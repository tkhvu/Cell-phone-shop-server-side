const express = require('express');
const router = express.Router();
const { matchUser, addUser, localStorage, getUsers, findUser } = require('../controllers/userController');


router.get('/UsernameCheck', findUser)
router.get('/getUsers', getUsers)
router.post('/userMatch', matchUser)
router.post('/CreatingUser', addUser)
router.get('/localStorage', localStorage)



module.exports = router;