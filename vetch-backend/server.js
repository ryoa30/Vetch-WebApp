const http= require("http");
const { Server } = require("socket.io");
const SocketManager = require("./src/utils/SocketManager");
const { getDb } = require('./src/utils/mongoDb');
const dotenv = require('dotenv');

dotenv.config();

const app = require('./src/app');
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const sockets = new SocketManager(io);
sockets.init();

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await getDb();
});