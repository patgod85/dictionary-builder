var sort = require('../src/sort');

describe('Sorter', function () {

    it('works', function () {

        var a = {b: 1, a: 2, c: 3};

        assert.equal(sort(a).toString(), {a: 2, b: 1, c: 3}.toString());
    });
});
