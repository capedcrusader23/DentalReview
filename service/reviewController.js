const { Op } = require('sequelize');
const { Review, Appointment, ParameterLink, Parameter, ReviewInsight, FinalReview } = require("../model/index.model");
const { structureResponse } = require('../utils/common.utils');

class reviewController {

    async checkReview(req, res) {
        try {
            let reviews = await Review.findAll({
                where: {
                    appointmentId: req.body.appointmentId
                }
            })
            let response;
            if (reviews.length > 0) {
                let reviewInsights = await ReviewInsight.findOne({
                    where: {
                        appointmentId: req.body.appointmentId
                    },
                });
                console.log("REVIEW INSIGHTS", reviewInsights)
                let appointment = await Appointment.findOne({
                    where: {
                        id: req.body.appointmentId
                    }
                })
                let finalSavedReview = await FinalReview.findOne({
                    where: {
                        appointmentId: req.body.appointmentId
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
            let parametersLink = await ParameterLink.findAll({
                where: {
                    appointmentId: req.params.appointmentId
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
                    appointmentId: req.params.appointmentId,
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
            for (let i = 0; i < req.body.ratings.length; i++) {
                let savedReview = await Review.create({
                    appointmentId: req.body.appointmentId,
                    parameterId: req.body.ratings[i].parameterId,
                    rating: req.body.ratings[i].value,
                })
                savedReviews.push(savedReview);
            }
            console.log("Saved the ratings for appointmentID ", req.body.appointmentId)

            let ans = await this.fetchReviewAndSuggestivePricing(savedReviews, req.body.appointmentId)

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

    async fetchReviewAndSuggestivePricing(reviews, appointmentId) {
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
            finalRating: finalRating
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