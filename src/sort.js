module.exports = function (unordered) {
    const ordered = {};

    Object.keys(unordered).sort().forEach(function (key) {
        ordered[key] = unordered[key];
    });

    return ordered;
};
