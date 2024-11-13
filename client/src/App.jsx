import { Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./Page/About";
import HomePage from "./Page/Home";
import NotFoundPage from "./Page/NotFound";
import Denied from "./Page/Denied";
import CheckRolePermission from "./Components/Auth/RequireRole";
import Login from "./Page/Login";
import SignUp from "./Page/Signup";
import Contact from "./Page/Contact";
import Search from "./Page/Product";
import Product from "./Page/Product";
import Profile from "./Page/User/Profile";
import RequireAuth from "./Components/Auth/RequireRole";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/Login" element={<Login />}></Route>
      <Route path="/Signup" element={<SignUp />}></Route>
      <Route path="/Search" element={<Product />}></Route>
      <Route path="/AllProduct" element={<Product />}></Route>
      <Route path="/Contact" element={<Contact />}></Route>

      <Route path="/About" element={<About />}></Route>
      <Route element={<RequireAuth allowedRole={["USER"]} />}>
        <Route path="/Profile" element={<Profile />}></Route>
      </Route>

      <Route path="/Denied" element={<Denied />}></Route>
      <Route path="*" element={<NotFoundPage />}></Route>
    </Routes>
  );
}

export default App;
