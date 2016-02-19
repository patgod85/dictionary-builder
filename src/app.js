var fs = require('fs');
var vfs = require('vow-fs');
var vow = require('vow');
var argv = require('yargs').argv;

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


scanDir(argv.i)
    .then(function (structuredResult) {

        var paths = structuredResult.join(',').split(',').filter(function (x) {
            return !!x
        });

        var files = [];
        for (var i = 0; i < paths.length; i++) {
            files.push({
                path: paths[i],
                content: JSON.parse(fs.readFileSync(paths[i]).toString())
            });
        }

        console.log(files);
    }
);

