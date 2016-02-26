var vow = require('vow');
var mkdirp = require('mkdirp');

module.exports.sort = function (unordered) {
    const ordered = {};

    Object.keys(unordered).sort().forEach(function (key) {
        ordered[key] = unordered[key];
    });

    return ordered;
};

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports.clone = clone;

module.exports.isEmpty = function (o) {
    var counter = 0;

    for (var firstLevel in o) {
        if (o.hasOwnProperty(firstLevel)) {
            for (var secondLevel in o[firstLevel]) {
                if (o[firstLevel].hasOwnProperty(secondLevel)) {
                    counter++;
                }
            }
        }
    }
    return !counter;
};

module.exports.removeProps = function (o, props) {
    //o = clone(o);

    for (var firstLevel in o) {
        if (o.hasOwnProperty(firstLevel)) {
            for (var i = 0; i < props.length; i++) {
                delete o[firstLevel][props[i]];
            }
        }
    }
    return o;
};

module.exports.mkdir = function (path) {
    return new vow.Promise(function (resolve, reject) {
        mkdirp(path, function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};


