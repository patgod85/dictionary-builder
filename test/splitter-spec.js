var splitter = require('../src/splitter');

var inputDir = "./test/resources/example/component",
    expectedFile = "./test/resources/example/l10n/expected.json",
    splitterInput = expectedFile,
    splitterInputL10n = "./test/resources/example/l10n/expected.l10n.json",
    splitterDir = "./test/resources/example/splitted",
    splitterDirL10n = "./test/resources/example/splitted-l10n",
    splitterFileToCheck = '/toolbar/form.json',
    splitterFileToCheckL10n = '/toolbar/form.l10n.json';

var vfs = require("vow-fs");
var fs = require("fs");
var rimraf = require("rimraf");

describe('splitter positive', function () {

    before(function(){
        var dir = fs.readdirSync(splitterDir);

        for(var i = 0; i < dir.length; i++){
            if(dir[i] != '.gitignore'){
                rimraf.sync(splitterDir + '/' + dir[i]);
            }
        }
    });

    it('works', function (done) {

        //assert.ok(true);done();
        function checkExpectation() {

            //done();
            vfs.read(inputDir + splitterFileToCheck)

                .then(function (expectedContent) {
                    return expectedContent.toString().replace(/\r/g, '');
                })
                .then(function (expectedResultToString) {

                    vfs.read(splitterDir + splitterFileToCheck)
                        .then(function (outputContent) {
                            return outputContent.toString().replace(/\r/g, '');
                        })
                        .should.become(expectedResultToString).and.notify(done);
                });
        }

        splitter({i: splitterInput, o: splitterDir, model: inputDir})
            .should.become("done:" + splitterDir).and.notify(checkExpectation);
    });

});

describe('splitter with chapter mask', function () {

    before(function(){
        var dir = fs.readdirSync(splitterDirL10n);

        for(var i = 0; i < dir.length; i++){
            if(dir[i] != '.gitignore'){
                rimraf.sync(splitterDirL10n + '/' + dir[i]);
            }
        }
    });

    it('works', function (done) {

        //assert.ok(true);done();
        function checkExpectation() {

            //done();
            vfs.read(inputDir + splitterFileToCheckL10n)

                .then(function (expectedContent) {
                    return expectedContent.toString().replace(/\r/g, '');
                })
                .then(function (expectedResultToString) {

                    vfs.read(splitterDirL10n + splitterFileToCheckL10n)
                        .then(function (outputContent) {
                            return outputContent.toString().replace(/\r/g, '');
                        })
                        .should.become(expectedResultToString).and.notify(done);
                });
        }

        splitter({i: splitterInputL10n, o: splitterDirL10n, model: inputDir, chapterFileMask: "*.l10n.json"})
            .should.become("done:" + splitterDirL10n).and.notify(checkExpectation);
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
