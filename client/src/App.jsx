import { Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./Page/About";
import HomePage from "./Page/Home";
import NotFoundPage from "./Page/NotFound";
import Denied from "./Page/Denied";
import Login from "./Page/Login";
import SignUp from "./Page/Signup";
import Contact from "./Page/Contact";
import Product from "./Page/Product";
import Profile from "./Page/User/Profile";
import RequireAuth from "./Components/Auth/RequireRole";
import Blog from "./Page/Blog";
import ProductDescription from "./Page/Product/ProductDes";
import AddProduct from "./Page/Product/AddProduct";
import Cart from "./Page/Card/Cart";
import CheckoutForm from "./Page/Order/ChecK0ut";
import { ThemeProvider } from "./Components/ThemeContext";
import ThankYou from "./Page/Order/Thankyou";
import UpdateProfile from "./Page/User/Update";
import SlowInternetPage from "./helper/CheckInternet";
import AdminDashboard from "./Page/ADMIN/Dashboard";
import CarouselUpload from "./Page/ADMIN/CarouselUpload/CarouselUpload";
import { CarouselUpdate } from "./Page/ADMIN/CarouselUpload/carouselUpdate";
import OrderDetails from "./Page/Order/OrderDetails";
import BlogUpload from "./Page/ADMIN/Blog/uploadBlog";
import BlogDetails from "./Page/ADMIN/Blog/BlogDetails";
import SingleProduct from "./Page/Product/ProudctDetalis";
import ForgetPassword from "./Page/password/ForgetPassword";
import UpdatePassword from "./Page/password/updatePassword";
import ChangePassword from "./Page/password/changePassword";
function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/ForgetPassword" element={<ForgetPassword />}></Route>
          <Route
            path="/changePassword/:token"
            element={<UpdatePassword />}
          ></Route>
          <Route path="/Signup" element={<SignUp />}></Route>
          <Route
            path="/SlowInternetPage"
            element={<SlowInternetPage />}
          ></Route>
          <Route path="/Search" element={<Product />}></Route>
          <Route path="/AllProduct" element={<Product />}></Route>
          <Route path="/Contact" element={<Contact />}></Route>
          <Route path="/api/v3/user/order/:id" element={<OrderDetails />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/product/:id" element={<ProductDescription />}></Route>
          <Route
            element={<RequireAuth allowedRole={["USER", "ADMIN", "AUTHOR"]} />}
          >
            <Route
              path="/profile/UpdatePassword"
              element={<ChangePassword />}
            ></Route>
            <Route path="/Profile" element={<Profile />}></Route>
            <Route path="/CheckoutForm" element={<CheckoutForm />}></Route>
            <Route path="/ThankYou" element={<ThankYou />}></Route>
            <Route path="/UpdateProfile" element={<UpdateProfile />}></Route>
            <Route path="/Cart" element={<Cart />}></Route>
            <Route path="/Blog" element={<Blog />}></Route>
          </Route>
          <Route path="/About" element={<About />}></Route>
          <Route element={<RequireAuth allowedRole={["USER"]} />}>
            <Route path="/Profile" element={<Profile />}></Route>
            <Route path="/Blog" element={<Blog />}></Route>

            <Route path="/Description" element={<ProductDescription />}></Route>
          </Route>
          <Route element={<RequireAuth allowedRole={["ADMIN", "AUTHOR"]} />}>
            <Route path="/AddProduct" element={<AddProduct />}></Route>
            <Route path="/CarouselUpdate" element={<CarouselUpdate />}></Route>
            <Route path="/BlogUpload" element={<BlogUpload />}></Route>
            <Route path="/SingleProduct" element={<SingleProduct />}></Route>
            <Route path="/CarouselUpload" element={<CarouselUpload />}></Route>
            <Route path="/DashBoard" element={<AdminDashboard />}></Route>
          </Route>
          <Route path="/Denied" element={<Denied />}></Route>
          <Route path="*" element={<NotFoundPage />}></Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
