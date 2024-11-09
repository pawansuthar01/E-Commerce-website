import { Link } from "react-router-dom";
import Footer from "../Components/footer";
import Layout from "../layout/layout";

function Login() {
  return (
    <Layout>
      <div className=" w-full relative top-[-64px]">
        <div className=" min-h-[70vh] justify-center flex items-center ">
          <div className="bg-white w-[400px] rounded-lg  p-8 h-[350px] max-sm:m-9 shadow-[0_0_5px_black] mt-4 ">
            <h1 className="text-center text-3xl font-semibold mb-6 text-[#9e6748]">
              LOGIN
            </h1>
            <form>
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
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
              <p className="mt-1  text-center">
                Do not have a Account ?
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
