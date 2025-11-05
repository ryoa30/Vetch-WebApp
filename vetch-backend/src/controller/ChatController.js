const ChatRepository = require("../repository/ChatRepository");
const cloudinary = require("../utils/cloudinary");

class ChatController {
  #chatRepository;
  constructor() {
    this.#chatRepository = new ChatRepository();

    // bind methods for route handlers
    this.getMessages = this.getMessages.bind(this);
    this.postMessage = this.postMessage.bind(this);
  }

  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ ok: false, message: "No file uploaded" });
      }
      const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
          {
              folder: "chat-images",
              resource_type: "image",
              allowed_formats: ["jpg", "jpeg", "png", "webp"],
          },
          (error, result) => (error ? reject(error) : resolve(result))
          );
          // Multer memory buffer -> upload_stream
          stream.end(req.file.buffer);
      });

      console.log("uploadResult",uploadResult);

      if(!uploadResult || !uploadResult.secure_url) {
        return res.status(500).json({ ok: false, message: "Failed to upload image" });
      }else{
        return res.status(200).json({ ok: true, message: "Image uploaded successfully", data: uploadResult.secure_url });
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, message: "Error uploading image", error: error.message });
    }
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