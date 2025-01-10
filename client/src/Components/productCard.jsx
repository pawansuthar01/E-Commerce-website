import React, { useEffect, useState } from "react";
import { FiShoppingCart, FiEye, FiHeart, FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AddProductCard,
  DeleteProduct,
  LikeAndDisLike,
  RemoveProductCard,
} from "../Redux/Slice/ProductSlice";
import { MdCurrencyRupee } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { LoadAccount } from "../Redux/Slice/authSlice";
import LoginPrompt from "./loginProment";

function ProductCard({ data, onSave, onProductDelete }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLike, setIsLike] = useState(false);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  const [show, setShow] = useState(false);
  const [productExists, setProductExists] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const {
    userName,
    role,
    data: userData,
  } = useSelector((state) => state?.auth);
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
      data?.image?.secure_url ||
        (data.images && data.images.length > 0 && data.images[0]?.secure_url) ||
        data.image
    );
  }, [data, userName]);
  const loadProfile = async () => {
    await dispatch(LoadAccount());
  };
  const handleLikeDislike = async (id) => {
    if (!isLoggedIn) {
      setShow(true);
      return;
    }
    setIsLike((prev) => !prev);

    await dispatch(LikeAndDisLike(id));
    loadProfile();
  };

  const handleAddToCart = async (productId, status) => {
    if (!isLoggedIn) {
      setShow(true);
      return;
    }
    if (status == "Out stock") return alert("Product Out Stock");
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
  const handleDeleteProduct = async (productId) => {
    if (!productId) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!isConfirmed) return;
    onProductDelete(productId);

    await dispatch(DeleteProduct(productId));
    toast.success("Product deleted successfully");
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
  function isProductUploadedToday(data) {
    const today = new Date();
    const uploadDate = new Date(data);

    const timeDifference = today - uploadDate;

    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return daysDifference <= 2 && daysDifference >= 0;
  }

  return (
    <div className="w-[250px] relative flex-shrink-0 max-w-xs:w-[260px] max-w-xs:h-[350px] max-sm:w-[200px] flex flex-col cursor-pointer max-sm:h-[250px]  sm:h-[400px] bg-white border border-gray-200 rounded-lg shadow p-2 dark:bg-gray-800 dark:border-gray-700">
      <section className="relative h-full flex justify-center rounded-lg p-5 w-full  group overflow-hidden">
        <img
          src={imageUrl}
          crossOrigin="anonymous"
          alt="product_image"
          className="rounded-lg max-w-xs:w-[100%] max-w-xs:object-contain  max-w-xs:h-[100%]  transition-transform duration-500 ease-in-out group-hover:scale-110"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() =>
            navigate(`/product/${data?._id}`, {
              state: { ...data },
            })
          }
        />
      </section>
      <div className="absolute text-sm flex justify-between w-full ">
        {data?.discount && (
          <p className=" ml-2 rounded-xl py-1 px-3 bg-red-300 shadow-[0_1px_0_black] dark:shadow-[0_1px_0_white] ">
            {data?.discount}% off
          </p>
        )}
        {isProductUploadedToday(data.createdAt) && (
          <p className="   mr-6 rounded-xl py-1 px-3 bg-red-300 shadow-[0_1px_0_black] dark:shadow-[0_1px_0_white]">
            New
          </p>
        )}
      </div>
      <p className="text-black text-center capitalize font-semibold mt-3 dark:text-white break-words">
        {data.name}
      </p>
      <p className="dark:text-white text-black font-bold flex justify-center    items-center">
        <MdCurrencyRupee />{" "}
        {data?.discount
          ? (
              data?.price +
              (data?.price * data?.gst) / 100 -
              ((data?.price + (data?.price * data?.gst) / 100) *
                data?.discount) /
                100
            ).toFixed(2)
          : (data?.price + (data?.price * data?.gst) / 100).toFixed(2)}
        {data?.discount > 0 && (
          <span className="line-through text-gray-500 text-sm flex  items-center">
            <MdCurrencyRupee />{" "}
            {(data?.price + (data?.price * data?.gst) / 100).toFixed(2)}
            /-
          </span>
        )}
      </p>
      {data?.category && (
        <div className="flex justify-center items-end pb-1 font-serif gap-1">
          <p>Category :</p>
          {data?.category}
        </div>
      )}
      <div className="flex justify-between w-full rounded-sm gap-1 border-2 dark:border-white border-black">
        {role && (role === "ADMIN" || role === "AUTHOR") ? (
          <button
            title="Delete"
            className={`dark:text-white text-2xl text-black w-1/3 flex justify-center `}
          >
            <AiOutlineDelete
              onClick={() => {
                handleDeleteProduct(data._id);
              }}
              className="text-red-400  p-2 h-[35px] w-[40px]"
            />
          </button>
        ) : (
          <button
            title="Add to Cart"
            onClick={() => handleAddToCart(data._id, data?.stock)}
            className={`dark:text-white text-2xl text-black w-1/3 flex justify-center `}
          >
            <FiShoppingCart
              className={`${
                productExists ? "text-green-300 dark:text-green-400" : ""
              } p-2 max-sm:h-[32px] max-sm:w-[32px]`}
              size={36}
            />
          </button>
        )}

        <button
          title="More..."
          className="text-white text-2xl w-1/3 flex justify-center"
        >
          <FiEye
            onClick={() =>
              navigate(`/product/${data?._id}`, {
                state: { ...data },
              })
            }
            className="text-black p-2 dark:text-white dark:hover:text-green-500 hover:text-green-300"
            size={36}
          />
        </button>
        {role && (role === "ADMIN" || role === "AUTHOR") ? (
          <button
            title="Edit"
            className="text-black text-2xl w-1/3 flex justify-center"
          >
            <FiEdit
              onClick={() => {
                navigate("/SingleProduct", {
                  state: { ...data },
                });
              }}
              size={36}
              className="text-red-400 p-2"
            />
          </button>
        ) : (
          <button
            title="Like"
            onClick={() => handleLikeDislike(data._id)}
            className="text-black text-2xl w-1/3 flex justify-center"
          >
            <FiHeart
              className={`${
                isLike ? "text-red-500 dark:text-red-500" : "dark:text-white"
              } p-2 `}
              size={36}
            />
          </button>
        )}
      </div>
      {show && <LoginPrompt show={show} setShow={setShow} />}
    </div>
  );
}

export default ProductCard;
