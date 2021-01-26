const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  time: { type: Date },
});

ChatSchema.statics = {
  /**
   * list all chats
   */
  list: async function (options) {
    return await this.find(options.criteria).select(options.select).exec();
  }
}

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
