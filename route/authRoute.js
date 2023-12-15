const express=require('express');
const { registerController, loginController } = require('../controller/authController');
const router=express.Router();
const rateLimit=require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})
router.post('/login',limiter,loginController);

router.post('/register',limiter,registerController);

module.exports=router;