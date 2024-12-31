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
import { OrderCart } from "../../Components/OrderDataCart";

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
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

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
  };

  const fetchData = async () => {
    try {
      const usersRes = await dispatch(getAllUsers());
      const ordersRes = await dispatch(AllOrder());
      const paymentsRes = await dispatch(getPaymentRecord());
      const paymentsRe = await dispatch(PaymentData());
      setRazorpay(paymentsRes?.payload?.allPayments?.items);
      setUsers(usersRes?.payload?.allUser);
      setOrders(ordersRes?.payload?.data);
      setPayments(paymentsRe?.payload?.data);
      setStats({
        users: usersRes?.payload?.allUserCount,
        Author: usersRes?.payload?.allAUTHORCount,
        Admin: usersRes?.payload?.allADMINCount,
        monthlySalesRecord: paymentsRes?.payload?.monthlySalesRecord,
        orders: ordersRes?.payload?.data.length,
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
        <div className="flex flex-wrap gap-1">
          {activeButton === 3 && <OrderCart />}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
