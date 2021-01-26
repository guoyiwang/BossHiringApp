import { configureStore } from "@reduxjs/toolkit";

import usersReducer from "../features/users/usersSlice";
import currentUserReducer from "../features/users/currentUser/currentUserSlice";
import messagesReducer from "../features/messages/messagesSlice";

export default configureStore({
  reducer: {
    users: usersReducer,
    currentUser: currentUserReducer,
    messages: messagesReducer,
  },
});
