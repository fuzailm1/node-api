// Import packages
const express = require('express');
const app = express();

// Example data structure. 
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
    console.log(dataSet);
    if (dataSet === {}) { // If empty, return empty object.
        res.send('Empty Data Set.');
    }
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

app.use(express.json()) // for parsing application/json

//initializing the server on port 3001. 
var server = app.listen('3001', () => {
    console.log('listening on port 3001');
});

module.exports = server; 