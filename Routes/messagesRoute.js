const { addMessage, getAllMessage } = require("../Controllers/messagesController")

const router = require('express').Router();

router.post('/addmsg', addMessage);
router.post('/getallmesg', getAllMessage);



module.exports = router