import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/footer";
import { BsPersonCircle } from "react-icons/bs";
import { useState } from "react";
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
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
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
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (
      !SignUpData.fullName ||
      !SignUpData.userName ||
      !SignUpData.password ||
      !SignUpData.email ||
      !SignUpData.avatar ||
      !SignUpData.phoneNumber ||
      !SignUpData.ConfirmPassword
    ) {
      setLoading(false);
      toast.error("All Fields are required...");
      return;
    }
    if (SignUpData.fullName.length < 5) {
      setLoading(false);
      toast.error("FullName should be at least 5 characters..");
      return;
    }
    if (!isEmail(SignUpData.email)) {
      setLoading(false);
      toast.error("Invalid email..");
      return;
    }
    if (!isValidPassword(SignUpData.password)) {
      setLoading(false);
      toast.error(
        "Password should be 6-16 characters and include at least one number and one special character.."
      );
      return;
    }
    if (!isPhoneNumber(SignUpData.phoneNumber)) {
      setLoading(false);
      toast.error("Invalid Phone Number..");
      return;
    }
    if (!isUserName(SignUpData.userName)) {
      setLoading(false);
      toast.error(
        "Username should be 6-20 characters and contain no spaces or special characters.."
      );
      return;
    }
    if (SignUpData.password !== SignUpData.ConfirmPassword) {
      setLoading(false);
      toast.error("Password and Confirm Password do not match..");
      return;
    }
    const formData = new FormData();
    formData.append("fullName", SignUpData.fullName);
    formData.append("email", SignUpData.email);
    formData.append("userName", SignUpData.userName);
    formData.append("phoneNumber", SignUpData.phoneNumber);
    formData.append("avatar", SignUpData.avatar);
    formData.append("password", SignUpData.password);
    console.log(formData);
    const response = await dispatch(CreateAccount(formData));
    if (response) {
      setLoading(false);
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
          <div className="bg-white dark:bg-gray-800 dark:text-gray-200 max-sm:mt-20 mt-44 mb-10 w-[400px] rounded-lg shadow-[0_0_5px_black] p-8 max-sm:m-9">
            <h1 className="text-center text-3xl font-semibold mb-6 text-[#9e6748] dark:text-[#f5d9b1]">
              Create Your Account
            </h1>
            <form noValidate onSubmit={handleCreate}>
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
                    <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
                  </div>
                )}
              </label>
              <input
                type="file"
                onChange={handelImageInput}
                className="hidden"
                name="image_uploads"
                id="image_uploads"
                accept=".png ,.svg ,.jpeg ,.jpg"
              />
              <div className="relative mb-6">
                <input
                  type="text"
                  onChange={handelUserInput}
                  value={SignUpData.userName}
                  name="userName"
                  required
                  className="peer w-full border-b-2 border-gray-300  focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent  dark:text-gray-200"
                />
                {SignUpData.userName ? (
                  <label className=" absolute left-0 top-[-20px] text-sm text-gray-500 dark:text-gray-300">
                    UserName
                  </label>
                ) : (
                  <label className="absolute left-0 top-2 text-lg text-gray-500 dark:text-gray-300 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
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
                  required
                  className="peer w-full border-b-2 border-gray-300  focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent  dark:text-gray-200"
                />
                {SignUpData.fullName ? (
                  <label className=" absolute left-0 top-[-20px] text-sm text-gray-500 dark:text-gray-300">
                    FullName
                  </label>
                ) : (
                  <label className="absolute left-0 top-2 text-lg text-gray-500 dark:text-gray-300 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
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
                  required
                  className="peer w-full border-b-2 border-gray-300  focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent  dark:text-gray-200"
                />
                {SignUpData.email ? (
                  <label className=" absolute left-0 top-[-20px] text-sm text-gray-500 dark:text-gray-300">
                    Email
                  </label>
                ) : (
                  <label className="absolute left-0 top-2 text-lg text-gray-500 dark:text-gray-300 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
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
                  required
                  className="peer w-full border-b-2 border-gray-300  focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent dark:text-gray-200"
                />
                {SignUpData.phoneNumber ? (
                  <label className=" absolute left-0 top-[-20px] text-sm text-gray-500 dark:text-gray-300">
                    Phone Number
                  </label>
                ) : (
                  <label className="absolute left-0 top-2 text-lg text-gray-500 dark:text-gray-300 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
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
                  required
                  className="peer w-full border-b-2 border-gray-300  focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent  dark:text-gray-200"
                />
                {SignUpData.password ? (
                  <label className=" absolute left-0 top-[-20px] text-sm text-gray-500 dark:text-gray-300">
                    Password
                  </label>
                ) : (
                  <label className="absolute left-0 top-2 text-lg text-gray-500 dark:text-gray-300 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
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
                  required
                  className="peer w-full border-b-2 border-gray-300  focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent  dark:text-gray-200"
                />
                {SignUpData.ConfirmPassword ? (
                  <label className=" absolute left-0 top-[-20px] text-sm text-gray-500 dark:text-gray-300">
                    Confirm Password
                  </label>
                ) : (
                  <label className="absolute left-0 top-2 text-lg text-gray-500 dark:text-gray-300 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
                    Confirm Password
                  </label>
                )}
              </div>
              <div className="flex justify-center mt-5">
                <LoadingButton
                  handleClick={handleCreate}
                  loading={loading}
                  message={"Loading"}
                  name={"SinUp"}
                  color={"bg-green-500"}
                />
              </div>
            </form>
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
