'use strict';

var randomPass = (function randomPass() {

    function generate(charType, length) {
        var now = (new Date()).valueOf();

        var charSources = {
            alphabetical: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890' + now,
            numerical: '1234567890'
        };

        var charSource = charSources[charType] || charSources.alphabetical;
        var passLength = length || 50;
        var res = '';
        var doIt = true;
        var i = 0;

        function randomNumber(m) {
            return Math.floor((Math.random() * m));
        }

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
    }

    return {
        generate: generate
    };
})();

module.exports = randomPass;

