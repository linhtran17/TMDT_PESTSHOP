const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Model = sequelize.define('OrderDetails', {
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    note: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'OrderDetails',
    timestamps: false
});

module.exports = Model;