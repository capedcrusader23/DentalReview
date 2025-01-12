const { Op } = require('sequelize');
const {Review, Appointment, ParameterLink, Parameter, ReviewInsight, FinalReview} = require("../model/index.model");
const { structureResponse } = require('../utils/common.utils');
const { app } = require('firebase-admin');

class InsightController{
     async getInsights(req,res){
        try{
            let appointments = await Appointment.findAll();
            let response =[];
            for(let i=0;i<appointments.length;i++){
                let reviewInsights = await ReviewInsight.findOne({
                    where: {
                        appointmentId: appointments[i].dataValues.id
                    },
                });
                let finalReviw = await FinalReview.findOne({
                    where:{
                        appointmentId:appointments[i].dataValues.id
                    }
                })
                let responseEntity;
                if(reviewInsights == null){
                    continue;
                } else{
                    let finalPricing = 0;
                    console.log(reviewInsights.dataValues.optedPricing)
                    if(reviewInsights.dataValues.optedPricing != -1){
                        let pricing = JSON.parse(appointments[i].dataValues.pricing)
                        for(let j=0;j<pricing.length;j++){
                            console.log("Pricing is",pricing[j])
                            if(reviewInsights.dataValues.optedPricing==0) {
                                finalPricing+=pricing[j].pricing.basic
                            } else if(reviewInsights.dataValues.optedPricing==1){
                                console.log(pricing[j].pricing.standard)
                                finalPricing+=pricing[j].pricing.standard
                            }
                            else if(reviewInsights.dataValues.optedPricing==2){
                                finalPricing+=pricing[j].pricing.premium
                            }
                        }
                    }
                    console.log("FINAL PRICE", finalPricing)
                    responseEntity = {
                        appointmentId: appointments[i].dataValues.id,
                        suggestivePricing: reviewInsights.dataValues.suggestivePricing,
                        optedPricing: reviewInsights.dataValues.optedPricing,
                        finalPricing: finalPricing,
                        finalReview: finalReviw.dataValues.finalRating
                    }
                }
                console.log(responseEntity)
                
                response.push(responseEntity)
            }
            let finalresponse = structureResponse(response, 1, "Insights Fetch successfully");
            return res.status(200).json({
                message: finalresponse.headers.message,
                data: finalresponse.body,
            })
        } catch(err){
            console.log(err);
            let response = structureResponse("Something Went Wrong", 0, "Failure")
            return res.status(500).json({
                message: response.headers.message,
                data:response.body,
            })
        }
     } 
}

module.exports = new InsightController();