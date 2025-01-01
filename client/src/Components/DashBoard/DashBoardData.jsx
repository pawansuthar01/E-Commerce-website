import { Bar, Pie } from "react-chartjs-2";
import { FaArrowLeft, FaBoxOpen, FaUsers } from "react-icons/fa6";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { FcSalesPerformance } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";
import { FiCheckCircle, FiLoader, FiTruck, FiXCircle } from "react-icons/fi";
ChartJS.register(
  ArcElement,

  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const DashBoard = ({ show, stats, orders }) => {
  const orderStatusChartData = {
    labels: ["Delivered", "Canceled", "Processing", "Shipping"],
    datasets: [
      {
        label: "Order Status",
        data: [
          orders.filter((order) => order.orderStats === "Delivered").length,
          orders.filter((order) => order.orderStats === "Canceled").length,
          orders.filter((order) => order.orderStats === "Processing").length,
          orders.filter((order) => order.orderStats === "Shipping").length,
        ],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800", "#2196f3"],
        borderColor: ["#4caf50", "#f44336", "#ff9800", "#2196f3"],
        borderWidth: 1,
      },
    ],
  };

  const userData = {
    labels: ["USER", "ADMIN", "AUTHOR"],
    fontColor: "white",
    datasets: [
      {
        label: "User Details",
        data: [stats.users, stats.Admin, stats.Author],
        backgroundColor: ["yellow", "green", "red"],
        borderWidth: 1,
        borderColor: ["yellow", "green", "red"],
      },
    ],
  };
  const salesData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    fontColor: "white",
    datasets: [
      {
        label: "Sales / Month",
        data: stats.monthlySalesRecord,
        backgroundColor: ["green"],
        borderColor: ["white"],
        borderWidth: 2,
      },
    ],
  };
  if (!show) return;
  return (
    <>
      <div className="grid sm:grid-cols-2 justify-center gap-5 m-auto mx-10">
        <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
          <div className="w-80 h-80">
            <Pie data={userData} />
          </div>
          <div className="grid grid-cols-3  gap-2">
            <div className="flex items-center justify-between  p-1 gap-2 rounded-md shadow-md">
              <div className="flex flex-col items-center ">
                <p className="font-semibold"> Users</p>
                <h3 className="text-2xl  font-bold">{stats.users}</h3>
              </div>
              <FaUsers className="text-yellow-500 text-3xl" />
            </div>
            <div className="flex items-center justify-between p-1 gap-2 rounded-md shadow-md">
              <div className="flex flex-col items-center">
                <p className="font-semibold">Admin</p>
                <h3 className="text-2xl font-bold">{stats.Admin}</h3>
              </div>
              <FaUsers className="text-green-500 text-3xl" />
            </div>
            <div className="flex items-center justify-between p-1 gap-2 rounded-md shadow-md">
              <div className="flex flex-col items-center">
                <p className="font-semibold">Author</p>
                <h3 className="text-2xl font-bold">{stats.Author}</h3>
              </div>
              <FaUsers className="text-green-500 text-3xl" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
          <div className="h-80 w-full relative">
            <Bar className="absolute bottom-0 h-80 w-full" data={salesData} />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex items-center justify-between p-2 gap-5 rounded-md shadow-md">
              <div className="flex flex-col items-center">
                <p className="font-semibold">Total Order</p>
                <h3 className="text-3xl font-bold">{stats.orders}</h3>
              </div>
              <FcSalesPerformance className="text-yellow-500 text-5xl" />
            </div>
            <div className="flex items-center justify-between p-2 gap-5 rounded-md shadow-md">
              <div className="flex flex-col items-center">
                <p className="font-semibold">Total Revenue</p>
                <h3 className="text-3xl font-bold">₹{stats.totalPayments}</h3>
              </div>
              <GiMoneyStack className="text-green-500 text-5xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
        <div className="w-96 h-96">
          <Pie data={orderStatusChartData} />
        </div>
        <div className="grid grid-cols-4  gap-2">
          <div className="flex items-center justify-center  p-1 max-sm:flex-col gap-2   rounded-md shadow-md">
            <FiCheckCircle className="text-green-500 text-3xl" />
            <div className="flex flex-col items-center ">
              <p className="font-semibold"> Delivered</p>
              <p className="text-2xl  font-bold">
                {
                  orders.filter((order) => order.orderStats === "Delivered")
                    .length
                }
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center  p-1 max-sm:flex-col gap-2  rounded-md shadow-md">
            <FiXCircle className="text-red-500  text-3xl" />
            <div className="flex flex-col items-center">
              <p className="font-semibold">Canceled</p>
              <h3 className="text-2xl font-bold">
                {
                  orders.filter((order) => order.orderStats === "Canceled")
                    .length
                }
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-center  p-1 max-sm:flex-col gap-2  rounded-md shadow-md">
            <FiLoader className="text-blue-500  text-3xl" />
            <div className="flex flex-col items-center">
              <p className="font-semibold">Processing</p>
              <h3 className="text-2xl font-bold">
                {
                  orders.filter((order) => order.orderStats === "Processing")
                    .length
                }
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-center max-sm:flex-col  p-1  gap-2  rounded-md shadow-md">
            <FiTruck className="text-yellow-500 text-3xl " />
            <div className="flex flex-col items-center">
              <p className="font-semibold">Shipping</p>
              <h3 className="text-2xl font-bold">
                {
                  orders.filter((order) => order.orderStats === "Shipping")
                    .length
                }
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
