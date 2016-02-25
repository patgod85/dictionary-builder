var builder = require('../src/builder');

var inputDir = "./test/resources/example/component",
    outputDir = "./test/resources/example/l10n",
    outputFile = "./test/resources/example/l10n/main.json",
    expectedFile = "./test/resources/example/l10n/expected.json",
    outputFileL10n = "./test/resources/example/l10n/main.l10n.json",
    expectedFileL10n = "./test/resources/example/l10n/expected.l10n.json";


var vfs = require("vow-fs");
var fs = require("fs");

describe('builder positive', function () {

    before(function(){
        try{
            fs.accessSync(outputFile);
            fs.unlinkSync(outputFile);
            console.log("Main.json is removed\n");
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

        builder({i: inputDir, o: outputFile})
            .should.become("done:" + outputFile).and.notify(checkExpectation);
    });

});

describe('builder with chapter file mask', function () {

    before(function(){
        try{
            fs.accessSync(outputFileL10n);
            fs.unlinkSync(outputFileL10n);
            console.log("Main.l10n.json is removed\n");
        }
        catch (e){}
    });

    it('works', function (done) {

        //assert.ok(true);done();
        function checkExpectation() {

            vfs.read(expectedFileL10n)
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

        builder({i: inputDir, o: outputFileL10n, chapterFileMask: "*.l10n.json"})
            .should.become("done:" + outputFile).and.notify(checkExpectation);
    });

});

describe('builder negative', function () {

    it('fails with wrong input path', function (done) {

        builder({i: 'wrong>* path', o: outputDir})
            .should.be.rejectedWith("The model directory does not exist or contains no target files").and.notify(done);

    });
});

