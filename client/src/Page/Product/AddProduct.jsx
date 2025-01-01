import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Layout from "../../layout/layout";
import LoadingButton from "../../constants/LoadingBtn";
import { FiEdit, FiPenTool } from "react-icons/fi";
import { AddNewProduct } from "../../Redux/Slice/ProductSlice";

function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const [ProductUpData, setProductUpData] = useState({
    name: "",
    price: "",
    description: "",
    images: [], // For multiple images
  });

  // Disable scrolling when loading
  useEffect(() => {
    if (showLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on component unmount
    };
  }, [showLoading]);

  // Handle multiple image inputs with validation
  const handelImageInput = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files); // Convert file list to array

    // Validate minimum and maximum number of files
    if (files.length < 2) {
      toast.error("You must upload at least 2 images.");
      return;
    }
    if (files.length > 6) {
      toast.error("You can upload a maximum of 6 images.");
      return;
    }

    setProductUpData({
      ...ProductUpData,
      images: files,
    });

    // Generate previews for selected images
    const fileReaders = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });
    });

    Promise.all(fileReaders).then((previews) => {
      setPreviewImages(previews); // Set preview images
    });
  };

  const handelUserInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setProductUpData({
      ...ProductUpData,
      [name]: value,
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Validate form fields and image count
    if (
      !ProductUpData.name ||
      !ProductUpData.price ||
      !ProductUpData.description ||
      ProductUpData.images.length < 2 ||
      ProductUpData.images.length > 6
    ) {
      setLoading(false);
      toast.error(
        "All fields are required. Ensure you upload between 2 and 6 images."
      );
      return;
    }

    if (ProductUpData.name.length < 5) {
      setLoading(false);
      toast.error("Product name should be at least 5 characters.");
      return;
    }
    if (ProductUpData.price < 1) {
      setLoading(false);
      toast.error("Product price should be at least 1 Rupee.");
      return;
    }

    const formData = new FormData();
    formData.append("name", ProductUpData.name);
    formData.append("price", ProductUpData.price);
    formData.append("description", ProductUpData.description);

    // Append multiple images to FormData
    ProductUpData.images.forEach((image) => {
      formData.append("images", image);
    });
    setShowLoading(true);
    const response = await dispatch(AddNewProduct(formData));
    if (response) {
      setShowLoading(false);
      setLoading(false);
    }

    if (response?.payload?.success) {
      setLoading(false);
      const id = response?.payload?.data?._id;
      navigate(`/Product/${id}`);
      setProductUpData({
        name: "",
        price: "",
        description: "",
        images: [],
      });
      setPreviewImages([]);
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
                  {loading
                    ? "Please wait, product is uploading..."
                    : "Loading..."}
                </p>
              </div>
            )}
            <>
              <h1 className="text-center text-3xl font-semibold mb-6 text-[#9e6748]">
                Add Product
              </h1>
              <form>
                {/* File Input for Images */}
                <label
                  htmlFor="image_uploads"
                  className="cursor-pointer justify-center flex"
                >
                  {previewImages.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {previewImages.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt="preview"
                          className="h-20 w-20 object-contain bg-white dark:bg-[#111827] dark:shadow-[0_0_1px_white] shadow-[0_0_1px_black]"
                        />
                      ))}
                    </div>
                  ) : (
                    <FiEdit className="w-full" size={"100px"} />
                  )}
                </label>
                <input
                  type="file"
                  onChange={handelImageInput}
                  className="hidden"
                  name="image_uploads"
                  id="image_uploads"
                  accept=".png,.svg,.jpeg,.jpg"
                  multiple
                />

                {/* Product Name */}
                <div className="relative mb-6 mt-5">
                  <input
                    type="text"
                    onChange={handelUserInput}
                    value={ProductUpData.name}
                    name="name"
                    required
                    className="peer w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent"
                  />
                  {ProductUpData.name ? (
                    <label className="absolute left-0 top-[-20px] text-sm text-gray-500">
                      Product Name
                    </label>
                  ) : (
                    <label className="absolute left-0 top-2 text-lg text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
                      Product Name
                    </label>
                  )}
                </div>

                {/* Product Price */}
                <div className="relative mb-6">
                  <input
                    type="number"
                    onChange={handelUserInput}
                    value={ProductUpData.price}
                    name="price"
                    required
                    className="peer w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent"
                  />
                  {ProductUpData.price ? (
                    <label className="absolute left-0 top-[-20px] text-sm text-gray-500">
                      Product Price
                    </label>
                  ) : (
                    <label className="absolute left-0 top-2 text-lg text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
                      Product Price
                    </label>
                  )}
                </div>

                {/* Product Description */}
                <div className="relative mb-6">
                  <textarea
                    onChange={handelUserInput}
                    value={ProductUpData.description}
                    name="description"
                    required
                    className="peer resize-none overflow-y-auto h-[250px] w-full pl-2 border-2 border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent"
                  />
                  {ProductUpData.description ? (
                    <label className="absolute left-0 pl-2 top-[-20px] text-sm text-gray-500">
                      Product Description
                    </label>
                  ) : (
                    <label className="absolute left-0 pl-2 top-2 text-lg text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
                      Product Description
                    </label>
                  )}
                </div>

                {/* Submit Button */}
                <div onClick={handleCreate}>
                  <LoadingButton
                    loading={loading}
                    color={"bg-green-600"}
                    message={"Loading..."}
                    name={"Add Product"}
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

export default AddProduct;
