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
let isLike;
function ProductCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [response, SetResponse] = useState("");
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
  }, [data.product]);

  return (
    <div className="w-[250px] max-sm:w-[150px]  max-sm:h-[200px] flex flex-col h-[300px] cursor-pointer bg-white border border-gray-200 rounded-lg shadow p-2  dark:bg-gray-800 dark:border-gray-700 ">
      <section className="relative h-full flex  justify-center rounded-lg p-5 w-[100%]  group">
        <img
          src={data.image.secure_url ? data.image.secure_url : data.image}
          alt="product_image"
          className=" rounded-xl object-fill  h-[100%] w-[100%]"
        />

        <div className="absolute inset-0 bg-opacity-50 flex items-end pb-3 justify-center space-x-4 max-sm:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          <button
            onClick={() => ProductAddCard(data._id)}
            className="text-white text-2xl focus:outline-none transform opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-5  transition-all duration-300 delay-00"
          >
            <FiShoppingCart
              className={`${
                productExists ? `bg-green-300` : `bg-black`
              } p-2 rounded-lg w-[36px] h-[36px] max-sm:h-[32px] max-sm:w-[32px]`}
            />
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
            onClick={() =>
              handelLikeDisLike(data.product ? data.product : data._id)
            }
            className="text-white text-2xl focus:outline-none transform opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-5 transition-all duration-300 delay-300"
          >
            <FiHeart
              className={` ${
                isLike ? `bg-red-800` : `bg-black`
              } p-2 rounded-lg `}
              size={36}
            />
          </button>
        </div>
      </section>

      <h1 className="text-black text-center capitalize font-semibold mt-3">
        {data.name}
      </h1>
      <p className="font-serif text-black text-center flex justify-center items-center pb-2">
        Price : <MdCurrencyRupee />
        {data.price}
      </p>
    </div>
  );
}

export default ProductCard;
