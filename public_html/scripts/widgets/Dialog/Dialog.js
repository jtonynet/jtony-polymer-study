(function() {
    'use strict';

    Dialog.prototype = new Voltron({});
    Dialog.prototype.constructor = Dialog;

    function Dialog(options) {
        Voltron.call(this, options);
        return this;
    }

    Dialog.prototype.defaults = {};

    Dialog.prototype.events = {};

    Dialog.prototype.render = function() {};

    Dialog.prototype.show = function() {};

    Dialog.prototype.hide = function() {};

    Dialog.prototype.render = function() {};
})