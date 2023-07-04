const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services')
const {ErrorResponse, SuccessResponse} = require("../utils/common");
async function createBooking(req, res){
    console.log(req)
    try {
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats,
        });
        SuccessResponse.data = response;
        res.status(StatusCodes.OK)
            .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        res.status(error.statusCode)
            .json(ErrorResponse);
    }
} 

module.exports = {
    createBooking,
}