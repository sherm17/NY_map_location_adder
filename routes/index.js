const express     = require('express');
const mysql       = require('mysql');
const router      = express.Router();
const bodyParser  = require('body-parser');
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

router.post('/create_user', function(req, res) {
  var sql = "INSERT INTO locations (suggestion, category, locationName, address, latitude, longitude, notes) VALUES ?";
  var values = [
    [req.body.suggestedBy, req.body.category, req.body.locationName, req.body.fullAddress, req.body.latitude, req.body.longitude, req.body.notes]
  ];
  const connection = getConnection();
  connection.query(sql, [values], function(err, result) {
    if (err) throw err;
  })
  res.end();
});

module.exports = router;