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
    density: 300, // Higher density for better quality
    saveFilename: "page",
    savePath: outputFolder,
    format: "png", // Output format
    width: 800, // Resize width
  };

  return await pdf2image.convertPDF(pdfPath, options);
};

// Controller to handle PDF upload
export const UploadPdf = async (req, res, next) => {
  try {
    // Validate request data
    if (!req.file || !req.user || !req.user.userName) {
      return next(new AppError("All fields are required to process PDF", 400));
    }

    const pdfPath = req.file.path;
    console.log(`PDF Path: ${pdfPath}`);

    // Convert PDF to images
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

      // Clean up temporary image files
      fs.unlinkSync(image.path);
    }

    // Clean up the uploaded PDF file
    fs.unlinkSync(pdfPath);

    if (uploadedImageUrls.length === 0) {
      return next(new AppError("Failed to process PDF", 400));
    }

    // Save PDF and image URLs to the database
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
    console.error(error);

    // Cleanup temporary files in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    next(new AppError("Failed to process PDF", 500));
  }
};
