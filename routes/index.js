const express = require('express');
const createSpreadsheetByMonth = require('../public/javascripts/createSpreadsheet');

const app = express();
const router = express.Router();

app.get('/', (req, res) => {
    res.send('Hello Weather!');

    // createSpreadsheetByMonth();
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on PORT: ${process.env.PORT}`);
});

// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;