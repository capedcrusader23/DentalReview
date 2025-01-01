const express = require("express")

const reviewController = require("../service/reviewController"); 

const router = express.Router();

router.post('/checkReview', (req,res)=>{
    reviewController.checkReview(req,res);
});


module.exports = router;