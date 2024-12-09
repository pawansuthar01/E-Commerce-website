import React, { useEffect } from "react";
import Layout from "../../layout/layout";
import { useLocation } from "react-router-dom";
import { MdCurrencyRupee } from "react-icons/md";

const ThankYou = () => {
  const { state } = useLocation();
  console.log(state);
  useEffect(() => {}, []);
  return (
    <Layout>
      <div className="bg-gray-100 dark:bg-[#1F2937] flex justify-center items-center w-full ">
        <div className=" w-full   p-6">
          {/* Thank You Message */}
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Thank you. Your order has been received.
          </h1>

          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-700 dark:text-white">
                <strong>Order Id:</strong> {state.data._id}
              </p>
              <p className="text-gray-700 dark:text-white">
                <strong>Date:</strong> {state.data.createdAt}
              </p>
              <p className="text-gray-700 dark:text-white flex items-center">
                <strong>Total:</strong> <MdCurrencyRupee />
                <p className="font-medium">{state.data.totalAmount}/-</p>
              </p>
              <p className="text-gray-700 dark:text-white">
                <strong>Payment Method:</strong> {state.data.PaymentMethod}
              </p>
            </div>
          </div>

          {/* Order Details Table */}
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Order Details
          </h2>
          {state.data.products.map((product, ind) => {
            return (
              <table
                key={ind}
                className="w-full border-collapse border border-gray-300 mb-6"
              >
                <h1 className="pl-4 py-2 font-bold">Order #{ind + 1}</h1>
                <thead>
                  <tr className="bg-gray-200 text-gray-800">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Product
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="border  font-bold border-gray-300 px-4 py-2">
                      {product.productDetails.name} × {product.quantity}
                    </td>
                    <td className="border font-bold border-gray-300 px-4 py-2 text-right">
                      {Number(product.productDetails.price).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-bold">
                      Subtotal:
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-bold">
                      {(Number(product.price) * product.quantity).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-bold">
                      paymentStatus:
                    </td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-right">
                      {state.data.paymentStatus}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-bold">
                      Payment Method:
                    </td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-right">
                      {state.data.PaymentMethod}
                    </td>
                  </tr>
                </tbody>
              </table>
            );
          })}

          {/* Billing Address */}
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Billing Address
          </h2>

          <div className="text-gray-700 dark:text-white">
            <p>
              <strong>{state.data.shippingAddress.name}</strong>
            </p>
            <p>{state.data.shippingAddress.address}</p>
            <p>
              {state.data.shippingAddress.state},{" "}
              {state.data.shippingAddress.postalCode}
            </p>
            <p>
              {state.data.shippingAddress.state},{" "}
              {state.data.shippingAddress.country}
            </p>
            <p>📞 {state.data.shippingAddress.phoneNumber}</p>
            <p>📧 {state.data.shippingAddress.email}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThankYou;
