import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/layout";
import { FiEdit } from "react-icons/fi";
import bgProfile from "../../assets/home/pexels-photo-29376504.webp";
import { useNavigate } from "react-router-dom";
import { LoadAccount } from "../../Redux/Slice/authSlice";
import { useEffect, useState } from "react";
import {
  CancelOrder,
  getOrder,
  UpdateOrder,
} from "../../Redux/Slice/OrderSlice";
import LoadingButton from "../../constants/LoadingBtn";
import { FaArrowLeft, FaUser } from "react-icons/fa6";
import toast from "react-hot-toast";
import { OrderShow } from "../../Components/ShowOrder";
import FeedbackForm from "../../Components/feedbackfrom";
import FeedbackList from "../../Components/feedbackList";
import { OrderCart } from "../../Components/OrderDataCart";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const UserData = useSelector((state) => state?.auth);

  const loadProfile = async () => {
    const res = await dispatch(LoadAccount());
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <Layout>
      <div className="min-h-[100vh] w-full ">
        <div className=" flex flex-col justify-center mt-1 items-center gap-2  border-b-4 border-s-orange-100 ">
          <div className="w-full   h-[200px] ">
            <h2 className=" absolute text-white font-bold text-center w-full mt-10 sm:text-3xl max-sm:text-2xl">
              My Profile
            </h2>
            <img
              src={bgProfile}
              alt="backGround_image"
              className="w-full object-start   h-full"
            />
          </div>
          <div className=" relative bottom-10  flex flex-col gap-3 justify-center items-center w-full ">
            <div className=" rounded-l-[18%]  items-center rounded-md flex dark:text-white dark:bg-[#111827] shadow-[0_0_1px_black]  dark:shadow-[0_0_1px_white] bg-white h-[100px] max-sm:h-[70px] w-[360px] max-sm:w-[290px]">
              <div className=" w-[125px]  ">
                <img
                  src={UserData?.data?.avatar?.secure_url}
                  className="w-full relative  h-full left-[-20px]  rounded-full border-2 border-black"
                  alt=""
                />
              </div>
              <div>
                <p className="flex items-center gap-1">
                  <FaUser size={"15px"} className="text-red-700" /> {"  "}
                  {UserData?.data?.fullName}
                </p>
                <p>📞 {UserData?.data?.phoneNumber}</p>
                <p className="max-sm:text-sm max-sm:pr-8 ">
                  {UserData?.data?.email}
                </p>
              </div>
            </div>

            <div className="text-xl flex items-center  gap-2">
              <h1 className="text-black dark:text-white text-xl font-medium">
                {UserData?.data?.userName}
              </h1>
              <FiEdit
                onClick={() => navigate("/UpdateProfile")}
                size={"26px"}
                className=" cursor-pointer text-red-400 hover:text-red-300"
              />
            </div>

            {UserData?.role === "ADMIN" ||
              (UserData?.role === "AUTHOR" && (
                <div className="flex justify-center items-center dark:text-white text-black">
                  <h1 className="text-xl font-medium">
                    WellCome{" "}
                    <span className=" font-semibold">{UserData.role}</span>
                  </h1>
                </div>
              ))}
            <div className="text-center text-black dark:text-white text-xl border-2 shadow-[0_0_2px_black] p-2 rounded-xl">
              <h1 className="font-bold">
                {UserData.data?.walletAddProducts?.length}
              </h1>
              <p className=" font-semibold">Add Product</p>
            </div>
          </div>
        </div>
        <h1 className="text-xl p-5 font-normal dark:text-white text-center">
          Your Orders.
        </h1>
        <hr className=" h-1" />
        <>
          <div className="flex flex-wrap gap-1">
            <OrderCart />
          </div>
        </>

        {/* feedback section */}
        <div className="w-full  ">
          <hr className="h-1 bg-slate-200" />
          <h1 className="text-2xl font-bold mb-4 ml-10 text-start dark:text-white text-black">
            feedback Section
          </h1>
          <FeedbackForm />
          <FeedbackList />
        </div>
      </div>
    </Layout>
  );
}
export default Profile;
