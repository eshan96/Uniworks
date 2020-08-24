const express = require('express');

const router = express.Router();
const passport = require('passport')
const usersController = require('../controllers/users_controller');


router.post('/create', usersController.create)
router.post('/create-session', usersController.createSession)
router.get('/list', passport.authenticate('jwt', {session: false}), usersController.list);
router.get('/info', passport.authenticate('jwt', {session: false}), usersController.info);
router.put('/update/:id', passport.authenticate('jwt', {session: false}), usersController.update);
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), usersController.delete);

module.exports = router