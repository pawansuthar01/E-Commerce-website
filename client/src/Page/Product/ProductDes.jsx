import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/layout";
import {
  AddProductCard,
  getProduct,
  getSearchProduct,
} from "../../Redux/Slice/ProductSlice";
import LoadingButton from "../../constants/LoadingBtn";
import { LoadAccount, RemoveProductCard } from "../../Redux/Slice/authSlice";
import { MdCurrencyRupee } from "react-icons/md";
import ProductCard from "../../Components/productCard";
import FeedbackForm from "../../Components/feedbackfrom";
import FeedbackList from "../../Components/feedbackList";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { ProductCarouselImages } from "../../Components/CarouselProudctImage";
import LoginPrompt from "../../Components/loginProment";

function ProductDescription() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [Search, setSearch] = useState([]);
  const [quantities, setQuantities] = useState(1);
  const [ProductData, setProductData] = useState();
  const { pathname } = useLocation();
  const { state } = useLocation();
  const [Image, setImage] = useState();
  const domain =
    window.location.hostname +
    (window.location.port ? `:${window.location.port}` : "");
  const ProductId = pathname.split("/").pop();
  const { data, isLoggedIn } = useSelector((state) => state.auth);
  const endOfCommentsRef = useRef(null);
  const fetchOrderDetails = async () => {
    try {
      setShowLoading(true);
      if (!state) {
        const data = await dispatch(getProduct(ProductId));
        if (data?.payload?.success) {
          setProductData(data?.payload?.data);
          setShowLoading(false);
        }
        return;
      }
      setProductData(state);
      setShowLoading(false);
    } catch {
      navigate("/");
    }
  };
  useEffect(() => {
    if (ProductId) fetchOrderDetails();
  }, [ProductId]);

  const productExists = data?.walletAddProducts?.some(
    (item) =>
      (item.product && item?.product?.toString() === ProductData?._id) ||
      ProductData?.product
  );
  const dispatch = useDispatch();
  useEffect(() => {
    setImage(
      ProductData?.images[0]?.secure_url || ProductData?.image?.secure_url
    );
  }, [ProductData]);
  const LoadProfile = async () => {
    await dispatch(LoadAccount());
  };

  const ProductAddCard = async (productId, status) => {
    if (!isLoggedIn) return setShowLoginPrompt(true);
    if (status == "Out stock") return alert("Product Out Stock");
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
  useEffect(() => {
    if (endOfCommentsRef.current) {
      endOfCommentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ProductData]);

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
  const handelPlaceOrder = (productId, quantities, status) => {
    if (status == "Out stock") return alert("Product Out Stock");
    navigate("/Product/New/Order-place", {
      state: { quantities, ProductId },
    });
  };
  const minQuantity = () => {
    setQuantities((prevQuantities) => {
      if (prevQuantities > 1) {
        return prevQuantities - 1;
      }
      return prevQuantities;
    });
  };

  const setQuantity = () => {
    setQuantities((prevQuantities) => prevQuantities + 1);
  };

  useEffect(() => {
    if (!ProductId) {
      navigate(-1);
    }
  }, [ProductId, navigate]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (ProductData?.name) {
        setSearchLoading(true);
        const res = await dispatch(
          getSearchProduct({
            name: ProductData.name,
          })
        );
        setSearch(res.payload?.data || []);
        setSearchLoading(false);
      }
    };
    fetchSearch();
  }, [ProductData?.name, dispatch]);

  const url = `http://${domain}/product/${ProductId}`;
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ProductData.name,
        text: ProductData.description,
        url: url,
      });
    }
  };
  if (showLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-gray-100  dark:bg-gray-900 
          fixed inset-0  bg-opacity-30 z-10
      "
      >
        <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Layout>
      <div
        ref={endOfCommentsRef}
        className="min-h-[90vh] bg-white text-gray-900 dark:bg-gray-900 dark:text-white "
      >
        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div
              className="relative overflow-hidden group w-full max-w-xs:h-auto h-[400px] max:border rounded-md max:shadow-md"
              onMouseMove={handleMouseMove}
            >
              {ProductData?.discount > 0 && (
                <p className=" absolute text-sm mt-2 ml-2 rounded-xl py-1 px-3 bg-red-300 z-10">
                  {ProductData?.discount}% off
                </p>
              )}

              <img
                src={
                  Image ||
                  ProductData?.images?.[0]?.secure_url ||
                  ProductData?.image
                }
                alt="product_image"
                className="w-full max-w-xs:hidden  h-full absolute object-contain transform group-hover:scale-125 transition-transform duration-500"
                style={{ transformOrigin }}
              />
              <div className="max-w-xs:flex hidden">
                {ProductData?.images && (
                  <ProductCarouselImages data={ProductData?.images} />
                )}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {ProductData?.images?.length > 1 && (
              <div className=" max-w-xs:hidden flex gap-2 justify-center p-2">
                {ProductData?.images?.map((productImage, index) => (
                  <img
                    key={index}
                    onClick={() => setImage(productImage.secure_url)}
                    src={productImage.secure_url}
                    alt="thumbnail"
                    className={`cursor-pointer w-16 h-16 border hover:shadow-2xl   rounded-md overflow-hidden transition-all${
                      Image === productImage.secure_url &&
                      "ring-2 ring-gray-500"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-4 relative">
            <span className=" absolute  right-0 z-10 top-[-10px]">
              {" "}
              <IoPaperPlaneOutline
                onClick={handleShare}
                className="rounded-lg  cursor-pointer"
                size={26}
              />{" "}
            </span>
            <h1 className="text-2xl font-semibold  break-words">
              {ProductData?.name}
            </h1>
            {/* Product Name */}

            {/* Discounted Price and Original Price */}
            <div className="text-lg flex flex-col">
              <span className="dark:text-white text-black font-bold flex   items-center">
                <MdCurrencyRupee size={20} />{" "}
                {ProductData?.discount
                  ? (
                      ProductData?.price +
                      (ProductData?.price * ProductData?.gst) / 100 -
                      ((ProductData?.price +
                        (ProductData?.price * ProductData?.gst) / 100) *
                        ProductData?.discount) /
                        100
                    ).toFixed(2)
                  : (
                      ProductData?.price +
                      (ProductData?.price * ProductData?.gst) / 100
                    ).toFixed(2)}
                {ProductData?.discount > 0 && (
                  <span className="line-through text-gray-500 text-sm flex  items-center">
                    <MdCurrencyRupee />{" "}
                    {(
                      ProductData?.price +
                      (ProductData?.price * ProductData?.gst) / 100
                    ).toFixed(2)}
                    /-
                  </span>
                )}
              </span>

              <div className="">
                <p className="text-sm font-mono text-gray-600">
                  With GST: {ProductData?.gst}
                </p>
              </div>
            </div>

            {/* {/* {/* Stock Status * /} */}
            <div className="flex items-center space-x-2">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  ProductData?.stock === "In stock"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
              <p
                className={`text-sm font-medium text-gray-700 ${
                  ProductData?.stock === "In stock"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {ProductData?.stock}
              </p>
            </div>

            <h1 className="text-sm font-semibold">
              {" "}
              Category:{" "}
              <span className="text-sm text-gray-500">
                {ProductData?.category}
              </span>
            </h1>
            <div className=" grid grid-cols-2 mx-auto gap-2">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-3  border rounded w-[100%] dark:border-white border-gray-700 justify-evenly">
                <button
                  onClick={minQuantity}
                  className="px-3 py-1  text-gray-700  "
                >
                  &minus;
                </button>
                <input
                  type="text"
                  value={quantities || 1}
                  readOnly
                  className="w-12 text-center bg-white  dark:bg-gray-900 text-gray-700"
                />
                <button
                  onClick={setQuantity}
                  className="px-3 py-1   text-gray-700  bg-gary-700 "
                >
                  +
                </button>
              </div>
              <button
                onClick={() =>
                  handelPlaceOrder(ProductId, quantities, ProductData?.stock)
                }
                className="w-full max-w-xs:text-sm  px-5 py-3 text-lg font-semibold shadow-xl text-white bg-black rounded-sm hover:bg-gray-800 transition dark:bg-[#002] dark:hover:bg-[#0109]"
              >
                Place Order
              </button>
            </div>

            {/* Place Order and Cart Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                {!productExists ? (
                  <LoadingButton
                    textSize={"py-3"}
                    onClick={() =>
                      ProductAddCard(ProductData._id, ProductData?.stock)
                    }
                    name="Add To Cart"
                    color="bg-green-500"
                    message="Loading..."
                    loading={loading}
                    width="w-full"
                  />
                ) : (
                  <LoadingButton
                    onClick={() => ProductRemoveCard(ProductData._id)}
                    name="Remove From Cart"
                    color="bg-red-500"
                    textSize={"py-3"}
                    message="Loading..."
                    loading={loading}
                    width="w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="p-6 border-t mt-6">
          <h2 className="text-2xl font-semibold mb-2 max-w-xs:text-center">
            Product Description
          </h2>
          <p>{ProductData?.description}</p>
        </div>

        {/* Related Products */}
        <div className="">
          {Array.isArray(Search) && (
            <h2 className="text-2xl font-semibold mb-4 max-w-xs:text-center">
              Related Products
            </h2>
          )}
          <div className="flex flex-wrap  justify-evenly max-w-xs:gap-2 gap-6 my-6 w-full">
            {searchLoading && (
              <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            )}
            {Array.isArray(Search) &&
              Search.map((product, ind) => (
                <ProductCard
                  data={product}
                  key={ind}
                  className="relative group"
                />
              ))}
          </div>
        </div>
        {/* feedback section */}
        <div className="w-full  ">
          <hr className="h-1 bg-slate-200" />
          <h1 className="text-2xl font-bold mb-4 ml-10 text-start dark:text-white text-black">
            feedback Section
          </h1>
          <FeedbackForm />
          <FeedbackList />
        </div>
        {showLoginPrompt && (
          <LoginPrompt show={showLoginPrompt} setShow={setShowLoginPrompt} />
        )}
      </div>
    </Layout>
  );
}

export default ProductDescription;
