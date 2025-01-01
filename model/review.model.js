const { DataTypes } = require('sequelize');

const Review = {
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    appointmentId:{
        type: DataTypes.UUID,
    },
    parameterId: {
        type: DataTypes.UUID,
    },
    rating:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}

module.exports = Review