import { FaArrowLeft, FaRegComment } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost, LikeAndDisLikePost } from "../Redux/Slice/ContenrSlice";
import { useState, useEffect } from "react";
import CommentCard from "./CommentListCard";

function BlogCard({ data }) {
  const [showCommentForm, setShowCommentForm] = useState(false); // State to toggle comment form visibility

  const dispatch = useDispatch();
  const { userName } = useSelector((state) => state?.auth);

  const productExists = data?.PostLikes?.some(
    (item) => item.userName && item.userName.toString() === userName
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data.title,
        text: data.description,
        url: window.location.href,
      });
    }
  };

  const handleCommentAdded = () => {
    LoadBlog();
  };

  async function LoadBlog() {
    await dispatch(getAllPost());
  }

  async function handelLikeDisLike(id) {
    const res = await dispatch(LikeAndDisLikePost(id));
    if (res) {
      LoadBlog();
    }
  }

  return (
    <div>
      <div className="card card-compact bg-base-100 dark:bg-gray-800 dark:text-white w-96 shadow-xl">
        <figure>
          <img
            src={data.Post.secure_url}
            alt="Shoes"
            className="max-h[250px]"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-black dark:text-white font-medium text-2xl">
            {data.title}
          </h2>
          <p>{data.description}</p>
          <div className="card-actions justify-evenly rounded-sm p-1 text-black dark:text-white font-normal">
            <button
              onClick={() => setShowCommentForm(true)}
              className="rounded-lg font-serif"
            >
              <h1 className="flex gap-1">
                <FaRegComment className="rounded-lg" size={20} />
                <span>Comment...</span>
              </h1>
              {data.numberOfComment}
            </button>
            <button
              onClick={() => handelLikeDisLike(data._id)}
              className="font-serif"
            >
              <h1 className="flex gap-1">
                <FiHeart
                  className={`${
                    productExists
                      ? "text-red-800 dark:text-red-800"
                      : "bg-white"
                  } rounded-lg text-black dark:text-white font-bold`}
                  size={20}
                />
                <span>{productExists ? "Unlike" : "Like"}</span>
              </h1>
              {data.likeCount}
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
              <CommentCard data={data} onAddComment={handleCommentAdded} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogCard;
