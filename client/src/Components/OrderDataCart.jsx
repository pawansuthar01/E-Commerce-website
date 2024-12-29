import { useEffect, useState } from "react";
import { CancelOrder, getOrder, UpdateOrder } from "../Redux/Slice/OrderSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { AiOutlinePrinter } from "react-icons/ai";
import { MdCurrencyRupee } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import toast from "react-hot-toast";

export const OrderCart = ({ UserID }) => {
  const dispatch = useDispatch();
  const [OrderId, setOrderId] = useState();
  const [OrderData, setOrderData] = useState([]);
  const [orderStats, setOrderStatus] = useState([]);
  const [PaymentStatus, setPaymentStatus] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);
  const [newDate, setNewDate] = useState(null);
  const [editShow, setEditShow] = useState(false);
  const { role: Role } = useSelector((state) => state.auth);

  const [PaymentData, setPaymentData] = useState({
    name: "",
    amount: undefined,
    paymentStatus: null,
    PaymentDate: null,
  });
  const [orderStatus, setORDERStatus] = useState(null);

  async function loadOrders() {
    // console.log(UserID);
    const res = await dispatch(getOrder(UserID));
    if (res?.payload?.success) setOrderData(res?.payload?.data);
    console.log(res);
  }
  const handelOrderCancel = async (id) => {
    if (orderStats[OrderId] === "Delivered") {
      toast.error("You cannot cancel a delivered order.");
      return;
    }

    if (!id) {
      setLoading(false);
      toast.error("Something went wrong. Try again.");
      return;
    }

    const res = await dispatch(CancelOrder(id));
    setLoading(false);
    setShow(false);
    if (res?.payload?.success) {
      loadOrders();
    }
  };
  const trackingOrder = () => {
    const statusMap = OrderData?.reduce((acc, Order) => {
      acc[Order._id] = Order.orderStats;
      return acc;
    }, {});
    setOrderStatus(statusMap);
  };
  const trackingDeliveryDate = () => {
    const statusMap = OrderData?.reduce((acc, Order) => {
      acc[Order._id] = Order.deliveryDate;
      return acc;
    }, {});
    setSelectedDate(statusMap);
  };
  const trackingPayments = () => {
    const statusMap = OrderData?.reduce((acc, Order) => {
      acc[Order._id] = Order.paymentStatus;
      return acc;
    }, {});
    setPaymentStatus(statusMap);
  };

  const handleOrderUpdate = async (id) => {
    if (orderStatus === "Delivered") {
      toast.error("You cannot update or cancel a delivered order.");
      return;
    }

    if (orderStatus == "Delivered" && PaymentStatus[id] !== "Completed") {
      toast.error("Payment must be completed before updating the order.");
      return;
    }

    if (!id) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    if (newDate !== null) {
      const res = await dispatch(
        UpdateOrder({ id, data: { deliveryDate: newDate } })
      );
      console.log(res);
      setNewDate(null);
      if (res?.payload?.success) {
        toast.success("deliveryDate updated successfully!");
        loadOrders();
        trackingDeliveryDate();
      }
    }
    if (PaymentData.paymentStatus !== null) {
      if (PaymentData.paymentStatus == "Completed") {
        setPaymentData({
          ...PaymentData,
          PaymentDate: Date.now(),
        });
        if (
          !PaymentData.name ||
          !PaymentData.PaymentDate ||
          !PaymentData.amount
        ) {
          toast.error("please enter a data");
          return;
        }

        const res = await dispatch(UpdateOrder({ id, data: PaymentData }));
        console.log(res);
        setPaymentData({
          name: "",
          amount: undefined,
          paymentStatus: "",
          PaymentDate: null,
        });
        if (res?.payload?.success) {
          // setEditShow(false);

          toast.success("Payment Status updated successfully!");
          loadOrders();
          trackingOrder();
          trackingPayments();
        } else {
          toast.error(
            res?.payload?.message || "Failed to update payment status."
          );
        }
      } else {
        const res = await dispatch(UpdateOrder({ id, data: PaymentData }));
        setPaymentData({
          name: "",
          amount: undefined,
          paymentStatus: null,
          PaymentDate: null,
        });
        console.log(res);
        if (res?.payload?.success) {
          // setEditShow(false);

          toast.success("Payment Status updated successfully!");
          loadOrders();
          trackingOrder();
          trackingPayments();
        } else {
          toast.error(
            res?.payload?.message || "Failed to update payment status."
          );
        }
      }
    }

    if (orderStatus !== null) {
      const res = await dispatch(UpdateOrder({ id, data: orderStatus }));
      if (res?.payload?.success) {
        // setEditShow(false);
        toast.success("Order Status updated successfully!");
        loadOrders(); // Reload orders to reflect the change
        trackingOrder(); // Update order status tracking
      } else {
        toast.error(res?.payload?.message || "Failed to update order status.");
      }
    }
  };
  const renderOrderProgress = (status) => {
    const progressWidth = {
      Processing: "40%",
      Shipping: "70%",
      Delivered: "100%",
      Canceled: "100%",
    };
    return progressWidth[status] || "10%";
  };
  useEffect(() => {
    loadOrders();
  }, [UserID]);
  useEffect(() => {
    trackingOrder();
    trackingDeliveryDate();
    trackingPayments();
  }, [OrderData]);
  return (
    <div>
      {OrderData?.map((order, index) => (
        <div
          key={index}
          className="bg-white dark:bg-[#111827] sm:w-[45%] dark:text-white shadow-[0_0_2px_black] mt-2 rounded-lg p-6 max-w-2xl mx-auto mb-4 flex flex-col"
        >
          <h2 className="text-lg flex justify-between dark:text-white font-semibold mb-4 max-sm:text-sm gap-2">
            Order ID: {order._id}
            {orderStats[order._id] === "Canceled" ? (
              <p className="text-red-500 text-sm cursor-pointer hover:underline">
                Canceled
              </p>
            ) : Role == "ADMIN" || Role == "AUTHOR" ? (
              <div className="flex gap-1">
                <FiEdit
                  onClick={() => {
                    setOrderId(order._id);
                    setEditShow(true);
                  }}
                  size={26}
                  className="cursor-pointer text-red-400 hover:text-red-300"
                />
                <AiOutlinePrinter
                  onClick={() => (setShowPrint(true), setOrderPrintData(order))}
                  size={26}
                  className="text-blue-500 cursor-pointer"
                />
              </div>
            ) : (
              <p
                className="text-red-500 text-sm cursor-pointer hover:underline"
                onClick={() => handelOrderCancel(order._id)}
              >
                Cancel
              </p>
            )}
          </h2>
          {/* Products Section */}
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
                  Quantity: {product.quantity}
                </p>
                <p className="mt-2 text-gray-700 dark:text-white w-[100px] line-clamp-1">
                  {product.productDetails.description}
                </p>
              </div>
            </div>
          ))}
          {/* Delivery and Order Details */}
          <div className="mt-6 sm:grid grid-cols-2 gap-4 dark:text-white">
            <div>
              <h3 className="text-sm font-bold mb-2 dark:text-white">
                Delivery Address
              </h3>
              <div className="text-gray-700 max-sm:py-3 dark:text-white">
                <p className="text-sm">{order.shippingAddress.name}</p>
                <p className="text-sm">
                  {order.shippingAddress.address}, {order.shippingAddress.city}
                </p>
                <p className="text-sm">
                  {order.shippingAddress.state},{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <a
                  className="text-sm"
                  href={`tel:+${order.shippingAddress.phoneNumber}`}
                >
                  {order.shippingAddress.phoneNumber}
                </a>
                <br />
                <a
                  className=" text-[11px]"
                  href={`mailto:${order.shippingAddress.email}`}
                >
                  {order.shippingAddress.email}
                </a>

                {Role === "USER" && (
                  <p
                    onClick={() => {
                      setOrderId(order._id);
                      setShow(true);
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
              <p className="text-gray-700 dark:text-white">
                Status: {order.orderStats}
              </p>
              <p className="text-gray-700 dark:text-white">
                Payment Status: {order.paymentStatus}
              </p>
            </div>
          </div>
          {/* Order Progress */}
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
            {orderStats[order._id] === "Canceled" ? (
              <p className="text-red-500 text-sm font-semibold text-center">
                This order has been canceled.
              </p>
            ) : (
              <div>
                <div className="w-full bg-gray-200 dark:bg-black h-1 rounded-full">
                  <div
                    className="bg-blue-600 h-1 rounded-full"
                    style={{
                      width: renderOrderProgress(orderStats[order._id]),
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2 dark:text-white">
                  <span className="text-blue-600 font-medium">
                    Order placed
                  </span>
                  <span
                    className={`${
                      orderStats[order._id] === "Processing" ||
                      orderStats[order._id] === "Shipping" ||
                      orderStats[order._id] === "Delivered"
                        ? "text-blue-600"
                        : "text-black dark:text-white"
                    } font-medium`}
                  >
                    Processing
                  </span>
                  <span
                    className={`${
                      orderStats[order._id] === "Shipping" ||
                      orderStats[order._id] === "Delivered"
                        ? "text-blue-600"
                        : "text-black dark:text-white"
                    } font-medium`}
                  >
                    Shipped
                  </span>
                  <span
                    className={`${
                      orderStats[order._id] === "Delivered"
                        ? "text-blue-600"
                        : "text-black dark:text-white"
                    } font-medium mb-5`}
                  >
                    Delivered
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      {editShow && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 dark:bg-opacity-80 z-50">
          <div className="bg-white dark:bg-[#1f2937] dark:text-white w-[90%] max-w-lg p-6 rounded-lg shadow-lg">
            {/* Close Button */}
            <div className="flex justify-start">
              <button
                onClick={() => setEditShow(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-red-500 focus:ring-2 focus:ring-red-300 p-2 rounded-lg"
                aria-label="Close"
              >
                <FaArrowLeft size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-6">
              {orderStats[OrderId] === "Delivered" && (
                <p className="text-center text-red-400">
                  The order has been delivered. No further updates are allowed.
                </p>
              )}

              {/* If Order is Canceled */}
              {orderStats[OrderId] === "Canceled" ? (
                <p className="text-red-500 text-lg font-semibold text-center">
                  This order has been canceled.
                </p>
              ) : Role === "AUTHOR" || Role === "ADMIN" ? (
                // Author or Admin Controls
                <div className="space-y-6">
                  {/* Change Order Status */}
                  <div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Change Order Status
                    </p>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-green-400 focus:outline-none"
                      value={orderStatus || orderStats[OrderId]}
                      onChange={(e) => setORDERStatus(e.target.value)}
                      disabled={
                        orderStats[OrderId] === "Canceled" ||
                        orderStats[OrderId] === "Delivered"
                      }
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Change Delivery Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                      value={
                        newDate ||
                        (selectedDate[OrderId] &&
                        !isNaN(new Date(selectedDate[OrderId]))
                          ? new Date(selectedDate[OrderId])
                              .toISOString()
                              .split("T")[0]
                          : "")
                      }
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>
                  {/* Change Payment Status */}
                  <div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Change Payment Status
                    </p>

                    {/* Payment Status Dropdown */}
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-green-400 focus:outline-none"
                      value={
                        PaymentData.paymentStatus || PaymentStatus[OrderId]
                      }
                      onChange={(e) =>
                        setPaymentData({
                          ...PaymentData,
                          paymentStatus: e.target.value,
                        })
                      }
                      // Uncomment if you want to disable Completed or Failed statuses
                      // disabled={
                      //   PaymentStatus[OrderId] === "Completed" ||
                      //   PaymentStatus[OrderId] === "Failed"
                      // }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Failed">Failed</option>
                    </select>

                    {/* Input for Payment Name */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Payment Name
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                        placeholder="Enter payment name"
                        value={PaymentData.name}
                        onChange={(e) =>
                          setPaymentData({
                            ...PaymentData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Input for Payment Amount */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Payment Amount
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                        placeholder="Enter payment amount"
                        value={PaymentData.amount}
                        onChange={(e) =>
                          setPaymentData({
                            ...PaymentData,
                            amount: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p
                  onClick={() => handelOrderCancel(OrderId)}
                  className="text-red-500 text-lg font-semibold text-center cursor-pointer hover:underline"
                >
                  Cancel Order
                </p>
              )}
            </div>
            <div className="mt-6">
              <button
                onClick={() => handleOrderUpdate(OrderId)}
                className="w-full bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-300"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
