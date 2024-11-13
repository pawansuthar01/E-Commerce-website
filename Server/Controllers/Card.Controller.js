import Product from "../module/Product.module.js";
import User from "../module/use.module.js";
import AppError from "../utils/AppError.js";

export const AddCardProduct = async (req, res, next) => {
  const { productId } = req.body;
  const { id } = req.user;
  if (!id || !productId) {
    return next(new AppError("all filed is required..", 400));
  }

  try {
    const FindProduct = await Product.findById(productId);
    if (!FindProduct) {
      return next(new AppError("Product is not Found..", 400));
    }
    const userFind = await User.findById(id);
    if (!userFind) {
      return next(new AppError("user is not Found..", 400));
    }
    userFind.walletAddProducts.push({
      product: productId,
    });
    await userFind.save();
    res.status(200).json({
      success: true,
      userFind,
      message: "successfully add product in wallet..",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const removeCardProduct = async (req, res, next) => {
  const { productId } = req.body;
  const { id } = req.user;
  if (!id || !productId) {
    return next(new AppError("all filed is required..", 400));
  }
  try {
    const FindProduct = await Product.findById(productId);
    if (!FindProduct) {
      return next(new AppError("Product is not Found..", 400));
    }
    const userFind = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $pull: {
          walletAddProducts: { _id: productId },
        },
      },
      {
        runValidators: true,
      }
    );

    if (!userFind) {
      return next(new AppError("user is not Found..", 400));
    }
    userFind.walletAddProducts.push({
      product: productId,
    });
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
