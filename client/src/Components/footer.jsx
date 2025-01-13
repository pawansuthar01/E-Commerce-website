import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
import { useTheme } from "./ThemeContext"; // Importing the useTheme hook
import { useSelector } from "react-redux";

function Footer() {
  const currentData = new Date();
  const year = currentData.getFullYear();
  const navigate = useNavigate();
  const { darkMode } = useTheme(); // Get darkMode state from ThemeContext
  const { phoneNumber, email, address, instagram, youtube, facebook } =
    useSelector((state) => state?.ShopInfo);
  const handelNavigatePrivacyPolicy = () => {
    navigate("/App/privacy-policy");
  };
  console.log(instagram);
  return (
    <footer className="relative py-4 bottom-0 border-t-2 border-[#0005] left-0 w-full ">
      <h1 className="text-center text-3xl font-semibold">KGS DOORS</h1>

      <div
        className={`flex justify-evenly max-sm:gap-6 gap-36 max-sm:items-center p-5 max-sm:flex-col max-sm:text-center `}
      >
        <div>
          <ul className="flex flex-col gap-1">
            <h1
              className={`text-2xl font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-950"
              }`}
            >
              About
            </h1>
            <li className="cursor-pointer hover:text-blue-800">About us</li>
            <li className="cursor-pointer hover:text-blue-800">Shop</li>
            <li className="cursor-pointer hover:text-blue-800">Chat</li>
            <li className="cursor-pointer hover:text-blue-800">Contact</li>
          </ul>
        </div>
        <div>
          <ul className="flex flex-col gap-1">
            <h1
              className={`text-2xl font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-950"
              }`}
            >
              Categories
            </h1>
            <li className="cursor-pointer hover:text-blue-800">Chairs</li>
            <li className="cursor-pointer hover:text-blue-800">Sofa</li>
            <li className="cursor-pointer hover:text-blue-800">Table</li>
            <li className="cursor-pointer hover:text-blue-800">Lamp</li>
          </ul>
        </div>
        <div>
          <ul className="flex flex-col gap-1">
            <h1
              className={`text-2xl font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-950"
              }`}
            >
              Contact
            </h1>
            <a
              className="cursor-pointer hover:text-blue-800"
              href={`mailto:${email || ""}`}
            >
              {email || ""}
            </a>

            <a
              className="cursor-pointer hover:text-blue-800"
              href={`tel:${phoneNumber || "+91 9950352887"}`}
            >
              +91 {phoneNumber || "9950352887"}
            </a>
            <p className=" line-clamp-2 ">{address}</p>
          </ul>
        </div>
      </div>
      <div
        className={`flex justify-between mx-5 my-1 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        <div className="flex justify-evenly w-full">
          <h1>Copyright {year} | All rights reserved</h1>
          <Link
            onClick={() => handelNavigatePrivacyPolicy()}
            className="text-blue-500 hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="flex gap-2 mt-1 max-sm:justify-center">
          <a href={`${instagram || ""}`} target="_blank">
            <FaInstagram
              className={`w-[22px] h-[22px] hover:text-yellow-500 cursor-pointer ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            />
          </a>

          <a href={`${facebook || ""}`} target="_blank">
            <FaFacebook
              className={`w-[22px] h-[22px] hover:text-yellow-500 cursor-pointer ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            />
          </a>
          <a href={`${youtube || ""}`} target="_blank">
            <FaYoutube
              className={`w-[22px] h-[22px] hover:text-yellow-500 cursor-pointer ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
