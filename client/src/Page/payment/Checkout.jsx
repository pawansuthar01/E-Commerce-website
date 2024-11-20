import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import Layout from "../../layout/layout";
import { paymentCreate } from "../../Redux/Slice/paymentSlice";

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [UserData, setUserData] = useState({});
  const [payment, setPayment] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const handlePayment = async (e) => {
    e.preventDefault(); // Prevent form submission behavior
    try {
      setLoading(true);

      const orderResponse = await dispatch(paymentCreate(payment)); // Adjust if using async Thunk
      console.log(orderResponse);
      const { orderId, currency, amount } = orderResponse?.payload;
      // Razorpay options and initialization
      const options = {
        key: "rzp_test_5SBL5zBd3YDIum", // Use env variable
        amount,
        currency,
        name: "Your Store Name",
        description: "Order Description",
        order_id: orderId,
        handler: function (response) {
          console.log("Payment successful", response);
          setPaymentStatus("Payment Successful");
          toast.success("Payment Successful");
        },
        prefill: {
          name: UserData.name,
          email: UserData.email,
          contact: UserData.phoneNumber,
        },
        theme: {
          color: "#F37254",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setPaymentStatus("Error processing payment");
      toast.error("Error processing payment");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!state || !state.shippingAddress) {
      toast.error("Checkout information is missing.");
      navigate("/");
    } else {
      setPayment(state.totalAmount);
      setUserData(state.shippingAddress);
    }
  }, [state, navigate]);

  return (
    <Layout>
      <form
        onSubmit={handlePayment}
        className="min-h-[90vh] flex flex-col justify-center items-center text-white "
      >
        <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-sm relative">
          <h1 className="bg-yellow-300 absolute top-0 w-full text-center py-4 text-2xl font-bold  rounded-tl-l grounded-tr-lg">
            Subscription Bundle
          </h1>
          <div className="px-4 space-y-5 text-center">
            <p className="text-[17px]">
              This purchase will allow you to access all available courses on
              our platform for{" "}
              <span className="text-yellow-200 font-bold">
                <br />1 year duration
              </span>
              . All the existing and newly launched courses will also be
              available.
            </p>
            <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-300">
              <BiRupee /> <span>{payment}</span> Only
            </p>
            <div className="text-gray-500">
              <p>100% refund on cancellation</p>
              <p>* Terms and conditions apply *</p>
            </div>
            <button
              type="submit"
              className={`bg-yellow-500 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-yellow-600"
              } transition-all ease-in-out duration-300 absolute bottom-0 w-full left-0 text-xl font-bold rounded-bl-lg rounded-br-lg py-2`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Buy now"}
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}

export default Checkout;
