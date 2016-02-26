var fs = require('fs');
var vfs = require('vow-fs');
var vow = require('vow');
var helpers = require('./helpers');
var argv;

function processDirItem(path) {
    return new vow.Promise(function (resolve, reject) {
        return vfs.stat(path)
            .then(function (stats) {
                if (stats.isDirectory()) {
                    resolve(scanDir(path));
                }
                else if (stats.isFile()) {
                    if(argv.propertyPathRegExp.test(path)){
                        resolve(path);
                    }
                    else{
                        resolve("");
                    }
                }
            })
            .catch(reject);
    });
}

var scanDir = function (rootPath) {

    return vfs.listDir(rootPath)
        .then(function (files) {
            var all = [];
            for (var i = 0; i < files.length; i++) {
                all.push(processDirItem(rootPath + '/' + files[i]));
            }
            return vow.all(all);
        })
        .catch(function(){
            throw "Fail to list directory: " + rootPath;
        });
};


function injectIntoJson(o, path, value) {
    path = helpers.clone(path);
    var currentPath = path.shift();

    if (path.length >= 1) {
        if (typeof o[currentPath] === 'undefined') {
            o[currentPath] = {};
        }
        o[currentPath] = injectIntoJson(o[currentPath], path, value);
    }
    else {
        o[currentPath] = value;
    }

    o = helpers.sort(o);

    return o;
}

module.exports = function (_argv) {

    argv = _argv;

    argv.chapterFileMask = argv.chapterFileMask || '*.json';

    var chapterFileExtension = argv.chapterFileMask.replace('*', '');

    argv.propertyPathRegExp = new RegExp("(\\/index)?" + chapterFileExtension.replace(/\./g, '\.') + "$");

    return new vow.Promise(function (resolve, reject) {
        vfs.glob(argv.i + '/**/' + argv.chapterFileMask)
            .then(function(files){
                if(!files.length){
                    reject("The model directory does not exist or contains no target files");
                }
                return scanDir(argv.i)
            })
            .then(function (structuredResult) {

                var paths = structuredResult.join(',').split(',').filter(function (x) {
                    return !!x
                });
                var dictionary = {};

                var files = [];
                for (var i = 0; i < paths.length; i++) {
                    console.log('Found file: ' + paths[i]);
                    var namespace = paths[i].replace(argv.i, '');
                    var item = {
                        filePath: paths[i],
                        content: JSON.parse(fs.readFileSync(paths[i]).toString()),
                        namespace: namespace,
                        propertyPath: namespace.replace(argv.propertyPathRegExp, '').replace(/^[\\\/]/, '').split(/[\\\/]/)
                    };

                    files.push(item);

                    for (var j in item.content) {
                        if (item.content.hasOwnProperty(j)) {
                            if (!dictionary.hasOwnProperty(j)) {
                                dictionary[j] = {};
                            }
                            dictionary[j] = injectIntoJson(dictionary[j], item.propertyPath, item.content[j]);
                        }
                    }
                }

                return vfs.write(argv.o, JSON.stringify(helpers.sort(dictionary), null, 4));
            })
            .then(function () {

                resolve('done:' + argv.o);
            })
            .catch(reject)
    });
};

