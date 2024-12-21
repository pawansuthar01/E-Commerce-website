import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getFeedback } from "../Redux/Slice/feedbackSlice";

const FeedbackList = () => {
  const dispatch = useDispatch();
  const { Feedback: feedback } = useSelector((state) => state?.feedback);
  const { userName } = useSelector((state) => state?.auth);

  const [displayedFeedback, setDisplayedFeedback] = useState([]); // Feedback to display
  const [filter, setFilter] = useState("all"); // Filter (all, 1-3 stars, 4-5 stars)
  const [page, setPage] = useState(1); // Current page

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (feedback.length === 0) {
        await dispatch(getFeedback({ page, limit: 0 }));
      }
    };
    fetchFeedbacks();
  }, [dispatch, feedback.length, page]);

  // Apply filtering and sorting
  useEffect(() => {
    const filteredFeedback =
      filter === "1-3"
        ? feedback.filter((fb) => fb.rating >= 1 && fb.rating <= 3)
        : filter === "4-5"
        ? feedback.filter((fb) => fb.rating >= 4 && fb.rating <= 5)
        : feedback;

    const sortedFeedback = [
      ...filteredFeedback.filter((fb) => fb.userName === userName), // Current user's feedback
      ...filteredFeedback.filter((fb) => fb.userName !== userName), // Other feedback
    ];

    const startIndex = (page - 1) * 10;
    const paginatedFeedback = sortedFeedback.slice(
      0,
      startIndex + 10 // Accumulate feedback for pagination
    );

    setDisplayedFeedback(paginatedFeedback);
  }, [filter, page, feedback, userName]);

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to page 1 on filter change
  };

  // Load more feedback
  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await dispatch(getFeedback({ page: nextPage, limit: 0 })); // Fetch next page of feedback
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        User Feedbacks
      </h2>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleFilterChange("all")}
        >
          All Feedback
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "1-3"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleFilterChange("1-3")}
        >
          1-3 Stars
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "4-5"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleFilterChange("4-5")}
        >
          4-5 Stars
        </button>
      </div>

      {/* Feedback List */}
      <div className="space-y-6">
        {displayedFeedback?.map((fb, index) => (
          <div
            key={index}
            className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all"
          >
            {/* Username Display */}
            <div className="flex items-center mb-4 justify-between">
              <span className="text-lg font-medium text-gray-800 dark:text-white">
                {fb.userName || "Anonymous"}
              </span>
              {fb.userName === userName && (
                <span className="flex gap-2">
                  <AiOutlineDelete
                    size={26}
                    className="text-red-400 cursor-pointer"
                    onClick={() => {
                      // Add delete logic
                    }}
                  />
                  <FiEdit
                    size={26}
                    className="cursor-pointer text-blue-400 hover:text-blue-300"
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
                    fb.rating >= star ? "text-yellow-400" : "text-gray-400"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Comment */}
            <p className="text-gray-700 dark:text-gray-300">{fb.comment}</p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {displayedFeedback.length < feedback.length && (
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={loadMore}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
