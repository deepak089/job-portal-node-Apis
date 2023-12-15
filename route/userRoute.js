const express=require('express');
const router=express.Router();
const userAuth=require('../middleware/authMiddleware');
const { updateUserController } = require('../controller/userController');

router.post('/user/update',updateUserController);


module.exports=router;