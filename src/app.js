process.bin = process.title = 'dictionary-builder';

var argv = require('yargs').argv;
var builder = require('./builder');
var splitter = require('./splitter');

var source = argv.source || 'chapter';

if(source == 'chapter'){
    builder(argv).then(processResult);
}else{
    splitter(argv).then(processResult);
}

function processResult(result){
    console.log(result);
    process.exit();
}
