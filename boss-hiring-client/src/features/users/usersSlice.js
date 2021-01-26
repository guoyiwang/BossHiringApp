import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { reqAllUsers } from "../../web/userAPI";

const usersAdapter = createEntityAdapter({
  selectId: (user) => user._id,
  sortComparer: (a, b) => a.username.localeCompare(b.username),
});

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (type, { requestId, getState }) => {
    const { loading, currentRequestId } = getState().users;
    if (loading !== "pending" || currentRequestId !== requestId) {
      return Promise.reject("Try it later");
    }
    const response = await reqAllUsers(type);
    return response.data.users;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState({
    loading: "idle",
    currentRequestId: undefined,
    error: null,
  }),
  reducers: {
    userUpdated: usersAdapter.upsertOne,
    usersReset: usersAdapter.setAll,
  },
  extraReducers: {
    [fetchUsers.pending]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchUsers.fulfilled]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentRequestId === action.meta.requestId
      ) {
        state.loading = "idle";
        state.currentRequestId = undefined;
        usersAdapter.upsertMany(state, action.payload); // upsert many users into list
      }
    },
    [fetchUsers.rejected]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentRequestId === action.meta.requestId
      ) {
        state.loading = "idle";
        state.currentRequestId = undefined;
        state.error = action.error;
      }
    },
  },
});

export default usersSlice.reducer;

export const { userUpdated, usersReset } = usersSlice.actions;

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => state.users);

export const selectLoadingStatus = (state) => state.users.loading;

// userIds should be a map, and returns a new map with specific user as value
export const selectUsersByIds = createSelector(
  [selectAllUsers, (state, userIdsMap) => userIdsMap],
  (users, userIdsMap) => new Map(users.filter((user) => userIdsMap.has(user._id)).map(user => [user._id, user]))
);
