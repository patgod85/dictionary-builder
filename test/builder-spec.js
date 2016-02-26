var builder = require('../src/builder');

var inputDir = "./test/resources/example/component",
    outputDir = "./test/resources/example/l10n",
    outputFile = "./test/resources/example/l10n/main.json",
    expectedFile = "./test/resources/example/l10n/expected.json",
    outputFileL10n = "./test/resources/example/l10n/main.l10n.json",
    expectedFileL10n = "./test/resources/example/l10n/expected.l10n.json";


var fs = require("fs");

describe('builder positive', function () {

    before(function (done) {
        try {
            fs.accessSync(outputFile);
            fs.unlinkSync(outputFile);
            console.log("Main.json is removed\n");
        }
        catch (e) {
        }

        builder({i: inputDir, o: outputFile})
            .should.become("done:" + outputFile).and.notify(done);
    });

    it('works', function () {

        var expectedContent = fs.readFileSync(expectedFile).toString().replace(/\r/g, '');
        var resultContent = fs.readFileSync(outputFile).toString().replace(/\r/g, '');
        assert.equal(resultContent, expectedContent);

    });

});

describe('builder with chapter file mask', function () {

    before(function (done) {
        try {
            fs.accessSync(outputFileL10n);
            fs.unlinkSync(outputFileL10n);
            console.log("Main.l10n.json is removed\n");
        }
        catch (e) {
        }

        builder({i: inputDir, o: outputFileL10n, chapterFileMask: "*.l10n.json"})
            .should.become("done:" + outputFileL10n).and.notify(done);
    });

    it('works', function () {

        var expectedContent = fs.readFileSync(expectedFileL10n).toString().replace(/\r/g, '');
        var resultContent = fs.readFileSync(outputFileL10n).toString().replace(/\r/g, '');
        assert.equal(resultContent, expectedContent);

    });

});

describe('builder negative', function () {

    it('fails with wrong input path', function (done) {

        builder({i: 'wrong>* path', o: outputDir})
            .should.be.rejectedWith("The model directory does not exist or contains no target files").and.notify(done);

    });
});

