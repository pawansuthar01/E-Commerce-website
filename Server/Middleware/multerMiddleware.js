import multer from "multer";
import Pkg from "cloudinary";
const { v2: cloudinary } = Pkg;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import AppError from "../utils/AppError.js";


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "svg","pdf"], // Allowed file types
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit (10MB)
  fileFilter: (req, file, cb) => {
    const allowedExts = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "image/svg+xml",
      "application/pdf"
    ];
    if (!allowedExts.includes(file.mimetype)) {
      return cb(new AppError("Unsupported file type...", 400), false);
    }
    cb(null, true);
  },
});

export default upload;
