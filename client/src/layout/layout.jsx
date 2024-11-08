import { AiFillCloseCircle } from "react-icons/ai";
import { FiHeart, FiMenu, FiShoppingCart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/download-removebg-preview.png";
import { FaMagnifyingGlass, FaMoon, FaSun } from "react-icons/fa6";
import { useSelector } from "react-redux";

import Footer from "../Components/footer";
function Layout({ children }) {
  const Navigate = useNavigate();
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

  return (
    <div className="min-h-[90vh]">
      <div className="sm:hidden">
        <nav className="flex z-50 relative justify-between h-[36px]  w-[100%] items-center mt-4 mb-4">
          <label htmlFor="my-drawer" className=" relative cursor-pointer ">
            <FiMenu
              onClick={changeWight}
              size={"36px"}
              className=" font-bold m-4 text-gray-800 "
            />
          </label>
          <div className="flex gap-5 text-4xl font-bold text-black">
            <div className=" cursor-pointer ">
              <FaMagnifyingGlass size={"20px"} />
            </div>
            <div className=" cursor-pointer ">
              <FiHeart size={"20px"} />
            </div>

            <div className=" cursor-pointer mr-4">
              <FiShoppingCart size={"20px"} />
            </div>
          </div>
        </nav>
        <div className="drawer absolute left-0 z-50 w-fit ">
          <input className="drawer-toggle " id="my-drawer" type="checkbox" />
          <div className="drawer-side w-0">
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

              <li onClick={hideSide}>
                <Link to="/Courses">All courses</Link>
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
                <li className="w-[90%] absolute  bottom-4">
                  <div className=" flex items-center justify-center  w-full flex-wrap">
                    <Link to="/profile">
                      <button className="btn btn-primary px-8 py-1  rounded-md font-semibold w-full ">
                        profile
                      </button>
                    </Link>
                    <Link>
                      <button className="btn btn-secondary px-8 py-1  rounded-md font-semibold w-full">
                        Logout
                      </button>
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="max-sm:hidden flex mt-1 ">
        <nav
          className="flex w-full absolute z-50  justify-between
          items-center"
        >
          <img src={logo} alt="logo_image" className="  w-[90px] object-fill" />
          <div
            className="flex    pl-10
           gap-8 text-black font-semibold"
          >
            <Link to="/" className=" hover:text-green-400">
              Home
            </Link>
            <Link to="/Shop" className=" hover:text-green-400">
              Shop
            </Link>
            <Link to="/About" className=" hover:text-green-400">
              About
            </Link>
            <Link to="/Contact" className=" hover:text-green-400">
              Contact
            </Link>
          </div>
          {!isLoggedIn && (
            <div className=" flex gap-1 mr-1">
              <Link to="/Login">
                <button className=" btn btn-primary px-8 py-1  rounded-xl font-semibold ">
                  Login
                </button>
              </Link>
              <Link to="/SignUp">
                <button className=" btn btn-secondary px-8 py-1  rounded-xl font-semibold  ">
                  SignUp
                </button>
              </Link>
            </div>
          )}
          {isLoggedIn && (
            <div className=" flex gap-1 mr-1">
              <Link to="/profile">
                <button className="btn btn-primary px-8 py-1   rounded-xl font-semibold  ">
                  profile
                </button>
              </Link>
              <Link>
                <button className="btn btn-secondary px-8 py-1   rounded-xl font-semibold">
                  Shop
                </button>
              </Link>
            </div>
          )}
        </nav>
      </div>
      {children}
      <Footer />
    </div>
  );
}
export default Layout;
