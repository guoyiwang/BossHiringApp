import store from "../../../../app/store";
import { initIO } from "../../../../web/socketio";
import { prepared } from "../currentUserSlice";
import { fetchUsers } from "../../usersSlice";
import { fetchMessages } from "../../../messages/messagesSlice";

async function getAllUsers(user) {
  console.log("Fetching all users...");
  const type = {
    type: user.type === "recruiter" ? "jobseeker" : "recruiter",
  };
  await store.dispatch(fetchUsers(type));
}

async function getAllMessages(user) {
  initIO(user);
  console.log("Fetching all messages...");
  await store.dispatch(fetchMessages());
}

export default async function prepareLogin(user) {
  await getAllUsers(user);
  await getAllMessages(user);
  store.dispatch(prepared(true));
}
