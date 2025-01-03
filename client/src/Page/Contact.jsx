import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/layout";
import { AiOutlineArrowLeft } from "react-icons/ai";
import FeedbackForm from "../Components/feedbackfrom";
import FeedbackList from "../Components/feedbackList";
import { isEmail, isPhoneNumber } from "../helper/regexMatch";
import { SendMassage } from "../Redux/Slice/feedbackSlice";

function Contact() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage form inputs
  const [formData, setFormData] = useState({
    number: "",
    email: "",
    message: "",
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    document.getElementById(name).style.borderColor = "";
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      document.getElementById("email").style.borderColor = "red";
      return;
    }
    if (!isEmail(formData.email)) {
      document.getElementById("email").style.borderColor = "red";
      return;
    }

    if (!formData.number) {
      document.getElementById("number").style.borderColor = "red";
      return;
    }

    if (!isPhoneNumber(formData.number)) {
      document.getElementById("number").style.borderColor = "red";
      return;
    }
    if (!formData.message) {
      document.getElementById("message").style.borderColor = "red";
      return;
    }
    const res = await dispatch(SendMassage(formData));
    console.log(res);
    setFormData({
      number: "",
      email: "",
      message: "",
    });
  };

  return (
    <Layout>
      <div className="w-full min-h-[80vh] sm:mt-[100px] mb-10 dark:bg-[#111827] ">
        <div className="flex flex-col  items-center  w-full">
          <h3 className="text-2xl text-center font-black dark:text-white  text-black">
            We'd love to Help
          </h3>
          <p className="text-[#88878D] text-xl w-11/12 dark:text-white text-center">
            😇 Reach out and we'll get in touch within 24 hours. 😇
          </p>
          <div className=" p-3 shadow-[0_0_5px_black] dark:bg-[#111827]  bg-[#F7F7F7] sm:w-[50%] max-sm:w-[80%] rounded-sm   m-5">
            <header className="flex items-center justify-center relative">
              <button
                onClick={() => navigate(-1)}
                className="absolute left-2 text-xl text-black"
              >
                <AiOutlineArrowLeft />
              </button>
              <h1 className="text-xl dark:text-white text-black font-semibold">
                Contact
              </h1>
            </header>
            <form onSubmit={handleSubmit}>
              <div className="w-full my-5 flex flex-col">
                <label htmlFor="number" className="text-xl py-2">
                  Number
                </label>
                <input
                  type="number"
                  name="number"
                  id="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="Enter Phone Number..."
                  className="px-2 border-2 py-3 border-gray-500 dark:bg-[#111827]  font-normal rounded-xl pl-2"
                />
              </div>
              <div className="w-full my-5 flex  flex-col">
                <label htmlFor="email" className=" text-xl py-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email..."
                  className="px-2 border-2 py-3 border-gray-500 dark:bg-[#111827]   font-normal rounded-xl pl-2"
                />
              </div>
              <div className="w-full my-5 flex flex-col">
                <label htmlFor="message" className="text-xl  py-2">
                  Message..
                </label>
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className=" resize-none h-48 border-2 border-gray-500 font-normal dark:bg-[#111827]  rounded-xl p-2"
                  placeholder="Message ...."
                ></textarea>
              </div>

              <button className="text-white bg-blue-600 my-2 hover:bg-transparent hover:border-2 hover:border-blue-600 hover:text-blue-600 text-xl rounded-sm px-2 py-3 w-full">
                Submit
              </button>
            </form>
          </div>
        </div>
        {/* feedback section */}
        <div className="w-full">
          <hr className="h-1 bg-slate-200" />
          <h1 className="text-2xl font-bold mb-4 ml-10 text-start dark:text-white text-black">
            Feedback Section
          </h1>
          <FeedbackForm />
          <FeedbackList />
        </div>
      </div>
    </Layout>
  );
}

export default Contact;
