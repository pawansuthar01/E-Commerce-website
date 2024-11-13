import { useSelector } from "react-redux";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
const UserId = useSelector((state) => state?.auth?.data?._id);

socket.emit("join", UserId);
socket.on("newNotification", (message) => {
  console.log("New Notification:", message);
  alert(`Notification: ${message}`);
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});
