import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, LoadAccount } from "../../Redux/Slice/authSlice";
import { getPaymentRecord } from "../../Redux/Slice/paymentSlice";
import { AllOrder, UpdateOrder } from "../../Redux/Slice/OrderSlice";
import { getAllProduct } from "../../Redux/Slice/ProductSlice";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { GiMoneyStack } from "react-icons/gi";
import { FcSalesPerformance } from "react-icons/fc";
import { FiCheckCircle, FiXCircle, FiLoader, FiTruck } from "react-icons/fi";

import { FaArrowLeft, FaUsers } from "react-icons/fa6";
import Layout from "../../layout/layout";
import { OrderShow } from "../../Components/ShowOrder";

// Register chart.js components
ChartJS.register(
  ArcElement,

  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
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
  const [OrderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showUser, setShowUser] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [Role, setRole] = useState("");
  const [PaymentStatus, setPaymentStatus] = useState("");
  const [orderStats, setOrderStatus] = useState("");

  // Fetch All Data
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
      console.error("Error fetching products:", error);
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
      toast.error("You cannot update or cancel a delivered order.");
      return;
    }

    if (orderStats !== null && PaymentStatus !== "Completed") {
      toast.error("Payment must be completed before updating the order.");
      return;
    }

    if (!id) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    if (paymentStatus !== null) {
      const res = await dispatch(UpdateOrder({ id, data: paymentStatus }));
      if (res?.payload?.success) {
        setEditShow(false);
        const ordersRes = await dispatch(AllOrder());
        setOrders(ordersRes.payload.data);

        toast.success("Payment Status updated successfully!");
        loadOrders();
      } else {
        toast.error(
          res?.payload?.message || "Failed to update payment status."
        );
      }
    }

    if (orderStats !== null) {
      const res = await dispatch(UpdateOrder({ id, data: orderStats }));
      if (res?.payload?.success) {
        setEditShow(false);
        toast.success("Order Status updated successfully!");

        const ordersRes = await dispatch(AllOrder());
        setOrders(ordersRes.payload.data);
      } else {
        toast.error(res?.payload?.message || "Failed to update order status.");
      }
    }
  };
  const fetchData = async () => {
    try {
      const usersRes = await dispatch(getAllUsers());

      const ordersRes = await dispatch(AllOrder());
      const paymentsRes = await dispatch(getPaymentRecord());
      setUsers(usersRes.payload.allUser);
      setOrders(ordersRes.payload.data);
      setPayments(paymentsRes.payload.allPayments.items);

      setStats({
        users: usersRes.payload.allUserCount,
        Author: usersRes.payload.allAUTHORCount,
        Admin: usersRes.payload.allADMINCount,
        monthlySalesRecord: paymentsRes?.payload?.monthlySalesRecord,
        orders: ordersRes.payload.data.length,
        totalPayments: paymentsRes.payload.totalAmount,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert to milliseconds
    return date.toLocaleDateString(); // Format date as "MM/DD/YYYY"
  };

  useEffect(() => {
    fetchData();
    loadProfile();
    fetchProducts(1);
  }, []);
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      fetchProducts(page);
    }
  };
  const orderStatusChartData = {
    labels: ["Delivered", "Canceled", "Processing", "Shipping"],
    datasets: [
      {
        label: "Order Status",
        data: [
          orders.filter((order) => order.orderStats === "Delivered").length,
          orders.filter((order) => order.orderStats === "Canceled").length,
          orders.filter((order) => order.orderStats === "Processing").length,
          orders.filter((order) => order.orderStats === "Shipping").length,
        ],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800", "#2196f3"],
        borderColor: ["#4caf50", "#f44336", "#ff9800", "#2196f3"],
        borderWidth: 1,
      },
    ],
  };

  const userData = {
    labels: ["USER", "ADMIN", "AUTHOR"],
    fontColor: "white",
    datasets: [
      {
        label: "User Details",
        data: [stats.users, stats.Admin, stats.Author],
        backgroundColor: ["yellow", "green", "red"],
        borderWidth: 1,
        borderColor: ["yellow", "green", "red"],
      },
    ],
  };
  const salesData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    fontColor: "white",
    datasets: [
      {
        label: "Sales / Month",
        data: stats.monthlySalesRecord,
        backgroundColor: ["green"],
        borderColor: ["white"],
        borderWidth: 2,
      },
    ],
  };
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
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
        {/* Statistics */}

        {/* Chart - User Count */}

        <div className="grid sm:grid-cols-2 justify-center gap-5 m-auto mx-10">
          <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
            <div className="w-80 h-80">
              <Pie data={userData} />
            </div>
            <div className="grid grid-cols-3  gap-2">
              <div className="flex items-center justify-between  p-1 gap-2 rounded-md shadow-md">
                <div className="flex flex-col items-center ">
                  <p className="font-semibold"> Users</p>
                  <h3 className="text-2xl  font-bold">{stats.users}</h3>
                </div>
                <FaUsers className="text-yellow-500 text-3xl" />
              </div>
              <div className="flex items-center justify-between p-1 gap-2 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">Admin</p>
                  <h3 className="text-2xl font-bold">{stats.Admin}</h3>
                </div>
                <FaUsers className="text-green-500 text-3xl" />
              </div>
              <div className="flex items-center justify-between p-1 gap-2 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">Author</p>
                  <h3 className="text-2xl font-bold">{stats.Author}</h3>
                </div>
                <FaUsers className="text-green-500 text-3xl" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
            <div className="h-80 w-full relative">
              <Bar className="absolute bottom-0 h-80 w-full" data={salesData} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center justify-between p-2 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">Total Order</p>
                  <h3 className="text-3xl font-bold">{stats.orders}</h3>
                </div>
                <FcSalesPerformance className="text-yellow-500 text-5xl" />
              </div>
              <div className="flex items-center justify-between p-2 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">Total Revenue</p>
                  <h3 className="text-3xl font-bold">₹{stats.totalPayments}</h3>
                </div>
                <GiMoneyStack className="text-green-500 text-5xl" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
          <div className="w-96 h-96">
            <Pie data={orderStatusChartData} />
          </div>
          <div className="grid grid-cols-4  gap-2">
            <div className="flex items-center justify-between  p-1 gap-2 rounded-md shadow-md">
              <div className="flex flex-col items-center ">
                <p className="font-semibold"> Delivered</p>
                <h3 className="text-2xl  font-bold">
                  {
                    orders.filter((order) => order.orderStats === "Delivered")
                      .length
                  }
                </h3>
              </div>
              <FiCheckCircle className="text-green-500 text-3xl" />
            </div>
            <div className="flex items-center justify-between p-2 gap-2 rounded-md shadow-md">
              <div className="flex flex-col items-center">
                <p className="font-semibold">Canceled</p>
                <h3 className="text-2xl font-bold">
                  {
                    orders.filter((order) => order.orderStats === "Canceled")
                      .length
                  }
                </h3>
              </div>
              <FiXCircle className="text-red-500  text-3xl" />
            </div>
            <div className="flex items-center justify-between p-2 gap-2 rounded-md shadow-md">
              <div className="flex flex-col items-center">
                <p className="font-semibold">Processing</p>
                <h3 className="text-2xl font-bold">
                  {
                    orders.filter((order) => order.orderStats === "Processing")
                      .length
                  }
                </h3>
              </div>

              <FiLoader className="text-blue-500  text-3xl" />
            </div>
            <div className="flex items-center justify-between p-2 gap-2 rounded-md shadow-md">
              <div className="flex flex-col items-center">
                <p className="font-semibold">Shipping</p>
                <h3 className="text-2xl font-bold">
                  {
                    orders.filter((order) => order.orderStats === "Shipping")
                      .length
                  }
                </h3>
              </div>
              <FiTruck className="text-yellow-500 text-3xl " />
            </div>
          </div>
        </div>
        <div className="  flex flex-wrap justify-evenly my-2 m-auto shadow-md rounded-lg">
          <div className="form-control w-52">
            <label className="label cursor-pointer">
              <span className="label-text">Order Show</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                onChange={() => setShowOrder((prevState) => !prevState)}
                value={showOrder}
              />
            </label>
          </div>
          <div className="form-control w-52">
            <label className="label cursor-pointer">
              <span className="label-text">Payment Records</span>
              <input
                type="checkbox"
                className="toggle toggle-info"
                onChange={() => setShowPayment((prevState) => !prevState)}
                value={showPayment}
              />
            </label>
          </div>

          <div className="form-control w-52">
            <label className="label cursor-pointer">
              <span className="label-text">All UserShow</span>
              <input
                type="checkbox"
                className="toggle toggle-success"
                onChange={() => setShowUser((prevState) => !prevState)}
                value={showUser}
              />
            </label>
          </div>
          <div className="form-control w-52">
            <label className="label cursor-pointer">
              <span className="label-text">Product Show</span>
              <input
                type="checkbox"
                className="toggle toggle-accent"
                onChange={() => setShowProduct((prevState) => !prevState)}
                value={showProduct}
              />
            </label>
          </div>
        </div>
        {/* User Management */}
        {showUser && (
          <>
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <section className="mb-6 overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg  ">
                <thead className="bg-gray-200 ">
                  <tr>
                    <th className="p-2">No.</th>

                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="">
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td className="p-2">#{index + 1}</td>
                      <td className="p-2">{user.fullName}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.role}</td>
                      <td className="p-2 flex space-x-2">
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded"
                          onClick={() => handleUserDelete(user._id)}
                        >
                          Delete
                        </button>
                        {user.role !== "ADMIN" && (
                          <button
                            className="bg-blue-500 text-white px-4 py-1 rounded"
                            onClick={() => handlePromoteToAdmin(user._id)}
                          >
                            Promote
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {/* Product Management */}
        {showProduct && (
          <>
            <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
            <section className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="w-full  ">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2">No.</th>
                    <th className="p-2">Image</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {products.map((product, index) => (
                    <tr key={product._id}>
                      <td className="p-2">#{index + 1}</td>
                      <td>
                        <img
                          className="p-2 w-20 h-20 rounded-xl"
                          src={
                            product?.image?.secure_url
                              ? product?.image?.secure_url
                              : product?.images[0]?.secure_url
                          }
                          alt={product.name}
                        />
                      </td>
                      <td className="p-2">{product.name}</td>
                      <td className="p-2">₹{product.price}</td>
                      <td className="p-2">
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded"
                          onClick={() => handleProductDelete(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-1 space-x-2 mb-6 ">
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 border rounded bg-white text-blue-500 border-blue-500"
                  >
                    Previous
                  </button>
                )}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 border rounded ${
                      index + 1 === currentPage
                        ? "bg-blue-300 text-white"
                        : "bg-white text-blue-400 border-blue-600"
                    }`}
                    disabled={index + 1 === currentPage}
                  >
                    {index + 1}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 border rounded bg-white text-blue-500 border-blue-500"
                  >
                    Next
                  </button>
                )}
              </div>
            </section>
          </>
        )}
        {showPayment && (
          <>
            <h2 className="text-2xl font-bold mb-4">Manage Payments</h2>
            <section className="mb-6 overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2">No.</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">contact</th>
                    <th className="p-2">currency</th>
                    <th className="p-2">method</th>
                    <th className="p-2">Payment Status</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {payments.map((payment, index) => (
                    <tr key={payment.id}>
                      <td className="p-2">#{index + 1}</td>
                      <td className="p-2">₹{payment.amount}</td>
                      <td className="p-2">{payment.contact}</td>
                      <td className="p-2">{payment.currency}</td>
                      <td className="p-2">{payment.method}</td>
                      <td className="p-2 flex justify-center">
                        {payment.status !== "failed" ? (
                          <FiCheckCircle className="text-green-500 text-xl" />
                        ) : (
                          <FiXCircle className="text-red-500 text-xl" />
                        )}
                      </td>
                      <td className="p-2">{formatDate(payment.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {showOrder && (
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
