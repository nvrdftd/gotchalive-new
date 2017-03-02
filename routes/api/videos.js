var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('../../config/database-config');
var router = express.Router();
const username = config.username;
const password = config.password;
const host = config.host;
const port = config.port;

router.get('/videos/:id', function(req, res) {
  MongoClient.connect(`mongodb://${username}:${password}@${host}:${port}/tv`, function(err, db) {
    assert.equal(err, null);

    var tvDb = db;
    var movieDb = db.db('movie');

    movieDb.authenticate(username, password, function(err, result) {
      assert.equal(err, null);
      assert(result);

      var query = [
        { $match: { id: +req.params.id } },
        { $project: { _id: 0, keys: '$results.key' } }
      ];

      tvDb.collection('videos').aggregate(query, function(err, doc) {
        assert.equal(err, null);
        if (doc.length == 0) {
          movieDb.collection('videos').aggregate(query, function(err, doc) {
            assert.equal(err, null);
            res.json(doc[0]);
          });
        } else {
          res.json(doc[0]);
        }
      });
    });
  });
});

module.exports = router;
