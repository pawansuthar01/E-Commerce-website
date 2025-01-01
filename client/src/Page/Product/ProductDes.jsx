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

function ProductDescription() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [Search, setSearch] = useState([]);
  const [ProductData, setProductData] = useState();
  const { pathname } = useLocation();
  const [Image, setImage] = useState();
  const orderId = pathname.split("/").pop();
  const { data } = useSelector((state) => state.auth);
  const endOfCommentsRef = useRef(null);
  const fetchOrderDetails = async () => {
    try {
      const data = await dispatch(getProduct(orderId));
      setProductData(data?.payload?.data);
    } finally {
    }
  };
  useEffect(() => {
    if (orderId) fetchOrderDetails();
  }, [orderId]);

  const productExists = data?.walletAddProducts?.some(
    (item) =>
      (item.product && item.product.toString() === ProductData?._id) ||
      ProductData?.product
  );
  const dispatch = useDispatch();
  useEffect(() => {
    setImage(
      ProductData?.images[0]?.secure_url || ProductData?.image.secure_url
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

  useEffect(() => {
    if (!orderId) {
      navigate(-1);
    }
  }, [orderId, navigate]);

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
              {(data.role === "ADMIN" || data.role === "AUTHOR") && (
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                  Delete
                </button>
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
