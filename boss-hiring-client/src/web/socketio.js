import io from "socket.io-client";
import { socketIOConfig } from "../app/config";
import store from "../app/store";
import { messageAdded } from "../features/messages/messagesSlice";
import { userUpdated } from "../features/users/usersSlice";

export function initIO(user) {
  const userId = user._id;
  // singleton pattern
  if (!io.socket) {
    io.socket = io(socketIOConfig.url);
    io.socket.on("receiveMsg", (msg) => {
      console.log("Received ", msg);
      // only when msg is about me,
      if (msg.from === userId || msg.to === userId) {
        store.dispatch(messageAdded(msg));
      }
    });
    io.socket.on("userUpdated", (user) => {
      console.log("Received updated user");
      store.dispatch(userUpdated(user));
    });
    console.log("Send user", user._id, user.type);
    io.socket.emit("newUser", user);
  }
}

export const sendMessage = (msg) => {
  console.log("Send ", msg);
  io.socket.emit("sendMsg", msg);
};
