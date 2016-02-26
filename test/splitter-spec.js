var splitter = require('../src/splitter');

var inputDir = "./test/resources/example/component",
    expectedFile = "./test/resources/example/l10n/expected.json",
    splitterInput = expectedFile,
    splitterInputL10n = "./test/resources/example/l10n/expected.l10n.json",
    splitterDir = "./test/resources/example/splitted",
    splitterDirL10n = "./test/resources/example/splitted-l10n",
    splitterFileToCheck = '/toolbar/form.json',
    splitterFileToCheckL10n = '/toolbar/form.l10n.json';

var fs = require("fs");
var rimraf = require("rimraf");

function cleanFolder(path){

    var dir = fs.readdirSync(path);

    for(var i = 0; i < dir.length; i++){
        if(dir[i] != '.gitignore'){
            rimraf.sync(path + '/' + dir[i]);
        }
    }
}

describe('splitter with chapter mask', function () {

    beforeEach(function(done){
        cleanFolder(splitterDirL10n);

        splitter({i: splitterInputL10n, o: splitterDirL10n, model: inputDir, chapterFileMask: "*.l10n.json"})
            .should.become("done:" + splitterDirL10n).and.notify(done);

    });

    it('works', function (done) {


        var expectedContent = fs.readFileSync(inputDir + splitterFileToCheckL10n).toString().replace(/\r/g, '');
        var resultContent = fs.readFileSync(splitterDirL10n + splitterFileToCheckL10n).toString().replace(/\r/g, '');

        assert.equal(resultContent, expectedContent);
        done();

    });

});

describe('splitter negative', function () {

    it('fails with wrong input path', function (done) {

        splitter({i: 'wrong path', o: splitterDir, model: inputDir})
            .should.be.rejected.and.notify(done);

    });

    it('fails with wrong model path', function (done) {

        splitter({i: splitterInput, o: splitterDir, model: 'wrong path <*'})
            .should.be.rejectedWith("The model directory does not exist or contains no target files").and.notify(done);

    });

    it('fails with wrong output path', function (done) {

        splitter({i: splitterInput, o: 'wrong path <*', model: inputDir})
            .should.be.rejectedWith("The output directory does not exists").and.notify(done);

    });
});

describe('splitter positive', function () {

    beforeEach(function(done){
        cleanFolder(splitterDir);

        splitter({i: splitterInput, o: splitterDir, model: inputDir})
            .should.become("done:" + splitterDir).and.notify(done);
    });

    it('works', function () {


        var expectedContent = fs.readFileSync(inputDir + splitterFileToCheck).toString().replace(/\r/g, '');
        var resultContent = fs.readFileSync(splitterDir + splitterFileToCheck).toString().replace(/\r/g, '');

        assert.equal(resultContent, expectedContent);

    });

});
