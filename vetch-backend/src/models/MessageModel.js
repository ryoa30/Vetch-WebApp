function newMessage({ roomId, senderId, senderRole, content }) {
  return {
    room_id: roomId,
    sender_id: senderId,
    sender_role: senderRole,
    content,
    inserted_at: new Date(),
  };
}

module.exports = { newMessage };
