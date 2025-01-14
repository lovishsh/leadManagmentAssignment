const express=require('express');
const verifyJWTMiddleware = require('../middlewares/verifyJwtMiddleware');
const LeadController = require('../controllers/leadController');
const router=express.Router();
router.use(verifyJWTMiddleware);
router.post('/create',LeadController.create);
router.get('/fetch',LeadController.fetch);
router.put('/update',LeadController.update);
router.delete('/delete',LeadController.delete);
module.exports=router;