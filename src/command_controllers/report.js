const { 
    getReportData
} = require('../aux/airtable_helper.js');

const { botSuccessReply } = require('../aux/bot_helper.js');


const generateReport = async (req, res) => {
    const { data, token } = req.body;
    
    const entered_pwd = data.options[0].value;
    const report_duration = data.options[1].value;

    const duration_lookup = {
        last_7_days: "last 7 days",
        last_30_days: "last 30 days",
        last_month: "last month",
        last_2_months: "last 2 month",
    };

    if( entered_pwd !== process.env.REPORT_PWD ){
        botSuccessReply( token, "You have entered a wrong password" );
        return;
    }

    const report_array = await getReportData( report_duration );
    let report_message = `## Report for the ${duration_lookup[report_duration]}\n`;

    report_array.forEach( user => {
        report_message += "```Name: " + user.name + "\nActive hours: " + user.active_hrs + " hrs\n```"
    });


    botSuccessReply( token, report_message );

}


module.exports = {
    generateReport,
}