import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu, FiShoppingCart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/download-removebg-preview.png";
import { FaMagnifyingGlass, FaMoon, FaSun, FaUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

import Footer from "../Components/footer";
import LoadingButton from "../constants/LoadingBtn";
import { useState } from "react";
import { LogoutAccount } from "../Redux/Slice/authSlice";

function Layout({ children }) {
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const role = useSelector((state) => state?.auth?.role);
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
    console.log(res);
    if (res) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh]  ">
      <div className=" sticky top-0 z-50">
        <nav className="flex   z-50 bg-white  justify-between   w-[100%] items-center">
          <label htmlFor="my-drawer" className=" relative cursor-pointer ">
            <FiMenu
              onClick={changeWight}
              size={"36px"}
              className=" font-bold m-4 text-gray-800 "
            />
          </label>
          <div className="max-sm:hidden flex w-full justify-center  ">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative w-1/2  ">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none   ">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                className="w-full p-4 ps-10 text-sm outline-none text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Mockups, Logos..."
                required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700  border-blue-700 hover:bg-transparent hover:text-blue-700 hover:border-2 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </div>
          <div className="flex gap-5 text-4xl font-bold text-black items-center">
            <div className="max-sm:hidden flex">
              {!isLoggedIn && (
                <Link to="/Login">
                  <button className=" text-sm  bg-blue-700 border-blue-700  px-8 py-3 font-medium  text-white rounded-md w-full hover:bg-transparent hover:text-blue-700 hover:border-2 ">
                    Login
                  </button>
                </Link>
              )}
            </div>
            <Link to="/Search">
              <div className=" cursor-pointer sm:hidden ">
                <FaMagnifyingGlass size={"20px"} />
              </div>
            </Link>
            <div className=" cursor-pointer hover:text-green-400">
              <FaUser size={"20px"} onClick={() => navigate("/Profile")} />
            </div>

            <div className=" cursor-pointer mr-4">
              <FiShoppingCart size={"20px"} />
            </div>
          </div>
        </nav>
        <div className="drawer absolute left-0 z-50 w-fit ">
          <input className="drawer-toggle " id="my-drawer" type="checkbox" />
          <div className="drawer-side  w-0">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu p-4 w-56 h-[100%]   sm:w-80 bg-base-200 text-base-content space-y-5 relative">
              <li className="w-fit absolute right-2 z-50 ">
                <button onClick={hideSide}>
                  <AiFillCloseCircle size={"20px"} />
                </button>
              </li>
              <li onClick={hideSide} className="pt-5">
                <Link to="/">Home</Link>
              </li>
              {role === "ADMIN" ||
                (role === "AUTHOR" && (
                  <li onClick={hideSide} className="pt-5">
                    <Link to="/AddProduct">Add Product</Link>
                  </li>
                ))}

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
                <li className="w-[90%] absolute  bottom-4">
                  <div className=" flex items-center justify-center w-full flex-wrap ">
                    <Link to="/Login">
                      <button className=" btn btn-primary px-8 py-1  rounded-md font-semibold w-full  ">
                        Login
                      </button>
                    </Link>
                    <Link to="/SignUp">
                      <button className=" btn btn-secondary px-8 py-1  rounded-md font-semibold  w-full ">
                        SignUp
                      </button>
                    </Link>
                  </div>
                </li>
              )}
              {isLoggedIn && (
                <div className="w-[90%] absolute  bottom-4 ">
                  <div className=" flex  items-center justify-center  w-full ">
                    <Link to="/Profile" className="w-1/2">
                      <LoadingButton
                        name={"Profile"}
                        message={"Loading"}
                        color={"bg-green-500"}
                      />
                    </Link>
                    <Link onClick={handelLogout} className="w-1/2  ml-1">
                      <LoadingButton
                        loading={loading}
                        name={"Logout"}
                        message={"Loading"}
                        color={"bg-red-500"}
                        onClick={handelLogout}
                      />
                    </Link>
                  </div>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>

      {children}
      <Footer />
    </div>
  );
}
export default Layout;
