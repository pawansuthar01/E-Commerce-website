import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  userName: localStorage.getItem("userName") || "",
  data:
    localStorage.getItem("data") !== undefined
      ? JSON.parse(localStorage.getItem("data"))
      : {},
};

export const CreateAccount = createAsyncThunk(
  "/auth/register",
  async (data) => {
    try {
      const res = axiosInstance.post("/api/v3/user/register", data);
      toast.promise(res, {
        loading: "please wait! creating account..",
        success: (data) => {
          return data?.data?.message;
        },

        error: (data) => {
          return data?.response?.data?.message;
        },
      });
      const Data = await res;
      console.log(Data);
      return (await res).data;
    } catch (error) {
      toast.error(e?.response?.message);
    }
  }
);
export const LoginAccount = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = axiosInstance.post("/api/v3/user/login", data);
    toast.promise(res, {
      loading: "please wait! login account..",
      success: (data) => {
        return data?.data?.message;
      },

      error: (data) => {
        return data?.response?.data?.message;
      },
    });
    return (await res).data;
  } catch (error) {
    toast.error(e?.response?.message);
  }
});
export const LogoutAccount = createAsyncThunk("/auth/logout", async () => {
  console.log("yes");
  try {
    const res = axiosInstance.get("/api/v3/user/logout");
    toast.promise(res, {
      loading: "please wait! logout account..",
      success: (data) => {
        return data?.data?.message;
      },

      error: (data) => {
        return data?.response?.data?.message;
      },
    });
    return (await res).data;
  } catch (error) {
    toast.error(e?.response?.message);
  }
});

export const UpdateAccount = createAsyncThunk("/auth/update", async () => {
  try {
    const res = axiosInstance.post("/api/v3/user/UpdateProfile");
    toast.promise(res, {
      loading: "please wait! Update Profile ..",
      success: (data) => {
        return data?.data?.message;
      },

      error: (data) => {
        return data?.response?.data?.message;
      },
    });
    return (await res).data;
  } catch (error) {
    toast.error(e?.response?.message);
  }
});

export const LoadAccount = createAsyncThunk("/auth/getProfile", async () => {
  try {
    const res = axiosInstance.get("/api/v3/user/getProfile");
    toast.promise(res, {
      loading: "please wait! get Profile ..",
      success: (data) => {
        return data?.data?.message;
      },

      error: (data) => {
        return data?.response?.data?.message;
      },
    });
    return (await res).data;
  } catch (error) {
    toast.error(e?.response?.message);
  }
});

const authSliceRedux = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateAccount.fulfilled, (state, action) => {
        localStorage.setItem("data", JSON.stringify(action?.payload?.data));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.data?.role);
        localStorage.setItem("userName", action?.payload?.data?.userName);

        state.walletProduct = [...action?.payload?.data?.walletAddProducts];
        state.isLoggedIn = true;
        state.userName = action?.payload?.data.userName;
        state.data = action?.payload?.data;
        state.role = action?.payload?.data?.role;
      })
      .addCase(LoginAccount.fulfilled, (state, action) => {
        localStorage.setItem("data", JSON.stringify(action?.payload?.data));
        localStorage.setItem("userName", action?.payload?.data.userName);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.data?.role);

        state.walletProduct = [...action?.payload?.data?.walletAddProducts];
        state.isLoggedIn = true;
        state.userName = action?.payload?.data.userName;
        state.data = action?.payload?.data;
        state.role = action?.payload?.data?.role;
      })
      .addCase(LoadAccount.fulfilled, (state, action) => {
        localStorage.setItem("data", JSON.stringify(action?.payload?.data));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.data.role);
        localStorage.setItem("userName", action?.payload?.data?.userName);
        state.userName = action?.payload?.data.userName;
        state.walletProduct = [...action?.payload?.data?.walletAddProducts];
        state.isLoggedIn = true;
        state.data = action?.payload?.data;
        state.role = action?.payload?.data?.role;
      })
      .addCase(LogoutAccount.fulfilled, (state) => {
        localStorage.clear();
        state.userName = "";
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      });
  },
});
export const {} = authSliceRedux.actions;
export default authSliceRedux.reducer;
