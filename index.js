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

// Get endpoint. 
app.get('/metric/:key/sum', function (req, res) {
    const key = req.params.key;
    if(key in dataSet) { // If Key is found in the dataSet.
        var sum = 0;
        if (dataSet[key].length === 0) // If Key is found but doesn't have any values. 
            res.send('No existing values found for this key');
        else {
            dataSet[key].forEach(dataValue => { // Key is found, iterate over and sum up values created within the last hour.
                var diffMinutes = Math.abs(new Date() - dataValue.createdAt)/(1000*60);
                if(diffMinutes < 60) {
                    sum += dataValue.value;
                }
            });
            res.send( {"value": sum } ); // sum of values created within last hour. 0 if all values are > 60 mins old.
        }
    }
    else {
        res.status(404).send('Key not found'); // Key not found in the dataset. 
    }
});

// POST method to create data.
app.post('/metric/:key', function (req, res) {
    const key = req.params.key;
    if(!("value" in req.body)) { // If there isn't a 'value' in the body
        res.status(400).send('Bad Request! No "value" found.');
    }
    else if (typeof(req.body.value) !== "number") { // If the "value" field doesn't contain a number
        res.status(400).send('Bad Request! "value" is not a number.');
    } else {
        var dataObject = {}; // Creating an object to push into the dataSet. 
        dataObject.value = Math.round(req.body.value); // Rounded value from request body
        dataObject.createdAt = new Date(); // Generating a createdAt field as a qualifying factor for sum. 
        if(key in dataSet) { // If they key exists. 
            dataSet[key].push(dataObject); // Add value to the existing key.
        }
        else { // If key does not exist
            dataSet[key] = [dataObject]; // Create a new key with the value in the request.
        }
        res.send({}); // Success 
    }
});

app.use(express.json()) // for parsing application/json

//initializing the server on port 3001. 
var server = app.listen('3001', () => {
    console.log('listening on port 3001');
});

module.exports = server; 