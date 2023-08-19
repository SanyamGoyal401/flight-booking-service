const axios = require('axios')

const { BookingRepository } = require('../repositories')
const db = require('../models');
const { ServerConfig, Queue } = require('../config');
const serverConfig = require('../config/server-config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { Enums } = require('../utils/common');
const {createSeatBooking}  = require('./seat-booking-service');
const { BOOKED, CANCELLED} = Enums.BOOKING_STATUS;


const bookingRepository = new BookingRepository();
async function createBooking(data) {
    try {
        const result = await db.sequelize.transaction(async function bookingImpl(t) {
            const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            const flightData = flight.data.data;
            if (data.noOfSeats > flightData.totalSeats) {
                throw new AppError("Not enough seats", StatusCodes.BAD_REQUEST)
            }

            const totalBillingAmount = data.noOfSeats * flightData.price;

            const bookingPayLoad = { ...data, totalCost: totalBillingAmount };
            
            const booking = await bookingRepository.create(bookingPayLoad);
            
            await createSeatBooking({
                flightId : data.flightId,
                seats : data.seats,
                bookingId : booking.id,
            });
            await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, { seats: data.noOfSeats });
            return booking;
        })
        return result;
    } catch (error) {
        if(error instanceof AppError)throw error;
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function makePayment(data) {
    try {
        const result = await db.sequelize.transaction(async function verifyDetailsAndBook(t) {
            const bookingDetails = await bookingRepository.get(data.bookingId);
            const bookingTime = new Date(bookingDetails.createdAt);
            const currentTime = new Date();
            if (bookingDetails.status == CANCELLED) {
                throw new AppError('This booking has been cancelled', StatusCodes.BAD_REQUEST);
            }
            if (currentTime - bookingTime > 300000) {
                await cancelBooking(bookingDetails.id);
                throw new AppError('Booking Expired', StatusCodes.BAD_REQUEST);
            }

            if (bookingDetails.totalCost != data.totalCost) {
                throw new AppError("The amount doesn't match", StatusCodes.BAD_REQUEST);
            }
            if (bookingDetails.userId != data.userId) {
                throw new AppError("The user corresponding to booking doesnot match", StatusCodes.BAD_REQUEST);
            }

            //assuming payment is successful
            const response = await bookingRepository.update(data.bookingId, { status: BOOKED });
            Queue.sendData({
                recepientEmail: 'sanyamgoyal2859@gmail.com',
                subject: 'Flight Booked',
                body: `Booking successfully done for the Flight.\nDetails are: ${JSON.stringify(bookingDetails)}`
            })
            return response;
        })
        return result;
    } catch (error) {
        if(error instanceof AppError)throw error;
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);    }
}



async function cancelBooking(bookingId) {
    try {
        const result = await db.sequelize.transaction(async function cancelBookingAndUpdate(t) {
            const bookingDetails = await bookingRepository.get(bookingId);
            if (bookingDetails.status == CANCELLED) {
                return true;
            }
            await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
                seats: bookingDetails.noOfSeats,
                dec: false
            });
            await bookingRepository.update(bookingId, {
                status: CANCELLED
            });
            return true;
        })
        return result;
    } catch (error) {
        if(error instanceof AppError)throw error;
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function cancelOldBookings(){
    try{
        const timestamp = new Date(Date.now() - 1000*300);
        const response = await bookingRepository.cancelOldBookings(timestamp);
        return response;
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    createBooking,
    makePayment,
    cancelOldBookings
}