import { IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NotificationRead } from "../../Redux/Slice/notification.Slice";

function NotificationCart({ data, onUpdate }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handelClickBtn = async (id) => {
    const res = await dispatch(NotificationRead(id));
    if (res?.payload?.success) {
      onUpdate();
    }
  };

  const handelClick = async (id) => {
    const res = await dispatch(NotificationRead(id));
    if (res?.payload?.success) {
      onUpdate();
    }

    if (data.type == "comment") navigate("/Blog");
    if (data.type == "replay") navigate("/Blog");
    if (data.type == "blog") navigate("/Blog");
    if (data.type == "new product") navigate("/AllProduct");
    if (data.type == "like") navigate("/Blog");
  };

  return (
    <div
      onClick={() => handelClick(data._id)}
      className="w-full  flex items-center gap-10    font-medium"
    >
      <p>{data.message}</p>
      <button
        onClick={() => handelClickBtn(data._id)}
        className=" text-red-500 text-lg font-bold cursor-pointer text-end"
      >
        <IoCloseCircleOutline size={26} />
      </button>
    </div>
  );
}
export default NotificationCart;
