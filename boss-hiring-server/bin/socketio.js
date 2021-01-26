const Chat = require("../models/chat");
const User = require("../models/user");

// save type of clients and its socket
let clients = new Map();

exports.initIO = function (server) {
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    console.log("One Socket IO connection");

    socket.on("sendMsg", (message) => {
      console.log("Received", message);
      const time = Date.now();
      const msg = new Chat({ ...message, time });

      async function saveMsg() {
        try {
          const newMsg = await msg.save();
          console.log("Saved ", newMsg);
          io.emit("receiveMsg", newMsg);
        } catch (err) {
          console.log("Message saving failed");
        }
      }
      saveMsg();
    });
    socket.on("newUser", (user) => {
      console.log("Add new user ", user._id, user.type);
      clients.set(user._id, [socket, user.type]);
      console.log("Clients number: ", clients.size);
      socket.on("disconnect", () => {
        console.log("Disconned: ", user._id, user.type);
        clients.delete(user._id);
        console.log("Clients number: ", clients.size);
      });
    });
  });
};

/**
 * Notify one type of clients of the other type new users's list
 * @param {Object} newUser the type of clients need to be notified
 */
exports.notifyAll = async (newUser) => {
  const otherType = newUser.type === "recruiter" ? "jobseeker" : "recruiter";
  newUser.password = undefined;
  try {
    for (const [key, val] of clients.entries()) {
      if (val[1] === otherType) {
        console.log("Notified user: ", key);
        val[0].emit("userUpdated", newUser);
      }
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
