const cron = require('node-cron');

const {BookingService} = require('../../services');



function scheduleCron(){
    cron.schedule('* */15 * * * *', async()=>{
        const response = await BookingService.cancelOldBookings();
        console.log("response = ",response);
    })
}

module.exports  = scheduleCron;