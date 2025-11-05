const ChatRepository = require("../repository/ChatRepository");
const NotificationController = require("../controller/NotificationController");

class SocketManager {
  /**
   * @param {import('socket.io').Server} io
   */
  #chatRepository;
  #notificationController;
  constructor(io) {
    this.io = io;
    this.#chatRepository = new ChatRepository();
    this.#notificationController = new NotificationController();
  }

  init() {
    this.io.on("connection", (socket) => {
      console.log("User connected:", socket.id);
      socket.emit("me", socket.id);

      socket.on("join_room", ({ roomId }) => {
        if (!roomId) return;
        if (!socket.rooms.has(roomId)) {
          socket.join(roomId);
          console.log(`User ${socket.id} joined room ${roomId}`);
        }
      });

      // optional: support leave
      socket.on("leave_room", ({ roomId }) => {
        if (!roomId) return;
        if (socket.rooms.has(roomId)) {
          socket.leave(roomId);
          console.log(`User ${socket.id} left room ${roomId}`);
        }
      });

      socket.on(
        "send_message",
        async ({ roomId, senderId, senderRole, message, type }, ack) => {
          try {
            const saved = await this.#chatRepository.addMessage({
              roomId,
              senderId,
              senderRole,
              content: message,
              type: type,
            });

            // Count others in the room (works with clustered adapters)
            const socketsInRoom = await this.io.in(roomId).allSockets();
            const total = socketsInRoom.size;
            const others = socket.rooms.has(roomId) ? Math.max(total - 1, 0) : total;

            this.io.to(roomId).emit("receive_message", saved);
            if (others > 0) {
              ack?.({ deliveredRealtime: true, notified: false });
            } else {
              const trueMessage = type === 'message' ? saved.content : `Sent a ${type}`;
              await this.#notificationController.sendToUserBooking([roomId], {title: "New message in your chat", body: {trueMessage}}, senderRole);
              ack?.({ deliveredRealtime: false, notified: true });
            }
          } catch (err) {
            console.error("Error saving message:", err);
            ack?.({ error: true });
          }
        }
      );

      socket.on(
        "finishBooking",
        async ({ roomId }) => {
          try {
            // Count others in the room (works with clustered adapters)
            if (!socket.rooms.has(roomId)) return;
            console.log(`finish booking from booking ${roomId}`);

            socket.to(roomId).emit("finishBooking", {
              roomId,
            });
          } catch (err) {
            console.error("Error saving message:", err);
          }
        }
      );

      // WebRTC signaling passthrough
      socket.on("callUser", async ({ roomId, signalData, from, name, senderRole }) => {
        if (!roomId) return;
        // ensure the caller is actually in the room (optional safety)
        if (!socket.rooms.has(roomId)) return;
        console.log(`callUser from ${from} to room ${roomId}`);
        await this.#notificationController.sendToUserBooking([roomId], {title: "You have a new call"}, senderRole);

        socket.to(roomId).emit("callUser", {
          signal: signalData, // offer
          from, // caller socket id
          name,
          roomId,
        });
      });

      socket.on("leaveCall", ({ roomId }) => {
        if (!roomId) return;
        // ensure the caller is actually in the room (optional safety)
        if (!socket.rooms.has(roomId)) return;
        console.log(`leaveCall from room ${roomId}`);

        socket.to(roomId).emit("leaveCall", {
          roomId,
        });
      });

      // Answer goes directly to the caller socket id
      socket.on("answerCall", ({ to, signal }) => {
        if (!to) return;
        this.io.to(to).emit("callAccepted", signal); // answer
      });

      socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
      });
    });
  }
}

module.exports = SocketManager;
