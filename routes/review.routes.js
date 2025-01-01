const express = require("express")

const reviewController = require("../service/reviewController"); 

const router = express.Router();

router.post('/checkReview', (req,res)=>{
    reviewController.checkReview(req,res);
});

router.get('/getReviewParameters/:appointmentId',(req,res)=>{
    reviewController.getReviewParameters(req,res);
})

router.post('/saveReview',(req,res)=>{
    reviewController.saveReviewRatings(req,res);
})


module.exports = router;