import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  exp: Number(localStorage.getItem("exp")) || 0,
  userName: localStorage.getItem("userName") || "",
  Authenticator: localStorage.getItem("Authenticator") || null,
  data:
    localStorage.getItem("data") == undefined
      ? JSON.parse(localStorage.getItem("data"))
      : {},
};

export const CreateAccount = createAsyncThunk(
  "/auth/register",
  async (data) => {
    try {
      const res = await axiosInstance.post("/api/v3/user/register", data);
      return res.data;
    } catch (error) {
      return error?.response?.data || error?.message || "Something went wrong";
    }
  }
);
export const LoginAccount = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = await axiosInstance.post("/api/v3/user/login", data);

    return res.data;
  } catch (error) {
    return error?.response?.data || error?.message || "Something went wrong";
  }
});
export const LogoutAccount = createAsyncThunk("/auth/logout", async () => {
  try {
    const token = localStorage.getItem("Authenticator");

    const res = await axiosInstance.get(
      "/api/v3/user/logout",
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    return error?.response?.data || error?.message || "Something went wrong";
  }
});

export const UpdateAccount = createAsyncThunk("/auth/update", async (data) => {
  try {
    const token = localStorage.getItem("Authenticator");

    const res = await axiosInstance.put(
      "/api/v3/user/UpdateProfile",
      data,

      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    return error?.response?.data || error?.message || "Something went wrong";
  }
});

export const LoadAccount = createAsyncThunk("/auth/getProfile", async () => {
  try {
    const token = localStorage.getItem("Authenticator");
    const res = await axiosInstance.get(
      "/api/v3/user/getProfile",

      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    return error?.response?.data || error?.message || "Something went wrong";
  }
});
export const getAllUsers = createAsyncThunk("/auth/User", async () => {
  try {
    const token = localStorage.getItem("Authenticator");
    const res = await axiosInstance.get(
      "/api/v3/Admin/User",

      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    return error?.response?.data || error?.message || "Something went wrong";
  }
});
export const HandelDelete = createAsyncThunk("delete/", async (data) => {
  try {
    const token = localStorage.getItem("Authenticator");
    const res = await axiosInstance.delete("/api/v3/Admin/User", {
      data: data,
      headers: {
        Authorization: `${token}`,
      },
    });

    return res.data;
  } catch (error) {
    return error?.response?.data || error?.message || "Something went wrong";
  }
});
export const HandelPromotion = createAsyncThunk(
  "user/roleUpdate",
  async (data) => {
    try {
      const token = localStorage.getItem("Authenticator");
      const res = await axiosInstance.put("/api/v3/Admin/User", data, {
        headers: {
          Authorization: `${token}`,
        },
      });

      return res.data;
    } catch (error) {
      return error?.response?.data || error?.message || "Something went wrong";
    }
  }
);

const authSliceRedux = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateAccount.fulfilled, (state, action) => {
        if (action.payload.success) {
          localStorage.setItem("data", JSON.stringify(action?.payload?.data));
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("exp", Number(action?.payload?.exp));
          localStorage.setItem("role", action?.payload?.data.role);
          localStorage.setItem("userName", action?.payload?.data.userName);
          localStorage.setItem(
            "Authenticator",
            action?.payload?.AuthenticatorToken
          );
          state.Authenticator = action?.payload?.AuthenticatorToken;
          state.userName = action?.payload?.data.userName;
          state.walletProduct = [...action?.payload?.data.walletAddProducts];
          state.exp = Number(action?.payload?.exp);
          state.isLoggedIn = true;
          state.data = action?.payload?.data;
          state.role = action?.payload?.data.role;
        }
      })
      .addCase(LoginAccount.fulfilled, (state, action) => {
        if (action?.payload?.success) {
          const { data, exp } = action.payload;
          localStorage.setItem("data", JSON.stringify(data));
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("exp", Number(exp));
          localStorage.setItem("role", data.role);
          localStorage.setItem("userName", data.userName);
          localStorage.setItem(
            "Authenticator",
            action?.payload?.AuthenticatorToken
          );
          state.Authenticator = action?.payload?.AuthenticatorToken;
          state.userName = data.userName;
          state.walletProduct = [...data.walletAddProducts];
          state.exp = Number(exp);
          state.isLoggedIn = true;
          state.data = data;
          state.role = data.role;
        }
      })
      .addCase(LoadAccount.fulfilled, (state, action) => {
        if (action.payload.success) {
          const { data, exp } = action.payload;

          localStorage.setItem("data", JSON.stringify(data));
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("exp", Number(exp));
          localStorage.setItem("role", data.role);
          localStorage.setItem("userName", data.userName);

          state.userName = data.userName;
          state.walletProduct = [...data.walletAddProducts];
          state.exp = Number(exp);
          state.isLoggedIn = true;
          state.data = data;
          state.role = data.role;
        }
      })
      .addCase(LogoutAccount.fulfilled, (state) => {
        localStorage.clear();
        state.userName = "";
        state.exp = 0;
        state.Authenticator = null;
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      });
  },
});
export const {} = authSliceRedux.actions;
export default authSliceRedux.reducer;
