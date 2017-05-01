(function() {
    'use strict';

    Dialog.prototype = new Voltron({});
    Dialog.prototype.constructor = Dialog;

    function Dialog(options) {
        options.$el = options.clone ? $(options.$el).clone() : $(options.$el);

        if (options.appendToEl) {
            $(options.appendToEl).append(options.$el);
        }

        Voltron.call(this, options);

        if (options.draggable) {
            this.shamen = new Shamen(this.$el[0], { dragHandle: '#title' });
        }

        if (options.resizable) {
            this.apacheChief = new ApacheChief(this.$el[0], { handles: ['BR'] });
        }

        this.overlay = new Duvet(this.$el[0], {
            fixed: options.draggable ? false : true
        });

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
        this.overlay.position();
    };

    Dialog.prototype.destroy = function() {
        this.overlay.destroy();

        if (this.shamen) {
            this.shamen.destroy();
        }

        if (this.apacheChief) {
            this.apacheChief.destroy();
        }

        Voltron.prototype.destroy.call(this);
    }

    Dialog.prototype.hide = function() {};

    Dialog.prototype.render = function() {};
})