import { IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NotificationRead } from "../../Redux/Slice/notification.Slice";

function NotificationCart({ data, onUpdate, handleReadNotification }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handelClickBtn = async (id) => {
    handleReadNotification(id);
    const res = await dispatch(NotificationRead(id));
    if (res?.payload?.success) {
      onUpdate();
    }
  };

  const handelClick = async (id) => {
    handleReadNotification(id);
    if (data.type == "New Account") {
      navigate("/profile");
    }
    const res = await dispatch(NotificationRead(id));
    if (res?.payload?.success) {
      onUpdate();
    }
  };

  return (
    <div className="w-full  flex items-center gap-10    font-medium">
      <p onClick={() => handelClick(data._id)}>{data.message}</p>
      <button
        onClick={() => handelClickBtn(data._id)}
        className=" text-red-500 text-lg font-bold cursor-pointer text-end"
      >
        <IoCloseCircleOutline
          onClick={() => handelhandelClickClickBtn(data._id)}
          size={26}
        />
      </button>
    </div>
  );
}
export default NotificationCart;
