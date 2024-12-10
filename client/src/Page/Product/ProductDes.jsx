import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/layout";
import {
  AddProductCard,
  getSearchProduct,
  RemoveProductCard,
} from "../../Redux/Slice/ProductSlice";
import LoadingButton from "../../constants/LoadingBtn";
import { LoadAccount } from "../../Redux/Slice/authSlice";
import { MdCurrencyRupee } from "react-icons/md";
import ProductCard from "../../Components/productCard";

function ProductDescription() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [Search, setSearch] = useState([]);
  const ProductDetails = useLocation().state;
  const [Image, setImage] = useState(ProductDetails?.images[0]?.secure_url);

  const { data } = useSelector((state) => state.auth);
  const productExists = data?.walletAddProducts?.some(
    (item) =>
      (item.product && item.product.toString() === ProductDetails?._id) ||
      ProductDetails?.product
  );
  const dispatch = useDispatch();

  const LoadProfile = async () => {
    await dispatch(LoadAccount());
  };

  const ProductAddCard = async (productId) => {
    setLoading(true);
    const res = await dispatch(AddProductCard(productId));

    if (res) {
      await LoadProfile();
    }
    setLoading(false);
  };

  const ProductRemoveCard = async (productId) => {
    setLoading(true);
    const res = await dispatch(RemoveProductCard(productId));

    if (res) {
      await LoadProfile();
    }
    setLoading(false);
  };

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    const originX = (x / width) * 100;
    const originY = (y / height) * 100;
    setTransformOrigin(`${originX}% ${originY}%`);
  };

  // Handle search for related products
  useEffect(() => {
    if (!ProductDetails) {
      navigate(-1);
    }
  }, [ProductDetails, navigate]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (ProductDetails?.name) {
        const res = await dispatch(getSearchProduct(ProductDetails.name));
        setSearch(res.payload?.data || []); // Default to empty array
      }
      console.log(Search);
    };
    fetchSearch();
  }, [ProductDetails?.name, dispatch]);

  return (
    <Layout>
      <div className="min-h-[90vh] text-white bg-[#F5F5F5] dark:bg-[#1F2937] flex flex-col">
        <div className="w-full rounded-sm">
          <div className="grid sm:grid-cols-2">
            {/* Image Section */}
            <div className="max-sm:flex flex-row-reverse">
              <div className="overflow-hidden group shadow-[0_0_1px_black] cursor-pointer my-2 ml-1 w-full h-[350px] rounded-sm">
                <img
                  src={
                    Image
                      ? Image
                      : ProductDetails?.images
                      ? ProductDetails?.images[0]
                        ? ProductDetails?.images[0].secure_url
                        : ProductDetails?.image?.secure_url
                      : ProductDetails?.image
                  }
                  onMouseMove={handleMouseMove}
                  alt="product_image"
                  className="h-full object-contain w-full transform transition-transform duration-500 ease-in-out group-hover:scale-150"
                  style={{
                    transformOrigin,
                  }}
                />
              </div>
              {ProductDetails?.images.length > 1 && (
                <div className="flex w-40 h-40 gap-2 max-sm:flex-col max-sm:mt-6 ml-1">
                  {ProductDetails?.images?.map((productImage, index) => (
                    <img
                      onClick={() => setImage(productImage.secure_url)}
                      key={index}
                      src={productImage.secure_url}
                      alt="images"
                      className={`rounded-sm shadow-sm cursor-pointer ${
                        Image === productImage.secure_url &&
                        `border-[8px] border-gray-500`
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="sm:w-full space-y-1 text-xl max-sm:mb-2 p-10">
              <h1 className="text-3xl font-bold dark:text-white text-black capitalize mb-1">
                {ProductDetails?.name}
              </h1>
              <h1 className="text-xl flex items-center font-bold dark:text-white text-gray-500 capitalize mb-5">
                Price: <MdCurrencyRupee /> {ProductDetails?.price}/-
              </h1>

              <div className="w-full flex gap-10 pt-10">
                {!productExists ? (
                  <LoadingButton
                    onClick={() => ProductAddCard(ProductDetails._id)}
                    name={"Add To Cart"}
                    color={"bg-green-500"}
                    message={"Loading..."}
                    loading={loading}
                    width={"w-[150px]"}
                  />
                ) : (
                  <LoadingButton
                    onClick={() => ProductRemoveCard(ProductDetails._id)}
                    name={"Remove From Cart"}
                    color={"bg-red-500"}
                    message={"Loading..."}
                    loading={loading}
                    width={"w-[150px]"}
                  />
                )}
                {(data.role === "ADMIN" || data.role === "AUTHOR") && (
                  <button className="bg-red-500 text-xl rounded-md font-bold px-5 py-2 w-[100px] hover:bg-red-700 transition-all duration-300">
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className=" px-5 gap-2 flex flex-col mb-1">
            <p className="text-black dark:text-white text-2xl">
              Product Description 👇
            </p>
            <p className="text-black dark:text-white text-xl tracking-[1px]">
              {ProductDetails?.description}
            </p>
          </div>
          <div>
            <h1 className="dark:text-white text-black text-2xl">
              More Related Products:
            </h1>
            <div className=" flex flex-wrap  max-sm:justify-center justify-evenly  gap-10 my-20">
              {Array.isArray(Search) &&
                Search.map((product, ind) => (
                  <ProductCard data={product} key={ind} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductDescription;
