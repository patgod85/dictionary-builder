var vfs = require('vow-fs');
var fs = require('vow-fs');

var outputDir = '../test/resources/example/component';

var resultDir = '../test/resources/example/splitted';

var mkdirp = require('mkdirp');

function look(testPath, path, item, content){

    vfs.isFile(testPath)
        .then(function(){

            console.log('YEs', testPath, content);
            var newPath = testPath.replace(outputDir, resultDir);
            mkdirp(newPath.replace(/[\/\\]\w+\.json$/, ''), function(err){

                if(err){
                    throw err;
                }
                vfs.write(newPath, JSON.stringify(content, null, 4))
                    .then(function(){
                        console.log('YESS!', arguments);

                    })
                    .catch(function(err){
                        console.warn(err);
                    });
            });
        })
        .catch(function(err){
            processLevel(path + '/' + item, content)
        });
}

function processLevelItem(path, item, content){

    var testPath = path + '/' + item + '.json';
    look(testPath, path, item, content);

}

function processLevel(path, content){
    if( typeof content === 'string' || path.match(/index$/)){
        return;
    }
    for(var i in content){
        if(content.hasOwnProperty(i)){
            processLevelItem(path, i, content[i]);
        }
    }

    processLevelItem(path, 'index', content);
}

vfs.read('../test/resources/example/l10n/main.json')
    .then(function(content){

        processLevel(outputDir, JSON.parse(content.toString()).en);
    })
    .catch(function(err){
        console.warn('!!', err);
    });