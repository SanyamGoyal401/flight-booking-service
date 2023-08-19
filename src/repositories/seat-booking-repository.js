const {SeatBooking} = require('../models');
const CrudRepository = require('./crud-repository');


class SeatBookingRepository extends CrudRepository{
    constructor(){
        super(SeatBooking)
    }
}

module.exports = SeatBookingRepository;