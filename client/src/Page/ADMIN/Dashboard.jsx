import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, LoadAccount } from "../../Redux/Slice/authSlice";
import { getPaymentRecord, PaymentData } from "../../Redux/Slice/paymentSlice";
import { AllOrder, UpdateOrder } from "../../Redux/Slice/OrderSlice";
import { getAllProduct } from "../../Redux/Slice/ProductSlice";
import { FaArrowLeft, FaBoxOpen } from "react-icons/fa6";
import Layout from "../../layout/layout";
import { OrderShow } from "../../Components/ShowOrder";
import { FaUser, FaBox, FaCreditCard, FaThLarge } from "react-icons/fa";
import { UsersCart } from "../../Components/DashBoard/UserDataCard";
import { ProductsCart } from "../../Components/DashBoard/ProductDataCart";
import { DashBoard } from "../../Components/DashBoard/DashBoardData";
import { PaymentCart } from "../../Components/DashBoard/PaymentDataCart";
import { LoadingCart } from "../../Components/DashBoard/Loader";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    users: 0,
    Admin: 0,
    Author: 0,
    products: 0,
    orders: 0,
    monthlySalesRecord: [],
    totalPayments: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [Razorpay, setRazorpay] = useState([]);
  const [OrderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [editShow, setEditShow] = useState(false);
  const [Role, setRole] = useState("");
  const [PaymentStatus, setPaymentStatus] = useState("");
  const [orderStats, setOrderStatus] = useState("");

  const fetchProducts = async (page) => {
    try {
      const productsRes = await dispatch(
        getAllProduct({ page, limit: window.innerWidth > 760 ? "50" : "25" })
      );
      const { data, totalPages } = productsRes.payload;
      setProducts(data);
      setTotalPages(totalPages);
      setCurrentPage(page);

      setStats({
        products: productsRes.payload.totalProducts,
      });
    } catch (error) {
      alert(error.message);
    }
  };
  const loadProfile = async () => {
    const res = await dispatch(LoadAccount());
    setRole(res?.payload?.data?.role);
  };
  const handleOrderUpdate = async (
    id,
    paymentStatus = null,
    orderStats = null
  ) => {
    if (orderStats === "Delivered") {
      alert("You cannot update or cancel a delivered order.");

      return;
    }

    if (orderStats !== null && PaymentStatus !== "Completed") {
      alert("Payment must be completed before updating the order.");
      return;
    }

    if (!id) {
      alert("Something went wrong. Please try again.");
      return;
    }

    if (paymentStatus !== null) {
      const res = await dispatch(UpdateOrder({ id, data: paymentStatus }));
      if (res?.payload?.success) {
        setEditShow(false);
        const ordersRes = await dispatch(AllOrder());
        setOrders(ordersRes.payload.data);
        alert("Payment Status updated successfully!");

        loadOrders();
      } else {
        alert(res?.payload?.message || "Failed to update payment status.");
      }
    }

    if (orderStats !== null) {
      const res = await dispatch(UpdateOrder({ id, data: orderStats }));
      if (res?.payload?.success) {
        setEditShow(false);
        alert("Order Status updated successfully!");

        const ordersRes = await dispatch(AllOrder());
        setOrders(ordersRes.payload.data);
      } else {
        alert(res?.payload?.message || "Failed to update order status.");
      }
    }
  };
  const fetchData = async () => {
    try {
      // const usersRes = await dispatch(getAllUsers());
      // console.log(usersRes);
      // const ordersRes = await dispatch(AllOrder());
      // console.log(ordersRes);
      const paymentsRes = await dispatch(getPaymentRecord());
      const paymentsRe = await dispatch(PaymentData());
      console.log(paymentsRe);
      setRazorpay(paymentsRes?.payload?.allPayments?.items);
      // setUsers(usersRes?.payload?.allUser);
      // setOrders(ordersRes?.payload?.data);
      setPayments(paymentsRe?.payload?.data);
      setStats({
        // users: usersRes?.payload?.allUserCount,
        // Author: usersRes?.payload?.allAUTHORCount,
        // Admin: usersRes?.payload?.allADMINCount,
        monthlySalesRecord: paymentsRes?.payload?.monthlySalesRecord,
        // orders: ordersRes?.payload?.data.length,
        totalPayments: paymentsRes?.payload?.totalAmount,
      });
      setLoading(false);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    loadProfile();
    fetchProducts(1);
  }, []);

  useEffect(() => {
    const trackingOrder = () => {
      const statusMap = orders?.reduce((acc, Order) => {
        acc[Order._id] = Order.orderStats;
        return acc;
      }, {});
      setOrderStatus(statusMap);
    };

    trackingOrder();
  }, [orders]);
  const [activeButton, setActiveButton] = useState(1);

  const handleClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 select-none">
        <LoadingCart dataType={"user"} />
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
        <div className="flex space-x-4 w-full justify-evenly bg-[#EFF3EA] py-2">
          {/* Dashboard Button */}
          <button
            className={`p-3 rounded-md transition-all duration-300 flex justify-center gap-1 items-center ${
              activeButton === 1
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleClick(1)}
          >
            <FaThLarge />
            <span>DashBoard</span>
          </button>

          {/* User Button */}
          <button
            className={`p-3 rounded-md transition-all duration-300 flex  items-center gap-1 ${
              activeButton === 2
                ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleClick(2)}
          >
            <FaUser />
            <span>Users</span>
          </button>

          {/* Package Button */}
          <button
            className={`p-3 rounded-md transition-all duration-300  flex  items-center gap-1 ${
              activeButton === 3
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleClick(3)}
          >
            <FaBox />
            <span>Order</span>
          </button>
          <button
            className={`p-3 rounded-md transition-all duration-300  flex  items-center gap-1 ${
              activeButton === 4
                ? "bg-gradient-to-r from-green-500 to-orange-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleClick(4)}
          >
            <FaBoxOpen />
            <span>Products</span>
          </button>

          {/* Notification Button */}
          <button
            className={`p-3 rounded-md transition-all duration-300 flex gap-1 items-center ${
              activeButton === 5
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleClick(5)}
          >
            <FaCreditCard />
            <span>Payments</span>
          </button>
        </div>

        <DashBoard show={activeButton === 1} orders={orders} stats={stats} />
        <UsersCart showUser={activeButton === 2} users={users} />
        <PaymentCart
          showPayment={activeButton === 5}
          Razorpay={Razorpay}
          payments={payments}
        />
        <ProductsCart
          currentPage={currentPage}
          totalPages={totalPages}
          showProduct={activeButton === 4}
          products={products}
          fetchProducts={fetchProducts}
        />

        {activeButton === 3 && (
          <>
            <div className="flex flex-wrap gap-1">
              <OrderShow
                Role={Role}
                Orders={orders}
                orderStats={orderStats}
                handelOrderCancel={(id) => handelOrderCancel(id)}
                setEditShow={setEditShow}
                setOrderId={setOrderId}
                setPaymentStatus={setPaymentStatus}
              />
            </div>
          </>
        )}
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
                    The order has been delivered. No further updates are
                    allowed.
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
                        value={orderStats[OrderId]}
                        onChange={(e) =>
                          handleOrderUpdate(OrderId, {
                            orderStats: e.target.value,
                          })
                        }
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

                    {/* Change Payment Status */}
                    <div>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Change Payment Status
                      </p>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-green-400 focus:outline-none"
                        value={PaymentStatus}
                        onChange={(e) =>
                          handleOrderUpdate(OrderId, {
                            paymentStatus: e.target.value,
                          })
                        }
                        disabled={
                          PaymentStatus === "Completed" ||
                          PaymentStatus === "Failed"
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Failed">Failed</option>
                      </select>
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
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
