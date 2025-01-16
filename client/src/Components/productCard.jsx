import React, { useEffect, useState } from "react";
import { FiShoppingCart, FiEye, FiHeart, FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AddProductCard,
  DeleteProduct,
  LikeAndDisLike,
} from "../Redux/Slice/ProductSlice";
import { MdCurrencyRupee } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { LoadAccount, RemoveProductCard } from "../Redux/Slice/authSlice";
import LoginPrompt from "./loginProment";
import { formatPrice } from "../Page/Product/format";

function ProductCard({ data, onProductDelete }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLike, setIsLike] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [productExists, setProductExists] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { userName, role, data: userData } = useSelector((state) => state.auth);

  useEffect(() => {
    const isLiked = data?.ProductLikes?.some(
      (item) => item.userName?.toString() === userName
    );
    const productExists = userData?.walletAddProducts?.some(
      (item) => item.product?.toString() === data?._id
    );
    const imageUrl = getProductImageUrl(data);

    setIsLike(isLiked);
    setProductExists(productExists);
    setImageUrl(imageUrl);
  }, [data, userData, userName]);

  const getProductImageUrl = (product) =>
    product?.image?.secure_url ||
    (product.images?.length > 0 && product.images[0]?.secure_url) ||
    product.image;

  const handleLikeDislike = async (id) => {
    if (!isLoggedIn) return setShowLoginPrompt(true);
    setIsLike((prev) => !prev);
    await dispatch(LikeAndDisLike(id));
  };

  const handleAddToCart = async (productId, stockStatus) => {
    if (!isLoggedIn) return setShowLoginPrompt(true);
    if (stockStatus === "Out stock") {
      toast.error("Product is out of stock");
      return;
    }
    setProductExists(!productExists);
    if (!productExists) await dispatch(AddProductCard(productId));
    else await dispatch(RemoveProductCard(productId));
    dispatch(LoadAccount());
  };
  const handleMouseEnter = () => {
    if (data?.images && data.images.length > 1) {
      setImageUrl(data.images[1]?.secure_url);
    }
  };

  const handleMouseLeave = () => {
    setImageUrl(
      data?.image?.secure_url ||
        (data.images && data.images.length > 0 && data.images[0]?.secure_url) ||
        data.image
    );
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await dispatch(DeleteProduct(productId));
      toast.success("Product deleted successfully");
      onProductDelete(productId);
    }
  };

  const isNewProduct = (createdAt) => {
    const today = new Date();
    const uploadDate = new Date(createdAt);
    return (today - uploadDate) / (1000 * 3600 * 24) <= 2;
  };

  return (
    <div className="w-[250px] max-w-xs:w-[200px] max-w-xs:h-[250px] flex-shrink-0  cursor-pointer flex flex-col bg-white border border-gray-200 rounded-lg shadow p-2 dark:bg-gray-800 dark:border-gray-700">
      <section
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative flex justify-center items-center h-full rounded-lg p-5 overflow-hidden"
      >
        <img
          src={imageUrl}
          crossOrigin="anonymous"
          alt={data.name || "Product Image"}
          className="rounded-lg max-w-[150px] h-[100px]   max-w-xs:p-2 object-contain transition-transform duration-500 ease-in-out hover:scale-110"
          onClick={() =>
            navigate(`/product/${data._id}`, { state: { ...data } })
          }
        />
        {data?.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-300 text-xs font-semibold px-2 py-1 rounded">
            {data.discount}% OFF
          </span>
        )}
        {isNewProduct(data?.createdAt) && (
          <span className="absolute top-2 right-2 bg-red-300 text-xs font-semibold px-2 py-1 rounded">
            New
          </span>
        )}
      </section>
      <div className="text-center mt-3">
        <h3 className="font-semibold text-black dark:text-white line-clamp-1">
          {data.name}
        </h3>
        <div className="font-bold text-black dark:text-white flex items-center justify-center">
          <span>
            {data.discount
              ? formatPrice(
                  data.price +
                    (data.price * data.gst) / 100 -
                    ((data.price + (data.price * data.gst) / 100) *
                      data.discount) /
                      100
                )
              : formatPrice(data.price + (data.price * data.gst) / 100)}
          </span>
          {data.discount > 0 && (
            <span className="line-through text-gray-500 text-sm ml-2">
              {formatPrice(data.price + (data.price * data.gst) / 100)}
            </span>
          )}
        </div>
        {data?.category && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Category: {data.category}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-3 border p-1">
        {role === "ADMIN" || role === "AUTHOR" ? (
          <>
            <button
              className="flex-1 flex justify-center text-red-400"
              onClick={() => handleDeleteProduct(data._id)}
            >
              <AiOutlineDelete size={24} />
            </button>
            <button
              className="flex-1 flex justify-center text-blue-400"
              onClick={() => navigate("/SingleProduct", { state: { ...data } })}
            >
              <FiEdit size={24} />
            </button>
          </>
        ) : (
          <>
            <button
              className={`flex-1 flex justify-center ${
                productExists
                  ? "text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => handleAddToCart(data._id, data.stock)}
            >
              <FiShoppingCart size={24} />
            </button>
            <button
              className={`flex-1 flex justify-center ${
                isLike ? "text-red-500" : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => handleLikeDislike(data._id)}
            >
              <FiHeart size={24} />
            </button>
          </>
        )}
        <button
          className="flex-1 flex justify-center text-gray-500 dark:text-gray-400"
          onClick={() =>
            navigate(`/product/${data._id}`, { state: { ...data } })
          }
        >
          <FiEye size={24} />
        </button>
      </div>
      {showLoginPrompt && (
        <LoginPrompt show={showLoginPrompt} setShow={setShowLoginPrompt} />
      )}
    </div>
  );
}

export default ProductCard;
