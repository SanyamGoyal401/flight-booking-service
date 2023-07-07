const axios = require('axios')

const {BookingRepository} = require('../repositories')
const db = require('../models');
const {ServerConfig} = require('../config');
const serverConfig = require('../config/server-config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const {Enums} = require('../utils/common');
const { BOOKED, CANCELLED, INITIATED, PENDING } = Enums.BOOKING_STATUS;


const bookingRepository = new BookingRepository();
async function createBooking(data){
    try {
        const result = await db.sequelize.transaction(async function bookingImpl(t){
            const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            const flightData = flight.data.data;
            if(data.noOfSeats > flightData.totalSeats){
                throw new AppError("Not enough seats", StatusCodes.BAD_REQUEST)
            }

            const totalBillingAmount = data.noOfSeats * flightData.price;
            
            const bookingPayLoad = {...data, totalCost: totalBillingAmount};
            
            const booking = await bookingRepository.create(bookingPayLoad);

            await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {seats: data.noOfSeats});
            console.log(booking);
            return booking;
        })
        console.log(result);
        return result;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function makePayment(data){
    try {
        const result = await db.sequelize.transaction(async function verifyDetails(t){
            const bookingDetails = await bookingRepository.get(data.bookingId);
            const bookingTime = new Date(bookingDetails.createdAt);
            const currentTime = new Date();
            if(bookingDetails.status == CANCELLED){
                throw new AppError('Booking Expired', StatusCodes.BAD_REQUEST);
            }
            if(currentTime - bookingTime > 300000){
                await bookingRepository.update(data.bookingId, {status: CANCELLED});
                throw new AppError('Booking Expired', StatusCodes.BAD_REQUEST);
            }
            
            if(bookingDetails.totalCost != data.totalCost){
                throw new AppError("The amount doesn't match", StatusCodes.BAD_REQUEST);
            }
            if(bookingDetails.userId != data.userId){
                throw new AppError("The user corresponding to booking doesnot match", StatusCodes.BAD_REQUEST);
            }

            //assuming payment is successful
            const response = await bookingRepository.update(data.bookingId, {status: BOOKED});
            console.log(response);
            return response;
        })
        console.log(result);
        return result;
        
    } catch (error) {
        
    }
}

module.exports={
    createBooking,
    makePayment,
}