import axios from "axios";

const basic_uri = "http://localhost:5000";
const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = basic_uri;
axiosInstance.defaults.withCredentials = true;
export default axiosInstance;
