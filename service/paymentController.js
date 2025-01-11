const { Op } = require('sequelize');
const {Review, Appointment, ParameterLink, Parameter, ReviewInsight, Order} = require("../model/index.model");
const { structureResponse } = require('../utils/common.utils');
const initiatePaymentValidation = require('../validation/InitiatePaymentValidation');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpayInstance = new Razorpay({
    key_id: "rzp_test_jx3qUdaZ3DEefb",  // Replace with your Razorpay key_id
    key_secret: "FGn2s9FZHbXrSsc2Cjnn36uw",  // Replace with your Razorpay key_secret
  });


class paymentController{
     async initiatePayment(req,res){
        try{
            console.log(req.body)
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
                    appointmentId: req.body.appointmentId
                }
            })
            console.log("Saved opted pricing", reviewInsight)
            //start razorpay Payment

            const options = {
                amount: req.body.amount * 100,  // Razorpay expects the amount in paise (smallest currency unit)
                currency: 'INR',
                receipt: crypto.randomBytes(10).toString('hex'),  // A unique receipt ID
                payment_capture: 1,  // Automatic capture (if set to 1, payment is captured immediately)
              };

            const order = await razorpayInstance.orders.create(options);

            let systemOrder = await Order.create({
                appointmentId: req.body.appointmentId,
                status: "CREATED",
                price: req.body.amount,
                razorpayOrderId: order.id
            })

            let resp = {
                success: true,
                orderId: order.id,
                currency: order.currency,
                amount: order.amount,
            }  
            console.log("Called razorpay successfully", resp);
            let response = structureResponse(resp, 1, "Payment Initiated successfully");
            return res.status(200).json({
                message: response.headers.message,
                data: response.body,
            })
        } catch(err){
            console.log(err);
            let response = structureResponse("Something Went Wrong during inititating payment", 0, "Failure")
            return res.status(500).json({
                message: response.headers.message,
                data:response.body,
            })
        }
     } 

     // endpoint where razorpay will send webhook to update payment
     async updatePayment(req,res) {
            try{
                const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
                if(this.verifySignature(razorpay_payment_id, razorpay_order_id, razorpay_signature)) {
                const paymentDetails = await razorpayInstance.payments.fetch(razorpay_payment_id);
                console.log(req.body)
                if (paymentDetails.status === 'captured') {
                    const receiptUrl = paymentDetails.receipt;
                    console.log('Payment successful. Receipt URL:', receiptUrl);
                    let savedOrder = await Order.update(
                        {status: "SUCCESS",receiptUrl:receiptUrl},{
                          where:{
                              razorpayOrderId: razorpay_order_id
                          }
                    })

                    let appointment = await Appointment.findOne({
                        where: {
                            id: req.body.appointmentId
                        }
                    })
                    let reviewInsight = await ReviewInsight.findOne({
                        where:{
                            appointmentId: req.body.appointmentId,
                        }
                    })


                    let resp = {
                        receiptUrl: receiptUrl,
                        success: true,
                        firstName: appointment.dataValues.firstName,
                        lastName: appointment.dataValues.lastName,
                        pricing: appointment.dataValues.pricing,
                        optedPricing: reviewInsight.dataValues.optedPricing,
                    }
                    
                  let response = structureResponse(resp, 1, "Payment Done successfully");
                  console.log(response)
                  return res.status(200).json({
                      message: response.headers.message,
                      data: response.body,
                  })
                  } else {
                    let resp = {
                        receiptUrl: null,
                        success: false
                    }
                    let response = structureResponse(resp, 1, "Payment Not captured");
                    res.status(400).json({  
                        message: response.headers.message,
                        data: response.body,});
                  }
                } else{
                    let resp = {
                        receiptUrl: null,
                        success: false
                    }
                    let response = structureResponse(resp, 1, "Invalid signature for payment");
                    res.status(400).json({  
                        message: response.headers.message,
                        data: response.body,});
                  }  
            } catch(err){
                console.log(err);
            let response = structureResponse("Something Went Wrong during inititating payment", 0, "Failure")
            return res.status(500).json({
                message: response.headers.message,
                data:response.body,
            })
        }
     }

    verifySignature(paymentId, orderId, signature) {
        const crypto = require('crypto');
        const generatedSignature = crypto
          .createHmac('sha256', 'FGn2s9FZHbXrSsc2Cjnn36uw')  // Replace with your Razorpay secret key
          .update(orderId + '|' + paymentId)
          .digest('hex');
        return generatedSignature === signature;
      }
}

module.exports = new paymentController();