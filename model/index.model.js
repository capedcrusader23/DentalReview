const { Sequelize } = require('sequelize');
const config = require("config")
const AppointmentSchema = require("./appointment.model");
const ReviewSchema = require("./review.model");
const ParameterSchema = require("./parameters.model");
const ParameterLinkSchema = require("./parameter_link.model");
const FinalReviewSchema = require("./finalReview.model");
const ReviewInSightsSchema = require("./ReviewInSights.model");
const OrderSchema = require("./order.model");
console.log({ db_name: process.env.DB_NAME, db_user: process.env.DB_USER, db_password: process.env.DB_PASSWORD, db_host: process.env.DB_HOST })
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
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
            alter: true,
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