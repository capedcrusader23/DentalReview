const { DataTypes } = require('sequelize');

const Parameters = {
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    paramterName:{
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    timestamp: {
        type: DataTypes.DATE,
    },
    isActive : {
        type: DataTypes.BOOLEAN,
    }
}

module.exports = Parameters