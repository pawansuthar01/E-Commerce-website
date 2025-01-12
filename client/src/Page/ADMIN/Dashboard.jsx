import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, LoadAccount } from "../../Redux/Slice/authSlice";
import { getPaymentRecord, PaymentData } from "../../Redux/Slice/paymentSlice";
import { AllOrder, UpdateOrder } from "../../Redux/Slice/OrderSlice";
import { getAllProduct } from "../../Redux/Slice/ProductSlice";
import { FaArrowLeft, FaBoxOpen, FaEnvelope } from "react-icons/fa6";
import Layout from "../../layout/layout";
import { OrderShow } from "../../Components/ShowOrder";
import { FaUser, FaBox, FaCreditCard, FaThLarge } from "react-icons/fa";
import { UsersCart } from "../../Components/DashBoard/UserDataCard";
import { ProductsCart } from "../../Components/DashBoard/ProductDataCart";
import { DashBoard } from "../../Components/DashBoard/DashBoardData";
import { PaymentCart } from "../../Components/DashBoard/PaymentDataCart";
import { LoadingCart } from "../../Components/DashBoard/Loader";
import { OrderCart } from "../../Components/OrderDataCart";
import { GetMessage } from "../../Redux/Slice/feedbackSlice";
import Messages from "../../Components/DashBoard/MessageData";
import ShopInformationForm from "../../Components/shopInfo";

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
    await dispatch(LoadAccount());
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
        totalPayments:
          paymentsRes?.payload?.totalAmount +
          (paymentsRe?.payload?.data?.receivedAmount || 0),
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
        {/* Dashboard Button */}
        <div className="grid grid-cols-3 gap-4 w-full bg-[#EFF3EA] py-4 rounded-lg px-4">
          {/* Dashboard Button */}
          {[
            {
              id: 1,
              label: "Dashboard",
              icon: FaThLarge,
              colors: "from-blue-500 to-purple-500",
            },
            {
              id: 2,
              label: "Users",
              icon: FaUser,
              colors: "from-green-500 to-teal-500",
            },
            {
              id: 3,
              label: "Orders",
              icon: FaBox,
              colors: "from-yellow-500 to-orange-500",
            },
            {
              id: 4,
              label: "Products",
              icon: FaBoxOpen,
              colors: "from-green-500 to-orange-500",
            },
            {
              id: 5,
              label: "Payments",
              icon: FaCreditCard,
              colors: "from-red-500 to-pink-500",
            },
            {
              id: 6,
              label: "Messages",
              icon: FaEnvelope,
              colors: "from-purple-500 to-indigo-500",
            },
          ].map(({ id, label, icon: Icon, colors }) => (
            <button
              key={id}
              className={`p-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                activeButton === id
                  ? `bg-gradient-to-r ${colors} text-white shadow-lg`
                  : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
              onClick={() => handleClick(id)}
            >
              <Icon className="text-xl" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        <DashBoard stats={stats} show={activeButton === 1} orders={orders} />
        <UsersCart showUser={activeButton === 2} users={users} />
        {activeButton === 3 && <ShopInformationForm />}
        <ProductsCart
          currentPage={currentPage}
          totalPages={totalPages}
          showProduct={activeButton === 4}
          products={products}
          fetchProducts={fetchProducts}
        />
        <PaymentCart
          showPayment={activeButton === 5}
          Razorpay={Razorpay}
          payments={payments}
        />
        {activeButton == 6 && <Messages />}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
