import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/layout";
import { FiEdit } from "react-icons/fi";
import bgProfile from "../../assets/home/pexels-photo-29376504.webp";
import { useNavigate } from "react-router-dom";
import { LoadAccount } from "../../Redux/Slice/authSlice";
import { useEffect, useState } from "react";
import { getOrder } from "../../Redux/Slice/OrderSlice";
import { MdEmail, MdPhone } from "react-icons/md";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [UserId, setUserID] = useState("");
  const [Orders, setOrder] = useState({});
  const UserData = useSelector((state) => state?.auth);

  const loadProfile = async () => {
    const res = await dispatch(LoadAccount());
    setUserID(res?.payload?.data?._id);
  };
  const order = {
    productName: "Minimalist Wristwatch",
    price: 149.0,
    description:
      "This contemporary wristwatch has a clean, minimalist look and high quality components.",
    image: "https://via.placeholder.com/100", // Replace with your product image URL
    deliveryAddress: {
      name: "Floyd Miles",
      street: "7363 Cynthia Pass",
      city: "Toronto, ON N3Y 4H8",
    },
    contactInfo: {
      email: "f•••@example.com",
      phone: "1••••••••40",
    },
    status: "Shipped",
    shippedDate: "March 23, 2021",
  };
  console.log(UserId);
  const loadOrders = async (UserId) => {
    const res = await dispatch(getOrder(UserId ? UserId : UserData?.data._id));
    console.log(res);
    setOrder(res?.payload?.data);
  };

  useEffect(() => {
    loadProfile();

    loadOrders();
  }, []);

  return (
    <Layout>
      <div className="min-h-[100vh] w-full">
        <div className=" flex flex-col justify-center mt-1 items-center gap-2  border-b-4 border-s-orange-100 ">
          <div className="w-full  h-[200px] ">
            <h2 className=" absolute text-white font-bold text-center w-full mt-10 sm:text-3xl max-sm:text-2xl">
              My Profile
            </h2>
            <img
              src={bgProfile}
              alt="backGround_image"
              className="w-full object-start   h-full"
            />
          </div>
          <div className="relative bottom-20 flex flex-col gap-3 justify-center items-center w-full ">
            <div className="  w-[150px] h-[150px] ">
              <img
                src={UserData?.data?.avatar?.secure_url}
                className="w-full h-full rounded-full border-2 border-black"
                alt=""
              />
            </div>
            <div className="text-xl flex items-center  gap-2">
              <h1 className="text-black text-xl font-medium">
                {UserData?.data?.userName}
              </h1>
              <FiEdit
                size={"26px"}
                className=" cursor-pointer text-red-400 hover:text-red-300"
              />
            </div>

            {UserData?.role === "ADMIN" ||
              (UserData?.role === "AUTHOR" && (
                <div className="flex justify-center items-center text-black">
                  <h1 className="text-xl font-medium">
                    WellCome{" "}
                    <span className=" font-semibold">{UserData.role}</span>
                  </h1>
                  <div className="flex flex-col">
                    <h3></h3>
                    <p></p>
                  </div>
                  <div>
                    <h3></h3>
                    <p></p>
                  </div>
                </div>
              ))}
            <div className="text-center text-black text-xl border-2 shadow-[0_0_2px_black] p-2 rounded-xl">
              <h1 className="font-bold">
                {UserData.data?.walletAddProducts?.length}
              </h1>
              <p className=" font-semibold">Add Product</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex space-x-4">
            <img
              src={order.image}
              alt={order.productName}
              className="w-24 h-24 object-cover rounded"
            />
            <div>
              <h2 className="text-lg font-semibold">{order.productName}</h2>
              <p className="text-gray-500">${order.price.toFixed(2)}</p>
              <p className="mt-2 text-gray-700">{order.description}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-bold mb-2">Delivery address</h3>
              <p className="text-gray-700">
                {order.deliveryAddress.name}
                <br />
                {order.deliveryAddress.street}
                <br />
                {order.deliveryAddress.city}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-2">Shipping updates</h3>
              <p className="text-gray-700 flex items-center">
                <MdEmail className="mr-2" />
                {order.contactInfo.email}
              </p>
              <p className="text-gray-700 flex items-center mt-1">
                <MdPhone className="mr-2" />
                {order.contactInfo.phone}
              </p>
              <button className="text-blue-500 hover:underline mt-2">
                Edit
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm text-gray-600 mb-2">
              Shipped on {order.shippedDate}
            </h3>
            <div className="w-full bg-gray-200 h-1 rounded-full">
              <div
                className="bg-blue-600 h-1 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span className="text-blue-600 font-bold">Order placed</span>
              <span>Processing</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default Profile;
