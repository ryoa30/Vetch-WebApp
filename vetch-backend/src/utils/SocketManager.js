const ChatRepository = require("../repository/ChatRepository");

class SocketManager {
  /**
   * @param {import('socket.io').Server} io
   */
  #chatRepository;
  constructor(io) {
    this.io = io;
    this.#chatRepository = new ChatRepository();
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
        async ({ roomId, senderId, senderRole, message }) => {
          try {
            const saved = await this.#chatRepository.addMessage({
              roomId,
              senderId,
              senderRole,
              content: message,
            });
            this.io.to(roomId).emit("receive_message", saved);
          } catch (err) {
            console.error("Error saving message:", err);
          }
        }
      );

      // WebRTC signaling passthrough
      socket.on("callUser", ({ roomId, signalData, from, name }) => {
        if (!roomId) return;
        // ensure the caller is actually in the room (optional safety)
        if (!socket.rooms.has(roomId)) return;
        console.log(`callUser from ${from} to room ${roomId}`);

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
