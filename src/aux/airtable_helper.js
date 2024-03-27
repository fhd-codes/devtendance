const { airtable_base } = require('./airtable_connection');

/**
    This file will have all the helper functions that will be used to get, or update
    Airtable records on discord interaction
*/


const isMemberExist = async ( discord_user_id ) => {
    const records = await airtable_base( process.env.MEMBERS_TABLE_ID ).select({
        filterByFormula: `{ID} = '${discord_user_id}'`,
    }).firstPage();

    return { is_exist: records.length > 0, record: records.length > 0 ? records[0] : [] };
}

const createNewMember = async ( discord_user_id, discord_username, discord_full_name ) => {

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


const punchCheckInTime = ( airtable_record_id, wfh ) => {
    
    // updating the availability status in the "members" table
    airtable_base('members').update([
        {
            "id": airtable_record_id,
            "fields": {
                "status": wfh ? "wfh" : "available"
            }
        }
    ]);

}

module.exports = {
    isMemberExist,
    createNewMember,
    punchCheckInTime
}