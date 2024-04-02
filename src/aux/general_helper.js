

const addHoursToCurrentTime = ( hours ) => {
    /**
        @params = { int } - number of hours
        @returns = { string } - time in format hh:mm (AM/PM)
    */
    const date = new Date();

    const hoursToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date.toLocaleTimeString('en-US', {hour12: true, hour: '2-digit', minute: '2-digit'});

}


const getTimeDiffMinutes = ( t1, t2 ) => {
    /**
        @params = { string, string } - 2 timestamp in 2024-04-02T06:07:46.000Z format
        @returns = { float } - number of minutes between these timestamps
    */

    return Math.abs((new Date(t2) - new Date(t1)) / (1000 * 60));

}

const getActiveHours = ( time_sorted_record_fields ) => {
    /**
        This function will loop through the records and 

        @params = { array } - an array of airtable records (sorted wrt time) from attendance_ledger table of a user
        @returns = { float } - number of active hours of that user
    */

    let active_minutes = 0;

    let active_timestamp = null; let away_timestamp = null;

    time_sorted_record_fields.forEach( rec_fields => {
        active_timestamp = rec_fields.type.includes('checkin') ? rec_fields.time : active_timestamp
        
        if( rec_fields.type.includes('checkout') || rec_fields.type.includes('brb') && active_timestamp !== null ){
            away_timestamp = rec_fields.time;
            active_minutes += getTimeDiffMinutes( active_timestamp, away_timestamp );

            active_timestamp = null; away_timestamp = null; // resetting the timestamp variables
        }

    });

    return ( active_minutes / 60 ).toFixed(2); // converting minutes to hours
}


module.exports = {
    addHoursToCurrentTime,
    getTimeDiffMinutes,
    getActiveHours
}