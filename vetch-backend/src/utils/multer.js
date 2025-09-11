// libs/multer.js
const multer = require("multer");

const storage = multer.memoryStorage(); // keep file buffer in memory
const upload = multer({ storage });

module.exports = upload;
