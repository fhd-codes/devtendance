const UIDGenerator = require('uid-generator');

const { airtable_base } = require('./airtable_connection');
const { getActiveHours } = require('./general_helper');

const uidgen = new UIDGenerator();

/**
    This file will have all the helper functions that will be used to get, or update
    Airtable records on discord interaction
*/


const isMemberExist = async ( discord_user_id ) => {
    /**
        @params = { string }
        @returns = { object } - an object with a boolean (true if user exists else false) 
        and airtable record object if user exists else null
    */

    const records = await airtable_base('members').select({
        filterByFormula: `{ID} = '${discord_user_id}'`,
    }).firstPage();

    return { is_exist: records.length > 0, record: records.length > 0 ? records[0] : null };
}

const createNewMember = async ( discord_user_id, discord_username, discord_full_name ) => {
    /**
        @params = { string, string, string }
        @returns = { string } - airtable record id
    */

    const new_rec = await airtable_base('members').create(
        [
            { 
                "fields": {
                    "ID": discord_user_id,
                    "discord_username": discord_username,
                    "discord_full_name": discord_full_name
                }
            },
        ]
    );

    return await new_rec[0];
}


const punchTime = async ( airtable_record_id, discord_user_id, discord_full_name, punch_type, wfh=false, notes=null ) => {
    /**
        @params = { string, string, string, bool=false, string=null } - punch_type will be one of these: 
        ["in", "out", "brb", "back"]. Notes will be any string
        @returns = { null }
    */

    let user_status = null;

    if( punch_type === "in" || punch_type === "back" ){
        user_status = wfh ? "available_wfh" : "available";
    } else if( punch_type === "brb" ){
        user_status = "brb";
    } else if( punch_type === "out" ){
        user_status = "offline";
    }

    // NOTE: for the attendance ledger, the terminologies are a bit different than the user status. 
    // So, replacing "available" with "checkin" and "offline" with "checkout" from the user_status value
    let attendance_type = user_status.replace("available", "checkin");
    attendance_type = attendance_type.replace("offline", "checkout");

    try{
        // updating the availability status in the "members" table
        await airtable_base('members').update([
            {
                "id": airtable_record_id,
                "fields": {
                    "status": user_status,
                    "notes": punch_type === "out" ? "" : notes
                }
            }
        ]); 

        const ledger_rec = await airtable_base('attendance_ledger').create([
            {
                "fields": {
                    "uid": uidgen.generateSync(), // this is uid for checkin checkout
                    "discord_user_id": discord_user_id,
                    "discord_full_name": discord_full_name,
                    "type": attendance_type,
                    "progress_report": punch_type === "out" ? notes : ""
                }
            },
        ]);

        return ledger_rec;


    } catch( error ){
        console.error("Error handling updating ledger:", error);
        return res.status(500).send("Error handling ledger. Please try again later.");
    }


}

const getReportData = async ( report_duration ) => {
    /**
        @params = { string } - the value can be one of the following: ["last_7_days", "last_30_days", "last_month", "last_2_months"]
        @returns = { array } - an array of objects where each object contains the member's name and its active hours
    */


    // TODO: make the formula for the last month and last 2 months
    const formula_lookup = {
        last_7_days: `
        IS_AFTER( 
            DATESTR( CREATED_TIME() ),
            DATESTR( DATEADD( TODAY(), -7, 'days' ))
        )`,
        last_30_days: `
        IS_AFTER( 
            DATESTR( CREATED_TIME() ),
            DATESTR( DATEADD( TODAY(), -30, 'days' ))
        )`,
        last_month: ``,
        last_2_months: ``,
    }
    let records_list = [];

    try{
        await airtable_base('attendance_ledger').select({
            filterByFormula: formula_lookup[report_duration],

        }).eachPage( function page(records, fetchNextPage)  {
            records_list.push( ...records  );
            fetchNextPage();

        });

        /**
        grouping the records based on discord_user_id. The result will be like this:
            const records_list_grouped = {
                '720900787206881290': {
                    full_name: 'Snippy Microbe',
                    records: [ {Record}, {Record}, {Record}, {Record} ]
                },
                '1180048229396656239': {
                    full_name: 'Muhammad Ali',
                    records: [ {Record}, {Record}, {Record}, {Record} ]
                },
                ...
            };

            NOTE: this Record will only have the "Record.fields" object in it
        */
        const records_fields_grouped = records_list.reduce((acc, obj) => {
            acc[obj.fields.discord_user_id] = acc[obj.fields.discord_user_id] || {full_name: obj.fields.discord_full_name, record_fields: []};
            acc[obj.fields.discord_user_id].record_fields.push(obj.fields);
            return acc;
        }, {});
        
        let report_data = [];
        Object.entries(records_fields_grouped).forEach( ([key, user_rec]) => {
            // sorting the records wrt time field (in ascending order)
            const time_sorted_recs = user_rec.record_fields.sort((a, b) => {
                return new Date(a.time) - new Date(b.time);
            });

            const active_hrs = getActiveHours( time_sorted_recs );
            report_data.push( {name: user_rec.full_name, active_hrs: active_hrs} )
        });

        return report_data;
    

    } catch( error ){
        console.error("Error handling updating ledger:", error);
        return res.status(500).send("Error generating report. Please try again later.");
    }
}


module.exports = {
    isMemberExist,
    createNewMember,
    punchTime,
    getReportData
}