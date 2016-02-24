var mkdirp = require('mkdirp');

var vow = require('vow');
var vfs = require('vow-fs');

var argv;


function look(testPath, path, item, content) {

    return new vow.Promise(function (resolve, reject) {

        vfs.isFile(testPath)
            .then(function () {

                //console.log('YEs', testPath, content);
                var newPath = testPath.replace(argv.model, argv.o);
                mkdirp(newPath.replace(/[\/\\]\w+\.json$/, ''), function (err) {

                    if (err) {
                        throw err;
                    }
                    vfs.write(newPath, JSON.stringify(content, null, 4))
                        .then(function () {
                            //console.log('YESS!', arguments);

                            resolve();
                        })
                        .catch(reject);
                });
            })
            .catch(function () {
                processLevel(path + '/' + item, content)
                    .then(resolve)
                    .catch(reject);
            });
    });
}

function processLevelItem(path, item, content) {

    return new vow.Promise(function (resolve, reject) {

        var testPath = path + '/' + item + '.json';
        look(testPath, path, item, content)
            .then(resolve)
            .catch(reject);
    });


}

function processLevel(path, content) {

    return new vow.Promise(function(resolve, reject){

        if (typeof content === 'string' || path.match(/index$/)) {
            resolve();
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
            resolve();
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

        return vow.all(all)
            .then(resolve)
            .catch(reject);
    });
}

module.exports = function (_argv) {

    argv = _argv;

    argv.model = argv.model || argv.o;
    argv.chapterFileMask = argv.chapterFileMask || '*.json';

    return new vow.Promise(function (resolve, reject) {

        vfs.glob(argv.model + '/**/' + argv.chapterFileMask)
            .then(function(files){
                if(!files.length){
                    reject("The model directory does not exist or contains no target files");
                }
                return vfs.exists(argv.o);
            })
            .then(function(outputDirectoryIsExists){

                if(!outputDirectoryIsExists){
                    reject("The output directory does not exists");
                }
                return vfs.read(argv.i);
            })
            .then(function (content) {

                processLevel(argv.model, JSON.parse(content.toString()))
                    .then(function () {
                        resolve('done:' + argv.o);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });

};
