const express = require('express')
const {BookingController} = require('../../controllers')

const router = express.Router();


// /api/v1/booking
router.post('/', BookingController.createBooking);

router.post('/payment',BookingController.makePayment);

module.exports = router;