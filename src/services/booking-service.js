const axios = require('axios')

const {BookingRepository} = require('../repositories')
const db = require('../models');
const {ServerConfig} = require('../config');
const serverConfig = require('../config/server-config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');


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
            return booking;
        })
        return result;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports={
    createBooking,
}