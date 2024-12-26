import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { UploadPdf } from "../../../../../Server/Controllers/Pdf.Controller";
import Layout from "../../../layout/layout";
import LoadingButton from "../../../constants/LoadingBtn";

function UploadPDF() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (showLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLoading]);

  const handlePdfInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log(file);
    // // if (file.type !== "application/pdf") {
    //   toast.error("Only PDF files are allowed!");
    //   return;
    // }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("PDF size must be under 10MB!");
      return;
    }

    setPdfFile(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(pdfFile);
    if (!pdfFile) {
      setLoading(false);
      toast.error("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    console.log(formData);
    setShowLoading(true);

    const response = await dispatch(UploadPdf(formData));
    if (response?.payload?.success) {
      setShowLoading(false);
      setLoading(false);
      toast.success("PDF uploaded and processed successfully!");
      setPreviewImages(response.payload.images); // Assume images are returned in response
    } else {
      setShowLoading(false);
      setLoading(false);
      toast.error(response?.payload?.message || "Failed to process PDF.");
    }
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="relative justify-center flex items-center">
          <div className="bg-white dark:bg-[#111827] mt-44 mb-10 w-[400px] rounded-lg shadow-[0_0_5px_black] p-8">
            {showLoading && (
              <div
                className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 ${
                  loading ? "fixed inset-0 bg-black bg-opacity-30 z-10" : ""
                }`}
              >
                <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                <p>
                  {loading ? "Processing PDF, please wait..." : "Loading..."}
                </p>
              </div>
            )}
            <>
              <h1 className="text-center text-3xl font-semibold mb-6 text-[#9e6748]">
                Upload PDF
              </h1>
              <form>
                {/* File Input for PDF */}
                <label
                  htmlFor="pdf_upload"
                  className="cursor-pointer justify-center flex"
                >
                  {pdfFile ? (
                    <p className="text-center text-gray-500">{pdfFile.name}</p>
                  ) : (
                    <FiEdit className="w-full" size={"100px"} />
                  )}
                </label>
                <input
                  type="file"
                  onChange={handlePdfInput}
                  className="hidden"
                  name="pdf_upload"
                  id="pdf_upload"
                />

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-6">
                    {previewImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="h-20 w-20 object-contain bg-white dark:bg-[#111827] dark:shadow-[0_0_1px_white] shadow-[0_0_1px_black]"
                      />
                    ))}
                  </div>
                )}

                {/* Submit Button */}
                <div onClick={handleUpload} className="mt-6">
                  <LoadingButton
                    loading={loading}
                    color={"bg-green-600"}
                    message={"Uploading..."}
                    name={"Upload PDF"}
                  />
                </div>
              </form>
            </>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UploadPDF;
