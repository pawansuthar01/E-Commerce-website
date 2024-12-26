import Notification from "../module/Notification.module.js";
import Product from "../module/Product.module.js";
import User from "../module/use.module.js";
import AppError from "../utils/AppError.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

export const ProductUpload = async (req, res, next) => {
  const { name, description, price } = req.body;
  const { userName } = req.user;

  if (!name || !description || !price) {
    return next(new AppError("All fields are required", 400));
  }

  try {
    let imageUploads = [];
    if (req.files && req.files.length > 0) {
      imageUploads = await Promise.all(
        req.files.map(async (file) => {
          const uploadResult = await cloudinary.v2.uploader.upload(file.path, {
            folder: "Product",
          });

          await fs.rm(file.path, { force: true });

          return {
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
          };
        })
      );
    }

    if (imageUploads.length === 0) {
      return next(
        new AppError("Image upload failed. No product was created.", 400)
      );
    }

    const product = await Product.create({
      name,
      description,
      price,
      images: imageUploads,
    });

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

    res.status(200).json({
      success: true,
      data: product,
      message:
        "Product uploaded successfully with multiple images and notifications sent.",
    });
  } catch (error) {
    if (req.files) {
      await Promise.all(
        req.files.map((file) => fs.rm(file.path, { force: true }))
      );
    }

    return next(new AppError(`Product upload failed: ${error.message}`, 400));
  }
};
export const OrderCount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderCount: count } = req.body;

    if (!id) {
      return next(new AppError("Product ID is required for update.", 400));
    }
    if (!count) {
      return next(new AppError("Order count is required for update.", 400));
    }

    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return next(new AppError("Product not found.", 404));
    }

    currentProduct.orderCount += count;
    await currentProduct.save();

    res.status(200).json({
      success: true,
      message: "Product successfully updated.",
      data: currentProduct.orderCount,
    });
  } catch (error) {
    next(error);
  }
};

export const productUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { name, orderCount, description, price, images, index } = req.body;
  if (!id) {
    return next(new AppError("Product ID is required for update.", 400));
  }

  try {
    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return next(new AppError("Product not found.", 404));
    }

    if (orderCount) {
      currentProduct.orderCount += orderCount;
    }

    let updatedImageData = [...currentProduct.images];

    if (req.files && req.files.length > 0) {
      const files = req.files;

      if (index && Array.isArray(index)) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          if (index[i] !== undefined) {
            const imageIndex = parseInt(index[i], 10);

            const uploadResult = await cloudinary.v2.uploader.upload(
              file.path,
              {
                folder: "Product",
              }
            );

            await fs.rm(file.path, { force: true });

            updatedImageData[imageIndex] = {
              public_id: uploadResult.public_id,
              secure_url: uploadResult.secure_url,
            };
          }
        }
      } else if (index !== undefined) {
        for (const file of files) {
          const uploadResult = await cloudinary.v2.uploader.upload(file.path, {
            folder: "Product",
          });

          await fs.rm(file.path, { force: true });

          updatedImageData[parseInt(index, 10)] = {
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
          };
        }
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(price && { price }),
      ...(description && { description }),
      images: updatedImageData,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(
        new AppError("Failed to update the product. Please try again.", 400)
      );
    }

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
  const { query } = req.query;
  try {
    let filter = {};
    let name = "";
    let maxPrice = null;

    const regex = /(\w+)\s*under\s*(\d+)/;
    const match = query.match(regex);

    if (match) {
      name = match[1];
      maxPrice = match[2];
    } else {
      name = query;
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (maxPrice) {
      filter.price = { $lte: Number(maxPrice) };
    }

    const products = await Product.find(filter);

    if (!products || products.length === 0) {
      return next(new AppError("No products found. Please try again.", 404));
    }

    res.status(200).json({
      success: true,
      data: products,
      message: "Products fetched successfully.",
    });
  } catch (error) {
    return next(
      new AppError(`Failed to fetch products: ${error.message}`, 500)
    );
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
      } else {
        product.ProductLikes[likeIndex].ProductLike = "TRUE";
      }
    } else {
      product.ProductLikes.push({ userName, ProductLike: "TRUE" });
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
