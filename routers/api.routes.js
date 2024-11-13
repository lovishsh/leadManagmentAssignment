const express=require('express');
const router=express.Router();
router.use('/auth',require('./authRoutes'));
router.use('/lead',require('./leadRoutes'));
module.exports=router;