import { client } from "./client";

/**
 * Fetch all related messages for current user
 * @return {Promise}
 */
export const reqAllMessages = () => {
  return client.get("/msgs/msglist");
};

/**
 * Read all messages
 * @param {String} from
 * @return {Promise}
 */
export const reqReadAllMessages = (from) => {
  return client.post("/msgs/readmsg", { from });
};
