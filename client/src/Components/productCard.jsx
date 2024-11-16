import React, { useEffect } from "react";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllProduct, LikeAndDisLike } from "../Redux/Slice/ProductSlice";
import { FaRupeeSign } from "react-icons/fa6";
import { MdCurrencyRupee } from "react-icons/md";

function ProductCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userName } = useSelector((state) => state?.auth);
  const productExists = data?.ProductLikes?.some(
    (item) => item.userName && item.userName.toString() === userName
  );

  async function LoadProduct() {
    await dispatch(getAllProduct());
  }
  async function handelLikeDisLike(id) {
    const res = await dispatch(LikeAndDisLike(id));
    if (res) {
      LoadProduct();
    }
  }

  return (
    <div className="w-[260px] max-sm:w-[150px]  max-sm:h-[200px] flex flex-col  cursor-pointer bg-white border border-gray-200 rounded-lg shadow p-1  dark:bg-gray-800 dark:border-gray-700">
      <section className="relative h-full flex justify-center rounded-lg p-5 w-[100%]  group">
        <img
          src={data.image.secure_url ? data.image.secure_url : data.image}
          alt="product_image"
          className=" rounded-xl w-[100%] h-[200px] "
        />

        <div className="absolute inset-0 bg-opacity-50 flex items-end pb-3 justify-center space-x-4 max-sm:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          <button className="text-white text-2xl focus:outline-none transform opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-5  transition-all duration-300 delay-00">
            <FiShoppingCart className="bg-black p-2 rounded-lg w-[36px] h-[36px] max-sm:h-[32px] max-sm:w-[32px]" />
          </button>
          <button className="text-white text-2xl focus:outline-none transform opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-5 transition-all duration-300 delay-200">
            <FiEye
              onClick={() =>
                navigate("/Description", {
                  state: { ...data },
                })
              }
              className="bg-black p-2 rounded-lg"
              size={36}
            />
          </button>
          <button
            onClick={() => handelLikeDisLike(data._id)}
            className="text-white text-2xl focus:outline-none transform opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-5 transition-all duration-300 delay-300"
          >
            <FiHeart
              className={` ${
                productExists ? `bg-red-800` : `bg-black`
              } p-2 rounded-lg `}
              size={36}
            />
          </button>
        </div>
      </section>

      <h1 className="text-black text-center capitalize font-semibold mt-3">
        {data.name}
      </h1>
      <p className="font-serif text-black text-center flex justify-center items-center ">
        Price : <MdCurrencyRupee />
        {data.price}
      </p>
    </div>
  );
}

export default ProductCard;
function Card() {
  return (
    <div class="w-full max-w-sm ">
      <a href="#">
        <img
          class="p-8 rounded-t-lg"
          src="/docs/images/products/apple-watch.png"
          alt="product image"
        />
      </a>
      <div class="px-5 pb-5">
        <a href="#">
          <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport
          </h5>
        </a>
        <div class="flex items-center mt-2.5 mb-5">
          <div class="flex items-center space-x-1 rtl:space-x-reverse">
            <svg
              class="w-4 h-4 text-yellow-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              class="w-4 h-4 text-yellow-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              class="w-4 h-4 text-yellow-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              class="w-4 h-4 text-yellow-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              class="w-4 h-4 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          </div>
          <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
            5.0
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-3xl font-bold text-gray-900 dark:text-white">
            $599
          </span>
          <a
            href="#"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add to cart
          </a>
        </div>
      </div>
    </div>
  );
}
