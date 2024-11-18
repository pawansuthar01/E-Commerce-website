import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";

import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Layout from "../../layout/layout";
import LoadingButton from "../../constants/LoadingBtn";
import { FiEdit, FiPenTool } from "react-icons/fi";
import { AddNewProduct } from "../../Redux/Slice/ProductSlice";
function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ProductUpData, setProductUpData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const handelImageInput = (e) => {
    e.preventDefault();
    const image = e.target.files[0];
    if (image) {
      setProductUpData({
        ...ProductUpData,
        image: image,
      });
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    fileReader.addEventListener("load", function () {
      setPreviewImage(this.result);
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
    if (
      !ProductUpData.name ||
      !ProductUpData.price ||
      !ProductUpData.description ||
      !ProductUpData.image
    ) {
      setLoading(false);
      toast.error("All Filed is required...");
      return;
    }
    // console.log(SignUpData.fullName.length);
    if (ProductUpData.name.length < 5) {
      setLoading(false);
      toast.error("Product name should be altLeast 5 character..");
      return;
    }

    const formData = new FormData();
    formData.append("name", ProductUpData.name);
    formData.append("price", ProductUpData.price);
    formData.append("description", ProductUpData.description);
    formData.append("image", ProductUpData.image);
    const response = await dispatch(AddNewProduct(formData));
    if (response) {
      setLoading(false);
    }

    if (response?.payload?.success) {
      setLoading(false);
      navigate("/AllProduct");
      setProductUpData({
        name: "",
        price: "",
        description: "",
        image: "",
      });
      setPreviewImage("");
    }
  };
  return (
    <Layout>
      <div className=" w-full">
        <div className=" relative 2 top-[-64px]  justify-center flex items-center">
          <div className="bg-white max-sm:mt-20 mt-44 mb-10 w-[400px] rounded-lg shadow-[0_0_5px_black] p-8  max-sm:m-9 ">
            <h1 className="text-center text-3xl font-semibold mb-6 text-[#9e6748]">
              Add Product
            </h1>
            <form>
              <label
                htmlFor="image_uploads"
                className=" cursor-pointer justify-center flex"
              >
                {previewImage ? (
                  <div>
                    <img src={previewImage} className="" />
                  </div>
                ) : (
                  <div>
                    <FiEdit className="w-full" size={"100px"} />
                  </div>
                )}
              </label>
              <input
                type="file"
                onChange={handelImageInput}
                className="hidden "
                name="image_uploads"
                id="image_uploads"
                accept=".png ,.svg ,.jpeg ,.jpg"
              />

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
                  <label className=" absolute left-0 top-[-20px] text-sm text-gray-500">
                    Product Name
                  </label>
                ) : (
                  <label className="absolute left-0 top-2 text-lg text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
                    Product Name
                  </label>
                )}
              </div>
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
                  <label className=" absolute left-0 top-[-20px] text-sm text-gray-500">
                    Product Price
                  </label>
                ) : (
                  <label className="absolute left-0 top-2 text-lg text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
                    Product price
                  </label>
                )}
              </div>
              <div className="relative mb-6">
                <textarea
                  onChange={handelUserInput}
                  value={ProductUpData.description}
                  name="description"
                  required
                  className="peer resize-none overflow-y-auto h-[250px] w-full pl-2 border-2 border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent"
                />
                {ProductUpData.description ? (
                  <label className="pl-2 absolute left-0 top-[-20px] text-sm text-gray-500">
                    Product Description
                  </label>
                ) : (
                  <label className="absolute left-0 pl-2 top-2 text-lg text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
                    Product Description
                  </label>
                )}
              </div>

              <div onClick={handleCreate}>
                <LoadingButton
                  loading={loading}
                  color={"bg-green-600"}
                  message={"Loading..."}
                  name={"Add Product"}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default AddProduct;
