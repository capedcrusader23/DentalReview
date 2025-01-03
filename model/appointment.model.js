const { DataTypes, Sequelize } = require('sequelize');

const Appointment = {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    pricing: {
        type: DataTypes.STRING,
    },
    phoneNo:{
        type: DataTypes.STRING,
    }
}

module.exports = Appointment