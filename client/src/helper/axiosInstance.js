import axios from "axios";

const basic_uri = "https://e-commerce-website-production-4d08.up.railway.app";
const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = basic_uri;
axiosInstance.defaults.withCredentials = true;
export default axiosInstance;
