process.bin = process.title = 'dictionary-builder';

var argv = require('yargs').argv;
var builder = require('./builder');

builder(argv)
    .then(function(result){
        console.log(result);
        process.exit();
    });
