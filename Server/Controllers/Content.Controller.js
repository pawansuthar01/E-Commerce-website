import Post from "../module/Post.module.js";
import Reel from "../module/Reel.module.js";
import AppError from "../utils/AppError.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
// post //
export const PostUpload = async (req, res, next) => {
  const { title, description } = req.body;
  console.log("this");

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
export const postUpdate = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new AppError("id is required", 400));
    }
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        runValidators: true,
      }
    );
    if (!post) {
      return next(new AppError("post is does not exit,please try again", 400));
    }

    res.status(200).json({
      success: true,
      data: post,
      message: "post successfully update...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const getPost = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("id is required", 400));
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      return next(new AppError("post is does not exit,please try again", 400));
    }
    res.status(200).json({
      success: true,
      data: post,
      message: "successfully get post...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export const deletePostById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("id is required", 400));
  }
  try {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return next(new AppError("post is does not exit,please try again", 400));
    }
    res.status(200).json({
      success: true,

      message: "successfully delete post...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

// reel //
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

export const reelUpdate = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new AppError("id is required", 400));
    }
    const reel = await Reel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        runValidators: true,
      }
    );
    if (!reel) {
      return next(new AppError("Reel is does not exit,please try again", 400));
    }

    res.status(200).json({
      success: true,
      data: reel,
      message: "reel successfully update...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const getReel = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("id is required", 400));
  }
  try {
    const reel = await Reel.findById(id);
    if (!reel) {
      return next(new AppError("reel is does not exit,please try again", 400));
    }
    res.status(200).json({
      success: true,
      data: reel,
      message: "successfully get post...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const deleteReelById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("id is required", 400));
  }
  try {
    const reel = await Reel.findByIdAndDelete(id);
    if (!reel) {
      return next(new AppError("reel is does not exit,please try again", 400));
    }
    res.status(200).json({
      success: true,

      message: "successfully delete reel...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const getAllReel = async (req, res, next) => {
  try {
    const getAllReelCount = await Reel.countDocuments();
    const getAllReel = await Reel.find({}).select("-comments");
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
    const AllPostGet = await Post.find({}).select("-comments");
    res.status(200).json({
      Success: true,
      AllPostGetCount,
      AllPostGet,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
// comment api//for post///
export const addCommentPost = async (req, res, next) => {
  const { comment, userName } = req.body;
  const { id } = req.params;
  if (!comment || !userName) {
    return next(new AppError("all filed is required", 400));
  }
  console.log(id);
  if (!id) {
    return next(new AppError("id is required", 400));
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return next(new AppError("post is does not exit,please try again", 400));
    }
    post.comments.push({
      userName: userName,
      comment: comment,
    });

    post.numberOfComment = post.comments.length;
    await post.save();
    res.status(200).json({
      success: true,
      data: post,
      numberOfComment: post.numberOfComment,
      message: "successfully comment ...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const exitCommentInPostById = async (req, res, next) => {
  const { comment, userName } = req.body;
  const { postId, commentId } = req.query;
  if (!userName) {
    return next(new AppError("username is required", 400));
  }
  if (!postId || !commentId) {
    return next(new AppError("postId and CommentId is required", 400));
  }
  try {
    const updateComment = await Post.findOneAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
        "comments.userName": userName,
      },
      { $set: { "comments.$.comment": comment } },
      {
        runValidators: true,
      },
      { new: true }
    );
    if (!updateComment) {
      return next(new AppError("post does not Update..,please try again", 400));
    }
    res.status(200).json({
      success: true,
      comment,
      message: "comment successfully edit...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const deleteCommentInPostById = async (req, res, next) => {
  const { userName } = req.body;
  const { postId, commentId } = req.query;
  if (!postId || !commentId) {
    return next(new AppError("postId and CommentId is required", 400));
  }
  try {
    const findComment = await Post.findOne({
      _id: postId,
      "comments._id": commentId,
      "comments.userName": userName,
    });
    if (!findComment) {
      return next(new AppError("comment is not find..,please try again", 400));
    }
    const findCommentDelete = await Post.findByIdAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
        "comments.userName": userName,
      },
      {
        $pull: {
          comments: { _id: commentId, userName: userName },
        },
        $inc: { numberOfComments: -1 },
      }
    );
    if (!findCommentDelete) {
      return next(
        new AppError("comment does not delete..,please try again", 400)
      );
    }
    findComment.numberOfComment = findComment.comments.length - 1;
    await findComment.save();
    res.status(200).json({
      success: true,

      message: "comment successfully delete...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
// comment api for reel//
export const addCommentReel = async (req, res, next) => {
  const { comment, userName } = req.body;
  const { id } = req.params;
  if (!comment || !userName) {
    return next(new AppError("all filed is required", 400));
  }
  console.log(id);
  if (!id) {
    return next(new AppError("id is required", 400));
  }

  try {
    const reel = await Reel.findById(id);

    if (!reel) {
      return next(new AppError("reel is does not exit,please try again", 400));
    }
    reel.comments.push({
      userName: userName,
      comment: comment,
    });

    reel.numberOfComment = reel.comments.length;
    await reel.save();
    res.status(200).json({
      success: true,
      data: reel,
      numberOfComment: reel.numberOfComment,
      message: "successfully comment ...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const exitCommentInReelById = async (req, res, next) => {
  const { comment, userName } = req.body;
  const { postId, commentId } = req.query;
  if (!userName) {
    return next(new AppError("username is required", 400));
  }
  if (!postId || !commentId) {
    return next(new AppError("postId and CommentId is required", 400));
  }
  try {
    const updateComment = await Reel.findOneAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
        "comments.userName": userName,
      },
      { $set: { "comments.$.comment": comment } },
      {
        runValidators: true,
      },
      { new: true }
    );
    if (!updateComment) {
      return next(
        new AppError("reel comment does not Update..,please try again", 400)
      );
    }
    res.status(200).json({
      success: true,
      comment,
      message: "comment successfully edit...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
export const deleteCommentInReelById = async (req, res, next) => {
  const { userName } = req.body;
  const { postId, commentId } = req.query;
  if (!postId || !commentId) {
    return next(new AppError("postId and CommentId is required", 400));
  }
  try {
    const findComment = await Reel.findOne({
      _id: postId,
      "comments._id": commentId,
      "comments.userName": userName,
    });
    if (!findComment) {
      return next(new AppError("comment is not find..,please try again", 400));
    }
    const findCommentDelete = await Reel.findByIdAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
        "comments.userName": userName,
      },
      {
        $pull: {
          comments: { _id: commentId, userName: userName },
        },
        $inc: { numberOfComments: -1 },
      }
    );
    if (!findCommentDelete) {
      return next(
        new AppError("comment does not delete..,please try again", 400)
      );
    }
    findComment.numberOfComment = findComment.comments.length - 1;
    await findComment.save();
    res.status(200).json({
      success: true,

      message: "comment successfully delete...",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
