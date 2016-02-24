var vfs = require('vow-fs');
var fs = require('vow-fs');

var outputDir = '../test/resources/example/component';

var resultDir = '../test/resources/example/splitted';

var mkdirp = require('mkdirp');

/**
 * TODO: promises
 * TODO: Tests
 * TODO: Error messages
 */

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
        .catch(function(){
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

    var secondLevelTokensKeys = [],
        secondLevelTokens = {};

    for(var lang in content){
        if(content.hasOwnProperty(lang)){
            for(var i in content[lang]){
                if(content[lang].hasOwnProperty(i) && secondLevelTokensKeys.indexOf(i) == -1 && typeof content[lang] != 'string'){
                    secondLevelTokensKeys.push(i);
                }
            }
        }
    }

    if(!secondLevelTokensKeys.length){
        return;
    }

    for(i = 0; i < secondLevelTokensKeys.length; i++){

        for(lang in content) {
            if(content.hasOwnProperty(lang) && content[lang].hasOwnProperty(secondLevelTokensKeys[i])){
                if(!secondLevelTokens.hasOwnProperty(secondLevelTokensKeys[i])){
                    secondLevelTokens[secondLevelTokensKeys[i]] = {};
                }

                secondLevelTokens[secondLevelTokensKeys[i]][lang] = content[lang][secondLevelTokensKeys[i]];
            }
        }

    }

    for(i in secondLevelTokens){
        if(secondLevelTokens.hasOwnProperty(i)){
            processLevelItem(path, i, secondLevelTokens[i]);
        }
    }

    processLevelItem(path, 'index', content);
}

vfs.read('../test/resources/example/l10n/main.json')
    .then(function(content){

        processLevel(outputDir, JSON.parse(content.toString()));
    })
    .catch(function(err){
        console.warn('!!', err);
    });