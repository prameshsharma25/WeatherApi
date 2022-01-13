const { GoogleSpreadsheet } = require('google-spreadsheet');
const getWeatherData = require('./getWeatherData');
const dotenv = require('dotenv');

dotenv.config();

const createSpreadsheetDocument = async () => {
    const doc = new GoogleSpreadsheet(`${process.env.GOOGLE_SHEET_ID}`);

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    });

    await doc.loadInfo();
    await doc.updateProperties({ title: 'Weather Forecast'});

    const sheet = await createSpreadsheetByMonth(doc);

    return sheet;
}

const createSpreadsheetByMonth = async (currentDocument) => {
    const currentSpreadsheetTitle = getSpreadsheetTitle(currentDocument);
    const currentMonth = getCurrentMonth();
    let sheet;

    if (currentSpreadsheetTitle != currentMonth) {
        sheet = await currentDocument.addSheet({ headerValues: ['Date', 'Description', 'Temperature', 'Humidity', 'Wind']});
        updateGoogleSheetTitle(sheet, currentMonth);
    }
    else {
        sheet = getCurrentSpreadsheet(currentDocument); 
    }

    return sheet;
}

const loadWeatherData = async (googleSheet) => {
    const weatherData = await getWeatherData().then(res => {
        return res;
    });

    const {weather, main, wind} = weatherData;

    const row = await googleSheet.addRow({
        'Date': new Date().toJSON().slice(0,10).replace(/-/g,'/'),
        'Description': weather[0]['description'],
        'Temperature': main['temp'],
        'Humidity': main['humidity'],
        'Wind': wind['speed']
    });
}

const getCurrentSpreadsheet = (googleSheetDoc) => {
    const currentSheet = googleSheetDoc.sheetsByIndex.at(-1);

    return currentSheet;
}

const getSpreadsheetTitle = (googleSheetDoc) => {
    const { title } = Object.values(googleSheetDoc.sheetsByTitle).at(-1);
    
    return title;
}

const getCurrentMonth = () => {
    const listOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
    const currentMonth = listOfMonths[currentDate.getMonth()];
    
    return currentMonth;
}

const updateGoogleSheetTitle = async (googleSheet, month) => {
    await googleSheet.updateProperties({ title: month });
}

module.exports = {
    createSpreadsheetDocument,
    loadWeatherData
}