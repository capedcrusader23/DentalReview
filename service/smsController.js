const { Op } = require('sequelize');
const twilio = require('twilio');
const config = require('config');
const accountSid = process.env.TWILLIO_ACCOUNT_ID;  // from your Twilio console
const authToken = process.env.TWILLIO_AUTH_TOKEN;     // from your Twilio console
const { Appointment, Review, Parameter, ParameterLink } = require("../model/index.model");
const { firstName, lastName, isPaid, phoneNo } = require('../model/appointment.model');
const { timestamp } = require('../model/parameters.model');
const { appointmentId } = require('../model/review.model');
const client = twilio(accountSid, authToken);
const SendSmsValidation = require("../validation/SendSmsValidation");
const { structureResponse } = require('../utils/common.utils');
const { InvalidPropertiesException } = require("../utils/exceptions/validation.exception")
const shortid = require('shortid');


class smsController {
    async sendSms(req, res) {
        try {
            console.log(req.body)
            let validator = new SendSmsValidation(req.body);
            validator.validate();
            const shortId = shortid.generate();
            let createdAppointment = await Appointment.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                pricing: JSON.stringify(req.body.pricing),
                // pricing: JSON.stringify(req.body.pricing),
                isPaid: false,
                phoneNo: req.body.phoneNo,
                timestamp: new Date(),
                shortId: shortId,
                age: req.body.age,
            });
            let parameters = await Parameter.findAll({
                where: {
                    isActive: true,
                }
            });

            for (let i = 0; i < parameters.length; i++) {
                let parameterLink = {
                    appointmentId: createdAppointment.dataValues.id,
                    parameterId: parameters[i].dataValues.id,
                }
                await ParameterLink.create({
                    ...parameterLink
                })
            }
            console.log("Record created with id ", createdAppointment.dataValues.id)
            const message = await client.messages.create({
                body: "Hi "+ req.body.firstName +" "+req.body.lastName+", this is a confirmation for your Valu3 appointment. Please complete the payment here: " + "https://getValu3.com/payment/" + shortId,
                from: "+16205428380",
                to: "+91" + req.body.phoneNo
            });
            console.log("Message sent to number " + phoneNo + "with twillio id" + message.sid);
            let response = structureResponse(req.body, 1, "Sms Sent Successfully");
            console.log(response)
            return res.status(200).json({
                message: response.headers.message,
                data: response.body,
            })
        } catch (err) {
            console.log(err);
            let response;
            if (err instanceof InvalidPropertiesException) {
                response = structureResponse(err.data, 0, "Failure")
            } else {
                response = structureResponse("Something Went Wrong", 0, "Failure")
            }
            return res.status(500).json({
                message: response.headers.message,
                data: response.body,
            })
        }
    }

    async getAppointments(req, res) {
        try {
            let appointments = await Appointment.findAll();
            let response = structureResponse(appointments, 1, "Appointments Fetched");
            return res.status(200).json({
                message: response.headers.message,
                data: response.body,
            })
        } catch (err) {
            console.log(err);
            let response;
            if (err instanceof InvalidPropertiesException) {
                response = structureResponse(err.data, 0, "Failure")
            } else {
                response = structureResponse("Something Went Wrong", 0, "Failure")
            }
            return res.status(500).json({
                message: response.headers.message,
                data: response.body,
            })
        }
    }
}

module.exports = new smsController();