(function() {
    'use strict';

    Dialog.prototype = new Voltron({});
    Dialog.prototype.constructor = Dialog;

    function Dialog(options) {
        Voltron.call(this, options);
        return this;
    }

    Dialog.prototype.init = function(options) {
        Voltron.prototype.init.call(this, options);
        this.$el.css({ position: 'absolute' });
    }

    Dialog.prototype.defaults = {};

    Dialog.prototype.events = {};

    Dialog.prototype.render = function() {};

    Dialog.prototype.show = function() {
        Jenga.bringToFront(this.$el[0]);
    };

    Dialog.prototype.hide = function() {};

    Dialog.prototype.render = function() {};
})