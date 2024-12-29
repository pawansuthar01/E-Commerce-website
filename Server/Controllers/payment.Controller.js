import Order from "../module/Order.module.js";
import AppError from "../utils/AppError.js";

export const getPaymentData = async (req, res, next) => {
  try {
    const paymentData = await Order.find(
      {},
      "PaymentMethod paymentStatus name amount totalAmount PaymentDate shippingAddress"
    ).lean();

    if (!paymentData) {
      return next(new AppError("does not payment data get", 400));
    }
    res.status(200).json({
      success: true,
      data: paymentData,
      message: "payment data get successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
