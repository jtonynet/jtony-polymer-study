var Duvet = (function(global, $, Jenga) {
    'use strict';

    var defaults = {
        alignToEl: null,
        align: 'M',
        fixed: true,
        offsets: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    };

    function Duvet(el, options) {
        this.el = el;
        this.$el = $(el);

        this.setOptions(options);

        return this;
    }

    Duvet.prototype.position = function(options) {};

    Duvet.prototype.setOptions = function(options) {};

    Duvet.prototype.destroy = function(options) {};

    return Duvet;
})(window, jQuery, Jenga);