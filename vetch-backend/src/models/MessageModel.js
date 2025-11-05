function newMessage({ roomId, senderId, senderRole, content, type }) {
  return {
    room_id: roomId,
    sender_id: senderId,
    sender_role: senderRole,
    content,
    type: type || 'message',
    inserted_at: new Date(),
  };
}

module.exports = { newMessage };
