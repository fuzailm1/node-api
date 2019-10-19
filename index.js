// Import packages
const express = require('express');
const app = express();

app.use(express.json()) // for parsing application/json

// Example data structure. Initializing as an empty object. 
var dataSet =  {
    // 
    //     "key": [
    //                 {
    //                     "value": 5,
    //                     "createdAt": Sat Oct 19 2019 13:24:51 GMT-0500 (Central Daylight Time)
    //                 }
    //             ]
    // 
};

/**
 * @name  Get Sum.
 * @path  {GET} /metric/:key/sum
 * @params {String} :key is the unique identifier to select the metric to sum.
 * @response {object} An object with the sum value of the metric.
 * @code {200} If request is succesful.
 * @code {404} If the :key cannot be found. 
 */
app.get('/metric/:key/sum', function (req, res) {
    const key = req.params.key;
    if(key in dataSet) { // If Key is found in the dataSet.
        var sum = 0;
        if (dataSet[key].length === 0) // If Key is found but doesn't have any values. 
            res.send('No existing values found for this key');
        else {
            dataSet[key].forEach(dataValue => { // Key and values are found, iterate over and sum up values created within the last hour.
                var diffMinutes = Math.abs(new Date() - dataValue.createdAt)/(1000*60);
                if(diffMinutes < 60) {
                    sum += dataValue.value;
                }
            });
            res.send( {"value": sum } ); // Sum of values created within last hour. 0 if all values are > 60 mins old.
        }
    }
    else {
        res.status(404).send('Key not found'); // Key not found in the dataSet. 
    }
});

/**
 * @name Post Metric Values.
 * @path  {POST} /metric/:key
 * @params  {String} :key is the unique identifier for the metric for which the value submitted.
 * @response {object} An empty object if data is successfully added.
 * @code {200} If request is succesful.
 * @code {400} If there is a problem with the request. 
 */
app.post('/metric/:key', function (req, res) {
    const key = req.params.key;
    if(!("value" in req.body)) { // If there isn't a 'value' in the body
        res.status(400).send('Bad Request! No "value" found.');
    }
    else if (typeof(req.body.value) !== "number") { // If the "value" field doesn't contain a number
        res.status(400).send('Bad Request! "value" is not a number.');
    } else {
        var dataObject = {}; // Creating an object to push into the dataSet. 
        dataObject.value = Math.round(req.body.value); 
        dataObject.createdAt = new Date(); 
        if(key in dataSet) { 
            dataSet[key].push(dataObject); // Add value to the existing key.
        }
        else { 
            dataSet[key] = [dataObject]; // Create a new key with the value in the request.
        }
        res.send({}); 
    }
});

app.use(express.json()) // for parsing application/json

// Initializing the server on port 3001. 
var server = app.listen('3001', () => {
    console.log('listening on port 3001');
});

module.exports = server; 