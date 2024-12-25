import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/footer";
import Layout from "../layout/layout";
import LoadingButton from "../constants/LoadingBtn";
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { LoginAccount } from "../Redux/Slice/authSlice";
import { useTheme } from "../Components/ThemeContext"; // Import dark mode context
import { isEmail } from "../helper/regexMatch";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme(); // Access the dark mode state
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const [LoginData, setLoginData] = useState({
    Email: "",
    password: "",
  });

  function handelUserInput(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setLoginData({
      ...LoginData,
      [name]: value,
    });
    document.getElementById(name).style.borderColor = "";
    document.getElementById(name).nextElementSibling.innerHTML = name;
    document.getElementById(name).nextElementSibling.style.color = "";
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!LoginData.Email) {
      setLoading(false);
      document.getElementById("Email").style.borderColor = "red";
      document.getElementById("Email").nextElementSibling.innerHTML =
        "Please Enter Email..";
      document.getElementById("Email").nextElementSibling.style.color = "red";
      return;
    }
    if (!isEmail(LoginData.Email)) {
      setLoading(false);

      document.getElementById("Email").style.borderColor = "red";
      document.getElementById("Email").nextElementSibling.style.color = "red";

      return;
    }
    if (!LoginData.password) {
      setLoading(false);
      document.getElementById("password").style.borderColor = "red";
      document.getElementById("password").nextElementSibling.innerHTML =
        "Please Enter password..";

      document.getElementById("password").nextElementSibling.style.color =
        "red";
      return;
    }
    setShowLoading(true);
    const res = await dispatch(LoginAccount(LoginData));
    if (!res.payload?.success) {
      if (res.payload?.message == " user not found...") {
        document.getElementById("Email").style.borderColor = "red";
        document.getElementById("Email").nextElementSibling.innerHTML =
          res?.payload?.message;
        document.getElementById("Email").nextElementSibling.style.color = "red";
      }
      if (res.payload?.message == "password Does not match..") {
        document.getElementById("password").style.borderColor = "red";
        document.getElementById("password").nextElementSibling.innerHTML =
          res?.payload?.message;
        document.getElementById("password").nextElementSibling.style.color =
          "red";
      }
    }

    if (res) {
      setShowLoading(false);
      setLoading(false);
    }
    if (res?.payload?.success) {
      navigate("/");
      setLoginData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <Layout>
      <div className="w-full relative top-[-64px]">
        <div className="min-h-[70vh] justify-center flex items-center">
          <div
            className={`w-[400px] rounded-lg p-8 h-[350px] max-sm:m-9 shadow-[0_0_5px_black] mt-auto ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            {showLoading && (
              <div
                className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 ${
                  loading ? "fixed inset-0 bg-black bg-opacity-30 z-10" : ""
                }`}
              >
                <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                <p>
                  {loading
                    ? "Please wait,  Login Your Account..."
                    : "Loading..."}
                </p>
              </div>
            )}
            <h1 className="text-center text-3xl font-semibold mb-6">LOGIN</h1>
            <form>
              <div className="relative mb-6">
                <input
                  type="Email"
                  name="Email"
                  id="Email"
                  onChange={handelUserInput}
                  value={LoginData.Email}
                  required
                  className={`peer w-full border-b-2 ${
                    darkMode ? "border-gray-500" : "border-gray-300"
                  } focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent`}
                />
                {LoginData.Email ? (
                  <label
                    htmlFor="Email"
                    className="absolute left-0 top-[-20px] text-sm text-gray-500"
                  >
                    Email
                  </label>
                ) : (
                  <label
                    htmlFor="Email"
                    className="absolute left-0 top-2 text-lg text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm"
                  >
                    Email
                  </label>
                )}
              </div>
              <div className="relative mb-6">
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handelUserInput}
                  value={LoginData.password}
                  required
                  className={`peer w-full border-b-2 ${
                    darkMode ? "border-gray-500" : "border-gray-300"
                  } focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent`}
                />
                {LoginData.password ? (
                  <label
                    htmlFor="password"
                    className="absolute left-0 top-[-20px] text-sm text-gray-500"
                  >
                    Password
                  </label>
                ) : (
                  <label
                    htmlFor="password"
                    className="absolute left-0 top-2 text-lg text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm"
                  >
                    Password
                  </label>
                )}
              </div>
              <div onClick={handleLogin}>
                <LoadingButton
                  loading={loading}
                  message={"Loading"}
                  name={"Login"}
                  color={"bg-green-500"}
                />
              </div>
              <p className="mt-1 text-center">
                Do not have an account?
                <Link to="/SignUp" className="link text-blue-600 pl-1">
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
