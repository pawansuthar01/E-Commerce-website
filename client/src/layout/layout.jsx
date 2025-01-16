import {
  AiFillCloseCircle,
  AiFillHome,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { FiLock, FiMenu } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { GiShoppingCart } from "react-icons/gi";
import {
  FaBell,
  FaBlog,
  FaBoxOpen,
  FaMagnifyingGlass,
  FaMoon,
  FaSun,
  FaUser,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../Components/footer";
import LoadingButton from "../constants/LoadingBtn";
import { useEffect, useState } from "react";
import {
  getShopInfo,
  LoadAccount,
  LogoutAccount,
} from "../Redux/Slice/authSlice";
import { useTheme } from "../Components/ThemeContext";
import { NotificationGet } from "../Redux/Slice/notification.Slice";
import NotificationCart from "../Page/notification/notification";
import SearchBar from "../Components/SearchBar";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineContactPage,
  MdSpaceDashboard,
} from "react-icons/md";
import { BsArrowsCollapse, BsCloudUpload } from "react-icons/bs";
import { FaRegFileAlt } from "react-icons/fa";

function Layout({ children, load }) {
  const [loading, setLoading] = useState("");
  const [NotificationShow, setNotificationShow] = useState(false);
  const [notification, setNotification] = useState([]);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const { role, exp } = useSelector((state) => state?.auth);

  const { data } = useSelector((state) => state?.auth);
  const { phoneNumber, email, address, instagram, youtube, facebook } =
    useSelector((state) => state?.ShopInfo);

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
    setLoading(false);
    if (res?.payload?.success) {
      navigate("/login");
    }
  };
  const toggleNotificationSidebar = () => {
    setNotificationShow(!NotificationShow);
  };
  const handelNotificationLoad = async () => {
    if (isLoggedIn) {
      const res = await dispatch(NotificationGet());
      await dispatch(LoadAccount());
      if (res?.payload?.data) {
        const notificationsArray = Array.isArray(res.payload.data)
          ? res.payload.data
          : [res.payload.data];

        setNotification(notificationsArray);
      }
    }
  };
  useEffect(() => {
    async function handelShopInfo() {
      await dispatch(getShopInfo());
    }

    if (
      phoneNumber == "" ||
      email == "" ||
      address == "" ||
      instagram == "" ||
      youtube == "" ||
      facebook == ""
    ) {
      handelShopInfo();
    }
  }, []);
  const handleSearch = async (query) => {
    try {
      navigate("/Product", { state: query });
    } catch (e) {}
  };

  const handleReadNotification = (NotificationId) => {
    setNotification((prevNotiFiCation) =>
      prevNotiFiCation.filter(
        (Notification) => Notification._id !== NotificationId
      )
    );
  };
  useEffect(() => {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    async function handelCheckJWT() {
      if (exp != 0 && currentTimestamp > exp) {
        await dispatch(LogoutAccount());
        navigate("/login");
      }
    }

    handelCheckJWT();
  }, []);

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
          // navigate("/SlowInternetPage");
        }
      }
    };

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
          {!load && <SearchBar onSearch={handleSearch} />}
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
                  notification?.length >= 1 &&
                  notification?.length}
              </p>
            </div>
            <Link to="/Search">
              <div className="cursor-pointer dark:text-white sm:hidden">
                <FaMagnifyingGlass size={"20px"} />
              </div>
            </Link>

            {isLoggedIn && (
              <div className="cursor-pointer hover:text-green-400 dark:text-white">
                <FaUser size={"20px"} onClick={() => navigate("/Profile")} />
              </div>
            )}

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
              } space-y-4 relative`}
            >
              <li className="w-fit absolute right-2 z-50">
                <button onClick={hideSide}>
                  <AiFillCloseCircle size={"20px"} />
                </button>
              </li>
              <li onClick={hideSide} className="pt-2">
                <Link to="/">
                  {" "}
                  <AiFillHome />
                  Home
                </Link>
              </li>

              <li onClick={hideSide}>
                <Link to="/Product">
                  {" "}
                  <FaBoxOpen />
                  All Product
                </Link>
              </li>
              <li onClick={hideSide}>
                <Link to="/Blog">
                  {" "}
                  <FaBlog />
                  Blog
                </Link>
              </li>

              <li onClick={hideSide}>
                <Link to="/Contact">
                  {" "}
                  <MdOutlineContactPage />
                  Contact Us
                </Link>
              </li>
              <li onClick={hideSide}>
                <Link to="/About">
                  {" "}
                  <AiOutlineInfoCircle />
                  About Us
                </Link>
              </li>
              <li onClick={() => window.open("App/privacy-policy", "_blank")}>
                <Link>
                  {" "}
                  <FaRegFileAlt />
                  privacy-policy
                </Link>
              </li>
              {["ADMIN", "AUTHOR"].includes(role) && (
                <>
                  <p className="flex items-center gap-1 text-xm">
                    <MdOutlineAdminPanelSettings size={20} /> Admin Routes
                  </p>
                  <li onClick={hideSide}>
                    <Link to="/DashBoard">
                      <MdSpaceDashboard />
                      ADMIN Dashboard
                    </Link>
                  </li>
                  <li onClick={hideSide}>
                    <Link to="/AddProduct">
                      {" "}
                      <BsCloudUpload />
                      Add Product
                    </Link>
                  </li>
                  <li onClick={hideSide}>
                    <Link to="/CarouselUpdate">
                      {" "}
                      <BsArrowsCollapse />
                      Carousel Update
                    </Link>
                  </li>
                  <li onClick={hideSide}>
                    <Link to="/CarouselUpload">
                      {" "}
                      <BsCloudUpload />
                      CarouselUpload
                    </Link>
                  </li>
                  <li onClick={hideSide}>
                    <Link to="/BlogUpload">
                      {" "}
                      <BsCloudUpload />
                      BlogUpload
                    </Link>
                  </li>
                </>
              )}
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
                      textSize={"py-2"}
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
                      handleReadNotification={handleReadNotification}
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
