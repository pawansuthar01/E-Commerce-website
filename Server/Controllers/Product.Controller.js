import Notification from "../module/Notification.module.js";
import Product from "../module/Product.module.js";
import User from "../module/user.module.js";
import AppError from "../utils/AppError.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

export const ProductUpload = async (req, res, next) => {
  const { name, description, price, discount, category, gst } = req.body;
  console.log(discount);
  const { userName } = req.user;

  if (!name || !description || !price || !category) {
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
      ...(discount && { discount }),
      category,
      ...(gst && { gst }),
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
  const {
    name,
    orderCount,
    description,
    price,
    images,
    index,
    discount,
    category,
    gst,
    stock,
  } = req.body;
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

      ...(discount && { discount }),
      ...(category && { category }),
      ...(gst && { gst }),
      ...(stock && { stock }),
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

    // Regex patterns for matching query
    const regex1 = /(\w+)\s*under\s*(\d+)/; // Format: name under price
    const regex2 = /^([a-zA-Z]+)\s*(\d+)$/;
    const cleanQuery = query.trim();
    const match1 = cleanQuery.match(regex1);
    const match2 = cleanQuery.match(regex2);
    if (match1) {
      name = match1[1];
      maxPrice = Number(match1[2]);
    } else if (match2) {
      name = match2[1];
      maxPrice = Number(match2[2]);
    } else if (!isNaN(Number(query))) {
      maxPrice = Number(query);
    } else {
      name = query;
    }

    if (name) {
      filter.$or = [
        { name: { $regex: new RegExp(name, "i") } }, // Correct $regex syntax
        { category: { $regex: new RegExp(name, "i") } },
      ];
    }
    if (maxPrice) {
      filter.price = { $lte: maxPrice };
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
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
    return next(new AppError("Username is required.", 400));
  }

  if (!id) {
    return next(new AppError("Product ID is required.", 400));
  }

  try {
    const product = await Product.findOne({
      _id: id,
    });

    if (!product) {
      return next(new AppError("Product not found.", 400));
    }

    const likeIndex = product.ProductLikes.findIndex(
      (like) => like.userName === userName
    );

    if (likeIndex !== -1) {
      if (product.ProductLikes[likeIndex].ProductLike === true) {
        product.ProductLikes.splice(likeIndex, 1);
      } else {
        product.ProductLikes[likeIndex].ProductLike = true;
      }
    } else {
      product.ProductLikes.push({ ProductLike: true, userName: userName });
    }

    product.likeCount = product.ProductLikes.filter(
      (like) => like.ProductLike === true
    ).length;

    product.ProductLikes = product.ProductLikes.map((like) => ({
      ...like,
      ProductLike:
        typeof like.ProductLike === "boolean" ? like.ProductLike : false, // enforce boolean
    }));

    await product.save();

    res.status(200).json({
      success: true,
      product,
      message: "Product successfully liked or disliked.",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export const checkInStock = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return next(new AppError("productId is required ..", 400));

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock !== "In stock") {
      return res.status(400).json({
        success: false,
        message: `Product ${product.name} is out of stock.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Product ${product.name} is in stock.`,
    });
  } catch (error) {
    return next(new AppError(error.message || error), 400);
  }
};
