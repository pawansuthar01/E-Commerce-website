import Notification from "../module/Notification.module.js";
import Order from "../module/Order.module.js";
import Product from "../module/Product.module.js";
import User from "../module/use.module.js";
import { razorpay } from "../server.js";
import AppError from "../utils/AppError.js";

import crypto from "crypto";
import SendEmail from "../utils/SendEmial.js";

export const CreateOrder = async (req, res, next) => {
  const {
    userId,
    products,
    shippingAddress,
    paymentStatus,
    PaymentMethod,
    totalAmount,
  } = req.body;
  if (!userId || !products || !shippingAddress || !totalAmount) {
    return next(new AppError("All fields are required.", 400));
  }
  console.log();
  const productDetails = await Promise.all(
    products.map(async (product) => {
      const productFound = await Product.findById(product.product);
      if (!productFound) {
        return next(
          new AppError(`Product with ID ${product.product} not found.`, 400)
        );
      }
      return {
        product: productFound._id,
        productDetails: {
          name: productFound.name,
          image: productFound.images[0],
          description: productFound.description,
          price: productFound.price,
        },
        quantity: product.quantity,
        price: productFound.price,
      };
    })
  );

  const newOrder = new Order({
    userId,
    products: productDetails,
    shippingAddress,
    PaymentMethod,
    paymentStatus,
    totalAmount,
  });

  if (!newOrder) {
    return next(new AppError("Failed to create order.", 400));
  }

  await newOrder.save();
  const adminAndAuthors = await User.find({
    role: { $in: ["ADMIN", "AUTHOR"] },
  });
  const notifications = adminAndAuthors.map((user) => ({
    userId: user._id,
    message: `A new order has been placed with Order ID: ${newOrder._id}.`,
    type: "New Order",
  }));
  const path = process.env.FRONTEND_URL;
  const orderConfirmationUrl = `${path}/api/v3/user/order/${newOrder._id}`;
  const subject = "Order Confirmation";
  const message = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #4CAF50;">Thank you for your order!</h2>
    <p>Dear ${shippingAddress.name},</p>
    <p>Your order has been successfully placed! We are thrilled to have the opportunity to serve you.</p>
    <p>Here are your order details:</p>
    <ul>
      <li><strong>Order ID:</strong> ${newOrder._id}</li>
      <li><strong>Total Amount:</strong> ₹${totalAmount}</li>
      <li><strong>Shipping Address:</strong> ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.pinCode}</li>
    </ul>
    <p>You can view or track your order by clicking the link below:</p>
    <p><a href="${orderConfirmationUrl}" style="color: #ffffff; background-color: #4CAF50; padding: 10px 20px; text-decoration: none; border-radius: 5px;" target="_blank">View My Order</a></p>
    <p>If the button above doesn't work, copy and paste this link into your browser:</p>
    <p>${orderConfirmationUrl}</p>
    <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
    <p>Thank you for shopping with us!</p>
    <p>Best regards,</p>
    <p><strong>KGS DOORS</strong></p>
  </div>
