const mongoose = require("mongoose");
const User = require("./../models/user");
const only = require("only");
const notifyAll = require("../bin/socketio").notifyAll;

exports.create = async (req, res) => {
  const user = new User(only(req.body, "username password type"));
  try {
    const newUser = await user.save();
    const data = only(newUser, "_id username type");
    await notifyAll(newUser); // notify all clients of other type
    // secure for HTTPS, sameSite:None allows cookies sent
    res.cookie("userId", newUser._id, {
      // path: "/",
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      sameSite: "none",
      // httpOnly: true,
    });
    res.json({ user: data });
  } catch (err) {
    res.status(400).json({ message: "This user already exists" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const criteria = { username };
  try {
    const user = await User.load({ criteria });
    await user.authenticate(password);
    user.password = undefined; // remove password before send json
    res.cookie("userId", user._id, {
      // path: "/",
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      sameSite: "none",
      // httpOnly: true,
    });
    res.json({ user });
  } catch (err) {
    console.log(err);
    res.clearCookie("userId"); // clear userId cookie
    res.status(401).json({ message: "Username or Password is not correct" });
  }
};

exports.update = async (req, res) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).json({ message: "Please login first" });
  }
  const userUpdate = req.body;
  try {
    const oldUser = await User.findOneAndUpdate({ _id: userId }, userUpdate);
    const newUser = Object.assign(
      only(oldUser, "_id username type"),
      userUpdate
    );
    newUser.password = undefined; // remove password before send json
    await notifyAll(newUser); // notify all clients for users

    res.json({ user: newUser });
  } catch (err) {
    res.clearCookie("userId"); // clear userId cookie
    res.status(400).json({ message: "Update Error" });
  }
};

exports.show = async (req, res) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).json({ message: "Please login first" });
  }

  const criteria = { _id: userId };
  const select = { password: 0 };
  try {
    const user = await User.load({ criteria, select });
    res.json({ user });
  } catch (err) {
    res.clearCookie("userId"); // clear userId cookie
    res.status(400).json({ message: "Don't exist this user" });
  }
};

exports.index = async (req, res) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).json({ message: "Please login first" });
  }

  const { type } = req.query;

  const criteria = { type };
  const select = { password: 0 };
  try {
    const users = await User.list({ criteria, select });
    res.json({ users });
  } catch (err) {
    res.end();
  }
};
