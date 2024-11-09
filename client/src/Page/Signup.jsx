import { Link } from "react-router-dom";
import Footer from "../Components/footer";
import { BsPersonCircle } from "react-icons/bs";

import { useState } from "react";
import Layout from "../layout/layout";

function SignUp() {
  const [previewImage, setPreviewImage] = useState("");
  return (
    <Layout>
      <div className=" w-full">
        <div className=" relative  top-[-64px]  justify-center flex items-center">
          <div className="bg-white max-sm:mt-20 mt-44 mb-10 w-[400px] rounded-lg shadow-[0_0_5px_black] p-8 h-[600px] max-sm:m-9 ">
            <h1 className="text-center text-3xl font-semibold mb-6 text-[#9e6748]">
              Create Your Account
            </h1>
            <form>
              <label htmlFor="image_uploads" className=" cursor-pointer">
                {previewImage ? (
                  <div>
                    <img
                      src={previewImage}
                      className="w-24 h-24 rounded-full m-auto"
                    />
                  </div>
                ) : (
                  <div>
                    <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
                  </div>
                )}
              </label>
              <input
                type="file"
                //   onChange={handelImageInput}
                className="hidden "
                name="image_uploads"
                id="image_uploads"
                accept=".png ,.svg ,.jpeg ,.jpg"
              />
              <div className="relative mb-6">
                <input
                  type="text"
                  name="FullName"
                  required
                  className="peer w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent"
                />
                <label className="absolute left-0 top-2 text-lg text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
                  Full name
                </label>
              </div>
              <div className="relative mb-6">
                <input
                  type="email"
                  name="email"
                  required
                  className="peer w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent"
                />
                <label className="absolute left-0 top-2 text-lg text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
                  Email
                </label>
              </div>
              <div className="relative mb-6">
                <input
                  type="password"
                  name="password"
                  required
                  className="peer w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent"
                />
                <label className="absolute left-0 top-2 text-lg text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
                  Password
                </label>
              </div>
              <div className="relative mb-6">
                <input
                  type="password"
                  name="ConfirmPassword"
                  required
                  className="peer w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent"
                />
                <label className="absolute left-0 top-2 text-lg text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
                  Confirm Password
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
              <p className="mt-1  text-center">
                you have a Account ?
                <Link to="/Login" className="link text-blue-600 pl-1">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SignUp;
