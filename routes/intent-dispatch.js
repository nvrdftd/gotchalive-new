'use strict';

var MongoClient = require('mongodb').MongoClient;
var data = require('./data');
var assert = require('assert');
var config = require('../config/database-config');
const username = config.username;
const password = config.password;
const host = config.host;
const port = config.port;

function intentDispatch(res, cb) {
  MongoClient.connect(`mongodb://${username}:${password}@${host}:${port}/tv`, function(err, db) {
    assert.equal(err, null);
    var tvDb = db;
    var movieDb = db.db('movie');
    movieDb.authenticate(username, password, function(err, result) {
      assert.equal(err, null);
      assert(result);
      var tvDA = new data.tvDA(tvDb);
      var movieDA = new data.movieDA(movieDb);

      if (res.intents.length != 0) {
        var intent = res.intents[0].intent;
        var query = {};
        switch (intent) {
          case 'upcoming':
            movieDA.upcoming(query, function(docs) {
              cb(docs);
            });
            break
          case 'playing':
            movieDA.playing(query, function(docs) {
              cb(docs);
            });
            break
          case 'airing':
            tvDA.airing(query, function(docs) {
              cb(docs);
            });
            break
          case 'specific_genre':
            collectGenre(res, function(genres) {
              query = { genre_ids: { $in: genres } };
              movieDA.playing(query, function(docs) {
                cb(docs);
              });
            });
            break
          case 'find_actor':
            query = { $text: { $search: res.input.text } };
            movieDA.actor(query, function(docs) {
              query = { id: { $in: docs } };
              movieDA.playing(query, function(docs) {
                cb(docs);
              });
            });
            break
        }
      } else {
        movieDA.upcoming({}, function(docs) {
          cb(docs);
        });
      }
    });
  });
}

function collectGenre(res, cb) {
  var i = 0;
  var genres = [];
  while (i < res.entities.length && res.entities[i].entity == 'genres') {
    genres.push(+res.entities[i].value);
    i++;
  }
  cb(genres);
}

module.exports = intentDispatch;
