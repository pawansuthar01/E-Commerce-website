import { useDispatch, useSelector } from "react-redux";
import Layout from "../../layout/layout";
import { FiEdit } from "react-icons/fi";
import bgProfile from "../../assets/home/pexels-photo-29376504.webp";
import { useNavigate } from "react-router-dom";
import { getProduct } from "../../Redux/Slice/ProductSlice";
import { LoadAccount } from "../../Redux/Slice/authSlice";
import { useEffect } from "react";
import ProductCard from "../../Components/productCard";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserData = useSelector((state) => state?.auth);

  const loadProfile = async (id) => {
    const res = await dispatch(LoadAccount());
  };
  UserData.data?.walletAddProducts.map((Product) => {
    console.log(Product);
  });
  console.log(UserData.data?.walletAddProducts);

  useEffect(() => {
    loadProfile();
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
        {UserData.data?.walletAddProducts?.length == 0 ? (
          <div className="w-full flex text-center items-center gap-4 flex-col">
            <h1 className="text-3xl  mt-10">😕No Product Add...😓</h1>
            <p className="text-2xl">Now Add Product..</p>
            <button
              onClick={() => navigate("/AllProduct")}
              className="btn btn-primary w-32 text-sm"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className=" flex flex-wrap  max-sm:justify-center justify-evenly  gap-10 my-10">
            {UserData.data?.walletAddProducts &&
              UserData.data?.walletAddProducts.map((Product, ind) => {
                return <ProductCard data={Product} key={ind} />;
              })}
          </div>
        )}
      </div>
    </Layout>
  );
}
export default Profile;
