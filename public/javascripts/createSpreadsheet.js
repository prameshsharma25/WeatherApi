const { GoogleSpreadsheet } = require('google-spreadsheet');
const getWeatherData = require('./getWeatherData');
const dotenv = require('dotenv');

dotenv.config();

async function createSpreadsheetDocument() {
    const doc = new GoogleSpreadsheet(`${process.env.GOOGLE_SHEET_ID}`);

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    });

    await doc.loadInfo();
    await doc.updateProperties({ title: 'Weather Forecast'});

    createSpreadsheetByMonth(doc);
}

async function createSpreadsheetByMonth(doc) {
    const currentDocument = doc;
    let spreadsheetCount = currentDocument.sheetCount;

    if (spreadsheetCount < 1) {
        const sheet = await currentDocument.addSheet({ headerValues: ['Date', 'Description', 'Temperature', 'Humidity', 'Wind']});
    }
    else if (spreadsheetCount > 1) {
        while (spreadsheetCount > 1) {
            const currentSheet = currentDocument.sheetsByIndex[spreadsheetCount-1];
            await currentSheet.delete();
            spreadsheetCount = currentDocument.spreadsheetCount;
        }
    }
    else {
        /* Check if head row exists, than start adding weather data. */
        const currentSheet = currentDocument.sheetsByIndex[0];
        await currentSheet.updateProperties({ title: 'January' });
        const rows = await currentSheet.getRows();

        // await headRow.save();
        
        setInterval(async function() {
            loadWeatherData(currentSheet);
        }, 2000);
    }
}

async function loadWeatherData(sheet) {
    const weatherData = await getWeatherData().then(res => {
        console.log(res);
        return res;
    });

    const {weather, main, wind} = weatherData;

    const row = await sheet.addRow({
        'Date': new Date().toJSON().slice(0,10).replace(/-/g,'/'),
        'Description': weather[0]['description'],
        'Temperature': main['temp'],
        'Humidity': main['humidity'],
        'Wind': wind['speed']
    });
}


module.exports = createSpreadsheetByMonth;