import { useEffect, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { useDispatch } from "react-redux";
import { LoadAccount } from "../Redux/Slice/authSlice";
import { FiEdit } from "react-icons/fi";

export const OrderShow = ({
  Orders,
  setPaymentStatus,
  orderStats,
  Role,
  setShow,
  setEditShow,
  setOrderId,
}) => {
  return Orders?.map((order, index) => (
    <div
      key={index}
      className="bg-white dark:bg-[#111827] sm:w-[45%]  dark:text-white shadow-[0_0_2px_black] mt-2 rounded-lg p-6 max-w-2xl  mx-auto mb-4  flex flex-col "
    >
      <h2 className="text-lg flex justify-between dark:text-white font-semibold mb-4 max-sm:text-sm gap-2">
        Order ID: {order._id}
        {orderStats[order._id] === "Canceled" ? (
          <p className="text-red-500 text-sm  cursor-pointer hover:underline">
            Canceled
          </p>
        ) : (
          <FiEdit
            onClick={() => {
              setOrderId(order._id),
                setEditShow(true),
                setPaymentStatus(order.paymentStatus);
            }}
            size={26}
            className=" cursor-pointer text-red-400 hover:text-red-300"
          />
        )}
      </h2>
      {order.products.map((product, productIndex) => (
        <div key={productIndex} className="flex space-x-4 mb-4">
          <img
            src={product?.productDetails?.image?.secure_url}
            alt={product.productDetails.name}
            className="w-24 h-24 object-contain rounded"
          />
          <div>
            <h2 className="text-lg font-semibold dark:text-white">
              {product.productDetails.name}
            </h2>
            <p className="text-gray-500 dark:text-white flex items-center">
              <MdCurrencyRupee />
              {product.productDetails.price.toFixed(2)}
            </p>
            <p className="text-gray-500 text-sm dark:text-white">
              quantity :{product.quantity}
            </p>
            <p className="mt-2 text-gray-700 dark:text-white ">
              {product.productDetails.description}
            </p>
          </div>
        </div>
      ))}

      <div className="mt-6 sm:grid grid-cols-2 gap-4 dark:text-white">
        <div>
          <h3 className="text-sm font-bold mb-2 dark:text-white">
            Delivery address
          </h3>
          <div className="text-gray-700 max-sm:py-3 dark:text-white">
            <p className="text-sm"> {order.shippingAddress.name} </p>
            <p className="text-sm">
              {" "}
              {order.shippingAddress.address},{order.shippingAddress.city}{" "}
            </p>
            <p className="text-sm line-clamp-5 ">
              {" "}
              {order.shippingAddress.state},{order.shippingAddress.postalCode},
            </p>
            <p className="text-sm">{order.shippingAddress.phoneNumber}</p>
            <p className="w-[60%] text-[11px] ">
              {order.shippingAddress.email}
            </p>
            {Role == "USER" && (
              <p
                onClick={() => {
                  setOrderId(order._id), setShow(true);
                }}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
              >
                Edit
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold mb-2 dark:text-white">
            Order Details
          </h3>
          <p className="text-gray-700 dark:text-white">
            Payment Method: {order.PaymentMethod}
          </p>
          <p className="text-gray-700 dark:text-white flex items-center">
            Total Amount: <MdCurrencyRupee />
            {order.totalAmount.toFixed(2)}
          </p>
          <p className="text-gray-700  dark:text-white">
            Status: {order.orderStats}
          </p>
          <p className="text-gray-700 dark:text-white">
            Payment Status: {order.paymentStatus}
          </p>
        </div>
      </div>
      {orderStats[order._id] === "Canceled" ? (
        <div className="flex flex-col items-center mt-10">
          <h3 className="text-sm text-gray-600 mb-2 dark:text-white">
            Order placed on {new Date(order.createdAt).toLocaleDateString()}
          </h3>
          <h1 className="text-red-500">Canceled</h1>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex justify-between">
            <h3 className="text-sm text-gray-600 mb-2 dark:text-white">
              Order placed on {new Date(order.createdAt).toLocaleDateString()}
            </h3>
            <h3 className="text-sm text-gray-600 mb-2 dark:text-white">
              Order Delivery on{" "}
              {new Date(order.deliveryDate).toLocaleDateString()}
            </h3>
          </div>

          <div className="w-full bg-gray-200 dark:bg-black h-1 rounded-full">
            <div
              className="bg-blue-600 h-1 rounded-full"
              style={{
                width: `${
                  orderStats[order._id] === "Processing"
                    ? "40%"
                    : orderStats[order._id] === "Shipped"
                    ? "70%"
                    : orderStats[order._id] === "Delivered"
                    ? "10%"
                    : "10%"
                }`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2 dark:text-white">
            <span
              className="
                   text-blue-600 font-medium "
            >
              Order placed
            </span>
            <span
              className={` ${
                orderStats[order._id] === "Processing"
                  ? `text-blue-600`
                  : `text-black dark:text-white`
              }  font-medium `}
            >
              Processing
            </span>
            <span
              className={`${
                orderStats[order._id] === "Shipped"
                  ? `text-blue-600`
                  : `text-black dark:text-white`
              }   font-medium `}
            >
              Shipped
            </span>
            <span
              className={`${
                orderStats[order._id] === "Delivered"
                  ? `text-blue-600`
                  : `text-black dark:text-white`
              }   font-medium  mb-5`}
            >
              Delivered
            </span>
          </div>
        </div>
      )}
    </div>
  ));
};
