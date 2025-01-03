import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/layout";
import {
  AddProductCard,
  getProduct,
  getSearchProduct,
  RemoveProductCard,
} from "../../Redux/Slice/ProductSlice";
import LoadingButton from "../../constants/LoadingBtn";
import { LoadAccount } from "../../Redux/Slice/authSlice";
import { MdCurrencyRupee } from "react-icons/md";
import ProductCard from "../../Components/productCard";
import FeedbackForm from "../../Components/feedbackfrom";
import FeedbackList from "../../Components/feedbackList";
import { IoPaperPlaneOutline } from "react-icons/io5";

function ProductDescription() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [Search, setSearch] = useState([]);
  const [quantities, setQuantities] = useState(1);
  const [ProductData, setProductData] = useState();
  const { pathname } = useLocation();
  const [Image, setImage] = useState();
  const domain =
    window.location.hostname +
    (window.location.port ? `:${window.location.port}` : "");
  const ProductId = pathname.split("/").pop();
  const { data } = useSelector((state) => state.auth);
  const endOfCommentsRef = useRef(null);
  const fetchOrderDetails = async () => {
    try {
      setShowLoading(true);
      const data = await dispatch(getProduct(ProductId));
      if (data?.payload?.success) {
        setProductData(data?.payload?.data);
        setShowLoading(false);
      }
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
        const res = await dispatch(
          getSearchProduct({
            name: ProductData.name,
          })
        );
        setSearch(res.payload?.data || []);
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
        className="min-h-[90vh] bg-white text-gray-900 dark:bg-gray-900 dark:text-white"
      >
        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div
              className="relative overflow-hidden group w-full h-[400px] border rounded-md shadow-md"
              onMouseMove={handleMouseMove}
            >
              <img
                src={
                  Image
                    ? Image
                    : ProductData?.images?.[0]?.secure_url || ProductData?.image
                }
                alt="product_image"
                className="w-full h-full object-contain transform group-hover:scale-125 transition-transform duration-500"
                style={{ transformOrigin }}
              />
            </div>

            {/* Thumbnail Carousel */}
            {ProductData?.images?.length > 1 && (
              <div className="flex max-sm:flex-wrap gap-2">
                {ProductData?.images?.map((productImage, index) => (
                  <img
                    onClick={() => setImage(productImage.secure_url)}
                    key={index}
                    src={productImage.secure_url}
                    alt="thumbnail"
                    className={`cursor-pointer w-16 h-16 border rounded-md ${
                      Image === productImage.secure_url &&
                      "ring-2 ring-gray-500"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold">{ProductData?.name}</h1>
            <h2 className="text-xl flex items-center">
              <MdCurrencyRupee /> {ProductData?.price}/-
            </h2>
            <div className="space-y-4 p-4 border  rounded-md shadow-sm bg-white dark:bg-[#1f2937]">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => minQuantity()}
                  className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  &minus;
                </button>
                <input
                  type="text"
                  className="w-12 text-center border rounded bg-gray-100 dark:bg-[#111827] text-gray-700 dark:text-gray-300"
                  value={quantities || 1}
                  readOnly
                />
                <button
                  onClick={() => setQuantity()}
                  className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  +
                </button>
                <div>
                  <button
                    onClick={handleShare}
                    className="flex items-start gap-1 font-serif"
                  >
                    <IoPaperPlaneOutline className="rounded-lg" size={20} />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Place Order Button */}
              <div>
                <button
                  onClick={() => {
                    navigate("/CheckoutForm", {
                      state: { quantities, ProductId },
                    });
                  }}
                  className="w-full px-5 py-3 text-lg font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                >
                  Place Order
                </button>
              </div>

              {/* Add/Remove from Cart */}
              <div className="flex gap-4">
                {!productExists ? (
                  <LoadingButton
                    onClick={() => ProductAddCard(ProductData._id)}
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
                    message="Loading..."
                    loading={loading}
                    width="w-full"
                  />
                )}
              </div>

              {/* Delete Button for Admin/Author */}
              {(data.role === "ADMIN" || data.role === "AUTHOR") && (
                <div>
                  <button className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700 transition">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="p-6 border-t mt-6">
          <h2 className="text-2xl font-semibold mb-2">Product Description</h2>
          <p>{ProductData?.description}</p>
        </div>

        {/* Related Products */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
          <div className="flex flex-wrap  justify-evenly gap-10">
            {Array.isArray(Search) &&
              Search.map((product, ind) => (
                <ProductCard data={product} key={ind} />
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
      </div>
    </Layout>
  );
}

export default ProductDescription;
