var builder = require('../src/builder');

var inputDir = "./test/resources/example/component",
    outputDir = "./test/resources/example/l10n",
    outputFile = "./test/resources/example/l10n/main.json",
    expectedFile = "./test/resources/example/l10n/expected.json";

var vfs = require("vow-fs");

describe('builder', function () {
    it('run builder', function (done) {

        function a() {

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
            .should.become("done:" + outputFile).and.notify(a);
    });

});

describe('splitter', function () {
    it('run splitter', function (done) {

        function a() {

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
            .should.become("done:" + outputFile).and.notify(a);
    });

});
