import axios from "axios";

const basic_uri = "https://e-commerce-website-2-2u9q.onrender.com";
const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = basic_uri;
axiosInstance.defaults.withCredentials = true;
export default axiosInstance;
