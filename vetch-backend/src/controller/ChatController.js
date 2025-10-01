const ChatRepository = require("../repository/ChatRepository");

class ChatController {
  #chatRepository;
  constructor() {
    this.#chatRepository = new ChatRepository();

    // bind methods for route handlers
    this.getMessages = this.getMessages.bind(this);
    this.postMessage = this.postMessage.bind(this);
  }

  async getMessages(req, res) {
    try {
      const { roomId, limit, before } = req.body ?? {};
      if (!roomId) return res.status(400).json({ error: "roomId is required" });

      const messages = await this.#chatRepository.findMessages({
        roomId,
        limit: Number(limit) || 100,
        before,
      });

      res.status(200).json({ok: true, data: messages, message: 'messages fetched successfully'});

    } catch (error) {
      console.error("getMessages error:", error);
      res.status(500).json({ ok: false, message: 'Error fetching Messages', error: error.message });
    }
  }

  async postMessage(req, res) {
    try {
      const { roomId, sender, content } = req.body ?? {};
      if (!roomId || !sender || !content) {
        return res.status(400).json({ ok: false, message: "roomId, sender, content required", error: "roomId, sender, content required" });
      }

      const saved = await this.#chatRepository.addMessage({ roomId, sender, content });
      res.status(201).json({ok: true, data: saved, message: 'message saved successfully'});
    } catch (error) {
      console.error("postMessage error:", error);
      res.status(500).json({ ok: false, message: "Error saving message", error: error.message });
    }
  }
}

module.exports = ChatController;