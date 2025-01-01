const { Op } = require('sequelize');
const twilio = require('twilio');
const config = require('config');
const accountSid = config.get("twillio").get("accountId");  // from your Twilio console
const authToken  = config.get("twillio").get("authToken");     // from your Twilio console
const {Review, Appointment} = require("../model/index.model");
const { firstName, lastName, isPaid, phoneNo } = require('../model/appointment.model');
const { timestamp } = require('../model/parameters.model');
const { appointmentId } = require('../model/review.model');
const client = twilio(accountSid, authToken);
const SendSmsValidation = require("../validation/SendSmsValidation");
const { structureResponse } = require('../utils/common.utils');
const {InvalidPropertiesException} = require("../utils/exceptions/validation.exception")

class reviewController{

      async checkReview(req,res){
        try{
            let reviews = await Appointment.findAll({
                where: {
                    appointmentId: req.body.appointmentId
                }
            })
            let response = structureResponse(reviews, 1, "Reviews Fetched successfully");
            return res.status(200).json({
                message: response.headers.message,
                data:response.body,
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

      async captureReview(req,res){
        try{
            
        } catch(err){
            console.log(err);
            let response;
            if(err instanceof InvalidPropertiesException){
                response = structureResponse(err.data, 0, "Failure") 
            } else{
                response = structureResponse("Something Went Wrong", 0, "Failure")
            }
            return res.status(500).json({
                message: response.headers.message,
                data:response.body,
            })
        }
     }
}

module.exports = new reviewController();