const express=require('express');
const AuthController = require('../controllers/authController');
const verifyJWTMiddleware = require('../middlewares/verifyJwtMiddleware');
const router=express.Router();
router.post('/register',AuthController.register);
router.post('/login',AuthController.login);
router.delete('/logout',verifyJWTMiddleware,AuthController.logout);
module.exports=router;