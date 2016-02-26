var mkdirp = require('mkdirp');

var vow = require('vow');
var vfs = require('vow-fs');

var argv;

function mkdir(path){
    return new vow.Promise(function(resolve, reject){
        mkdirp(path, function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

function look(testPath, path, item, content) {

    return new vow.Promise(function (resolve, reject) {

        var newPath = testPath.replace(argv.model, argv.o);

        vfs.isFile(testPath)
            .then(function () {
                var p = newPath.replace(argv.chapterExtensionRegExp, '');
                return mkdir(p);
            })
            .then(function(){
                return vfs.write(newPath, JSON.stringify(content, null, 4))
            })
            .then(function(){
                resolve(newPath);
            })
            .catch(function() {
                processLevel(path + '/' + item, content)
                    .then(resolve)
                    .catch(reject);
            });
    });
}

function processLevelItem(path, item, content) {

    var testPath = path + '/' + item + argv.chapterFileExtension;

    return look(testPath, path, item, content);
}

function processLevel(path, content) {

    if (typeof content === 'string' || path.match(/index$/)) {
        return vow.Promise.resolve();
    }

    var secondLevelTokensKeys = [],
        secondLevelTokens = {};

    for (var lang in content) {
        if (content.hasOwnProperty(lang)) {
            for (var i in content[lang]) {
                if (content[lang].hasOwnProperty(i) && secondLevelTokensKeys.indexOf(i) == -1 && typeof content[lang] != 'string') {
                    secondLevelTokensKeys.push(i);
                }
            }
        }
    }

    if (!secondLevelTokensKeys.length) {
        return vow.Promise.resolve();
    }

    for (i = 0; i < secondLevelTokensKeys.length; i++) {

        for (lang in content) {
            if (content.hasOwnProperty(lang) && content[lang].hasOwnProperty(secondLevelTokensKeys[i])) {
                if (!secondLevelTokens.hasOwnProperty(secondLevelTokensKeys[i])) {
                    secondLevelTokens[secondLevelTokensKeys[i]] = {};
                }

                secondLevelTokens[secondLevelTokensKeys[i]][lang] = content[lang][secondLevelTokensKeys[i]];
            }
        }
    }

    var all = [];

    for (i in secondLevelTokens) {
        if (secondLevelTokens.hasOwnProperty(i)) {
            all.push(processLevelItem(path, i, secondLevelTokens[i]));
        }
    }

    all.push(processLevelItem(path, 'index', content));

    return vow.all(all);
}

module.exports = function (_argv) {

    argv = _argv;

    argv.model = argv.model || argv.o;
    argv.chapterFileMask = argv.chapterFileMask || '*.json';

    argv.chapterFileExtension = argv.chapterFileMask.replace('*', '');

    argv.chapterExtensionRegExp = new RegExp("[\\/\\\\][\\w\\\.]+" + argv.chapterFileExtension.replace(/\./g, '\\\.') + "$");

    return vfs.glob(argv.model + '/**/' + argv.chapterFileMask)
            .then(function(files){
                if(!files.length){
                    throw "The model directory does not exist or contains no target files";
                }
                return vfs.exists(argv.o);
            })
            .then(function(outputDirectoryIsExists){

                if(!outputDirectoryIsExists){
                    throw "The output directory does not exists";
                }
                return vfs.read(argv.i);
            })
            .then(function (content) {

                return processLevel(argv.model, JSON.parse(content.toString()))
            })
            .then(function (result) {
                console.log("Files created (updated): ", result.toString().split(',').filter(function (x) {
                    return !!x;
                }));
                return vow.Promise.resolve('done:' + argv.o);
            })

};
