const express = require("express")

const awaitHandlerFactory = require('../middleware/awaitHandler.middleware');

const smsController = require("../service/smsController"); 

const router = express.Router();

router.post('/sendReviewRequest', (req,res)=>{
    smsController.sendSms(req,res);
});

router.get('/getAppointments',(req,res)=>{
    smsController.getAppointments(req,res)
})


module.exports = router;