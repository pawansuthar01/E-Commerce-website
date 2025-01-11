import React, { useEffect, useState } from "react";
import Layout from "../../layout/layout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoadAccount } from "../../Redux/Slice/authSlice";
import { RemoveProductCard } from "../../Redux/Slice/ProductSlice";
import LoadingButton from "../../constants/LoadingBtn";
import { MdCurrencyRupee } from "react-icons/md";
import { formatPrice } from "../Product/format";
import { FiShoppingCart } from "react-icons/fi";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadProfile = async () => {
    setIsLoading(true);
    const res = await dispatch(LoadAccount());
    setCart(res?.payload?.data?.walletAddProducts || []);
    const initialQuantities = {};
    res?.payload?.data?.walletAddProducts.forEach((product) => {
      initialQuantities[product.product] = product.quantity || 1;
    });
    setQuantities(initialQuantities);
    setIsLoading(false);
  };
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
    if (res.payload.success) {
      setCart(res?.payload?.userFind?.walletAddProducts || 0);
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
          Number(
            product?.price +
              (product?.price * product?.gst) / 100 -
              ((product?.price + (product?.price * product?.gst) / 100) *
                product?.discount || 0) /
                100
          ) * (quantities[product.product] || 1);
        return total + productTotal;
      }, 0)
      .toFixed(2);
  };

  return (
    <Layout>
      <div className="min-h-[50vh] p-6 bg-gray-100 dark:bg-[#111827]">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cart?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-screen text-center">
                <FiShoppingCart size={80} className="text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-600">
                  Your Cart is Empty
                </h2>
                <p className="text-gray-500 mt-2">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <button
                  onClick={() => {
                    navigate("/Product");
                  }}
                  className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Start Shopping
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
                      {cart?.map((product) => (
                        <tr
                          key={product?.product}
                          className="border-t border-gray-200 justify-center items-center"
                        >
                          <td className="p-4">
                            <img
                              src={product?.image?.secure_url}
                              alt={product?.name}
                              className="max-w-20"
                            />
                          </td>
                          <td className="p-4 ">
                            <h2 className="text-black dark:text-white font-medium line-clamp-1">
                              {product?.name}
                            </h2>
                          </td>
                          <td className="p-4  ">
                            {product?.discount
                              ? formatPrice(
                                  product?.price +
                                    (product?.price * product?.gst) / 100 -
                                    ((product?.price +
                                      (product?.price * product?.gst) / 100) *
                                      product?.discount) /
                                      100
                                )
                              : formatPrice(
                                  product?.price +
                                    (product?.price * product?.gst) / 100
                                )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => minQuantity(product?.product)}
                                className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-200"
                              >
                                &minus;
                              </button>
                              <input
                                type="text"
                                className="w-12 dark:bg-[#111827] text-center bg-white border rounded"
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
                          <td className="p-4 ">
                            {product?.discount
                              ? formatPrice(
                                  (product?.price +
                                    (product?.price * product?.gst) / 100 -
                                    ((product?.price +
                                      (product?.price * product?.gst) / 100) *
                                      product?.discount) /
                                      100) *
                                    (quantities[product.product] || 1)
                                )
                              : formatPrice(
                                  (product?.price +
                                    (product?.price * product?.gst) / 100) *
                                    (quantities[product.product] || 1)
                                )}
                          </td>
                          <td className="p-4">
                            <LoadingButton
                              textSize={"py-2"}
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
                <div className="flex justify-between flex-wrap max-sm:justify-center gap-10   mt-4 w-full items-start">
                  <button
                    onClick={() => {
                      navigate("/Product");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-400 text-white font-medium text-sm rounded-lg shadow-md hover:from-transparent hover:to-transparent hover:text-green-500 hover:border hover:border-green-400 transition-all duration-300"
                  >
                    Continue Shopping...
                  </button>

                  <div className="flex flex-col gap-4 p-4 bg-white dark:bg-[#1f2937] shadow-md rounded-lg">
                    {/* Header Section */}
                    <header className="text-gray-800 dark:text-gray-100 font-semibold text-2xl text-center">
                      Cart Total
                      <hr className="h-1 mt-2 bg-green-500 rounded-md" />
                    </header>

                    {/* Total Amount */}
                    <div className="grid grid-cols-2 items-center text-gray-700 dark:text-gray-300 font-medium text-lg">
                      <p>Total Amount:</p>
                      <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center">
                        {formatPrice(calculateTotalAmount())}
                      </h1>
                    </div>

                    {/* Place Order Button */}
                    <button
                      onClick={() => {
                        navigate("/CheckoutForm", {
                          state: { ...quantities },
                        });
                      }}
                      className="w-full py-3 text-lg font-medium text-white bg-gradient-to-r from-green-500 to-green-400 rounded-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 transition-all duration-300"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
