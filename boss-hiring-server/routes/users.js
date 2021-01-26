const express = require("express");
const users = require("./../controllers/users");
const router = express.Router();


/**
 * Users routes
 */
router.post("/register", users.create);
router.post("/login", users.login);
router.post("/update", users.update);
router.get('/user', users.show);
router.get('/userlist', users.index);

module.exports = router;
