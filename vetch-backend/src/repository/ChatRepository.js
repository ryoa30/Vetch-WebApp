const { getDb } = require("../utils/mongoDb.js");
const { ObjectId } = require("mongodb");
const { newMessage } = require("../models/MessageModel.js");

class ChatRepository {

  async findMessages({ roomId, limit = 100, before }) {
    const db = await getDb();
    const query = { room_id: roomId };
    if (before) query.inserted_at = { $lt: new Date(before) };

    return db
      .collection("chat_collection")
      .find(query, { sort: { inserted_at: 1 }, limit })
      .toArray();
  }

  async addMessage({ roomId, senderId, senderRole, content }) {
    const db = await getDb();
    const doc = newMessage({ roomId, senderId, senderRole, content });
    const { insertedId } = await db.collection("chat_collection").insertOne(doc);
    return { ...doc, _id: insertedId };
  }

  async findMessageById(id) {
    const db = await getDb();
    return db.collection("chat_collection").findOne({ _id: new ObjectId(id) });
  }
}

module.exports = ChatRepository;

