var helpers = require('../src/helpers');

describe('Sorter', function () {

    it('works', function () {

        var a = {b: 1, a: 2, c: 3};

        assert.equal(helpers.sort(a).toString(), {a: 2, b: 1, c: 3}.toString());
    });
});

describe('Chapter actions', function () {

    it('isEmpty works', function () {

        var a = {
            "en": {},
            "ru": {}
        };

        var b = {
            "en": {widget: 1},
            "ru": {}
        };
        assert.equal(helpers.isEmpty(a), true);
        assert.equal(helpers.isEmpty(b), false);
    });

    it('removeProps works', function () {

        var a = {
            "en": {widget: 1, step1: 2},
            "ru": {widget: 3}
        };

        var expected = {
            "en": {step1: 2},
            "ru": {}
        };
        assert.equal(helpers.removeProps(a, ['widget']).toString(), expected.toString());
    });
});
