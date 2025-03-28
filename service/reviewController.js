const { Op } = require('sequelize');
const { Review, Appointment, ParameterLink, Parameter, ReviewInsight, FinalReview, Order } = require("../model/index.model");
const { structureResponse } = require('../utils/common.utils');

class reviewController {

    async checkReview(req, res) {
        try {
            let currentAppointment = await Appointment.findOne({
                where:{
                    shortId: req.body.appointmentId
                }
            })
            let appointmentId = currentAppointment.dataValues.id;
            let reviews = await Review.findAll({
                where: {
                    appointmentId: appointmentId
                }
            })
            console.log()
            let response;
            if (reviews.length > 0) {
                let completedOrder = await Order.findOne({
                    where:{
                        appointmentId: appointmentId,
                        status:"SUCCESS", 
                    }
                });
                console.log(completedOrder)
                if(completedOrder!=null){
                    let reviewInsights = await ReviewInsight.findOne({
                        where: {
                            appointmentId: appointmentId
                        },
                    });

                    let appointment = await Appointment.findOne({
                        where: {
                            id: appointmentId
                        }
                    })

                    let finalResponse = {
                        firstName: appointment.dataValues.firstName,
                        lastName: appointment.dataValues.lastName,
                        pricing: appointment.dataValues.pricing,
                        optedPricing: reviewInsights.dataValues.optedPricing,
                        success: true,
                    }
                    response = structureResponse(finalResponse, 1, "You have already paid for this booking. Here is your reciept");
                } else{
                    let reviewInsights = await ReviewInsight.findOne({
                        where: {
                            appointmentId: appointmentId
                        },
                    });
                    console.log("REVIEW INSIGHTS", reviewInsights)
                    let appointment = await Appointment.findOne({
                        where: {
                            id: appointmentId
                        }
                    })
                    let finalSavedReview = await FinalReview.findOne({
                        where: {
                            appointmentId: appointmentId
                        },
                    })
                    console.log("FINAL SAVED REVIEW", finalSavedReview)
                    let finalResponse = {
                        suggestivePricing: reviewInsights.dataValues.suggestivePricing,
                        rating: finalSavedReview.dataValues.finalRating,
                        pricing: appointment.dataValues.pricing,
                        firstName: appointment.dataValues.firstName,
                        lastName: appointment.dataValues.lastName
                    }
                    response = structureResponse(finalResponse, 1, "Reviews Fetched successfully");
                }    
            } else {
                response = structureResponse(reviews, 1, "Reviews Fetched successfully");
            }
            return res.status(200).json({
                message: response.headers.message,
                data: response.body,
            })
        } catch (err) {
            console.log(err);
            let response = structureResponse("Something Went Wrong", 0, "Failure")
            return res.status(500).json({
                message: response.headers.message,
                data: response.body,
            })
        }
    }

    async getReviewParameters(req, res) {
        try {
            let allParameters = [];
            let currentAppointment = await Appointment.findOne({
                where:{
                    shortId: req.params.appointmentId
                }
            })
            let appointmentId = currentAppointment.dataValues.id;
            let parametersLink = await ParameterLink.findAll({
                where: {
                    appointmentId: appointmentId
                }
            });
            for (let i = 0; i < parametersLink.length; i++) {
                let parameter = await Parameter.findOne({
                    where: {
                        id: parametersLink[i].dataValues.parameterId
                    }
                })
                allParameters.push({
                    parameterId: parametersLink[i].dataValues.parameterId,
                    parameterName: parameter.dataValues.paramterName,
                    appointmentId: appointmentId,
                    description: parameter.dataValues.description
                });
            }
            let response = structureResponse(allParameters, 1, "Reviews Parameter Fetched successfully");
            return res.status(200).json({
                message: response.headers.message,
                data: response.body,
            })
        } catch (err) {
            console.log(err);
            let response = structureResponse("Something Went Wrong", 0, "Failure")
            return res.status(500).json({
                message: response.headers.message,
                data: response.body,
            })
        }
    }

    async saveReviewRatings(req, res) {
        try {
            let savedReviews = []
            let currentAppointment = await Appointment.findOne({
                where:{
                    shortId: req.body.appointmentId
                }
            })
            let appointmentId = currentAppointment.dataValues.id;
            for (let i = 0; i < req.body.ratings.length; i++) {
                let savedReview = await Review.create({
                    appointmentId: appointmentId,
                    parameterId: req.body.ratings[i].parameterId,
                    rating: req.body.ratings[i].value,
                })
                savedReviews.push(savedReview);
            }
            console.log("Saved the ratings for appointmentID ", appointmentId)

            let ans = await this.fetchReviewAndSuggestivePricing(savedReviews, appointmentId,req.body.feedback)

            let response = structureResponse(ans, 1, "Reviews Parameter Fetched successfully");
            return res.status(200).json({
                message: response.headers.message,
                data: response.body,
            })
        } catch (err) {
            console.log(err);
            let response = structureResponse("Something Went Wrong", 0, "Failure")
            return res.status(500).json({
                message: response.headers.message,
                data: response.body,
            })
        }
    }

    async fetchReviewAndSuggestivePricing(reviews, appointmentId, feedback) {
        console.log(reviews);
        let totalReviews = reviews.length;
        let totalRating = 0;
        let suggestPricing = 0;
        for (let i = 0; i < reviews.length; i++) {
            totalRating += reviews[i].dataValues.rating
        }
        let finalRating = totalRating / totalReviews;
        if (finalRating > 0 && finalRating < 2) {
            suggestPricing = 0;
        } else if (finalRating >= 2 && finalRating < 4) {
            suggestPricing = 1;
        } else {
            suggestPricing = 2;
        }
        let reviewInsights = await ReviewInsight.create({
            appointmentId: appointmentId,
            suggestivePricing: suggestPricing,
            optedPricing: -1
        })

        let finalSavedReview = await FinalReview.create({
            appointmentId: appointmentId,
            finalRating: finalRating,
            feedback: feedback,
        })
        let appointment = await Appointment.findOne({
            where: {
                id: appointmentId
            }
        })
        console.log("Saved suggestive pricing ", reviewInsights)
        let finalResponse = {
            suggestivePricing: suggestPricing,
            rating: finalRating,
            pricing: appointment.dataValues.pricing,
            firstName: appointment.dataValues.firstName,
            lastName: appointment.dataValues.lastName
        }
        return finalResponse;
    }
}

module.exports = new reviewController();