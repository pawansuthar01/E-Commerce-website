import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaRegClock, FaRegComment } from "react-icons/fa6";
import { FiHeart, FiShare2 } from "react-icons/fi";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  DeleteBlog,
  getAllPost,
  getPost,
  LikeAndDisLikePost,
} from "../../Redux/Slice/ContentSlice";
import CommentCard from "../CommentListCard";
import { DeleteIcon, EditIcon } from "../../Page/Product/icon";
import EditBlog from "./editBlog";
import { FaRegCommentAlt, FaUserCircle } from "react-icons/fa";

function BlogCard({ data, onDelete }) {
  const navigator = useNavigate();

  const dispatch = useDispatch();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [blog, setBlog] = useState(data);
  const { role, userName } = useSelector((state) => state?.auth);
  useEffect(() => {
    setBlog(data);
  }, [data]);
  const domain =
    window.location.hostname +
    (window.location.port ? `:${window.location.port}` : "");
  const url = `http://${domain}/Blog/${data?._id}`;
  const handleLikeDislike = async (id) => {
    if (!id) return;
    const res = await dispatch(LikeAndDisLikePost(id));

    if (res.payload.success) {
      setBlog(res.payload.FindPost);
    }
  };

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.description,
        url,
      });
    }
  }, [blog, url]);
  const isLiked = blog?.PostLikes?.some((like) => like.userName === userName);
  function UpdatedData(data) {
    setShowEdit(false);
    setBlog(data?.payload?.data);
  }
  return (
    <article className="bg-white w-96 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden  cursor-pointer">
        <img
          onClick={() =>
            navigator(`/blog/${data?._id}`, { state: { ...data } })
          }
          src={blog?.Post?.secure_url}
          alt={blog?.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
        {role && ["ADMIN", "AUTHOR"].includes(role) && (
          <div className="absolute top-4 right-4 flex gap-2 z-30">
            <button
              onClick={() => onDelete(blog._id)}
              className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              aria-label="Delete post"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              onClick={() => setShowEdit(true)}
              className="p-2 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors"
              aria-label="Edit post"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center mb-4">
          <FaUserCircle className="w-10 h-10 text-gray-400" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {blog?.userName || "Anonymous"}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <FaRegClock className="mr-1" />
              {new Date(blog?.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Title and Description */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {blog?.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
          {blog?.description}
        </p>

        {/* Interaction Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowCommentForm(true)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
          >
            <FaRegCommentAlt className="mr-2" />
            <span>{blog?.numberOfComment || 0}</span>
          </button>

          <button
            onClick={() => handleLikeDislike(blog?._id)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
          >
            <FiHeart
              className={`mr-2 ${isLiked ? "fill-current text-red-500" : ""}`}
            />
            <span>{blog?.likeCount || 0}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors"
          >
            <FiShare2 className="mr-2" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Comments</h3>
              <button
                onClick={() => setShowCommentForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaArrowLeft />
              </button>
            </div>
            <CommentCard data={blog} onAddComment={setBlog} />
            {/* Comment Form Component would go here */}
          </div>
        </div>
      )}
      {showEdit && (
        <EditBlog data={blog} setShow={setShowEdit} onUpdated={UpdatedData} />
      )}
    </article>
  );
}

export default BlogCard;
