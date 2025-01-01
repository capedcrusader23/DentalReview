const { Sequelize } = require('sequelize');
const config = require("config")
const AppointmentSchema = require("./appointment.model");
const ReviewSchema = require("./review.model");
const ParameterSchema = require("./parameters.model");
const ParameterLinkSchema = require("./parameter_link.model");

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
const ParameterLink = sequelize.define("reviews", ParameterLinkSchema)


sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        return sequelize.sync({
            // alter: true,
            // logging: true,
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
    ParameterLink
}