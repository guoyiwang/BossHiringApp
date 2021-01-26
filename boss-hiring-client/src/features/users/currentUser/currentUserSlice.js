import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reqRegister, reqLogin, reqUpdateUser, reqFetchUser } from "../../../web/userAPI";

export const register = createAsyncThunk(
  "currentUser/register",
  async (user, { getState, requestId, rejectWithValue }) => {
    const { loading, currentReqeustId } = getState().currentUser;
    if (loading !== "pending" || currentReqeustId !== requestId)
      return Promise.reject("Try it later");
    try {
      const response = await reqRegister(user);
      return response.data.user;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "currentUser/login",
  async (user, { getState, requestId, rejectWithValue }) => {
    const { loading, currentReqeustId } = getState().currentUser;
    // if its the first request, loading should be 'pending' and request ID should be same
    if (loading !== "pending" || currentReqeustId !== requestId)
      return Promise.reject("Try it later");
    try {
      const response = await reqLogin(user);
      return response.data.user;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "currentUser/updateUser",
  async (user, { getState, requestId, rejectWithValue }) => {
    const { loading, currentReqeustId } = getState().currentUser;
    if (loading !== "pending" || currentReqeustId !== requestId)
      return Promise.reject("Try it later");
    try {
      const response = await reqUpdateUser(user);
      return response.data.user;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "currentUser/fetchCurrentUser",
  async (_, { getState, requestId, rejectWithValue }) => {
    const { loading, currentReqeustId } = getState().currentUser;
    if (loading !== "pending" || currentReqeustId !== requestId)
      return Promise.reject("Try it later");
    try {
      const response = await reqFetchUser();
      return response.data.user;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    currentUser: null,
    prepared: false,
    isLoggedIn: false,
    loading: "idle",
    currentReqeustId: undefined,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.prepared = false;
      state.isLoggedIn = false;
    },
    setLoginStatus: (state) => {
      state.isLoggedIn = true;
    },
    prepared: (state, action) => {
      state.prepared = action.payload;
    }
  },
  extraReducers: {
    [register.pending]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentReqeustId = action.meta.requestId;
      }
    },
    [register.fulfilled]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentReqeustId === action.meta.requestId
      ) {
        state.currentUser = action.payload;
        state.loading = "idle";
        state.currentReqeustId = undefined;
      }
    },
    [register.rejected]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentReqeustId === action.meta.requestId
      ) {
        state.error = action.error;
        state.loading = "idle";
        state.currentReqeustId = undefined;
      }
    },
    [login.pending]: (state, action) => {
      // Only change it to 'pending' when we receive the first request and save current request ID
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentReqeustId = action.meta.requestId;
      }
    },
    [login.fulfilled]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentReqeustId === action.meta.requestId
      ) {
        state.currentUser = action.payload;
        state.loading = "idle";
        state.currentReqeustId = undefined;
      }
    },
    [login.rejected]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentReqeustId === action.meta.requestId
      ) {
        state.error = action.error;
        state.loading = "idle";
        state.currentReqeustId = undefined;
      }
    },
    [updateUser.pending]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentReqeustId = action.meta.requestId;
      }
    },
    [updateUser.fulfilled]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentReqeustId === action.meta.requestId
      ) {
        state.currentUser = action.payload;
        state.loading = "idle";
        state.currentReqeustId = undefined;
      }
    },
    [updateUser.rejected]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentReqeustId === action.meta.requestId
      ) {
        state.error = action.error;
        state.loading = "idle";
        state.currentReqeustId = undefined;
      }
    },
    [fetchCurrentUser.pending]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentReqeustId = action.meta.requestId;
      }
    },
    [fetchCurrentUser.fulfilled]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentReqeustId === action.meta.requestId
      ) {
        state.currentUser = action.payload;
        state.loading = "idle";
        state.currentReqeustId = undefined;
      }
    },
    [fetchCurrentUser.rejected]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentReqeustId === action.meta.requestId
      ) {
        state.error = action.error;
        state.loading = "idle";
        state.currentReqeustId = undefined;
      }
    },
  },
});

export default currentUserSlice.reducer;

export const { logout, prepared, setLoginStatus } = currentUserSlice.actions;

export const selectCurrentUser = (state) => state.currentUser.currentUser;
export const selectLoadingStatus = (state) => state.currentUser.loading;
export const selectPrepareStatus = (state) => state.currentUser.prepared;
export const selectLoggedInStatus = (state) => state.currentUser.isLoggedIn;
