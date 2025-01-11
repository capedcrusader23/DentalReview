const express = require("express")

const awaitHandlerFactory = require('../middleware/awaitHandler.middleware');

const insightController = require("../service/insightController"); 

const router = express.Router();

router.get('/getInsights', (req,res)=>{
    insightController.getInsights(req,res);
});


module.exports = router;