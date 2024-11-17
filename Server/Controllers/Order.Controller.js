import Order from "../module/Order.module";
import Product from "../module/Product.module";
import AppError from "../utils/AppError";
import razorpay from "razorpay";

export const CreateOrder = async (req, res, next) => {
  const { userId, products, shippingAddress, totalAmount } = req.body;
  try {
    if (!userId || !products || !shippingAddress || !totalAmount) {
      return next(new AppError("all filed is required...", 400));
    }
    const productDetails = await Promise.all(
      products.map(async (product) => {
        const productFound = await Product.findById(product.productId);
        if (!productFound) {
          return next(new AppError("product not Found...", 400));
        }
        return {
          productId: productFound._id,
          quantity: product.quantity,
          price: product.price,
        };
      })
    );
    const newOrder = new Order({
      userId,
      products: productDetails,
      shippingAddress,
      totalAmount,
    });
    if (!newOrder) {
      return next(new AppError("Product fail to Order.. ", 400));
    }
    await newOrder.save();
    res.status(200).json({
      message: "Order SuccessFully...",
      success: true,
      data: newOrder,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const createOrderPayment = async () => {
  const { totalAmount } = req.body;
  try {
    const Option = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `order_rcptid_${Math.random()}`,
    };
    const order = await razorpay.orders.create(Option);
    if (!order) {
      return next(new AppError("order payment not create..", 400));
    }
    res.status(200).json({
      success: true,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
