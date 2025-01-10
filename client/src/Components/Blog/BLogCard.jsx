import { FaArrowLeft, FaRegComment } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteBlog,
  getAllPost,
  getPost,
  LikeAndDisLikePost,
} from "../../Redux/Slice/ContentSlice";
import { useState, useEffect } from "react";
import CommentCard from "../CommentListCard";
import { DeleteIcon, EditIcon } from "../../Page/Product/icon";
import EditBlog from "./editBlog";

function BlogCard({ w, data, onDelete }) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const dispatch = useDispatch();
  const { userName } = useSelector((state) => state?.auth);
  const { role } = useSelector((state) => state.auth);
  const [Blog, setBlog] = useState(null);
  const [show, setShow] = useState(false);
  const domain =
    window.location.hostname +
    (window.location.port ? `:${window.location.port}` : "");
  const productExists = Blog?.PostLikes?.some(
    (item) => item.userName && item.userName.toString() === userName
  );
  useEffect(() => {
    setBlog(data);
  }, [data]);
  useEffect(() => {
    if (!data) {
      navigator(-1);
    }
  }, []);
  const url = `http://${domain}/Blog/${data?._id}`;
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data.title,
        text: data.description,
        url: url,
      });
    }
  };

  async function LoadBlog(id) {
    const res = await dispatch(getPost(id));
    setBlog(res?.payload?.data);
  }

  async function handelLikeDisLike(id) {
    if (!id) return;
    const res = await dispatch(LikeAndDisLikePost(id));
    if (res.payload.success) {
      setBlog(res.payload.FindPost);
    }
  }
  function handelUpdatedData(res) {
    if (res.payload.success) {
      setBlog(res.payload.data);
    }
    setShow(false);
  }
  async function handleDeleteBlog(id) {
    onDelete(id);
  }
  return (
    <div>
      <div
        className={`card card-compact bg-base-100 dark:bg-gray-800 dark:text-white ${
          w ? w : "w-96"
        } shadow-xl `}
      >
        {role && ["ADMIN", "AUTHOR"].includes(role) && (
          <div className=" relative flex justify-evenly  gap-24 ">
            <button
              onClick={() => handleDeleteBlog(Blog._id)}
              className="flex items-center justify-center  text-red-500"
            >
              <DeleteIcon className="w-7 h-7 " />
            </button>
            <button
              onClick={() => {
                setShow(true);
              }}
              className="flex justify-center text-green-500 text-center     "
            >
              <EditIcon className="w-7 h-7" />
            </button>

            {/* Delete Button */}
          </div>
        )}
        <figure>
          <img
            crossOrigin="anonymous"
            src={Blog?.Post?.secure_url}
            alt="Shoes"
            className="max-h[250px]"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-black dark:text-white font-medium text-2xl">
            {Blog?.title}
          </h2>
          <p>{Blog?.description}</p>
          <div className="card-actions justify-evenly rounded-sm p-1 text-black dark:text-white font-normal">
            <button
              onClick={() => setShowCommentForm(true)}
              className="rounded-lg font-serif"
            >
              <h1 className="flex gap-1">
                <FaRegComment className="rounded-lg" size={20} />
                <span>Comment</span>
              </h1>
              {Blog?.numberOfComment}
            </button>
            <button
              onClick={() => handelLikeDisLike(Blog?._id)}
              className="font-serif"
            >
              <h1 className="flex gap-1">
                <FiHeart
                  className={`${
                    productExists
                      ? "text-red-800 dark:text-red-800"
                      : "bg-white dark:bg-gray-800"
                  } rounded-lg   font-bold `}
                  size={20}
                />
                <span> Like</span>
              </h1>
              {Blog?.likeCount}
            </button>
            <button
              onClick={handleShare}
              className="flex items-start gap-1 font-serif"
            >
              <IoPaperPlaneOutline className="rounded-lg" size={20} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {showCommentForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-sm:w-full w-1/2 max-w-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-1 dark:text-white">
              <button
                onClick={() => setShowCommentForm(false)}
                className="text-black dark:text-white px-2 py-1 flex text-2xl rounded-lg"
              >
                <FaArrowLeft size={20} />
              </button>
              Comment..
            </h3>
            <div className="max-h-[500px] overflow-x-auto hide-scrollbar">
              <CommentCard data={Blog} onAddComment={LoadBlog} />
            </div>
          </div>
        </div>
      )}
      {show && (
        <EditBlog data={Blog} setShow={setShow} onUpdated={handelUpdatedData} />
      )}
    </div>
  );
}

export default BlogCard;
