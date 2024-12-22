import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getFeedback, SubmitFeedback } from "../Redux/Slice/feedbackSlice";

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const { userName } = useSelector((state) => state?.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment || !userName) {
      toast.error("Please provide both a rating and a comment.");
      return;
    }

    setIsSubmitting(true);
    await dispatch(SubmitFeedback({ rating, comment, userName }));
    setIsSubmitting(false);
    await dispatch(getFeedback({ page: 0, limit: 0 }));
    setRating(0);
    setComment(" ");
  };

  return (
    <div className="w-full max-w-md dark:text-white text-black p-6 mx-auto rounded-lg shadow-[0_0_1px_black] dark:shadow-[0_0_1px_white] my-10">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Submit Your Feedback
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Rating
          </label>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={`text-xl ${
                  rating >= star ? "text-yellow-400" : "text-gray-400"
                }`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full p-2 mt-2 border rounded-md border-gray-300 focus:ring-2 outline-none focus:ring-blue-500 dark:text-gray-200 dark:bg-gray-700"
            placeholder="Your feedback here..."
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-500 text-white rounded-lg focus:outline-none ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
