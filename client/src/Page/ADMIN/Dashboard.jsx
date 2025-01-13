import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, LoadAccount } from "../../Redux/Slice/authSlice";
import { getPaymentRecord, PaymentData } from "../../Redux/Slice/paymentSlice";
import { AllOrder, UpdateOrder } from "../../Redux/Slice/OrderSlice";
import { getAllProduct } from "../../Redux/Slice/ProductSlice";
import { FaArrowLeft, FaBoxOpen, FaEnvelope, FaMound } from "react-icons/fa6";
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
import { XCircleIcon } from "@heroicons/react/24/solid";
import { MdMenu, MdSettings } from "react-icons/md";
import { SettingsIcon } from "../Product/icon";

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

  const [activeSection, setActiveSection] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
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
    {
      id: 7,
      label: "Setting",
      icon: MdSettings,
      colors: "from-green-500 to-indigo-500",
    },
  ];
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
      <div className=" bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen select-none">
        {/* Dashboard Header */}

        {/* Button Section */}
        <header className="bg-white shadow-sm relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-bold text-indigo-600">
                Admin Dashboard
              </h1>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <XCircleIcon className="h-6 w-6" />
                ) : (
                  <MdMenu className="h-6 w-6" />
                )}
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1">
                {navigation.map((items) => (
                  <button
                    key={items.id}
                    onClick={() => (
                      setActiveSection(items.id),
                      setIsMobileMenuOpen(!isMobileMenuOpen)
                    )}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out flex items-center ${
                      activeSection === items.id
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <items.icon className="w-4 h-4 mr-2" />

                    {items.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg absolute w-full z-50">
              {navigation.map((items) => (
                <button
                  key={items.id}
                  onClick={() => (
                    setActiveSection(items.id),
                    setIsMobileMenuOpen(!isMobileMenuOpen)
                  )}
                  className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out flex items-center ${
                    activeSection === items.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <items.icon className="w-4 h-4 mr-2" />

                  {items.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Dynamic Content Section */}
        <div className="mt-10">
          {activeSection === 1 && <DashBoard stats={stats} orders={orders} />}
          {activeSection === 2 && <UsersCart users={users} />}
          {activeSection === 3 && <OrderCart order={orders} />}
          {activeSection === 4 && (
            <ProductsCart
              currentPage={currentPage}
              totalPages={totalPages}
              products={products}
              fetchProducts={fetchProducts}
            />
          )}
          {activeSection === 5 && (
            <PaymentCart Razorpay={Razorpay} payments={payments} />
          )}
          {activeSection === 6 && <Messages />}
          {activeSection === 7 && <ShopInformationForm />}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
