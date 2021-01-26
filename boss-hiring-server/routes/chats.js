const express = require('express');
const chats = require('./../controllers/chats');
const router = express.Router();

/**
 * Chats routes
 */
router.get("/msglist", chats.index);
router.post('/readmsg', chats.read);

module.exports = router;