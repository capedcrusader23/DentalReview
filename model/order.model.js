const { DataTypes, Sequelize } = require('sequelize');

const Order = {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    appointmentId: {
        type: DataTypes.UUID,
    },
    status: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.STRING,
    },
    razorpayOrderId:{
        type: DataTypes.STRING,
    },
    receiptUrl:{
        type:DataTypes.TEXT,
    }
}

module.exports = Order