import { useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
function Footer() {
  const currentData = new Date();
  const year = currentData.getFullYear();
  const navigate = useNavigate();
  return (
    <footer className=" relative  py-4     bottom-0 left-0 w-full bg-[#FAFAFB]">
      <h1 className="text-center text-3xl font-semibold">KGS DOORS</h1>

      <div className="flex justify-center max-sm:gap-6 gap-36  max-sm:items-center p-5 max-sm:flex-col  max-sm:text-center ">
        <div>
          <ul className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-gray-950">About</h1>
            <li className=" cursor-pointer hover:text-blue-800 ">About us</li>
            <li className=" cursor-pointer hover:text-blue-800 ">Shop</li>
            <li className=" cursor-pointer hover:text-blue-800 ">Chat</li>
            <li className=" cursor-pointer hover:text-blue-800 ">Contact</li>
          </ul>
        </div>
        <div>
          <ul className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">Categories</h1>
            <li className=" cursor-pointer hover:text-blue-800 ">Chairs</li>
            <li className=" cursor-pointer hover:text-blue-800 ">Sofa</li>
            <li className=" cursor-pointer hover:text-blue-800 ">Table</li>
            <li className=" cursor-pointer hover:text-blue-800 ">Lamp</li>
          </ul>
        </div>
        <div>
          <ul className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">Contact</h1>
            <li>Kgs@gamil.com</li>
            <li>+91 9950352887</li>
          </ul>
        </div>
      </div>
      <div className="flex justify-between mx-5 my-1">
        <h1>Copyright {year} | All rights reserved</h1>
        <div className="flex gap-2 mt-1 max-sm:justify-center">
          <FaInstagram className="w-[22px] h-[22px] hover:text-yellow-500 cursor-pointer" />
          <FaFacebook className="w-[22px] h-[22px] hover:text-yellow-500 cursor-pointer" />
          <FaYoutube className="w-[22px] h-[22px] hover:text-yellow-500 cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}
export default Footer;
