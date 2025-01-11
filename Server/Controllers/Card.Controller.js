import Product from "../module/Product.module.js";
import User from "../module/use.module.js";
import AppError from "../utils/AppError.js";

export const AddCardProduct = async (req, res, next) => {
  const { productId } = req.body;
  const { id } = req.user;

  if (!id || !productId) {
    return next(new AppError("All fields are required.", 400));
  }

  try {
    const FindProduct = await Product.findById(productId);
    if (!FindProduct) {
      return next(new AppError("Product not found.", 404));
    }

    const userFind = await User.findById(id);
    if (!userFind) {
      return next(new AppError("User not found.", 404));
    }

    const productExists = userFind.walletAddProducts.some(
      (item) => item.product && item.product.toString() === productId
    );

    if (productExists) {
      return next(new AppError("Product is already in the wallet.", 400));
    }

    const productImage = FindProduct.images
      ? FindProduct.images[0]
      : { public_id: null, secure_url: null };

    userFind.walletAddProducts.push({
      product: FindProduct._id,
      name: FindProduct.name,
      gst: FindProduct.gst,
      stock: FindProduct?.stock,
      discount: FindProduct?.discount,
      price: FindProduct.price,
      description: FindProduct.description,
      image: {
        public_id: productImage.public_id,
        secure_url: productImage.secure_url,
      },
    });
    await userFind.save();

    res.status(200).json({
      success: true,
      user: userFind,
      message: "Product successfully added to wallet.",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const removeCardProduct = async (req, res, next) => {
  const { productId } = req.body;
  const { id } = req.user;
  if (!id || !productId) {
    return next(new AppError("all filed is required..", 400));
  }
  try {
    const userFind = await User.findOneAndUpdate(
      { _id: id },
      { $pull: { walletAddProducts: { product: productId } } },
      { new: true }
    );

    if (!userFind) {
      return next(new AppError("user is not Found..", 400));
    }

    await userFind.save();
    res.status(200).json({
      success: true,
      userFind,
      message: "successfully remove product in wallet..",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export const AllRemoveCardProduct = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("all filed is required..", 400));
  }
  try {
    const userFind = await User.findOneAndUpdate(
      { _id: id },
      { $set: { walletAddProducts: [] } },
      { new: true }
    );

    if (!userFind) {
      return next(new AppError("user is not Found..", 400));
    }

    await userFind.save();
    res.status(200).json({
      success: true,
      userFind,
      message: "successfully All product remove in wallet..",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
