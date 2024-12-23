import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  PostData: [],
  PostCount: "",
};
export const getAllPost = createAsyncThunk("/content/post", async () => {
  try {
    const token = localStorage.getItem("Authenticator");

    const res = axiosInstance.get(
      "/api/v3/Content/Post",

      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    toast.promise(res, {
      loading: "please wait ! loading blog...",
      success: (data) => {
        return data?.data?.message;
      },

      error: (data) => {
        return data?.response?.data?.message;
      },
    });

    return (await res).data;
  } catch (e) {
    toast.error(e?.response?.message);
  }
});

export const LikeAndDisLikePost = createAsyncThunk(
  "/Content/likeDisLikePost",
  async (id) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = axiosInstance.put(
        `/api/v3/Content/Post/${id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      toast.promise(res, {
        loading: "please wait! like Post..",
        success: (data) => {
          return data?.data?.message;
        },

        error: (data) => {
          return data?.response?.data?.message;
        },
      });
      return (await res).data;
    } catch (e) {
      toast.error(e?.response?.message);
    }
  }
);
export const getPost = createAsyncThunk("/Content/get/post", async (id) => {
  try {
    const token = localStorage.getItem("Authenticator");

    const res = axiosInstance.get(
      `/api/v3/Content/Post/${id}`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    toast.promise(res, {
      loading: "please wait! get Post..",
      success: (data) => {
        return data?.data?.message;
      },

      error: (data) => {
        return data?.response?.data?.message;
      },
    });
    return (await res).data;
  } catch (e) {
    toast.error(e?.response?.message);
  }
});
export const deleteCommentById = createAsyncThunk(
  "/Content/Delete/CommentById",
  async (data) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = axiosInstance.delete(
        `/api/v3/Content/Post/?postId=${data.postId}&commentId=${data.commentId}`,

        {
          data: { userName: data.userName },
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      toast.promise(res, {
        loading: "please wait! Delete Comment..",
        success: (data) => {
          return data?.data?.message;
        },

        error: (data) => {
          return data?.response?.data?.message;
        },
      });
      return (await res).data;
    } catch (e) {
      toast.error(e?.response?.message);
    }
  }
);

export const AddCommentToPost = createAsyncThunk(
  "/Content/CommentAdd/Post",
  async (data) => {
    const token = localStorage.getItem("Authenticator");

    try {
      const res = axiosInstance.post(
        `/api/v3/Content/Post/${data.id}`,
        {
          comment: data.comment,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      toast.promise(res, {
        loading: "please wait! comment send..",
        success: (data) => {
          return data?.data?.message;
        },

        error: (data) => {
          return data?.response?.data?.message;
        },
      });
      return (await res).data;
    } catch (e) {
      toast.error(e?.response?.message);
    }
  }
);
export const AddCommentToReplay = createAsyncThunk(
  "/Content/CommentReplay/Post",
  async (data) => {
    const token = localStorage.getItem("Authenticator");

    try {
      const res = axiosInstance.put(
        `/api/v3/Content/posts/${data.postId}/comments/${data.commentId}/AddNewComment`,
        {
          reply: data.reply,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      toast.promise(res, {
        loading: "please wait! replay send..",
        success: (data) => {
          return data?.data?.message;
        },

        error: (data) => {
          return data?.response?.data?.message;
        },
      });
      return (await res).data;
    } catch (e) {
      toast.error(e?.response?.message);
    }
  }
);

export const removeReplayToComment = createAsyncThunk(
  "/Content/CommentReplayRemove/Post",
  async (data) => {
    const token = localStorage.getItem("Authenticator");

    try {
      const res = axiosInstance.delete(
        `/api/v3/Content/posts/${data.postId}/comments/${data.commentId}/replays/${data.replayId}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      toast.promise(res, {
        loading: "please wait! replay delete..",
        success: (data) => {
          return data?.data?.message;
        },

        error: (data) => {
          return data?.response?.data?.message;
        },
      });
      return (await res).data;
    } catch (e) {
      toast.error(e?.response?.message);
    }
  }
);
export const exitCommentInPostById = createAsyncThunk(
  "/Content/CommentEdit/Post",
  async (data) => {
    try {
      const token = localStorage.getItem("Authenticator");

      const res = axiosInstance.put(
        `/api/v3/Content/posts/${data.postId}/comments/${data.commentId}/UpdateComment`,
        {
          comment: data.updatedComment,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      toast.promise(res, {
        loading: "please wait! update comment..",
        success: (data) => {
          return data?.data?.message;
        },

        error: (data) => {
          return data?.response?.data?.message;
        },
      });
      return (await res).data;
    } catch (e) {
      toast.error(e?.response?.message);
    }
  }
);

const PostSliceRedux = createSlice({
  name: "content",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPost.fulfilled, (state, action) => {
      if (action?.payload?.success) {
        state.PostCount = action.payload.AllPostGetCount;
        state.PostData = [...action.payload.AllPostGet];
      }
    });
  },
});
export const {} = PostSliceRedux.actions;
export default PostSliceRedux.reducer;
