const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services')
const { ErrorResponse, SuccessResponse } = require("../utils/common");


const inMemDB = {};
async function createBooking(req, res) {
    try {
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats,
            seats: req.body.seats
        });
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK)
            .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
            .json(ErrorResponse);
    }
}
async function makePayment(req, res) {
    try {
        const idempotencyKey = req.header('x-idempotency-key');
        console.log(idempotencyKey);
        if (!idempotencyKey) {
            ErrorResponse.error = "Idempotency Key Missing";
            return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
        }
        if (inMemDB[idempotencyKey]) {
            ErrorResponse.error = 'Cannot retry on a successful payment'
            return res.status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
        }
        const response = await BookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId,
        });
        inMemDB[idempotencyKey] = idempotencyKey;
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK)
            .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
            .json(ErrorResponse);
    }
}

module.exports = {
    createBooking,
    makePayment,
}