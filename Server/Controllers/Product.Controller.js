import Notification from "../module/Notification.module.js";
import Product from "../module/Product.module.js";
import User from "../module/use.module.js";
import AppError from "../utils/AppError.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

export const ProductUpload = async (req, res, next) => {
  const { name, description, price } = req.body;
  const { userName } = req.user;

  // Validate required fields
  if (!name || !description || !price) {
    return next(new AppError("All fields are required", 400));
  }

  try {
    let imageUploads = [];
    if (req.files && req.files.length > 0) {
      // Upload images to Cloudinary
      imageUploads = await Promise.all(
        req.files.map(async (file) => {
          const uploadResult = await cloudinary.v2.uploader.upload(file.path, {
            folder: "Product",
          });

          // Remove the local file after successful upload
          await fs.rm(file.path, { force: true });

          // Return Cloudinary image details
          return {
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
          };
        })
      );
    }

    // Ensure at least one image is uploaded
    if (imageUploads.length === 0) {
      return next(
        new AppError("Image upload failed. No product was created.", 400)
      );
    }

    // Create the product after successful image uploads
    const product = await Product.create({
      name,
      description,
      price,
      images: imageUploads,
    });

    // Notify users
    const users = await User.find({}, "_id");
    if (users && users.length > 0) {
      const notifications = users.map((user) => ({
        userId: user._id,
        message: `${userName} has uploaded a new product: "${product.name}"`,
        type: "new product",
        read: false,
      }));

      await Notification.insertMany(notifications);
    }

    // Send success response
    res.status(200).json({
      success: true,
      data: product,
      message:
        "Product uploaded successfully with multiple images and notifications sent.",
    });
  } catch (error) {
    // Cleanup uploaded files in case of error
    if (req.files) {
      await Promise.all(
        req.files.map((file) => fs.rm(file.path, { force: true }))
      );
    }

    return next(new AppError(`Product upload failed: ${error.message}`, 400));
  }
};

export const productUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { data } = req.body;
  console.log(data);
  if (!id) {
    return next(new AppError("Product ID is required for update.", 400));
  }

  try {
    if (data.orderCount) {
      const currentProduct = await Product.findById(id);

      if (!currentProduct) {
        return next(new AppError("Product not found.", 404));
      }
      data.orderCount = currentProduct.orderCount + data.orderCount;
    }

    // Update the product with the provided data
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true } // Return updated document and validate inputs
    );

    if (!updatedProduct) {
      return next(
        new AppError("Failed to update the product. Please try again.", 400)
      );
    }
    console.log(updatedProduct);
    res.status(200).json({
      success: true,
      message: "Product successfully updated.",
      data: updatedProduct,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const productDelete = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  if (!id) {
    return next(new AppError("product update to id is required..", 400));
  }
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return next(
        new AppError(" product failed  to Delete.., Please try again..", 400)
      );
    }
    res.status(200).json({
      success: true,
      message: "product successfully Delete...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const getSearchProduct = async (req, res, next) => {
  const { name } = req.params;
  console.log(req.params);
  if (!name) {
    return next(new AppError("product Search for   required name  ...", 400));
  }
  try {
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });
    if (!products) {
      return next(
        new AppError(" product failed  to get.., Please try again..", 400)
      );
    }
    res.status(200).json({
      success: true,
      data: products,
      message: " search product successfully get...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const getProduct = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("product update to id is required..", 400));
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      return next(
        new AppError(" product failed  to get.., Please try again..", 400)
      );
    }
    res.status(200).json({
      success: true,
      data: product,
      message: "product successfully get...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const getAllProduct = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 50; // Default to 50 products per page
    const skip = (page - 1) * limit;

    const products = await Product.find({}).skip(skip).limit(limit);
    const popularProducts = await Product.find()
      .sort({ orderCount: -1 })
      .limit(5);
    const totalProducts = await Product.countDocuments();

    if (!products) {
      return next(
        new AppError("Products failed to load. Please try again.", 400)
      );
    }

    res.status(200).json({
      success: true,
      data: products,
      message: "Products successfully retrieved.",
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      popularProducts,
      currentPage: page,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

// // product like and dislike Api//
export const LikeAndDisLikeProduct = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);
  const { userName } = req.user;
  if (!userName) {
    return next(new AppError("username is required ..", 400));
  }
  if (!id) {
    return next(new AppError("postId is required ..", 400));
  }
  try {
    const product = await Product.findOne({
      _id: id,
    });

    if (!product) {
      return next(new AppError("product does not found. ..", 400));
    }
    const likeIndex = product.ProductLikes.findIndex(
      (like) => like.userName === userName
    );

    if (likeIndex !== -1) {
      if (product.ProductLikes[likeIndex].ProductLike === "TRUE") {
        product.ProductLikes.splice(likeIndex, 1);
        console.log("successFully disLike ");
      } else {
        product.ProductLikes[likeIndex].ProductLike = "TRUE";
        console.log("successFully Like ");
      }
    } else {
      product.ProductLikes.push({ userName, ProductLike: "TRUE" });
      console.log("successFully Like in full data ");
    }
    product.likeCount = product.ProductLikes.filter(
      (like) => like.ProductLike == "TRUE"
    ).length;
    await product.save();
    res.status(200).json({
      success: true,
      product,
      message: "product successfully like...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
