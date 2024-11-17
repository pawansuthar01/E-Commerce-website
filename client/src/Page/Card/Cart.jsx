import React, { useEffect, useState } from "react";
import Layout from "../../layout/layout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoadAccount } from "../../Redux/Slice/authSlice";
import { RemoveProductCard } from "../../Redux/Slice/ProductSlice";
import LoadingButton from "../../constants/LoadingBtn";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadProfile = async () => {
    const res = await dispatch(LoadAccount());
    setCart(res?.payload?.data?.walletAddProducts || []);
  };

  const ProductRemoveCard = async (productId) => {
    setLoadingStates((prev) => ({ ...prev, [productId]: true }));

    const res = await dispatch(RemoveProductCard(productId));
    if (res) {
      await loadProfile();
    }

    setLoadingStates((prev) => ({ ...prev, [productId]: false }));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <Layout>
      <div className="min-h-[50vh] p-6 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <div className="justify-center flex items-center p-1 flex-col gap-5">
            <p className="text-gray-600 text-2xl capitalize">
              No Product In cart...
            </p>
            <button
              onClick={() => {
                navigate("/AllProduct");
              }}
              className="px-3 font-medium py-2 bg-green-400 rounded-sm hover:bg-transparent hover:border-2 border-green-400"
            >
              Continue Shopping...
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product}
                className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg"
              >
                <div>
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} | Price: ${item.price}
                  </p>
                </div>
                <LoadingButton
                  loading={loadingStates[item.product]}
                  message={"Removing"}
                  name={"Remove"}
                  color={"bg-red-500"}
                  width={"w-[150px]"}
                  onClick={() => ProductRemoveCard(item.product)}
                ></LoadingButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
