
var fs = require('fs');
var vfs = require('vow-fs');
var vow = require('vow');


function processDirItem(path) {
    return new vow.Promise(function (resolve) {
        return vfs.stat(path)
            .then(function (stats) {
                if (stats.isDirectory()) {
                    resolve(scanDir(path));
                }
                else if (stats.isFile()) {
                    resolve(path);
                }
            })
    });
}

var vReaddir = function (rootPath) {
    return new vow.Promise(function (resolve, reject) {

        fs.readdir(rootPath, function (err, files) {

            if (err) {
                reject()
            }
            resolve(files);
        });
    });
};

var scanDir = function (rootPath) {

    return vReaddir(rootPath).then(function (files) {
        var all = [];
        for (var i = 0; i < files.length; i++) {
            all.push(processDirItem(rootPath + '/' + files[i]));
        }
        return vow.all(all);
    });
};

function clone(obj){
    return JSON.parse(JSON.stringify(obj));
}

function injectIntoJson(o, path, value) {
    path = clone(path);
    var currentPath = path.shift();

    if (path.length >= 1) {
        if(typeof o[currentPath] === 'undefined'){
            o[currentPath] = {};
        }
        injectIntoJson(o[currentPath], path, value);
    }
    else {
        o[currentPath] = value;
    }
}

module.exports = function(argv) {
//console.log(argv);
    return new vow.Promise(function (resolve, reject) {
        scanDir(argv.i)
            .then(function (structuredResult) {

                var paths = structuredResult.join(',').split(',').filter(function (x) {
                    return !!x
                });

                var dictionary = {};

                var files = [];
                for (var i = 0; i < paths.length; i++) {
                    var namespace = paths[i].replace(argv.i, '');
                    var item = {
                        filePath: paths[i],
                        content: JSON.parse(fs.readFileSync(paths[i]).toString()),
                        namespace: namespace,
                        propertyPath: namespace.replace(/(\/index)?\.json/, '').replace(/^[\\\/]/, '').split(/[\\\/]/)
                    };

                    files.push(item);


                    for (var j in item.content) {
                        if (item.content.hasOwnProperty(j)) {
                            if (!dictionary.hasOwnProperty(j)) {
                                dictionary[j] = {};
                            }
                            injectIntoJson(dictionary[j], item.propertyPath, item.content[j]);
                        }
                    }
                }

                vfs.write(argv.o + '/main.json', JSON.stringify(dictionary, null, 4))
                    .then(function () {

                        resolve('done:' + argv.o + '/main.json');
                    });
            })
            .catch(reject)
    });
};

