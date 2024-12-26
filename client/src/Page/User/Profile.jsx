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
import { isEmail, isPhoneNumber } from "../../helper/regexMatch";
import { OrderShow } from "../../Components/ShowOrder";
import FeedbackForm from "../../Components/feedbackfrom";
import FeedbackList from "../../Components/feedbackList";

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
  const [show, setShow] = useState(false);
  const [Role, setRole] = useState("");
  const [PaymentStatus, setPaymentStatus] = useState("");
  const [editShow, setEditShow] = useState(false);
  const UserData = useSelector((state) => state?.auth);
  const orders = useSelector((state) => state?.order.Orders);
  const [Orders, setOrder] = useState(orders);

  const loadProfile = async () => {
    const res = await dispatch(LoadAccount());
    setUserID(res?.payload?.data?._id);
    setRole(res?.payload?.data?.role);
  };
  const trackingOrder = () => {
    const statusMap = Orders?.reduce((acc, Order) => {
      acc[Order._id] = Order.orderStats;
      return acc;
    }, {});
    setOrderStatus(statusMap);
  };

  const loadOrders = async (UserId) => {
    if (Orders.length === 0) {
      {
        const res = await dispatch(
          getOrder(UserId ? UserId : UserData?.data._id)
        );
        if (res.payload.success) setOrder(orders);
      }
    } else {
      setOrder(orders);
    }
  };
  const handelUserInput = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };
  const handleOrderUpdate = async (
    id,
    paymentStatus = null,
    orderStats = null
  ) => {
    if (orderStats === "Delivered") {
      toast.error("You cannot update or cancel a delivered order.");
      return;
    }

    if (orderStats !== null && PaymentStatus !== "Completed") {
      toast.error("Payment must be completed before updating the order.");
      return;
    }

    if (!id) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    if (paymentStatus !== null) {
      const res = await dispatch(UpdateOrder({ id, data: paymentStatus }));
      if (res?.payload?.success) {
        setEditShow(false);

        toast.success("Payment Status updated successfully!");
        loadOrders();
        trackingOrder();
      } else {
        toast.error(
          res?.payload?.message || "Failed to update payment status."
        );
      }
    }

    if (orderStats !== null) {
      const res = await dispatch(UpdateOrder({ id, data: orderStats }));
      if (res?.payload?.success) {
        setEditShow(false);
        toast.success("Order Status updated successfully!");
        loadOrders(); // Reload orders to reflect the change
        trackingOrder(); // Update order status tracking
      } else {
        toast.error(res?.payload?.message || "Failed to update order status.");
      }
    }
  };

  const handelOrderCancel = async (id) => {
    if (orderStats[OrderId] === "Delivered") {
      toast.error("You cannot cancel a delivered order.");
      return;
    }

    if (!id) {
      setLoading(false);
      toast.error("Something went wrong. Try again.");
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
    trackingOrder();
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);
  useEffect(() => {
    loadOrders();
  }, [UserData, UserId]);

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
          <>
            <div className="flex flex-wrap gap-1">
              <OrderShow
                Role={Role}
                Orders={Orders}
                orderStats={orderStats}
                handelOrderCancel={(id) => handelOrderCancel(id)}
                setShow={setShow}
                setEditShow={setEditShow}
                setOrderId={setOrderId}
                setPaymentStatus={setPaymentStatus}
              />
            </div>
          </>
        )}
        {editShow && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 dark:bg-opacity-80 z-50">
            <div className="bg-white dark:bg-[#1f2937] dark:text-white w-[90%] max-w-lg p-6 rounded-lg shadow-lg">
              {/* Close Button */}
              <div className="flex justify-start">
                <button
                  onClick={() => setEditShow(false)}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-500 focus:ring-2 focus:ring-red-300 p-2 rounded-lg"
                  aria-label="Close"
                >
                  <FaArrowLeft size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="mt-4 space-y-6">
                {orderStats[OrderId] === "Delivered" && (
                  <p className="text-center text-red-400">
                    The order has been delivered. No further updates are
                    allowed.
                  </p>
                )}

                {/* If Order is Canceled */}
                {orderStats[OrderId] === "Canceled" ? (
                  <p className="text-red-500 text-lg font-semibold text-center">
                    This order has been canceled.
                  </p>
                ) : Role === "AUTHOR" || Role === "ADMIN" ? (
                  // Author or Admin Controls
                  <div className="space-y-6">
                    {/* Change Order Status */}
                    <div>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Change Order Status
                      </p>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-green-400 focus:outline-none"
                        value={orderStats[OrderId]}
                        onChange={(e) =>
                          handleOrderUpdate(OrderId, {
                            orderStats: e.target.value,
                          })
                        }
                        disabled={
                          orderStats[OrderId] === "Canceled" ||
                          orderStats[OrderId] === "Delivered"
                        }
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipping">Shipping</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </div>

                    {/* Change Payment Status */}
                    <div>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Change Payment Status
                      </p>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-green-400 focus:outline-none"
                        value={PaymentStatus}
                        onChange={(e) =>
                          handleOrderUpdate(OrderId, {
                            paymentStatus: e.target.value,
                          })
                        }
                        disabled={
                          PaymentStatus === "Completed" ||
                          PaymentStatus === "Failed"
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <p
                    onClick={() => handelOrderCancel(OrderId)}
                    className="text-red-500 text-lg font-semibold text-center cursor-pointer hover:underline"
                  >
                    Cancel Order
                  </p>
                )}
              </div>
            </div>
          </div>
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
                    className="form-control mt-1 w-full dark:bg-[#111827] bg-white   border p-2 rounded"
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
                      className="form-control mt-1 w-full dark:bg-[#111827] bg-white  border p-2 rounded"
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
                    className="form-control mt-1 w-full dark:bg-[#111827] bg-white  border p-2 rounded"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    name="address2"
                    onChange={handelUserInput}
                    value={shippingInfo.address2}
                    placeholder="Apartment, suite, unit etc. (optional)"
                    className="form-control mt-1 w-full dark:bg-[#111827]bg-white   border p-2 rounded"
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
                      className="form-control mt-1 w-full dark:bg-[#111827] bg-white   border p-2 rounded"
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
                      className="form-control mt-1 w-full dark:bg-[#111827] bg-white  border p-2 rounded"
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
                      className="form-control mt-1 w-full dark:bg-[#111827] bg-white   border p-2 rounded"
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
                      className="form-control mt-1 w-full dark:bg-[#111827] bg-white  border p-2 rounded"
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
                      className="form-control mt-1 w-full dark:bg-[#111827] bg-white   border p-2 rounded"
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
