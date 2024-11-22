import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/footer";
import Layout from "../layout/layout";
import LoadingButton from "../constants/LoadingBtn";
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { LoginAccount } from "../Redux/Slice/authSlice";
import { useTheme } from "../Components/ThemeContext"; // Import dark mode context

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme(); // Access the dark mode state
  const [loading, setLoading] = useState(false);

  const [LoginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function handelUserInput(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setLoginData({
      ...LoginData,
      [name]: value,
    });
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!LoginData.email || !LoginData.password) {
      setLoading(false);
      toast.error("All fields are required...");
      return;
    }
    const res = await dispatch(LoginAccount(LoginData));
    if (res) {
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
            <h1 className="text-center text-3xl font-semibold mb-6">LOGIN</h1>
            <form>
              <div className="relative mb-6">
                <input
                  type="email"
                  name="email"
                  onChange={handelUserInput}
                  value={LoginData.email}
                  required
                  className={`peer w-full border-b-2 ${
                    darkMode ? "border-gray-500" : "border-gray-300"
                  } focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent`}
                />
                {LoginData.email ? (
                  <label className="absolute left-0 top-[-20px] text-sm text-gray-500">
                    Email
                  </label>
                ) : (
                  <label className="absolute left-0 top-2 text-lg text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
                    Email
                  </label>
                )}
              </div>
              <div className="relative mb-6">
                <input
                  type="password"
                  name="password"
                  onChange={handelUserInput}
                  value={LoginData.password}
                  required
                  className={`peer w-full border-b-2 ${
                    darkMode ? "border-gray-500" : "border-gray-300"
                  } focus:outline-none focus:border-blue-500 py-2 text-lg bg-transparent`}
                />
                {LoginData.password ? (
                  <label className="absolute left-0 top-[-20px] text-sm text-gray-500">
                    Password
                  </label>
                ) : (
                  <label className="absolute left-0 top-2 text-lg text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-focus:top-[-20px] peer-focus:text-sm">
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
