const express = require('express');
const { createSpreadsheetDocument, loadWeatherData } = require('../public/javascripts/createSpreadsheet');

const app = express();
const router = express.Router();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './views'});

  setInterval(async () => {
    const sheet = await createSpreadsheetDocument();
    loadWeatherData(sheet);
  }, 5000);

});

app.listen(process.env.PORT, () => {
    console.log(`Listening on PORT: ${process.env.PORT}`);
});


module.exports = router;