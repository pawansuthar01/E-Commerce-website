import Feedback from "../module/feedbacl.module.js";
import AppError from "../utils/AppError.js";

export const SubmitFeedback = async (req, res, next) => {
  const { rating, comment, userName } = req.body.data;
  console.log(req.body);
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

export const getFeedback = async (req, res, next) => {
  try {
    const data = await Feedback.find();
    if (!data) {
      return next(
        new AppError("something went wrong , please tyr Again  ", 400)
      );
    }
    res.status(201).json({
      success: true,
      data: data,
      message: "Feedback get successfully!",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
