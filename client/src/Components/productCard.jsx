import React, { useEffect, useState } from "react";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AddProductCard,
  getAllProduct,
  getProduct,
  LikeAndDisLike,
} from "../Redux/Slice/ProductSlice";
import { MdCurrencyRupee } from "react-icons/md";
import { LoadAccount } from "../Redux/Slice/authSlice";
import { AiOutlineDelete } from "react-icons/ai";

let isLike;

function ProductCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [response, SetResponse] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // State to hold image URL
  const { userName } = useSelector((state) => state?.auth);
  const Data = useSelector((state) => state?.auth);

  const productExists = Data?.data?.walletAddProducts?.some(
    (item) => item.product && item.product.toString() === data._id
  );

  async function loadProfile() {
    await dispatch(LoadAccount());
  }

  async function LoadProduct() {
    await dispatch(getAllProduct());
  }

  async function handelLikeDisLike(id) {
    const res = await dispatch(LikeAndDisLike(id));
    if (res) {
      LoadProduct();
      ProductGet();
      loadProfile();
    }
  }

  const ProductAddCard = async (productId) => {
    const res = await dispatch(AddProductCard(productId));

    if (res) {
      LoadProduct();
      loadProfile();
    }
  };

  async function ProductGet() {
    if (data.product) {
      SetResponse(await dispatch(getProduct(data.product)));
      if (response) {
        LoadProduct();
      }
    }
  }

  if (data.product) {
    isLike = response?.payload?.data?.ProductLikes?.some(
      (item) => item.userName && item.userName.toString() === userName
    );
  } else {
    isLike = data?.ProductLikes?.some(
      (item) => item.userName && item.userName.toString() === userName
    );
  }

  useEffect(() => {
    ProductGet();
    // Set the initial image URL
    setImageUrl(
      data.image?.secure_url
        ? data.image.secure_url
        : data.images && data.images.length > 0
        ? data.images[0]?.secure_url
        : data.image
    );
  }, [data]);

  // Handle image hover
  const handleMouseEnter = () => {
    if (data.images && data.images.length > 1) {
      setImageUrl(data.images[0]?.secure_url); // Use second image (or alternate image)
    }
  };

  const handleMouseLeave = () => {
    setImageUrl(
      data.image?.secure_url
        ? data.image.secure_url
        : data.images && data.images.length > 0
        ? data.images[1]?.secure_url
        : data.image
    );
  };

  return (
    <div className="w-[260px] max-sm:w-[150px] flex flex-col cursor-pointer sm:h-[400px] bg-white border border-gray-200 rounded-lg shadow p-2 dark:bg-gray-800 dark:border-gray-700">
      {Data.role == "ADMIN" ||
        (Data.role == "AUTHOR" && (
          <AiOutlineDelete
            size={36}
            className="text-red-400"
            onClick={() => {}}
          />
        ))}
      <section className="relative h-full flex justify-center rounded-lg p-5 w-[100%] group overflow-hidden">
        <img
          src={imageUrl} // Display the current image URL from state
          alt="product_image"
          className="rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
          onMouseEnter={handleMouseEnter} // Trigger when mouse enters
          onMouseLeave={handleMouseLeave} // Trigger when mouse leaves
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
          title="add to cart"
          onClick={() => ProductAddCard(data._id)}
          className={`dark:text-white text-2xl text-black w-1/3 flex justify-center dark:hover:text-green-500 hover:text-green-300`}
        >
          <FiShoppingCart
            className={`${
              productExists ? `text-green-300 dark:text-green-400` : ``
            } p-2 max-sm:h-[32px] max-sm:w-[32px]`}
            size={36}
          />
        </button>
        <button
          title="more..."
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
          title="Like..."
          onClick={() =>
            handelLikeDisLike(data.product ? data.product : data._id)
          }
          className={`text-black text-2xl w-1/3 flex justify-center`}
        >
          <FiHeart
            className={`${
              isLike ? `text-red-500 dark:text-red-500 ` : `dark:text-white`
            } p-2 dark:hover:text-red-500 hover:text-red-300`}
            size={36}
          />
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
