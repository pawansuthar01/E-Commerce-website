import fs from "fs";
import path from "path";
import pdf2image from "pdf2image";
import AppError from "../utils/AppError.js";
import PdfToImages from "../module/Pdf.module.js";
import cloudinary from "cloudinary";

// Function to convert PDF to images
const convertPDFToImages = async (pdfPath) => {
  const outputFolder = "./tmp";

  // Ensure the temporary directory exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  const options = {
    density: 300,
    saveFilename: "page",
    savePath: outputFolder,
    format: "png",
    width: 800,
  };

  return await pdf2image.convertPDF(pdfPath, options);
};

export const UploadPdf = async (req, res, next) => {
  try {
    if (!req.file || !req.user || !req.user.userName) {
      return next(new AppError("All fields are required to process PDF", 400));
    }

    const pdfPath = req.file.path;

    const images = await convertPDFToImages(pdfPath);

    if (!images || images.length === 0) {
      return next(new AppError("Failed to convert PDF to images", 400));
    }

    const uploadedImageUrls = [];
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "pdf_images",
      });
      uploadedImageUrls.push(result.secure_url);

      fs.unlinkSync(image.path);
    }

    fs.unlinkSync(pdfPath);

    if (uploadedImageUrls.length === 0) {
      return next(new AppError("Failed to process PDF", 400));
    }

    const savedPdf = await PdfToImages.create({
      pdfUrl: req.file.path,
      imageUrls: uploadedImageUrls,
      uploadedBy: req.user.userName,
    });

    res.status(200).json({
      success: true,
      message: "PDF uploaded, converted, and saved successfully!",
      data: savedPdf,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    next(new AppError("Failed to process PDF", 500));
  }
};
