import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { FiSave } from "react-icons/fi";
import { AddNewProduct } from "../../Redux/Slice/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../constants/LoadingBtn";
import Layout from "../../layout/layout";
import { Category } from "../../Components/Product/categoryData";
import PriceCart from "../../Components/Product/TotaPrice";
function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { CategoryList } = useSelector((state) => state.Category);
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    gst: "",
    subCategory: "",
    discount: "",
    images: [],
  });

  const handelImageInput = (e) => {
    const files = Array.from(e.target.files);

    if (files.length < 2) {
      toast.error("You must upload at least 2 images.");
      return;
    }
    if (files.length > 6) {
      toast.error("You can upload a maximum of 6 images.");
      return;
    }

    setProductData({ ...productData, images: files });

    const fileReaders = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });
    });

    Promise.all(fileReaders).then((previews) => {
      setPreviewImages(previews);
    });
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    setProductData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    document.getElementById(e.target.name).style.borderColor = "";
    if (e.target.name == "name") {
      document.getElementById(e.target.name).previousElementSibling.innerHTML =
        "Product Name";
    }

    if (e.target.name == "description") {
      document.getElementById(e.target.name).previousElementSibling.innerHTML =
        "Description";
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (productData.name.length > 40 || productData.name.length < 20) {
      document.getElementById("name").style.borderColor = "red";
      if (productData.name.length > 40) {
        document.getElementById("name").previousElementSibling.innerHTML =
          "Maximum length is 30 characters";
      } else if (productData.name.length < 20) {
        document.getElementById("name").previousElementSibling.innerHTML =
          "Minimum length is 20 characters";
      }
      setLoading(false);
      return;
    }

    if (productData.images.length < 2 || productData.images.length > 6) {
      setLoading(false);
      document.getElementById("images").style.borderColor = "red";
      return;
    }
    if (!productData.price) {
      document.getElementById("price").style.borderColor = "red";
      setLoading(false);
      return;
    }
    if (!productData.description) {
      document.getElementById("price").style.borderColor = "red";
      setLoading(false);
      return;
    }
    if (productData.description.length > 100) {
      document.getElementById("description").style.borderColor = "red";
      document.getElementById("description").previousElementSibling.innerHTML =
        "Maximum length is 100 characters";
      setLoading(false);
      return;
    }
    if (!productData.category) {
      document.getElementById("category").style.borderColor = "red";
      setLoading(false);
      return;
    }

    setShowPrice(true);
  };
  async function handelUploadProduct(e) {
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("description", productData.description);
      formData.append("category", productData.category);
      formData.append("gst", productData.gst);
      formData.append("discount", productData.discount);
      productData.images.forEach((image) => formData.append("images", image));

      const response = await dispatch(AddNewProduct(formData));
      if (response?.payload?.success) {
        navigate(`/Product/${response?.payload?.data?._id}`);
        setProductData({
          name: "",
          price: "",
          description: "",
          category: "",
          subCategory: "",
          gst: "",
          discount: "",
          images: [],
        });
        setPreviewImages([]);
      }
      setUploadLoading(false);
      setLoading(false);
    } catch (error) {
      setUploadLoading(false);
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen sm:p-8">
        {uploadLoading && (
          <div
            className={`flex  flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 ${
              uploadLoading ? "fixed inset-0 bg-black bg-opacity-30 z-10" : ""
            }`}
          >
            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            <p>Please wait, uploading...</p>
          </div>
        )}
        <div className="max-w-4xl mx-auto  rounded-xl shadow-lg ">
          <div className="p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Add Product
              </h1>
              <button
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="flex items-center px-4 py-2 bg-blue-600 dark:text-white text-black rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="w-5 h-5 mr-2" />
                Manage Categories
              </button>
            </div>
            {showCategoryForm && <Category />}
            <form onSubmit={handleCreate} className="space-y-6">
              <div
                id="images"
                className="border-2  border-dashed border-gray-300 rounded-lg p-8 text-center"
              >
                {previewImages.length > 0 ? (
                  <div className="flex gap-1 flex-wrap justify-evenly">
                    {previewImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="h-32 w-32 object-contain rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FaPlus className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-500">
                      Drop images here or click to upload
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      2 Up to 6 images
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handelImageInput}
                  className="hidden "
                  id="images_upload"
                />
                <label
                  htmlFor="images_upload"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Select Images
                </label>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border bg-white dark:bg-gray-800 dark:text-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border bg-white  dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter price"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="Description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="Category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    {CategoryList?.map((Name, i) => (
                      <option key={i} value={Name.category}>
                        {Name.category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Discount (%)
                  </label>
                  <input
                    id="discount"
                    type="number"
                    name="discount"
                    value={productData.discount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter discount percentage"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="gst"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  GST (%)
                </label>
                <input
                  type="number"
                  name="gst"
                  id="gst"
                  value={productData.gst}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter discount percentage"
                  min="0"
                  max="100"
                />
              </div>
              <LoadingButton
                type="submit"
                message={"Adding Product..."}
                textSize={"py-2"}
                loading={loading}
                name={"Add Product"}
                color={"bg-green-500 hover:bg-blue-700 transition-colors"}
              />
            </form>
          </div>
        </div>
        {
          <PriceCart
            price={productData.price}
            gst={productData.gst}
            discount={productData.discount}
            setShowPrice={setShowPrice}
            ShowPrice={showPrice}
            handelUploadProduct={() => handelUploadProduct()}
          />
        }
      </div>
    </Layout>
  );
}
export default AddProduct;
