import { config } from "dotenv";
import http from "http";
config();

import app from "./app.js";
import { v2 } from "cloudinary";
import { initializeSocket } from "./Socket.js";

const PORT = process.env.PORT;

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//socket listen//
const server = http.createServer(app);
export const io = initializeSocket(server);
//sever listen//
server.listen(PORT, () => {
  console.log(`server is listen http://localhost:${PORT}`);
});
