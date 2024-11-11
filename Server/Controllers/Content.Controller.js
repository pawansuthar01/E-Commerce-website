import Post from "../module/Post.module.js";
import Reel from "../module/Reel.module.js";
import AppError from "../utils/AppError.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

export const PostUpload = async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return next(new AppError("All fields are required", 400));
  }

  const post = await Post.create({
    title,
    description,

    Post: {
      public_id: "this one time use",
      secure_url: "this one time use",
    },
  });

  if (!post) {
    return next(
      new AppError("Post is Upload is fail..., please try again", 400)
    );
  }

  if (req.file) {
    try {
      const PostUpload = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "Post",
      });

      if (PostUpload) {
        post.Post.public_id = PostUpload.public_id;

        post.Post.secure_url = PostUpload.secure_url;
      }
      fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      fs.rm(`uploads/${req.file.filename}`);

      return next(
        new AppError(
          JSON.stringify(error.message) || "file is not uploaded",
          400
        )
      );
    }
  }

  await post.save();

  res.status(201).json({
    success: true,
    message: "Post  successfully Upload...",
    post,
  });
};

export const ReelUpload = async (req, res, next) => {
  const { title, description } = req.body;

  if (!description || !title) {
    return next(new AppError("All filed is required..", 400));
  }
  if (!req.file) {
    return next(new AppError("post is  required..", 400));
  }

  try {
    const reel = await Reel.create({
      title,

      description,
      Reel: {},
    });
    if (!reel) {
      return next(
        new AppError(" Reel is upload failed , Please try again..", 400)
      );
    }
    try {
      const ReelUpload = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "Reel",
        chunk_size: 104857600,
        resource_type: "video",
      });
      if (ReelUpload) {
        reel.Reel.public_id = ReelUpload.public_id;
        reel.Reel.secure_url = ReelUpload.secure_url;
      }
      fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      fs.rm(`uploads/${req.file.filename}`);
      return next(
        new AppError(`file upload file try again ${error.message}`, 400)
      );
    }
    await reel.save();
    res.status(200).json({
      success: true,
      data: reel,
      Message: "successfully Reel...",
    });
  } catch (error) {
    new AppError(error.message, 400);
  }
};
export const getReelGet = async (req, res, next) => {
  try {
    const getAllReelCount = await Reel.countDocuments();
    const getAllReel = await Reel.find({});
    res.status(200).json({
      Success: true,
      getAllReelCount,
      getAllReel,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const getAllPost = async (req, res, next) => {
  try {
    const AllPostGetCount = await Post.countDocuments();
    const AllPostGet = await Post.find({});
    res.status(200).json({
      Success: true,
      AllPostGetCount,
      AllPostGet,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
