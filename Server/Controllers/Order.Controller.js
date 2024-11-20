import Order from "../module/Order.module.js";
import Product from "../module/Product.module.js";
import AppError from "../utils/AppError.js";
import Razorpay from "razorpay";

export const CreateOrder = async (req, res, next) => {
  const { userId, products, shippingAddress, totalAmount } = req.body;
  console.log(shippingAddress);
  if (!userId || !products || !shippingAddress || !totalAmount) {
    return next(new AppError("All fields are required.", 400));
  }

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
          image: productFound.image,
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
    totalAmount,
  });

  if (!newOrder) {
    return next(new AppError("Failed to create order.", 400));
  }

  await newOrder.save();

  res.status(200).json({
    message: "Order placed successfully.",
    success: true,
    data: newOrder,
  });
};
// export const createOrderPayment = async (req, res, next) => {
//   console.log(req.body);
//   const { totalAmount } = req.body;
//   try {
//     if (!totalAmount) {
//       return next(new AppError("totalAmount is required", 400));
//     }
//     const Option = {
//       amount: totalAmount * 100,
//       currency: "INR",
//       receipt: `order_rcptid_${Math.random()}`,
//     };

//     const order = await razorpay.Order.create(Option);
//     if (!order) {
//       return next(new AppError("order payment not create..", 400));
//     }
//     res.status(200).json({
//       success: true,
//       orderId: order.id,
//       currency: order.currency,
//       amount: order.amount,
//     });
//   } catch (error) {
//     return next(new AppError(error.message, 400));
//   }
// };
//
// import AppError from "../utils/AppError.js"; // Ensure you have a proper AppError utility

// Initialize Razorpay instance

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID, // Use environment variables for security
  key_secret: process.env.SECRET_ID,
});
// console.log("Razorpay Key ID:", process.env.KEY_ID);
// console.log("Razorpay Key Secret:", process.env.SECRET_ID);

export const createOrderPayment = async (req, res, next) => {
  try {
    const { totalAmount } = req.body;

    // Validate totalAmount
    if (!totalAmount || totalAmount <= 0) {
      return next(new AppError("Invalid or missing totalAmount", 400));
    }

    // Configure payment options
    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`, // Generate unique receipt ID
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    if (!order) {
      return next(new AppError("Failed to create Razorpay order", 500));
    }
    console.log(order.id);
    // Send success response
    res.status(200).json({
      success: true,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return next(new AppError(error.message || "Internal Server Error", 500));
  }
};

export const UpdateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    if (!id) {
      return next(new AppError("all  filed required ", 400));
    }
    const order = await Order.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
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
