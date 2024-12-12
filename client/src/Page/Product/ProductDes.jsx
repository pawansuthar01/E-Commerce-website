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
  const [Image, setImage] = useState();

  const { data } = useSelector((state) => state.auth);
  const productExists = data?.walletAddProducts?.some(
    (item) =>
      (item.product && item.product.toString() === ProductDetails?._id) ||
      ProductDetails?.product
  );
  const dispatch = useDispatch();
  useEffect(() => {
    setImage(
      ProductDetails?.images[0]?.secure_url || ProductDetails?.image.secure_url
    );
  }, [ProductDetails]);
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

  useEffect(() => {
    if (!ProductDetails) {
      navigate(-1);
    }
  }, [ProductDetails, navigate]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (ProductDetails?.name) {
        const res = await dispatch(getSearchProduct(ProductDetails.name));
        setSearch(res.payload?.data || []);
      }
    };
    fetchSearch();
  }, [ProductDetails?.name, dispatch]);

  return (
    <Layout>
      <div className="min-h-[90vh] bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
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
                    : ProductDetails?.images?.[0]?.secure_url ||
                      ProductDetails?.image
                }
                alt="product_image"
                className="w-full h-full object-contain transform group-hover:scale-125 transition-transform duration-500"
                style={{ transformOrigin }}
              />
            </div>

            {/* Thumbnail Carousel */}
            {ProductDetails?.images?.length > 1 && (
              <div className="flex max-sm:flex-wrap gap-2">
                {ProductDetails?.images?.map((productImage, index) => (
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
            <h1 className="text-3xl font-semibold">{ProductDetails?.name}</h1>
            <h2 className="text-xl flex items-center">
              <MdCurrencyRupee /> {ProductDetails?.price}/-
            </h2>

            <div className="flex gap-4">
              {!productExists ? (
                <LoadingButton
                  onClick={() => ProductAddCard(ProductDetails._id)}
                  name="Add To Cart"
                  color="bg-green-500"
                  message="Loading..."
                  loading={loading}
                  width="w-full"
                />
              ) : (
                <LoadingButton
                  onClick={() => ProductRemoveCard(ProductDetails._id)}
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
          <p>{ProductDetails?.description}</p>
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
      </div>
    </Layout>
  );
}

export default ProductDescription;
