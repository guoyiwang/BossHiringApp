const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/boss-hiring", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("db connection opens");
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  avatar: { type: String },
});

const User = mongoose.model("User", userSchema);

/* Test save */
function testSave() {
  const user = new User({
    username: "abc",
    password: "123", 
    type: "jobseeker",
  });
  user.save((err, user) => {
    if (err) return console.error(err);
    console.log("Save", user);
  });
}
// testSave();

/* Test find */
function testFind() {
  User.find(
    {
      username: "ab",
    },
    (err, docs) => {
      if (err) {
        console.log(`Error: ` + err);
      } else {
        if (docs.length === 0) {
          console.log("Such user doesn't exist");
        } else {
          console.log("find", docs);
        }
      }
    }
  );
}
// testFind();

/* Test update */
function testUpdate() {
  User.findOneAndUpdate(
    {
      username: "abc",
    },
    {
      username: "abcd",
    },
    (err, doc) => {
      if (err) {
        console.log(`Error: ` + err);
      } else {
        console.log("Update" + doc);
      }
    }
  );
}
// testUpdate();

function testDelete() {
  User.deleteOne(
    {
      username: "abcd",
    },
    (err) => {
      console.log(`Error: ` + err);
    }
  );
}
testDelete();
