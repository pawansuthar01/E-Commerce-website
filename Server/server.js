import { config } from "dotenv";
import http from "http";
config();

import app from "./app.js";
import { v2 } from "cloudinary";

const PORT = process.env.PORT;

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//socket listen//
//sever listen//
app.listen(PORT, () => {
  console.log(`server is listen http://localhost:${PORT}`);
});
