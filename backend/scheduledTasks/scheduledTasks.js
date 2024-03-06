const cron = require('node-cron');
const databaseConnection = require('../database/databaseConnection');

async function cancelUnfinishedAppointments() {
    console.log('Scheduler checking for unfinished bank_user_appointments');
    const query = `UPDATE BANK_USER_APPOINTMENTS SET STATUS = 'CANCELED' WHERE STATUS = 'PENDING' AND APPOINTMENT_DATE < SYSDATE`;
    const binds = {};
    try{
        const result = await databaseConnection.execute(query, binds);
        if (result.rowsAffected > 0) {
            console.log('Canceled unfinished appointments');
        }else{
            console.log('No unfinished appointments');
        }
    }
    catch(err){
        console.log("Error in cancelUnfinishedAppointments")
        console.log(err);
    }
}

cron.schedule('0 0 * * *', async () => {
    await cancelUnfinishedAppointments();
    console.log('Scheduler finished');
});

module.exports = {
    cancelUnfinishedAppointments
}
