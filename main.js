import express from 'express';
import createSpreadsheetByMonth from './createSpreadsheet.js';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello Weather!');

    // createSpreadsheetByMonth();
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});