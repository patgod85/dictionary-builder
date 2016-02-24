var builder = require('../src/builder');
var splitter = require('../src/splitter');

var inputDir = "./test/resources/example/component",
    outputDir = "./test/resources/example/l10n",
    outputFile = "./test/resources/example/l10n/main.json",
    expectedFile = "./test/resources/example/l10n/expected.json",
    splitterInput = expectedFile,
    splitterDir = "./test/resources/example/splitted",
    splitterFileToCheck = '/toolbar/form.json';

var vfs = require("vow-fs");
var fs = require("fs");
var rimraf = require("rimraf");

describe('builder positive', function () {

    before(function(){
        try{
            fs.accessSync(outputFile);
            fs.unlinkSync(outputFile);
            console.log("Main.json is removed");
        }
        catch (e){}
    });

    it('works', function (done) {

        //assert.ok(true);done();
        function checkExpectation() {

            vfs.read(expectedFile)
                .then(function (expectedContent) {
                    return expectedContent.toString().replace(/\r/g, '');
                })
                .then(function (expectedResultToString) {

                    vfs.read(outputFile)
                        .then(function (outputContent) {
                            return outputContent.toString().replace(/\r/g, '');
                        })
                        .should.become(expectedResultToString).and.notify(done);
                });
        }

        builder({i: inputDir, o: outputDir})
            .should.become("done:" + outputFile).and.notify(checkExpectation);
    });

});

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

describe('builder negative', function () {

    it('fails with wrong input path', function (done) {

        builder({i: 'wrong>* path', o: outputDir})
            .should.be.rejectedWith("The model directory does not exist or contains no target files").and.notify(done);

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
