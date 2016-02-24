process.bin = process.title = 'dictionary-builder';

var argv = require('yargs').argv;
var builder = require('./builder');
var splitter = require('./splitter');

var source = argv.source || 'chapter';

if(!argv.hasOwnProperty("i") || !argv.hasOwnProperty("o")){
    console.warn("Required parameter -i or -o is missed");
    process.exit();
}

if(['chapter', 'dictionary'].indexOf(source) == -1){
    console.warn("Invalid value of option --source");
    process.exit();
}

if(source == 'chapter'){
    builder(argv).then(processResult).catch(processError);
}else{
    splitter(argv).then(processResult).catch(processError);
}

function processResult(result){
    console.log("\033[32mOk:\x1b[0m " + result);
    process.exit();
}

function processError(err){
    console.error("\033[31mFail:\x1b[0m " + err);
    process.exit();
}
