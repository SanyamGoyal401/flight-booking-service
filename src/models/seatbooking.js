'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeatBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SeatBooking.init({
    flightId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seatId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'SeatBooking',
  });
  return SeatBooking;
};