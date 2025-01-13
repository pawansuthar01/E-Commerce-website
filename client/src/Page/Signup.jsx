import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/footer";
import { BsPersonCircle } from "react-icons/bs";
import { useEffect, useState } from "react";
import Layout from "../layout/layout";
import LoadingButton from "../constants/LoadingBtn";
import toast from "react-hot-toast";
import {
  isEmail,
  isPhoneNumber,
  isUserName,
  isValidPassword,
} from "../helper/regexMatch";
import { useDispatch } from "react-redux";
import { CreateAccount } from "../Redux/Slice/authSlice";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkPrivacyPolicy, setCheckPrivacyPolicy] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const [SignUpData, setSignUpData] = useState({
    fullName: "",
    userName: "",
    phoneNumber: "",
    email: "",
    avatar: "",
    password: "",
    ConfirmPassword: "",
  });

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handelImageInput = (e) => {
    e.preventDefault();

    const image = e.target.files[0];
    if (image) {
      setSignUpData({
        ...SignUpData,
        avatar: image,
      });
    }

    const fileReader = new FileReader();
    if (!image) return;
    fileReader.readAsDataURL(image);
    fileReader.addEventListener("load", function () {
      setPreviewImage(this.result);
    });
  };

  const handelUserInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setSignUpData({
      ...SignUpData,
      [name]: value,
    });
    document.getElementById(name).style.borderColor = "";
    document.getElementById(name).nextElementSibling.innerHTML = name;
    document.getElementById(name).nextElementSibling.style.color = "";
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!checkPrivacyPolicy) {
      document.getElementById("PrivacyPolicyCheckbox").style.color = "red";
      setLoading(false);
      return;
    }
    if (!SignUpData.avatar) {
      setLoading(false);
      document.getElementById("uploadImage").style.borderColor = "red";
      document.getElementById("uploadImage").nextElementSibling.style.color =
        "red";
      return;
    }
    if (SignUpData.fullName.length < 5) {
      setLoading(false);
      document.getElementById("fullName").style.borderColor = "red";
      document.getElementById("fullName").nextElementSibling.style.color =
        "red";

      return;
    }
    if (!isEmail(SignUpData.email)) {
      setLoading(false);
      document.getElementById("email").style.borderColor = "red";
      document.getElementById("email").nextElementSibling.style.color = "red";
      return;
    }
    if (!isValidPassword(SignUpData.password)) {
      setLoading(false);
      document.getElementById("password").style.borderColor = "red";
      document.getElementById("password").nextElementSibling.style.color =
        "red";

      return;
    }
    if (!isPhoneNumber(SignUpData.phoneNumber)) {
      setLoading(false);
      document.getElementById("phoneNumber").style.borderColor = "red";
      document.getElementById("phoneNumber").nextElementSibling.style.color =
        "red";
      return;
    }
    if (!isUserName(SignUpData.userName)) {
      setLoading(false);
      document.getElementById("userName").style.borderColor = "red";
      document.getElementById("userName").nextElementSibling.style.color =
        "red";
      return;
    }
    if (SignUpData.password !== SignUpData.ConfirmPassword) {
      setLoading(false);
      document.getElementById("password").style.borderColor = "red";
      document.getElementById("password").nextElementSibling.style.color =
        "red";
      document.getElementById("ConfirmPassword").style.borderColor = "red";
      document.getElementById(
        "ConfirmPassword"
      ).nextElementSibling.style.color = "red";
      return;
    }
    setShowLoading(true);
    const formData = new FormData();
    formData.append("fullName", SignUpData.fullName);
    formData.append("email", SignUpData.email);
    formData.append("userName", SignUpData.userName);
    formData.append("phoneNumber", SignUpData.phoneNumber);
    formData.append("avatar", SignUpData.avatar);
    formData.append("password", SignUpData.password);
    const response = await dispatch(CreateAccount(formData));
    if (response) {
      setLoading(false);
      setShowLoading(false);
    }
    if (!response?.payload?.success) {
      if (response?.payload?.message == "Username already exists") {
        document.getElementById("userName").style.borderColor = "red";
        document.getElementById("userName").nextElementSibling.innerHTML =
          response?.payload?.message;
        document.getElementById("userName").nextElementSibling.style.color =
          "red";
      }
      if (response?.payload?.message == "Email already exists") {
        document.getElementById("email").style.borderColor = "red";
        document.getElementById("email").nextElementSibling.innerHTML =
          response?.payload?.message;
        document.getElementById("email").nextElementSibling.style.color = "red";
      }
    }
    if (response?.payload?.success) {
      setLoading(false);
      navigate("/");
      setSignUpData({
        fullName: "",
        userName: "",
        phoneNumber: "",
        email: "",
        avatar: "",
        password: "",
      });
      setPreviewImage("");
    }
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="relative top-[-64px] justify-center flex items-center">
          {showLoading && (
            <div
              className={`flex flex-col items-center justify-center min-h-screen bg-gray-100  ${
                loading ? "fixed inset-0 bg-opacity-30 z-10" : ""
              }`}
            >
              <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
              <p>
                {loading
                  ? "Please wait,  Creating Your Account..."
                  : "Loading..."}
              </p>
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 dark:text-gray-200 max-sm:mt-20 mt-44 mb-10 w-[400px] rounded-lg shadow-[0_0_5px_black] p-8 max-sm:m-9">
            <h1 className="text-center text-3xl font-semibold mb-6 text-[#9e6748] dark:text-[#f5d9b1]">
              Create Your Account
            </h1>
            <form action="/register" noValidate onSubmit={handleCreate}>
              <label htmlFor="image_uploads" className="cursor-pointer">
                {previewImage ? (
                  <div>
                    <img
                      src={previewImage}
                      className="w-24 h-24 rounded-full m-auto"
                    />
                  </div>
                ) : (
                  <div>
                    <BsPersonCircle
                      id="uploadImage"
                      name="uploadImage"
                      className="w-24 h-24 rounded-full  m-auto border-2 border-dashed p-1"
                    />
                    <label
                      htmlFor="uploadImage"
                      className=" text-xl mb-5 flex justify-center"
                    >
                      upload Image
                    </label>
                  </div>
                )}
              </label>
              <input
                type="file"
                onChange={handelImageInput}
                className="hidden"
                name="image_uploads"
                id="image_uploads"
                accept=".png ,.jpeg ,.jpg"
              />
              <div className="relative mb-6 mt-1">
                <input
                  type="text"
                  onChange={handelUserInput}
                  value={SignUpData.userName}
                  name="userName"
                  id="userName"
                  autoComplete="userName"
                  required
                  className="peer w-full border-b-2 border-gray-300  focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent  dark:text-gray-200"
                />
                {SignUpData.userName ? (
                  <label
                    htmlFor="userName"
                    className=" absolute left-0 top-[-20px] text-sm text-gray-500 dark:text-gray-300"
                  >
                    UserName
                  </label>
                ) : (
                  <label
                    htmlFor="userName"
                    className="absolute left-0 top-2 text-lg text-gray-500 dark:text-gray-300 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm"
                  >
                    UserName
                  </label>
                )}
              </div>
              <div className="relative mb-6">
                <input
                  type="text"
                  onChange={handelUserInput}
                  value={SignUpData.fullName}
                  name="fullName"
                  id="fullName"
                  autoComplete="name"
                  required
                  className="peer w-full border-b-2 border-gray-300  focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent  dark:text-gray-200"
                />
                {SignUpData.fullName ? (
                  <label
                    htmlFor="fullName"
                    className=" absolute left-0 top-[-20px] text-sm text-gray-500 dark:text-gray-300"
                  >
                    FullName
                  </label>
                ) : (
                  <label
                    htmlFor="fullName"
                    className="absolute left-0 top-2 text-lg text-gray-500 dark:text-gray-300 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm"
                  >
                    FullName
                  </label>
                )}
              </div>
              <div className="relative mb-6">
                <input
                  onChange={handelUserInput}
                  value={SignUpData.email}
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  className="peer w-full border-b-2 border-gray-300  focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent  dark:text-gray-200"
                />
                {SignUpData.email ? (
                  <label
                    htmlFor="email"
                    className=" absolute left-0 top-[-20px] text-sm text-gray-500 dark:text-gray-300"
                  >
                    Email
                  </label>
                ) : (
                  <label
                    htmlFor="email"
                    className="absolute left-0 top-2 text-lg text-gray-500 dark:text-gray-300 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm"
                  >
                    Email
                  </label>
                )}
              </div>
              <div className="relative mb-6">
                <input
                  onChange={handelUserInput}
                  value={SignUpData.phoneNumber}
                  type="number"
                  name="phoneNumber"
                  id="phoneNumber"
                  autoComplete="tel"
                  required
                  className="peer w-full border-b-2 border-gray-300  focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent dark:text-gray-200"
                />
                {SignUpData.phoneNumber ? (
                  <label
                    htmlFor="phoneNumber"
                    className=" absolute left-0 top-[-20px] text-sm text-gray-500 dark:text-gray-300"
                  >
                    Phone Number
                  </label>
                ) : (
                  <label
                    htmlFor="phoneNumber"
                    className="absolute left-0 top-2 text-lg text-gray-500 dark:text-gray-300 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm"
                  >
                    Phone Number
                  </label>
                )}
              </div>
              <div className="relative mb-6">
                <input
                  onChange={handelUserInput}
                  value={SignUpData.password}
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  required
                  className="peer w-full border-b-2  border-gray-300  focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent  dark:text-gray-200"
                />
                {SignUpData.password ? (
                  <label
                    htmlFor="password"
                    className=" absolute left-0 top-[-20px] text-sm text-gray-500 dark:text-gray-300 "
                  >
                    Password
                  </label>
                ) : (
                  <label
                    htmlFor="password"
                    className="absolute left-0 top-2 text-lg text-gray-500 dark:text-gray-300  transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm"
                  >
                    Password
                  </label>
                )}
              </div>
              <div className="relative mb-6">
                <input
                  onChange={handelUserInput}
                  value={SignUpData.ConfirmPassword}
                  type="password"
                  name="ConfirmPassword"
                  id="ConfirmPassword"
                  autoComplete="new-password"
                  required
                  className="peer w-full border-b-2 border-gray-300  focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent  dark:text-gray-200"
                />
                {SignUpData.ConfirmPassword ? (
                  <label
                    htmlFor="ConfirmPassword"
                    className=" absolute left-0 top-[-20px] text-sm text-gray-500 dark:text-gray-300"
                  >
                    Confirm Password
                  </label>
                ) : (
                  <label
                    htmlFor="ConfirmPassword"
                    className="absolute left-0 top-2 text-lg text-gray-500 dark:text-gray-300 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm"
                  >
                    Confirm Password
                  </label>
                )}
              </div>
              <div className="flex justify-center mt-5">
                <LoadingButton
                  textSize={"py-3"}
                  handleClick={handleCreate}
                  loading={loading}
                  message={"Loading"}
                  name={"SinUp"}
                  color={"bg-green-500 hover:bg-green-600"}
                />
              </div>
            </form>
            <div className="my-2 flex gap-1">
              <input
                type="checkbox"
                value={checkPrivacyPolicy}
                onChange={() => (
                  setCheckPrivacyPolicy(!checkPrivacyPolicy),
                  (document.getElementById(
                    "PrivacyPolicyCheckbox"
                  ).style.color = "")
                )}
                className="cursor-pointer "
              />
              <p
                onClick={() => navigate("/App/privacy-policy")}
                id="PrivacyPolicyCheckbox"
                name="PrivacyPolicyCheckbox"
                className="hover:underline hover:text-blue-500 text-sm cursor-pointer "
              >
                Privacy Policy
              </p>
            </div>
            <div className="flex items-center justify-center mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SignUp;
