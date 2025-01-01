const { Op } = require('sequelize');
const {Review, Appointment, ParameterLink, Parameter, ReviewInsight} = require("../model/index.model");
const { structureResponse } = require('../utils/common.utils');
const initiatePaymentValidation = require('../validation/InitiatePaymentValidation');

class paymentController{
     async initiatePayment(req,res){
        try{
            let validation = new initiatePaymentValidation(req.body);
            validation.validate();
            let appointment = Appointment.findOne({
                where:{
                    id: req.body.appointmentId
                }
            })
            if(appointment == null){
                throw new InternalServerException("Appointment not present for this payment");
            }
            let reviewInsight = await ReviewInsight.update(
                {optedPricing: req.body.optedPricing},{
                where:{
                    appointment: req.body.appointmentId
                }
            })
            console.log("Saved opted pricing", reviewInsight)
            //start razorpay Payment
        } catch(err){
            console.log(err);
            let response = structureResponse("Something Went Wrong", 0, "Failure")
            return res.status(500).json({
                message: response.headers.message,
                data:response.body,
            })
        }
     } 

     // endpoint where razorpay will send webhook to update payment
     async updatePayment(req,res){

     }
}

module.exports = new paymentController();