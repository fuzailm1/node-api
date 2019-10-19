// Import packages
const express = require('express');
const app = express();

//initializing the server on port 3001. 
var server = app.listen('3001', () => {
    console.log('listening on port 3001');
});

module.exports = server; 