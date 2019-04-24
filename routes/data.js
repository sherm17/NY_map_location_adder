const express     = require('express');
const router      =  express.Router();
const bodyParser  = require('body-parser');
const mysql       = require('mysql')
const config      = require('../config')

router.use(bodyParser.urlencoded({extended: false}));

const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

function getConnection() {
  return pool;
}

router.get('/data', function(req, res) {
  const connection = getConnection();
  connection.query("SELECT * FROM locations", function (err, results, fields) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.json(results);
  });
});


module.exports = router;