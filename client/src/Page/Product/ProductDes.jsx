import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/layout";
import {
  AddProductCard,
  RemoveProductCard,
} from "../../Redux/Slice/ProductSlice";
import LoadingButton from "../../constants/LoadingBtn";
import { useEffect, useState } from "react";
import { LoadAccount } from "../../Redux/Slice/authSlice";
import { MdCurrencyRupee } from "react-icons/md";

function ProductDescription() {
  const [loading, setLoading] = useState("");
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

  useEffect(() => {
    LoadAccount();
  }, []);
  return (
    <Layout>
      <div className="min-h-[90vh] text-white bg-[#F5F5F5] pt-12 px-20 flex flex-col justify-center items-center ">
        <div className="bg-white p-5 rounded-sm">
          <div className=" grid grid-cols-2 gap-10 relative  ">
            <div className=" space-y-6">
              <img
                src={
                  state?.image.secure_url
                    ? state?.image.secure_url
                    : state?.image
                }
                alt="thumbnail_image"
                className="w-full h-64 rounded-sm"
              />

              {role === "ADMIN" && (
                <button className="bg-yellow-500 text-xl rounded-sm font-bold px-5 py-2 w-full hover:bg-yellow-400 transition-all duration-300">
                  Delete
                </button>
              )}
            </div>
            <div className=" space-y-5 text-xl">
              <h1 className="text-3xl font-bold text-black capitalize mb-5 text-center">
                {state?.name}
              </h1>
              <h1 className="text-xl flex items-center justify-center font-bold text-gray-500 capitalize mb-5 text-center">
                price: <MdCurrencyRupee /> {state?.price}/-
              </h1>
              <p className="text-black text-2xl"> Product Description 👇</p>
              <p className="text-black">{state?.description}</p>
            </div>
          </div>
          <div className="w-full flex gap-10 justify-center mt-6">
            {!productExists ? (
              <div className="w-1/2">
                <LoadingButton
                  onClick={() => ProductAddCard(state._id)}
                  name={"Add To Card "}
                  color={"bg-green-500"}
                  message={"Loading..."}
                  loading={loading}
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
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default ProductDescription;
