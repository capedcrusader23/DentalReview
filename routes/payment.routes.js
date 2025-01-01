const express = require("express")

const paymentController = require("../service/paymentController"); 

const router = express.Router();

router.post('/initiatePayment',(req,res)=>{
    paymentController.initiatePayment(req,res);
})

router.post('/updatePayment',(req,res)=>{
    paymentController.updatePayment(req,res);
})


module.exports = router;