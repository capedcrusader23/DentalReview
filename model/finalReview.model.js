const { DataTypes,Sequelize } = require('sequelize');

const FinalReview = {
    id:{
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    appointmentId:{
        type: DataTypes.UUID,
    },
    finalRating:{
        type: DataTypes.FLOAT,
        defaultValue: 0,
    }
}

module.exports = FinalReview