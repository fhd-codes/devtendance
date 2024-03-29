const UIDGenerator = require('uid-generator');

const { airtable_base } = require('./airtable_connection');

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


const punchTime = async ( airtable_record_id, discord_user_id, punch_type, wfh=false, notes=null ) => {
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

    // updating the availability status in the "members" table
    airtable_base('members').update([
        {
            "id": airtable_record_id,
            "fields": {
                "status": user_status,
                "notes": notes
            }
        }
    ]);

    airtable_base('attendance_ledger').create(
        [
            {
                "fields": {
                    "uid": uidgen.generateSync(), // this is uid for checkin checkout
                    "discord_user_id": discord_user_id,
                    "type": attendance_type
                }
            },
        ]
    )

}

module.exports = {
    isMemberExist,
    createNewMember,
    punchTime
}