// JavaScript source code
var randomPass = (function randomPass() {
    var uuid = require('node-uuid')();
    function generate(charType, length) {
        var now = (new Date()).valueOf();
        var charSources = {
            alphabetical: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890' + now,
            numerical: '1234567890'
        };

        var charSource = charSources[charType] || charSources.alphabetical;
        var passLength = length || 50;
        var res = '';

        function randomNumber(m) {
            return Math.floor((Math.random() * m));
        }

        var doIt = true;
        var i = 0;
        while (doIt) {
            res += charSource.substr(randomNumber(charSource.length), 1);
            if (i === passLength) {
                doIt = false;
            }
            i++;
        }
        if (!charType && !length) {
            res = res + now;
        }
        if (!doIt) {
            return res;
        }
    };

    function generateUuid() {
        var uuidLocal = uuid;
        return uuidLocal;
    };

    return {
        generate: generate,
        generateUuid: generateUuid
    };
})();

module.exports = randomPass;

