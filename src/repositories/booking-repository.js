const {StatusCodes} = require('http-status-codes');

const {Booking} = require('../models');
const CrudRepository = require('./crud-repository');
const { Op } = require('sequelize');
const { Enums } = require('../utils/common');
const { BOOKED, CANCELLED, } = Enums.BOOKING_STATUS;


class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking)
    }



    async cancelOldBookings(timestamps){
        const response = await Booking.update({status: CANCELLED},{
            where: {
                [Op.and]: [
                    {
                        createdAt : {
                            [Op.lt]: timestamps
                        }
                    },
                    {
                        status: {
                            [Op.ne]: BOOKED
                        }
                    },
                    {
                        status: {
                            [Op.ne] : CANCELLED
                        }
                    }

                ]
            }
        })
        console.log(response);
        return response;
    }
}

module.exports = BookingRepository;