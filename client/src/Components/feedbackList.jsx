import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getFeedback } from "../Redux/Slice/feedbackSlice";

const FeedbackList = () => {
  const dispatch = useDispatch();
  const { Feedback } = useSelector((state) => state?.feedback);
  const { userName } = useSelector((state) => state?.auth);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (Feedback.length == 0) {
        await dispatch(getFeedback());
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        User Feedbacks
      </h2>
      <div className="space-y-6">
        {Feedback?.map((feedback, index) => (
          <div
            key={index}
            className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all"
          >
            {/* Username Display */}
            <div className="flex items-center mb-4 justify-between">
              <span className="text-lg font-medium text-gray-800 dark:text-white">
                {feedback.userName || "Anonymous"}
              </span>
              {feedback.userName == userName && (
                <span className="text-lg font-medium text-gray-800 dark:text-white flex gap-2">
                  <AiOutlineDelete
                    size={26}
                    className="text-red-400"
                    onClick={() => {
                      // Add delete logic
                    }}
                  />
                  <FiEdit
                    size={"26px"}
                    className=" cursor-pointer text-red-400 hover:text-red-300"
                  />
                </span>
              )}
            </div>

            {/* Stars Rating */}
            <div className="flex items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xl ${
                    feedback.rating >= star
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Comment */}
            <p className="text-gray-700 dark:text-gray-300">
              {feedback.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
