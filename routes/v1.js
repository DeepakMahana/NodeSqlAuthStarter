const express 			= require('express');
const router 			= express.Router();
const passport      	= require('passport');
const path              = require('path');

const UserController 	= require('../controllers/user.controller');

/* GET Home Page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Yapsody API", data:{"version_number":"v1.0.0"}})
});

/* User Routes */
router.post('/users', UserController.create);                                                    // C
router.get('/users', passport.authenticate('jwt', {session:false}), UserController.get);        // R
router.put('/users', passport.authenticate('jwt', {session:false}), UserController.update);     // U
router.delete('/users',passport.authenticate('jwt', {session:false}), UserController.remove);     // D
router.post('/users/login',UserController.login);


//********* API DOCUMENTATION **********
router.use('/docs/api.json',            express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs',                     express.static(path.join(__dirname, '/../public/v1/documentation/dist')));

module.exports = router;
