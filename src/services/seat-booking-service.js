const {SeatBookingRepository } = require('../repositories')
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { Transaction } = require('sequelize');


const seatBookingRepository = new SeatBookingRepository();

async function createSeatBooking(data) {
    try {
        const result = await db.sequelize.transaction({
                isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
            },
            async function seatBookingImpl(t) {
                for(sId of data.seats){
                    await seatBookingRepository.create({
                        flightId : data.flightId,
                        seatId : sId,
                        bookingId: data.bookingId,
                    });
                }
                return true;
        })
        return result;
    } catch (error) {
        console.log(error);
        if(error.name === 'SequelizeUniqueConstraintError'){
            throw new AppError("The seat you selected has already been selected by another person", StatusCodes.CONFLICT);
        }
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createSeatBooking,
}