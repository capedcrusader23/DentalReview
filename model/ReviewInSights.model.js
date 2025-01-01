const { DataTypes } = require('sequelize');

const ReviewInsights = {
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    appointmentId:{
        type: DataTypes.UUID,
    },
    suggestivePricing:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    optedPricing:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}

module.exports = ReviewInsights