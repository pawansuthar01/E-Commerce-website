import mongoose, { model, Schema } from "mongoose";

const PdfToImage = new Schema(
  {
    pdfUrl: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [String],
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const PdfToImages = model("ModuleImages", PdfToImage);
export default PdfToImages;
