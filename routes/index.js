var express = require('express');
var assert = require('assert');
var intentDispatch = require('./intent-dispatch');
var watson = require('./watson-conversation');
var router = express.Router();


router.use('/conversation', watson);

router.post('/conversation', function(req, res) {
  intentDispatch(res.watsonResponse, function(docs) {
    res.watsonResponse.results = docs;
    res.json(res.watsonResponse);
  });
});

router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;
