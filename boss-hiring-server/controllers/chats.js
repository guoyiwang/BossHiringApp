const mongoose = require("mongoose");
const Chat = require("./../models/chat");

exports.read = async (req, res) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).json({ message: "Please login first" });
  }

  const to = userId;
  const from = req.body.from;
  try {
    const count = await Chat.updateMany(
      { from: from, to: to, read: false },
      { read: true }
    );
    res.json({ num: count.nModified });
  } catch (err) {
    res.status(400).json({ message: "Update Error" });
  }
};

exports.index = async (req, res) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).json({ message: "Please login first" });
  }

  const criteria = { $or: [{ from: userId }, { to: userId }] };
  const select = { password: 0 };
  try {
    const chats = await Chat.list({ criteria, select });
    res.json({ chats });
  } catch (err) {
    res.end();
  }
};
