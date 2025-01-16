const { Sequelize } = require('sequelize');
const config = require("config")
const AppointmentSchema = require("./appointment.model");
const ReviewSchema = require("./review.model");
const ParameterSchema = require("./parameters.model");
const ParameterLinkSchema = require("./parameter_link.model");
const FinalReviewSchema = require("./finalReview.model");
const ReviewInSightsSchema = require("./ReviewInSights.model");
const OrderSchema = require("./order.model");

const sequelize = new Sequelize(
    config.get("testDBLocal").get("database"),
    config.get("testDBLocal").get("user"),
    config.get("testDBLocal").get("password"),
    {
        host: config.get("testDBLocal").get("host"),
        dialect: "mysql",
    },
);

const Appointment = sequelize.define("appointments", AppointmentSchema)
const Review = sequelize.define("reviews", ReviewSchema)
const Parameter = sequelize.define("parameters", ParameterSchema)
const ParameterLink = sequelize.define("parameterLink", ParameterLinkSchema)
const FinalReview = sequelize.define("finalReview", FinalReviewSchema)
const ReviewInsight = sequelize.define("reviewInsights", ReviewInSightsSchema)
const Order = sequelize.define("orders", OrderSchema)

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        return sequelize.sync({
            // alter: true,
            logging: true,
        })
    })
    .then(() => {
        console.log("Schemas synced");
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
        process.exit(4)
    })

module.exports = {
    Appointment,
    Review,
    Parameter,
    ParameterLink,
    FinalReview,
    ReviewInsight,
    Order
}