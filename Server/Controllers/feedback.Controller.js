import Feedback from "../module/feedbacl.module.js";
import Message from "../module/massage.module.js";
import AppError from "../utils/AppError.js";

export const SubmitFeedback = async (req, res, next) => {
  const { rating, comment, userName } = req.body;

  try {
    if (!rating || !comment || !userName) {
      return next(new AppError("feedback all filed is required ", 400));
    }
    const feedback = new Feedback({ rating, comment, userName });
    if (!feedback) {
      return next(
        new AppError("something went wrong , please tyr Again  ", 400)
      );
    }

    await feedback.save();
    res
      .status(201)
      .json({ success: true, message: "Feedback submitted successfully!" });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const MessageSubmit = async (req, res, next) => {
  const { id } = req.user;
  const { message, number, email } = req.body;
  try {
    if (!id) {
      return next(new AppError("userId is required ", 400));
    }
    if (!message || !number || !email) {
      return next(new AppError("message all filed is required ", 400));
    }
    const messageSubmit = new Message({ userId: id, message, email, number });
    if (!messageSubmit) {
      return next(
        new AppError("something went wrong , please tyr Again  ", 400)
      );
    }

    await messageSubmit.save();
    res.status(201).json({
      success: true,
      message: "message submitted successfully!",
      data: messageSubmit,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export const getFeedback = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const data = await Feedback.find({}).skip(skip).limit(parseInt(limit));
    const TotalFeedbackCount = await Feedback.countDocuments({});
    const happyCustomers = await Feedback.countDocuments({
      rating: { $gte: 3 },
    });
    if (!data) {
      return next(
        new AppError("something went wrong , please tyr Again  ", 400)
      );
    }
    res.status(201).json({
      success: true,
      data: data,
      TotalFeedbackCount,
      happyCustomers,
      currentPage: page,
      totalPages: Math.ceil(TotalFeedbackCount / limit),
      message: "Feedback get successfully!",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
