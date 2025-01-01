const { DataTypes } = require('sequelize');

const ParamterLink = {
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
    }
}

module.exports = ParamterLink