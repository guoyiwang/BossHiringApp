import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { reqAllMessages, reqReadAllMessages } from "../../web/messageAPI";

const messagesAdapter = createEntityAdapter({
  selectId: (message) => message._id,
  sortComparer: (a, b) => a.time.localeCompare(b.time),
});

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (_, { requestId, getState }) => {
    const { loading, currentRequestId } = getState().messages;
    if (loading !== "pending" || currentRequestId !== requestId) {
      return Promise.reject("Try it later");
    }
    const response = await reqAllMessages();
    return response.data.chats;
  }
);

export const readAllMessages = createAsyncThunk(
  "messages/readAllMessages",
  async (msgs, { requestId, getState }) => {
    const { loading, currentRequestId } = getState().messages;
    if (loading !== "pending" || currentRequestId !== requestId) {
      return Promise.reject("Try it later");
    }
    const from = msgs[0].from;
    const response = await reqReadAllMessages(from);
    const count = response.data.num;
    if (count === msgs.length) {
      return msgs.map((msg) => Object.assign({ ...msg }, { read: true }));
    } else {
      return Promise.reject("Set read error");
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: messagesAdapter.getInitialState({
    loading: "idle",
    currentRequestId: undefined,
    error: null,
  }),
  reducers: {
    messageAdded: messagesAdapter.addOne,
    messageReset: messagesAdapter.setAll,
  },
  extraReducers: {
    [fetchMessages.pending]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchMessages.fulfilled]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentRequestId === action.meta.requestId
      ) {
        state.loading = "idle";
        state.currentRequestId = undefined;
        messagesAdapter.upsertMany(state, action.payload);
      }
    },
    [fetchMessages.rejected]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentRequestId === action.meta.requestId
      ) {
        state.loading = "idle";
        state.currentRequestId = undefined;
        state.error = action.error;
      }
    },
    [readAllMessages.pending]: (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = action.meta.requestId;
      }
    },
    [readAllMessages.fulfilled]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentRequestId === action.meta.requestId
      ) {
        state.loading = "idle";
        state.currentRequestId = undefined;
        messagesAdapter.upsertMany(state, action.payload);
      }
    },
    [readAllMessages.rejected]: (state, action) => {
      if (
        state.loading === "pending" &&
        state.currentRequestId === action.meta.requestId
      ) {
        state.loading = "ilde";
        state.currentRequestId = undefined;
        state.error = action.error;
      }
    },
  },
});

export default messagesSlice.reducer;

export const { messageAdded, messageReset } = messagesSlice.actions;

export const { selectAll: selectAllMessages } = messagesAdapter.getSelectors(
  (state) => state.messages
);

export const selectMessagesByUser = createSelector(
  [selectAllMessages, (state, userId) => userId],
  (msgs, userId) =>
    msgs.filter((msg) => msg.to === userId || msg.from === userId)
);

export const selectReceivedMessages = createSelector(
  [selectAllMessages, (state, userId) => userId],
  (msgs, userId) => msgs.filter((msg) => msg.to === userId)
);
