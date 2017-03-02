'use strict';
var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    supertest = require('supertest'),
    request = supertest('https://gotcha.live');

describe('Acquiring', function() {
  it('homepage should return a 200 response', function(done) {
    request.get('/')
           .expect(200, done);
  });
  it('a list of videos should return a 200 response', function(done) {
    request.get('/api/videos/6756')
           .expect(200, done);
  });
});

describe('Sending conversation messages', function() {
  it('should return a 200 response through the POST method', function(done) {
    request.post('/conversation')
           .set('Accept', 'application/json')
           .expect(200, done);
  });
  it('should receive an error through the GET method', function(done) {
    request.get('/conversation')
           .set('Accept', 'application/json')
           .expect(404, done);
  });
});
