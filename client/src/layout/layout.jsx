import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu, FiShoppingCart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { GiShoppingCart } from "react-icons/gi";
import logo from "../assets/download-removebg-preview.png";
import {
  FaBell,
  FaMagnifyingGlass,
  FaMoon,
  FaSun,
  FaUser,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../Components/footer";
import LoadingButton from "../constants/LoadingBtn";
import { useEffect, useState } from "react";
import { CheckJWT, LogoutAccount } from "../Redux/Slice/authSlice";
import { useTheme } from "../Components/ThemeContext";
import { NotificationGet } from "../Redux/Slice/notification.Slice";
import NotificationCart from "../Page/notification/notification";

function Layout({ children }) {
  const [loading, setLoading] = useState("");
  const [NotificationShow, setNotificationShow] = useState(false);
  const [notification, setNotification] = useState([]);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const role = useSelector((state) => state?.auth?.role);
  const { data } = useSelector((state) => state?.auth);

  function changeWight() {
    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "auto";
  }

  function hideSide() {
    const element = document.getElementsByClassName("drawer-toggle");
    element[0].checked = false;

    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "0";
  }

  const handelLogout = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await dispatch(LogoutAccount());
    if (res) {
      setLoading(false);
    }
  };
  const toggleNotificationSidebar = () => {
    setNotificationShow(!NotificationShow);
  };
  const handelNotificationLoad = async () => {
    if (isLoggedIn) {
      const res = await dispatch(NotificationGet());
      const response = await dispatch(CheckJWT());
      if (!response?.payload?.valid) {
        await dispatch(LogoutAccount());
        navigate("/login");
      }
      if (res?.payload?.data) {
        const notificationsArray = Array.isArray(res.payload.data)
          ? res.payload.data
          : [res.payload.data];

        setNotification(notificationsArray);
      }
    }
  };

  useEffect(() => {
    handelNotificationLoad();
  }, []);

  useEffect(() => {
    const checkNetworkSpeed = () => {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      if (connection) {
        const slowConnectionTypes = ["slow-2g", "2g"];
        if (slowConnectionTypes.includes(connection.effectiveType)) {
          navigate("/SlowInternetPage");
        }
      }
    };

    // Initial check
    checkNetworkSpeed();

    // Listen for network changes
    navigator.connection?.addEventListener("change", checkNetworkSpeed);

    return () => {
      navigator.connection?.removeEventListener("change", checkNetworkSpeed);
    };
  }, []);
  return (
    <div
      className={`min-h-[90vh] select-none ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="sticky top-0 z-50">
        <nav
          className={`flex z-50 justify-between w-[100%] items-center ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <label htmlFor="my-drawer" className="relative cursor-pointer">
            <FiMenu
              onClick={changeWight}
              size={"36px"}
              className={`font-bold m-4 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            />
          </label>
          <div className="max-sm:hidden flex w-full justify-center">
            <label
              htmlFor="default-search"
              className={`mb-2 text-sm font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              } sr-only`}
            >
              Search
            </label>
            <div className="relative w-1/2">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className={`w-4 h-4 ${
                    darkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className={`w-full p-4 ps-10 text-sm outline-none ${
                  darkMode
                    ? "text-white bg-gray-700 border-gray-600"
                    : "text-gray-900 bg-gray-50 border-gray-300"
                } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Search Mockups, Logos..."
                required
              />
              <button
                type="submit"
                className={`text-white absolute end-2.5 bottom-2.5 ${
                  darkMode ? "bg-blue-600" : "bg-blue-700"
                } border-blue-700 hover:bg-transparent hover:text-blue-700 hover:border-2 font-medium rounded-lg text-sm px-4 py-2`}
              >
                Search
              </button>
            </div>
          </div>
          <div className="flex gap-5 font-bold text-black items-center">
            <div className="max-sm:hidden flex">
              {!isLoggedIn && (
                <Link to="/Login">
                  <button
                    className={`${
                      darkMode ? "bg-blue-600" : "bg-blue-700"
                    } text-sm px-8 py-3 font-medium text-white rounded-md w-full hover:bg-transparent hover:text-blue-700 hover:border-2`}
                  >
                    Login
                  </button>
                </Link>
              )}
            </div>
            <div className=" relative cursor-pointer hover:text-green-400 dark:text-white">
              <FaBell
                size={"20px"}
                onClick={() => toggleNotificationSidebar()}
              />
              <p className="absolute text-green-600 font-serif text-sm top-[-12px] right-[-5px]">
                {notification &&
                  notification.length >= 1 &&
                  notification.length}
              </p>
            </div>
            <Link to="/Search">
              <div className="cursor-pointer dark:text-white sm:hidden">
                <FaMagnifyingGlass size={"20px"} />
              </div>
            </Link>

            <div className="cursor-pointer hover:text-green-400 dark:text-white">
              <FaUser size={"20px"} onClick={() => navigate("/Profile")} />
            </div>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded dark:text-white`}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            <div
              onClick={() => navigate("/Cart")}
              className="relative cursor-pointer mr-4 dark:text-white"
            >
              <p className="absolute text-green-600 font-serif text-sm top-[-12px] right-[-5px]">
                {data?.walletAddProducts?.length >= 1 &&
                  data?.walletAddProducts?.length}
              </p>
              <GiShoppingCart
                size={"20px"}
                className={`${
                  data?.walletAddProducts?.length >= 1
                    ? `text-green-400`
                    : `text-black dark:text-white`
                }`}
              />
            </div>
          </div>
        </nav>
        <div className="drawer absolute left-0 z-50 w-fit">
          <input className="drawer-toggle" id="my-drawer" type="checkbox" />
          <div className="drawer-side w-0">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul
              className={`menu p-4 w-56 h-[100%] sm:w-80 ${
                darkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-base-200 text-base-content"
              } space-y-5 relative`}
            >
              <li className="w-fit absolute right-2 z-50">
                <button onClick={hideSide}>
                  <AiFillCloseCircle size={"20px"} />
                </button>
              </li>
              <li onClick={hideSide} className="pt-5">
                <Link to="/">Home</Link>
              </li>
              {["ADMIN", "AUTHOR"].includes(role) && (
                <>
                  <li onClick={hideSide}>
                    <Link to="/AddProduct">Add Product</Link>
                  </li>
                  <li onClick={hideSide}>
                    <Link to="/DashBoard">ADMIN Dashboard</Link>
                  </li>
                </>
              )}

              <li onClick={hideSide}>
                <Link to="/AllProduct">All Product</Link>
              </li>
              <li onClick={hideSide}>
                <Link to="/Blog">Blog</Link>
              </li>

              <li onClick={hideSide}>
                <Link to="/Contact">Contact Us</Link>
              </li>
              <li onClick={hideSide}>
                <Link to="/About">About Us</Link>
              </li>
              {!isLoggedIn && (
                <li className="w-[90%] absolute bottom-4">
                  <div className="flex items-center justify-center w-full flex-wrap">
                    <Link to="/Login">
                      <button className="btn btn-primary px-8 py-1 rounded-md font-semibold w-full">
                        Login
                      </button>
                    </Link>
                    <Link to="/SignUp">
                      <button className="btn btn-secondary px-8 py-1 rounded-md font-semibold w-full">
                        SignUp
                      </button>
                    </Link>
                  </div>
                </li>
              )}
              {isLoggedIn && (
                <div className="w-[90%] absolute bottom-4">
                  <div className="flex items-center justify-center w-full flex-wrap">
                    <LoadingButton
                      loading={loading}
                      message={"Loading.."}
                      onClick={handelLogout}
                      name={"Logout"}
                      color={"bg-red-500"}
                    />
                  </div>
                </div>
              )}
            </ul>
          </div>
        </div>
        {NotificationShow && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-10"
            onClick={toggleNotificationSidebar}
          ></div>
        )}

        <div
          role="dialog"
          aria-label="Notification Panel"
          className={`fixed top-0 right-0 h-full dark:bg-[#111827] bg-white shadow-lg max-sm:w-[90%] w-[40%] z-20 transition-transform duration-500 ease-in-out ${
            NotificationShow ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center dark:bg-[#111827]  bg-gray-100 p-4 border-b border-gray-300 ">
            <h2 className="text-xl font-bold dark:text-white text-gray-800">
              Notifications
            </h2>
            <button
              className="text-red-500 text-lg font-bold"
              onClick={toggleNotificationSidebar}
            >
              X
            </button>
          </div>

          <div className="p-4 space-y-4 dark:text-white text-black overflow-y-auto max-h-[calc(100vh-80px)] ">
            {notification && notification.length == 0 ? (
              <p className="text-center">No notification...</p>
            ) : (
              notification.map((data, ind) => {
                return (
                  <div
                    key={ind}
                    className="p-3 bg-gray-100 dark:bg-[#111827] rounded-md shadow-[0_0_1px_white] "
                  >
                    <NotificationCart
                      data={data}
                      onUpdate={handelNotificationLoad}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <div>{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