`;

  await SendEmail(shippingAddress.email, subject, message);

  await Notification.insertMany(notifications);

  res.status(200).json({
    message: "Order placed successfully.",
    success: true,
    data: newOrder,
  });
};

export const createOrderPayment = async (req, res, next) => {
  try {
    const { totalAmount } = req.body;

    if (!totalAmount || totalAmount <= 0) {
      return next(new AppError("Invalid or missing totalAmount", 400));
    }
    const amountInPaise = totalAmount * 100;
    const MAX_AMOUNT = 500000;
    if (amountInPaise <= MAX_AMOUNT) {
      return next(
        new AppError("Amount exceeds maximum limit allowed by Razorpay", 400)
      );
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return next(new AppError("Failed to create Razorpay order", 500));
    }

    res.status(200).json({
      success: true,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    return next(new AppError(error.message || "Internal Server Error", 500));
  }
};

export const PaymentVerify = async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  try {
    const generated_signature = crypto
      .createHmac("sha256", process.env.SECRET_ID)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      res.status(200).json({ success: true, message: "Payment Verified" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export const UpdateOrder = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { id } = req.params;
    const { data } = req.body;
    if (!id || !data) {
      return next(new AppError("Order ID and update data are required.", 400));
    }
    if (data.shippingAddress && role !== "USER") {
      return next(
        new AppError("Only users can edit the shipping address.", 403)
      );
    }
    if (
      (data.orderStatus || data.paymentStatus) &&
      !(role === "ADMIN" || role === "AUTHOR")
    ) {
      return next(
        new AppError("Only ADMIN or AUTHOR can edit order status.", 403)
      );
    }
    if (
      data.paymentStatus == "Completed" &&
      (!data.name || !data.amount || !data.PaymentDate)
    ) {
      return next(
        new AppError("Payment complete to required name and amount", 403)
      );
    }
    const updateData = {};
    if (data.shippingAddress && role === "USER") {
      updateData.shippingAddress = data.shippingAddress;
    }

    if (data.orderStatus && (role === "ADMIN" || role === "AUTHOR")) {
      updateData.orderStats = data.orderStatus;
    }
    if (data.deliveryDate && (role === "ADMIN" || role === "AUTHOR")) {
      updateData.deliveryDate = data.deliveryDate;
    }

    if (data.paymentStatus && (role === "ADMIN" || role === "AUTHOR")) {
      updateData.paymentStatus = data.paymentStatus;
    }
    if (
      data.paymentStatus == "Completed" &&
      (role === "ADMIN" || role === "AUTHOR")
    ) {
      updateData.paymentStatus = data.paymentStatus;
      updateData.name = data.name;
      updateData.amount = data.amount;
      updateData.PaymentDate = data.PaymentDate;
    }

    const order = await Order.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true }
    );
    if (!order) {
      return next(new AppError("order is does not found..", 400));
    }
    res.status(200).json({
      success: true,
      message: "update Order...",
      data: order,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export const CancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new AppError("all  filed required ", 400));
    }
    const order = await Order.findOneAndUpdate(
      { _id: id },
      { $set: { orderStats: "Canceled" } },
      { new: true }
    );
    if (!order) {
      return next(new AppError("order is does not found..", 400));
    }

    res.status(200).json({
      success: true,
      message: "update Order...",
      data: order,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export const getOrderByID = async (req, res, next) => {
  try {
    const { OrderId: id } = req.params;
    if (!id) {
      return next(new AppError("all flied is required..", 400));
    }
    const OrderExit = await Order.findById(id);

    if (!OrderExit) {
      return next(new AppError("Order Not Found..", 400));
    }
    res.status(200).json({
      success: true,
      message: "successFully Order Get...",
      data: OrderExit,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new AppError("all flied is required..", 400));
    }
    const OrderExit = await Order.find({ userId: id });

    if (!OrderExit) {
      return next(new AppError("Order Not Found..", 400));
    }
    res.status(200).json({
      success: true,
      message: "successFully Order Get...",
      data: OrderExit,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export const AllOrder = async (req, res, next) => {
  try {
    const Orders = await Order.find();
    if (!Orders) {
      return next(new AppError("Order Not Found..", 400));
    }
    res.status(200).json({
      success: true,
      message: "successFully Order Get...",
      data: Orders,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const allOrderPayments = async (req, res, next) => {
  const { count = 10, skip = 0 } = req.query;

  try {
    const allPayments = await razorpay.payments.all({
      count: parseInt(count, 10),
      skip: parseInt(skip, 10),
    });

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const finalMonths = monthNames.reduce((acc, month) => {
      acc[month] = 0;
      return acc;
    }, {});

    // Calculate total amount and aggregate monthly payments
    let totalAmount = 0;
    allPayments.items.forEach((payment) => {
      const paymentDate = new Date(payment.created_at * 1000); // Convert timestamp to date
      const monthName = monthNames[paymentDate.getMonth()];

      totalAmount += payment.amount / 100; // Convert from paise to currency

      if (monthName) {
        finalMonths[monthName] += 1;
      }
    });

    // Generate the monthly sales record array
    const monthlySalesRecord = monthNames.map((month) => finalMonths[month]);

    res.status(200).json({
      success: true,
      message: "All payments fetched successfully",
      allPayments,
      totalAmount, // Include total amount
      finalMonths,
      monthlySalesRecord,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
