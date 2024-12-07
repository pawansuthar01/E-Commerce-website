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
import { MdCurrencyRupee, MdEmail, MdPhone } from "react-icons/md";
import LoadingButton from "../../constants/LoadingBtn";
import { FaArrowLeft, FaUser } from "react-icons/fa6";
import toast from "react-hot-toast";
import { isEmail, isPhoneNumber } from "../../helper/regexMatch";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
  });
  const [orderStats, setOrderStatus] = useState("");
  const [UserId, setUserID] = useState("");
  const [OrderId, setOrderId] = useState("");
  const [Orders, setOrder] = useState([]);
  const [show, setShow] = useState(false);
  const UserData = useSelector((state) => state?.auth);

  const loadProfile = async () => {
    const res = await dispatch(LoadAccount());
    setUserID(res?.payload?.data?._id);
  };
  console.log(Orders);

  const loadOrders = async (UserId) => {
    const res = await dispatch(getOrder(UserId ? UserId : UserData?.data._id));
    console.log(res);
    setOrder(res?.payload?.data);
  };
  const handelUserInput = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };
  const handelOrderCancel = async (id) => {
    if (!id) {
      setLoading(false);
      toast.error("Something want Wrong try again..");
      return;
    }
    const res = await dispatch(CancelOrder(id));
    setLoading(false);
    setShow(false);
    if (res?.payload?.success) {
      loadOrders();
    }
  };

  const handelPlaceOrder = async () => {
    setLoading(true);
    if (
      !shippingInfo.name ||
      !shippingInfo.phoneNumber ||
      !shippingInfo.address ||
      !shippingInfo.email ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.country ||
      !shippingInfo.postalCode
    ) {
      toast.error("All  Field  is mandatory To Order ....");
      setLoading(false);
      return;
    }

    if (!isPhoneNumber(shippingInfo.phoneNumber)) {
      setLoading(false);
      toast.error(" Invalid Phone Number....");
      return;
    }

    if (!isEmail(shippingInfo.email)) {
      setLoading(false);
      toast.error("Invalid email....");

      return;
    }

    if (!UserId) {
      setLoading(false);
      toast.error("Something want Wrong try again..");
      return;
    }
    const orderData = {
      shippingAddress: shippingInfo,
    };
    console.log(orderData);
    const res = await dispatch(
      UpdateOrder({ id: OrderId, shippingAddress: orderData })
    );
    setLoading(false);
    setShow(false);
    if (res?.payload?.success) {
      loadOrders();
    }
  };

  useEffect(() => {
    const trackingOrder = () => {
      const statusMap = Orders?.reduce((acc, Order) => {
        acc[Order._id] = Order.orderStats;
        return acc;
      }, {});
      setOrderStatus(statusMap);
    };

    trackingOrder();
  }, [Orders]);
  console.log(orderStats);
  useEffect(() => {
    loadProfile();

    loadOrders();
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
        {Orders?.length == 0 ? (
          <div className="flex justify-center items-center gap-10 mt-2 flex-col">
            <h1 className="text-center dark:text-white"> NO order....</h1>
            <button
              onClick={() => {
                navigate("/AllProduct");
              }}
              className="px-3 dark:text-white font-medium py-2 bg-green-400 w-1/2 rounded-xl hover:bg-transparent hover:border-2 border-green-400"
            >
              Continue Shopping...
            </button>
          </div>
        ) : (
          Orders?.map((order, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#111827] dark:text-white shadow-[0_0_2px_black] mt-2 rounded-lg p-6 max-w-2xl max-sm:mx-4 mx-auto mb-4  flex flex-col"
            >
              <h2 className="text-lg flex justify-between dark:text-white font-semibold mb-4 max-sm:text-sm">
                Order ID: {order._id}
                {orderStats[order._id] === "Canceled" ? (
                  <p className="text-red-500 text-sm  cursor-pointer hover:underline">
                    Canceled
                  </p>
                ) : (
                  <p
                    onClick={() => handelOrderCancel(order._id)}
                    className="text-red-500 text-sm cursor-pointer hover:underline"
                  >
                    Cancel
                  </p>
                )}
              </h2>
              {order.products.map((product, productIndex) => (
                <div key={productIndex} className="flex space-x-4 mb-4">
                  <img
                    src={product?.productDetails?.image?.secure_url}
                    alt={product.productDetails.name}
                    className="w-24 h-24 object-contain rounded"
                  />
                  <div>
                    <h2 className="text-lg font-semibold dark:text-white">
                      {product.productDetails.name}
                    </h2>
                    <p className="text-gray-500 dark:text-white flex items-center">
                      <MdCurrencyRupee />
                      {product.productDetails.price.toFixed(2)}
                    </p>
                    <p className="text-gray-500 text-sm dark:text-white">
                      quantity :{product.quantity}
                    </p>
                    <p className="mt-2 text-gray-700 dark:text-white">
                      {product.productDetails.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className="mt-6 sm:grid grid-cols-2 gap-4 dark:text-white">
                <div>
                  <h3 className="text-sm font-bold mb-2 dark:text-white">
                    Delivery address
                  </h3>
                  <div className="text-gray-700 max-sm:py-3 dark:text-white">
                    <p className="text-sm"> {order.shippingAddress.name} </p>
                    <p className="text-sm">
                      {" "}
                      {order.shippingAddress.address},
                      {order.shippingAddress.city}{" "}
                    </p>
                    <p className="text-sm line-clamp-5 ">
                      {" "}
                      {order.shippingAddress.state},
                      {order.shippingAddress.postalCode},
                    </p>
                    <p className="text-sm">
                      {order.shippingAddress.phoneNumber}
                    </p>
                    <p className="w-[60%] text-sm ">
                      {order.shippingAddress.email}
                    </p>
                    <p
                      onClick={() => {
                        setOrderId(order._id), setShow(true);
                      }}
                      className="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-2 dark:text-white">
                    Order Details
                  </h3>
                  <p className="text-gray-700 dark:text-white">
                    Payment Method: {order.PaymentMethod}
                  </p>
                  <p className="text-gray-700 dark:text-white flex items-center">
                    Total Amount: <MdCurrencyRupee />
                    {order.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-gray-700  dark:text-white">
                    Status: {order.orderStats}
                  </p>
                  <p className="text-gray-700 dark:text-white">
                    Payment Status: {order.paymentStatus}
                  </p>
                </div>
              </div>
              {orderStats[order._id] === "Canceled" ? (
                <div className="flex flex-col items-center mt-10">
                  <h3 className="text-sm text-gray-600 mb-2 dark:text-white">
                    Order placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </h3>
                  <h1 className="text-red-500">Canceled</h1>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="flex justify-between">
                    <h3 className="text-sm text-gray-600 mb-2 dark:text-white">
                      Order placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </h3>
                    <h3 className="text-sm text-gray-600 mb-2 dark:text-white">
                      Order Delivery on{" "}
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </h3>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-black h-1 rounded-full">
                    <div
                      className="bg-blue-600 h-1 rounded-full"
                      style={{
                        width: `${
                          orderStats[order._id] === "Processing"
                            ? "40%"
                            : orderStats[order._id] === "Shipped"
                            ? "70%"
                            : orderStats[order._id] === "Delivered"
                            ? "10%"
                            : "10%"
                        }`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2 dark:text-white">
                    <span
                      className="
                   text-blue-600 font-medium "
                    >
                      Order placed
                    </span>
                    <span
                      className={` ${
                        orderStats[order._id] === "Processing"
                          ? `text-blue-600`
                          : `text-black dark:text-white`
                      }  font-medium `}
                    >
                      Processing
                    </span>
                    <span
                      className={`${
                        orderStats[order._id] === "Shipped"
                          ? `text-blue-600`
                          : `text-black dark:text-white`
                      }   font-medium `}
                    >
                      Shipped
                    </span>
                    <span
                      className={`${
                        orderStats[order._id] === "Delivered"
                          ? `text-blue-600`
                          : `text-black dark:text-white`
                      }   font-medium  mb-5`}
                    >
                      Delivered
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        {show && (
          <div className="fixed inset-0 flex  overflow-y-auto  justify-center dark:bg-[#111827]   items-center bg-gray-800 bg-opacity-50 z-50">
            <div className=" px-4 mb-5 md:mb-0 sm:my-10  max-sm:h-[90%]  ">
              <h2 className="text-2xl mb-3 font-bold text-black dark:text-white">
                Billing Details
              </h2>

              <div className="p-5 border bg-white dark:bg-[#111827] ">
                <button
                  onClick={() => setShow(false)}
                  className=" text-black  dark:text-white px-2  flex text-2xl rounded-lg"
                >
                  <FaArrowLeft size={20} />
                </button>
                {/* Country Selection */}
                <div className="mb-4">
                  <label
                    htmlFor="country"
                    className="block text-black dark:text-white"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    onChange={handelUserInput}
                    value={shippingInfo.country}
                    name="country"
                    id="country"
                    className="form-control mt-1 w-full dark:bg-[#111827]   border p-2 rounded"
                  />
                </div>

                <div className="flex flex-wrap mb-4">
                  <div className="w-full  pr-2 mb-4 md:mb-0">
                    <label
                      htmlFor="name"
                      className="block text-black dark:text-white"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      onChange={handelUserInput}
                      value={shippingInfo.name}
                      name="name"
                      id="name"
                      className="form-control mt-1 w-full dark:bg-[#111827]   border p-2 rounded"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label
                    htmlFor="c_address"
                    className="block text-black dark:text-white"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    onChange={handelUserInput}
                    value={shippingInfo.address}
                    id="address"
                    name="address"
                    placeholder="Street address"
                    className="form-control mt-1 w-full dark:bg-[#111827]   border p-2 rounded"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    name="address2"
                    onChange={handelUserInput}
                    value={shippingInfo.address2}
                    placeholder="Apartment, suite, unit etc. (optional)"
                    className="form-control mt-1 w-full dark:bg-[#111827]   border p-2 rounded"
                  />
                </div>

                <div className="flex flex-wrap mb-4">
                  <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
                    <label
                      htmlFor="city"
                      className="block text-black dark:text-white"
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handelUserInput}
                      value={shippingInfo.city}
                      name="city"
                      type="text"
                      id="city"
                      className="form-control mt-1 w-full dark:bg-[#111827]   border p-2 rounded"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
                    <label
                      htmlFor="state"
                      className="block text-black dark:text-white"
                    >
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handelUserInput}
                      value={shippingInfo.state}
                      name="state"
                      type="text"
                      id="state"
                      className="form-control mt-1 w-full dark:bg-[#111827]   border p-2 rounded"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pl-2">
                    <label
                      htmlFor="postalCode"
                      className="block text-black dark:text-white"
                    >
                      Postal / Zip <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      onChange={handelUserInput}
                      value={shippingInfo.postalCode}
                      name="postalCode"
                      id="postalCode"
                      className="form-control mt-1 w-full dark:bg-[#111827]   border p-2 rounded"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap mb-5">
                  <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
                    <label
                      htmlFor="email"
                      className="block text-black dark:text-white"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handelUserInput}
                      value={shippingInfo.email}
                      name="email"
                      type="email"
                      id="email"
                      className="form-control mt-1 w-full dark:bg-[#111827]   border p-2 rounded"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pl-2 mb-2">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-black dark:text-white"
                    >
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handelUserInput}
                      value={shippingInfo.phoneNumber}
                      name="phoneNumber"
                      type="number"
                      id="phoneNumber"
                      placeholder="Phone Number"
                      className="form-control mt-1 w-full dark:bg-[#111827]   border p-2 rounded"
                    />
                  </div>
                  <LoadingButton
                    onClick={() => {
                      handelPlaceOrder();
                    }}
                    color={"bg-green-500"}
                    name={"Update.."}
                    message={"Updating..."}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
export default Profile;
