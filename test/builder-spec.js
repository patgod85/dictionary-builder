var builder = require('../src/builder');

describe('builder', function () {
    it('run builder', function (done) {
        builder({i: "./test/resources/example/component", o: "./test/resources/example/l10n"})
            .should.become("done:./test/resources/example/l10n/main.json").and.notify(done);
    });
});