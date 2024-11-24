import React, { useEffect, useState } from "react";
import Layout from "../../layout/layout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoadAccount } from "../../Redux/Slice/authSlice";
import { RemoveProductCard } from "../../Redux/Slice/ProductSlice";
import LoadingButton from "../../constants/LoadingBtn"; // Ensure this component is present in your codebase
import { MdCurrencyRupee } from "react-icons/md";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadProfile = async () => {
    const res = await dispatch(LoadAccount());
    setCart(res?.payload?.data?.walletAddProducts || []);
    const initialQuantities = {};
    res?.payload?.data?.walletAddProducts.forEach((product) => {
      initialQuantities[product.product] = product.quantity || 1;
    });
    setQuantities(initialQuantities);
  };
  console.log(cart);
  const minQuantity = (productId) => {
    setQuantities((prev) => {
      const updatedQuantities = { ...prev };
      if (updatedQuantities[productId] > 1) {
        updatedQuantities[productId] -= 1;
      }
      return updatedQuantities;
    });
  };

  const SetQuantity = (productId) => {
    setQuantities((prev) => {
      const updatedQuantities = { ...prev };
      updatedQuantities[productId] += 1;
      return updatedQuantities;
    });
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

  const calculateTotalAmount = () => {
    return cart
      .reduce((total, product) => {
        const productTotal =
          Number(product.price) * (quantities[product.product] || 1);
        return total + productTotal;
      }, 0)
      .toFixed(2);
  };

  return (
    <Layout>
      <div className="min-h-[50vh] p-6 bg-gray-100 dark:bg-[#111827]">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center gap-5">
            <p className="text-gray-600 text-2xl capitalize">
              No Product In cart...
            </p>
            <button
              onClick={() => {
                navigate("/AllProduct");
              }}
              className="px-3 font-medium py-2 bg-green-400 rounded-xl hover:bg-transparent hover:border-2 border-green-400"
            >
              Continue Shopping...
            </button>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white border dark:bg-[#111827] border-gray-200 shadow-xl rounded-lg">
                <thead>
                  <tr className="bg-gray-100 dark:bg-[#111827]">
                    <th className="p-4 text-left">Image</th>
                    <th className="p-4 text-left">Product</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Quantity</th>
                    <th className="p-4 text-left">Total</th>
                    <th className="p-4 text-left">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((product) => (
                    <tr
                      key={product.product}
                      className="border-t border-gray-200"
                    >
                      <td className="p-4">
                        <img
                          src={product.image.secure_url}
                          alt={product.name}
                          className="max-w-20"
                        />
                      </td>
                      <td className="p-4 ">
                        <h2 className="text-black dark:text-white font-medium">
                          {product.name}
                        </h2>
                      </td>
                      <td className="p-4 flex items-center  ">
                        <MdCurrencyRupee />
                        {Number(product.price).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => minQuantity(product.product)}
                            className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200"
                          >
                            &minus;
                          </button>
                          <input
                            type="text"
                            className="w-12 dark:bg-[#111827] text-center border rounded"
                            value={quantities[product.product] || 1}
                            readOnly
                          />
                          <button
                            onClick={() => SetQuantity(product.product)}
                            className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 flex items-center">
                        <MdCurrencyRupee />
                        {(
                          Number(product.price) *
                          (quantities[product.product] || 1)
                        ).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <LoadingButton
                          message={"Removing..."}
                          width={"w-[150px]"}
                          name={"Remove"}
                          loading={loadingStates[product.product]}
                          onClick={() => ProductRemoveCard(product.product)}
                          color={"bg-red-500"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between flex-wrap max-sm:justify-center gap-10  px-5 mt-4 w-full items-start">
              <button
                onClick={() => {
                  navigate("/AllProduct");
                }}
                className="px-3 font-medium py-2 bg-green-400 rounded-xl hover:bg-transparent hover:border-2 border-green-400"
              >
                Continue Shopping...
              </button>

              <div className="flex gap-2 flex-col   p-2 rounded-md">
                <header className="text-black dark:text-white font-medium text-2xl">
                  Cart Total
                  <hr className="h-1 bg-slate-500" />
                </header>
                <div className="text-xl grid grid-cols-2 dark:text-white text-black font-normal ">
                  <p>Total Amount =</p>{" "}
                  <h1 className="flex items-center text-2xl">
                    <MdCurrencyRupee />
                    {calculateTotalAmount()}
                  </h1>
                </div>
                <button
                  onClick={() => {
                    navigate("/CheckoutForm", {
                      state: { ...quantities },
                    });
                  }}
                  className="px-5 py-2 text-xl text-white font-normal bg-green-500 rounded-sm"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
