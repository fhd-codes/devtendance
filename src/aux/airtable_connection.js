const Airtable = require('airtable');

const dotenv = require('dotenv');
dotenv.config();


Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_TOKEN
});

const airtable_base = Airtable.base( process.env.AIRTABLE_BASE_ID );

module.exports = {
    airtable_base
};

