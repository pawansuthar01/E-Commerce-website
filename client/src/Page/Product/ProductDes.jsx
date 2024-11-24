import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/layout";
import {
  AddProductCard,
  RemoveProductCard,
} from "../../Redux/Slice/ProductSlice";
import LoadingButton from "../../constants/LoadingBtn";
import { LoadAccount } from "../../Redux/Slice/authSlice";
import { MdCurrencyRupee } from "react-icons/md";

function ProductDescription() {
  const [loading, setLoading] = useState("");
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const navigate = useNavigate();
  const { state } = useLocation();
  const { role } = useSelector((state) => state.auth.role);
  const { data } = useSelector((state) => state.auth);

  const productExists = data?.walletAddProducts?.some(
    (item) =>
      (item.product && item.product.toString() === state._id) || state.product
  );
  const dispatch = useDispatch();

  async function LoadProfile() {
    await dispatch(LoadAccount());
  }

  const ProductAddCard = async (productId) => {
    setLoading(true);
    const res = await dispatch(AddProductCard(productId));

    if (res) {
      LoadProfile();
      setLoading(false);
    }
  };

  const ProductRemoveCard = async (productId) => {
    setLoading(true);
    const res = await dispatch(RemoveProductCard(productId));

    if (res) {
      LoadProfile();
      setLoading(false);
    }
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

  return (
    <Layout>
      <div className="min-h-[90vh] text-white bg-[#F5F5F5] dark:bg-[#1F2937] flex flex-col justify-center items-center">
        <div className="w-full rounded-sm">
          <div className="flex gap-10 relative max-sm:flex-col items-center">
            {/* Image Section */}
            <div className="w-1/2 h-full space-y-6 group max-sm:w-full">
              <div
                className="overflow-hidden cursor-pointer relative h-[500px] w-full rounded-sm"
                onMouseMove={handleMouseMove}
              >
                <img
                  src={
                    state?.image.secure_url
                      ? state?.image.secure_url
                      : state?.image
                  }
                  alt="thumbnail_image"
                  className="object-contain h-full w-full transform transition-transform duration-500 ease-in-out group-hover:scale-150"
                  style={{
                    transformOrigin,
                    backgroundSize: "contain",
                  }}
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="w-1/2 space-y-1 text-xl max-sm:mb-2">
              <h1 className="text-3xl font-bold dark:text-white text-black capitalize mb-1">
                {state?.name}
              </h1>
              <h1 className="text-xl flex items-center font-bold dark:text-white text-gray-500 capitalize mb-5">
                price: <MdCurrencyRupee /> {state?.price}/-
              </h1>
              <p className="text-black dark:text-white text-2xl">
                Product Description 👇
              </p>
              <p className="text-black dark:text-white">{state?.description}</p>
              <div className="w-full flex gap-10 pt-10">
                {!productExists ? (
                  <div className="w-1/2">
                    <LoadingButton
                      onClick={() => ProductAddCard(state._id)}
                      name={"Add To Card "}
                      color={"bg-green-500"}
                      message={"Loading..."}
                      loading={loading}
                      width={"w-[150px]"}
                    />
                  </div>
                ) : (
                  <div className="w-1/2">
                    <LoadingButton
                      onClick={() => ProductRemoveCard(state._id)}
                      name={" Remove To Card "}
                      color={"bg-red-500"}
                      message={"Loading..."}
                      loading={loading}
                      width={"w-[150px]"}
                    />
                  </div>
                )}
                {role === "ADMIN" ||
                  (role === "AUTHOR" && (
                    <button className="bg-yellow-500 text-xl rounded-sm font-bold px-5 py-2 w-full hover:bg-yellow-400 transition-all duration-300">
                      Delete
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductDescription;
