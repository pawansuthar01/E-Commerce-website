import React, { useEffect, useState } from "react";
import Layout from "../../layout/layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoadAccount } from "../../Redux/Slice/authSlice";
import { FaArrowLeft, FaS } from "react-icons/fa6";
import { MdCurrencyRupee } from "react-icons/md";
import toast from "react-hot-toast";
import LoadingButton from "../../constants/LoadingBtn";
import { isEmail, isPhoneNumber } from "../../helper/regexMatch";
import { PlaceOrder } from "../../Redux/Slice/OrderSlice";
import {
  AllRemoveCardProduct,
  updateProduct,
} from "../../Redux/Slice/ProductSlice";
import { checkPayment, paymentCreate } from "../../Redux/Slice/paymentSlice";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useTheme } from "../../Components/ThemeContext";
import FeedbackForm from "../../Components/feedbackfrom";
import FeedbackList from "../../Components/feedbackList";

function CheckoutPage() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [UserId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const ProductDetails = useLocation().state;
  const [shippingInfo, setShippingInfo] = useState({
    name: name,
    email: email,
    phoneNumber: phone,
    address: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [showLoading, setShowLoading] = useState(true);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const { darkMode } = useTheme();

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const loadProfile = async () => {
    const res = await dispatch(LoadAccount());
    setUserId(res?.payload?.data?._id);

    setEmail(res?.payload?.data?.email);
    setPhone(res?.payload?.data?.phoneNumber);
    setName(res?.payload?.data?.fullName);

    const updatedCart = res?.payload?.data?.walletAddProducts?.map(
      (product) => {
        const productQuantity = ProductDetails[product.product] || 1;
        return { ...product, quantity: productQuantity };
      }
    );
    setCart(updatedCart || []);
    setShowLoading(false);
  };

  const calculateTotalAmount = () => {
    return cart
      .reduce((total, product) => {
        const productTotal =
          Number(product.price) * (ProductDetails[product.product] || 1);
        return total + productTotal;
      }, 0)
      .toFixed(2);
  };
  const handelUserInput = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
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
      setError(true);
      setLoading(false);
      setMessage("All  Field  is mandatory To Order ....");
      return;
    }

    if (!isPhoneNumber(shippingInfo.phoneNumber)) {
      setLoading(false);
      setMessage(" Invalid Phone Number....");
      return;
    }

    if (!isEmail(shippingInfo.email)) {
      setLoading(false);
      setMessage("Invalid email....");

      return;
    }

    if (!UserId) {
      setLoading(false);
      setMessage("Something want Wrong try again..");
      return;
    }
    if (paymentMethod === "razorpay") {
      setLoading(false);

      try {
        setLoading(true);

        const orderResponse = await dispatch(paymentCreate(totalPrice));

        const { orderId, currency, amount } = orderResponse?.payload;
        const options = {
          key: "rzp_test_ySodygWXmjNTgT",
          amount,
          currency,
          name: "Kgs Doors",
          description: "Order Description",
          order_id: orderId,
          handler: async function (response) {
            toast.success("Payment Successful");

            const res = await dispatch(checkPayment(response));

            if (res?.payload?.success) {
              setError(false), OrderPlaceNew("Completed");
            } else {
              setError(true),
                setLoading(false),
                setMessage("Payment is Fail 💔 please try again..");
            }
          },
          prefill: {
            name: shippingInfo.name,
            email: shippingInfo.email,
            contact: shippingInfo.phoneNumber,
          },
          theme: {
            color: ` ${darkMode ? `#111827` : `#F37254`}`,
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        toast.error("Error processing payment");
      } finally {
        setLoading(false);
      }
    } else {
      OrderPlaceNew("Pending");
    }

    async function OrderPlaceNew(paymentStatus) {
      setShowLoading(true);

      const orderData = {
        userId: UserId,
        products: cart,
        shippingAddress: shippingInfo,
        paymentStatus: paymentStatus,
        PaymentMethod: paymentMethod,
        totalAmount: totalPrice,
      };

      const res = await dispatch(PlaceOrder(orderData));
      setShowLoading(false);
      setLoading(false);
      setError(false);
      if (res?.payload?.success) {
        await dispatch(AllRemoveCardProduct(UserId));
        for (const product of cart) {
          await dispatch(
            updateProduct({
              id: product.product,

              orderCount: (product.orderCount || 0) + product.quantity,
            })
          );
        }
        loadProfile();
        navigate("/ThankYou", { state: { data: res?.payload?.data } });
      }
    }
  };

  useEffect(() => {
    if (calculateTotalAmount) {
      const Total = calculateTotalAmount();
      setTotalPrice(Total);
    }
  }, [cart]);

  useEffect(() => {
    loadProfile();
    if (!ProductDetails) {
      navigate(-1);
    }
  }, [ProductDetails]);
  useEffect(() => {
    setShippingInfo({
      ...shippingInfo,
      name: name,
      email: email,
      phoneNumber: phone,
    });
  }, [name, email, phone]);
  if (showLoading) {
    return (
      <Layout>
        <div
          className={`flex flex-col items-center justify-center min-h-screen bg-gray-100  dark:bg-gray-900 ${
            loading ? "fixed inset-0 bg-black bg-opacity-30 z-10" : ""
          }`}
        >
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
          <p>
            {" "}
            {loading
              ? "Please wait, your order is being placed..."
              : "Loading..."}
          </p>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="pb-10 ">
        {error && (
          <div className="flex  z-20  items-center gap-10 fixed bg-red-200   w-full mx-2 border-2 border-red-500 text-red-500 font-medium p-3">
            <p>{message}</p>
            <IoCloseCircleOutline
              size={20}
              className=" cursor-pointer"
              onClick={() => setError(false)}
            />
          </div>
        )}
        <h1
          onClick={() => navigate("/Cart")}
          className="flex items-center text-xl cursor-pointer hover:text-blue-500"
        >
          <FaArrowLeft className="ml-5 p-2  m-2" size={36} /> <span>Edit</span>
        </h1>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-5 md:mb-0">
              <h2 className="text-2xl mb-3 font-bold dark:text-white text-black">
                Billing Details
              </h2>
              <div className="p-5 border dark:bg-[#111827]  bg-white">
                {/* Country Selection */}
                <div className="mb-4">
                  <label
                    htmlFor="country"
                    className="block dark:text-white text-black"
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
                      className="block dark:text-white text-black"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      onChange={handelUserInput}
                      value={shippingInfo.name}
                      name="name"
                      id="name"
                      className="form-control mt-1 w-full dark:bg-[#111827]  border p-2 rounded"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label
                    htmlFor="c_address"
                    className="block dark:text-white text-black"
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
                    className="form-control mt-1 w-full dark:bg-[#111827]  border p-2 rounded"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    name="address2"
                    onChange={handelUserInput}
                    value={shippingInfo.address2}
                    placeholder="Apartment, suite, unit etc. (optional)"
                    className="form-control mt-1 w-full dark:bg-[#111827] border p-2 rounded"
                  />
                </div>

                <div className="flex flex-wrap mb-4">
                  <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
                    <label
                      htmlFor="city"
                      className="block dark:text-white text-black"
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handelUserInput}
                      value={shippingInfo.city}
                      name="city"
                      type="text"
                      id="city"
                      className="form-control mt-1 w-full dark:bg-[#111827]  border p-2 rounded"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
                    <label
                      htmlFor="state"
                      className="block dark:text-white text-black"
                    >
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handelUserInput}
                      value={shippingInfo.state}
                      name="state"
                      type="text"
                      id="state"
                      className="form-control mt-1 w-full dark:bg-[#111827]  border p-2 rounded"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pl-2">
                    <label
                      htmlFor="postalCode"
                      className="block dark:text-white text-black"
                    >
                      Postal / Zip <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      onChange={handelUserInput}
                      value={shippingInfo.postalCode}
                      name="postalCode"
                      id="postalCode"
                      className="form-control mt-1 w-full dark:bg-[#111827]  border p-2 rounded"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap mb-5">
                  <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
                    <label
                      htmlFor="email"
                      className="block dark:text-white text-black"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handelUserInput}
                      value={shippingInfo.email}
                      name="email"
                      type="email"
                      id="email"
                      className="form-control mt-1 w-full dark:bg-[#111827]  border p-2 rounded"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pl-2">
                    <label
                      htmlFor="phoneNumber"
                      className="block dark:text-white text-black"
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
                      className="form-control mt-1 w-full dark:bg-[#111827]  border p-2 rounded"
                    />
                  </div>
                </div>

                {/* Create Account Checkbox */}
              </div>
            </div>

            <div className="w-full md:w-1/2 px-4">
              <div className="mb-5 sm:sticky top-6">
                <h2 className="text-2xl mb-3 font-bold dark:text-white text-black">
                  Your Order
                </h2>
                <div className="p-5 border bg-white dark:bg-[#111827]  overflow-x-auto ">
                  <table className="w-full mb-5">
                    <thead className="">
                      <tr>
                        <th className=" p-4 text-center ">Product</th>
                        <th className=" p-4 text-center">Price</th>
                        <th className=" p-4 text-center">Quantity</th>
                        <th className=" p-4 text-center">Total</th>
                      </tr>
                    </thead>
                    {cart.map((product) => (
                      <tbody key={product.product}>
                        <tr>
                          <td className="p-4 text-center">{product.name}</td>
                          <td className="p-4 text-center items-center flex justify-center ">
                            <MdCurrencyRupee />{" "}
                            <span>{Number(product.price).toFixed(2)}</span>
                          </td>
                          <td className="p-4 text-center  ">
                            {product.quantity}{" "}
                          </td>

                          <td className="p-4 items-center flex  justify-center">
                            <MdCurrencyRupee />{" "}
                            {(
                              Number(product.price) *
                              ProductDetails[product.product]
                            ).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                  <div>
                    PaymentMethod :
                    <div>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === "razorpay"}
                        value="razorpay"
                        id="razorpay"
                        onChange={handlePaymentMethodChange}
                      />
                      <label
                        htmlFor="razorpay"
                        className="text-sm font-medium pl-2"
                      >
                        PhonePay,Paytm,Google Pay and Other...
                      </label>
                    </div>
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === "cash on Delivery"}
                      value="cash on Delivery"
                      id="cash_on_Delivery"
                      onChange={handlePaymentMethodChange}
                    />
                    <label
                      htmlFor="cash_on_Delivery"
                      className="text-sm font-medium pl-2"
                    >
                      Cash on Delivery
                    </label>
                  </div>
                  <div className="text-xl justify-end  w-full flex pr-3 items-center">
                    <span className="flex items-center my-2 ">
                      Total price : <MdCurrencyRupee />
                    </span>

                    <h1>{totalPrice}</h1>
                  </div>
                  <LoadingButton
                    onClick={() => handelPlaceOrder()}
                    color={"bg-green-500"}
                    message={"wait !..."}
                    loading={loading}
                    name={"Place Order"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default CheckoutPage;
