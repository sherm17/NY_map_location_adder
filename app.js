const express   = require('express');
const mysql     = require('mysql');
const csv       = require('csv-parser');
const fs        = require('fs');
const morgan    = require('morgan');

const app = express();

const router = require('./routes/index.js')
const dataRoute = require('./routes/data')

app.use(express.static(__dirname + "/public"))
app.use(express.static(__dirname + "/dist"))


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// data route
app.use(router);
app.use(dataRoute);

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port 3000');
});



