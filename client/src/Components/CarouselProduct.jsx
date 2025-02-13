import React, { useEffect, useState } from "react";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AddProductCard,
  LikeAndDisLike,
  RemoveProductCard,
} from "../Redux/Slice/ProductSlice";
import { MdCurrencyRupee } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { LoadAccount } from "../Redux/Slice/authSlice";

export const ProductCarousel = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLike, setIsLike] = useState(false);
  const [productExists, setProductExists] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { userName, role, data: userData } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsLike(
      data?.ProductLikes?.some(
        (item) => item.userName && item.userName.toString() === userName
      )
    );

    setProductExists(
      userData?.walletAddProducts?.some(
        (item) => item.product && item.product.toString() === data._id
      )
    );

    setImageUrl(
      data.image?.secure_url ||
        (data.images && data.images.length > 0 && data.images[0]?.secure_url) ||
        data.image
    );
  }, [data, userName, userData]);
  const loadProfile = async () => {
    const res = await dispatch(LoadAccount());
  };
  const handleLikeDislike = async (id) => {
    !isLike ? toast.success("like") : toast.success("dislike");

    setIsLike((prev) => !prev);
    loadProfile();
    await dispatch(LikeAndDisLike(id));
  };

  const handleAddToCart = async (productId) => {
    if (!productExists) {
      setProductExists(true);

      await dispatch(AddProductCard(productId));
      loadProfile();
    } else {
      setProductExists(false);
      await dispatch(RemoveProductCard(productId));
      loadProfile();
    }
  };

  const handleMouseEnter = () => {
    if (data.images && data.images.length > 1) {
      setImageUrl(data.images[1]?.secure_url);
    }
  };

  const handleMouseLeave = () => {
    setImageUrl(
      data.image?.secure_url ||
        (data.images && data.images.length > 0 && data.images[0]?.secure_url) ||
        data.image
    );
  };
  return (
    <div className="carousel-item">
      <div className="  w-[260px] max-sm:w-[150px] flex flex-col cursor-pointer sm:h-[400px] bg-white border border-gray-200 rounded-lg shadow p-2 dark:bg-gray-800 dark:border-gray-700">
        {(role === "ADMIN" || role === "AUTHOR") && (
          <AiOutlineDelete
            size={36}
            className="text-red-400"
            onClick={() => {
              // Add delete logic
            }}
          />
        )}
        <section className="relative h-full flex justify-center rounded-lg p-5 w-[100%] group overflow-hidden">
          <img
            src={imageUrl}
            alt="product_image"
            className="rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() =>
              navigate("/Description", {
                state: { ...data },
              })
            }
          />
        </section>

        <h1 className="text-black text-center capitalize font-semibold mt-3 dark:text-white">
          {data.name}
        </h1>
        <p className="font-serif text-black text-center flex justify-center items-center pb-2 dark:text-gray-300">
          Price : <MdCurrencyRupee />
          {data.price}
        </p>
        <div className="flex justify-between w-full rounded-sm gap-1 border-2 dark:border-white border-black">
          <button
            title="Add to Cart"
            onClick={() => handleAddToCart(data._id)}
            className={`dark:text-white text-2xl text-black w-1/3 flex justify-center dark:hover:text-green-500 hover:text-green-300`}
          >
            <FiShoppingCart
              className={`${
                productExists ? "text-green-300 dark:text-green-400" : ""
              } p-2 max-sm:h-[32px] max-sm:w-[32px]`}
              size={36}
            />
          </button>
          <button
            title="More..."
            className="text-white text-2xl w-1/3 flex justify-center"
          >
            <FiEye
              onClick={() =>
                navigate("/Description", {
                  state: { ...data },
                })
              }
              className="text-black p-2 dark:text-white dark:hover:text-green-500 hover:text-green-300"
              size={36}
            />
          </button>
          <button
            title="Like"
            onClick={() => handleLikeDislike(data._id)}
            className="text-black text-2xl w-1/3 flex justify-center"
          >
            <FiHeart
              className={`${
                isLike ? "text-red-500 dark:text-red-500" : "dark:text-white"
              } p-2 dark:hover:text-red-500 hover:text-red-300`}
              size={36}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
