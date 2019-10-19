// Import packages
var expect  = require('chai').expect;
var request = require('request');
var rewire = require("rewire");

var app = rewire("../index.js"); // Creates an instance of the server for testing, and enables injection of mock data.

it('Get metrics when key does not exist', function(done) {
    request('http://localhost:3001/metric/somekey/sum' , function(error, response, body) {
        expect(response.statusCode).to.equal(404);
        expect(body).to.equal('Key not found');
        done();
    });
});

it('Get metrics when key exists but no values exist', function(done) {
    app.__set__("dataSet", {"somekey": []});
    request('http://localhost:3001/metric/somekey/sum' , function(error, response, body) {
        expect(body).to.equal('No existing values found for this key');
        done();
    });
});

it('Get metrics when key exists and all values are within the last hour', function(done) {
    // Creating mock dates date1 and date2 such that they're within the last one hour. 
    var date1 = new Date();
    var date2 = new Date();
    date1.setMinutes(date1.getMinutes() - 20);
    date2.setMinutes(date2.getMinutes() - 30);
    // Using rewire to inject mock data for dataSet for testing. 
    app.__set__("dataSet", {"somekey": [{"value": 5, "createdAt": date1}, {"value": 7, "createdAt": date2}]}); 
    request('http://localhost:3001/metric/somekey/sum' , function(error, response, body) {
        expect(body).to.equal('{"value":12}');
        done();
    });
});

it('Get metrics when key exists and some values are within the last hour', function(done) {
    // Creating mock dates date1 and date2 such that one of them is within an hour, while another is more than an hour ago. 
    var date1 = new Date();
    var date2 = new Date();
    date1.setMinutes(date1.getMinutes() - 80);
    date2.setMinutes(date2.getMinutes() - 30);
    // Using rewire to inject mock data for dataSet for testing. 
    app.__set__("dataSet", {"somekey": [{"value": 5, "createdAt": date1}, {"value": 7, "createdAt": date2}]});
    request('http://localhost:3001/metric/somekey/sum' , function(error, response, body) {
        expect(body).to.equal('{"value":7}');
        done();
    });
});

// Closing the server so the test stops listening to port 3001. 
after(function() {
    app.__get__("server").close();
});