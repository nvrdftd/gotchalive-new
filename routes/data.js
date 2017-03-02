'use strict';

var assert = require('assert');

// access tv data
function tvDA(db) {

  this.airing = function(query = {}, cb) {
    db.collection('airing').find(query).toArray(function(err, docs) {
      assert.equal(err, null);
      cb(docs);
    });
  };

  this.actor = function(query = {}, cb) {
    let arrOfId = [];
    db.collection('credits').find(query, { _id: 0, id: 1}).forEach(function(doc) {
      arrOfId.push(doc.id);
    }, function(err) {
      assert.equal(err, null);
      cb(arrOfId);
    });
  };
}

// access movie data
function movieDA(db) {

  this.playing = function(query = {}, cb) {
    db.collection('playing').find(query).toArray(function(err, docs) {
      assert.equal(err, null);
      cb(docs);
    });
  };

  this.upcoming = function(query = {}, cb) {
    db.collection('upcoming').find(query).toArray(function(err, docs) {
      assert.equal(err, null);
      cb(docs);
    });
  };

  this.actor = function(query = {}, cb) {
    let arrOfId = [];
    db.collection('credits').find(query, { _id: 0, id: 1}).forEach(function(doc) {
      arrOfId.push(doc.id);
    }, function(err) {
      assert.equal(err, null);
      cb(arrOfId);
    });
  };
}

module.exports.tvDA = tvDA;
module.exports.movieDA = movieDA;
