import React, { useEffect, useState } from "react";
import Layout from "../../layout/layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoadAccount } from "../../Redux/Slice/authSlice";
import { FaArrowLeft } from "react-icons/fa6";
import { MdCurrencyRupee } from "react-icons/md";
import toast from "react-hot-toast";
import LoadingButton from "../../constants/LoadingBtn";
import { isEmail, isPhoneNumber } from "../../helper/regexMatch";
import { PlaceOrder } from "../../Redux/Slice/OrderSlice";

function CheckoutPage() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [UserId, setUserId] = useState("");
  const ProductDetails = useLocation().state;
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

  const loadProfile = async () => {
    const res = await dispatch(LoadAccount());
    setUserId(res?.payload?.data?._id);
    const updatedCart = res?.payload?.data?.walletAddProducts?.map(
      (product) => {
        const productQuantity = ProductDetails[product.product] || 1; // Set quantity from ProductDetails or default to 1
        return { ...product, quantity: productQuantity };
      }
    );
    setCart(updatedCart || []);
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
    if (!shippingInfo.name) {
      setLoading(false);
      toast.error("Name is required to order");
      return;
    }
    if (!shippingInfo.phoneNumber) {
      setLoading(false);
      toast.error("phoneNumber is required to order");
      return;
    }
    if (!isPhoneNumber(shippingInfo.phoneNumber)) {
      setLoading(false);
      toast.error("Invalid Phone Number");
      return;
    }
    if (!shippingInfo.address) {
      setLoading(false);
      toast.error("address is required to order");
      return;
    }
    if (!shippingInfo.email) {
      setLoading(false);
      toast.error("email is required to order");
      return;
    }
    if (!isEmail(shippingInfo.email)) {
      setLoading(false);
      toast.error("Invalid email");
      return;
    }
    if (!shippingInfo.city) {
      setLoading(false);
      toast.error("city is required to order");
      return;
    }
    if (!shippingInfo.state) {
      setLoading(false);
      toast.error("state is required to order");
      return;
    }
    if (!shippingInfo.country) {
      setLoading(false);
      toast.error("country is required to order");
      return;
    }
    if (!shippingInfo.postalCode) {
      setLoading(false);
      toast.error("postalCode is required to order");
      return;
    }
    if (!UserId) {
      setLoading(false);
      toast.error("Something want Worng try again..");
      return;
    }
    const orderData = {
      userId: UserId,
      products: cart,
      shippingAddress: shippingInfo,
      totalAmount: totalPrice,
    };
    const res = await dispatch(PlaceOrder(orderData));
    console.log(res);
    if (res) {
      setLoading(false);
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

  return (
    <Layout>
      <div className="pb-10 ">
        <h1
          onClick={() => navigate("/Cart")}
          className="flex items-center text-xl cursor-pointer hover:text-blue-500"
        >
          <FaArrowLeft className="ml-5 p-2  m-2" size={36} /> <span>Edit</span>
        </h1>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-5 md:mb-0">
              <h2 className="text-2xl mb-3 font-bold text-black">
                Billing Details
              </h2>
              <div className="p-5 border bg-white">
                {/* Country Selection */}
                <div className="mb-4">
                  <label htmlFor="country" className="block text-black">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    onChange={handelUserInput}
                    value={shippingInfo.country}
                    name="country"
                    id="country"
                    className="form-control mt-1 w-full border p-2 rounded"
                  />
                </div>

                <div className="flex flex-wrap mb-4">
                  <div className="w-full  pr-2 mb-4 md:mb-0">
                    <label htmlFor="name" className="block text-black">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      onChange={handelUserInput}
                      value={shippingInfo.name}
                      name="name"
                      id="name"
                      className="form-control mt-1 w-full border p-2 rounded"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label htmlFor="c_address" className="block text-black">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    onChange={handelUserInput}
                    value={shippingInfo.address}
                    id="address"
                    name="address"
                    placeholder="Street address"
                    className="form-control mt-1 w-full border p-2 rounded"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    name="address2"
                    onChange={handelUserInput}
                    value={shippingInfo.address2}
                    placeholder="Apartment, suite, unit etc. (optional)"
                    className="form-control mt-1 w-full border p-2 rounded"
                  />
                </div>

                <div className="flex flex-wrap mb-4">
                  <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
                    <label htmlFor="city" className="block text-black">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handelUserInput}
                      value={shippingInfo.city}
                      name="city"
                      type="text"
                      id="city"
                      className="form-control mt-1 w-full border p-2 rounded"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
                    <label htmlFor="state" className="block text-black">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handelUserInput}
                      value={shippingInfo.state}
                      name="state"
                      type="text"
                      id="state"
                      className="form-control mt-1 w-full border p-2 rounded"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pl-2">
                    <label htmlFor="postalCode" className="block text-black">
                      Postal / Zip <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      onChange={handelUserInput}
                      value={shippingInfo.postalCode}
                      name="postalCode"
                      id="postalCode"
                      className="form-control mt-1 w-full border p-2 rounded"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap mb-5">
                  <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
                    <label htmlFor="email" className="block text-black">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handelUserInput}
                      value={shippingInfo.email}
                      name="email"
                      type="email"
                      id="email"
                      className="form-control mt-1 w-full border p-2 rounded"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pl-2">
                    <label htmlFor="phoneNumber" className="block text-black">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handelUserInput}
                      value={shippingInfo.phoneNumber}
                      name="phoneNumber"
                      type="number"
                      id="phoneNumber"
                      placeholder="Phone Number"
                      className="form-control mt-1 w-full border p-2 rounded"
                    />
                  </div>
                </div>

                {/* Create Account Checkbox */}
              </div>
            </div>

            <div className="w-full md:w-1/2 px-4">
              <div className="mb-5">
                <h2 className="text-2xl mb-3 font-bold text-black">
                  Your Order
                </h2>
                <div className="p-5 border bg-white overflow-x-auto ">
                  <table className="w-full mb-5">
                    <thead className="">
                      <tr>
                        <th className=" p-4 text-center">Product</th>
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

                  {/* <button className="btn btn-black w-full p-3 bg-gray-800 text-white rounded">
                    Place Order
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CheckoutPage;
