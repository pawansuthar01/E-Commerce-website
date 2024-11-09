import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/layout";
import { AiOutlineArrowLeft } from "react-icons/ai";

function Contact() {
  const { fullName } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="w-full min-h-[80vh] sm:mt-[100px] mb-10 ">
        <div className="flex flex-col  items-center  w-full">
          <h3 className="text-2xl text-center font-black text-black">
            We'd love to Help
          </h3>
          <p className="text-[#88878D] text-xl w-11/12 text-center">
            😇 Reach out and we'll get in touch within 24 hours. 😇
          </p>
          <div className=" p-3 shadow-[0_0_5px_black] bg-[#F7F7F7] sm:w-[50%] max-sm:w-[80%] rounded-sm   m-5">
            <header className="flex items-center justify-center relative">
              <button
                onClick={() => navigate(-1)}
                className="absolute left-2 text-xl text-black"
              >
                <AiOutlineArrowLeft />
              </button>
              <h1 className="text-xl text-black font-semibold">Contact</h1>
            </header>
            <form>
              <div className="w-full my-5 flex flex-col">
                <label id="number" className="text-xl py-2">
                  Number
                </label>
                <input
                  type="number"
                  name="number"
                  id="number"
                  placeholder="Enter Phone Number..."
                  className="px-2 border-2 py-3 border-gray-500  font-normal rounded-xl pl-2"
                />
              </div>
              <div className="w-full my-5 flex  flex-col">
                <label id="email" className=" text-xl py-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter Email..."
                  className="px-2 border-2 py-3 border-gray-500  font-normal rounded-xl pl-2"
                />
              </div>
              <div className="w-full my-5 flex flex-col">
                <label id="message" className="text-xl  py-2">
                  Message..
                </label>
                <textarea
                  name="message"
                  id="message"
                  className=" resize-none h-48 border-2 border-gray-500 font-normal   rounded-xl p-2"
                  placeholder="Message ...."
                ></textarea>
              </div>

              <button className="text-white bg-blue-600 my-2 hover:bg-transparent hover:border-2 hover:border-blue-600 hover:text-blue-600 text-xl rounded-sm px-2 py-3 w-full">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default Contact;
