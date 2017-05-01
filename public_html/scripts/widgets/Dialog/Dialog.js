(function(window, $, Voltron, Duvet, Shamen, ApacheChief) {

    'use strict';

    // set prototype to base component and assign
    // Dialog constructor to the constructor prototype
    Dialog.prototype = new Voltron({});
    Dialog.prototype.constructor = Dialog;

    // constructor
    function Dialog(options) {
        // optionally clone dialog $el
        options.$el = options.clone ? $(options.$el).clone() :
            $(options.$el);
        // append to body
        $('body').append(options.$el);

        Voltron.call(this, options);
        // create overlay instance
        this.overlay = new Duvet(this.$el[0]);

        // create a draggable instance
        console.log('A, z: ');
        if (options.draggable) {
            console.log(this.$el);
            this.shamen = new Shamen(this.$el[0], {
                // dialog header is the draghandle
                dragHandle: '#title'
            });
        } else {
            console.log('FOI AQUI Q DEU RUIM');
        }

        // create a resizable instance
        if (options.resizable) {
            this.apacheChief = new ApacheChief(this.$el[0], {
                handles: ['BR']
            });
        }

        return this;
    }

    Dialog.prototype.init = function(options) {
        // call super method
        console.log('--options');
        console.log(options);
        Voltron.prototype.init.call(this, options);
        // position the dialog's root element absolutely
        this.$el.css({ position: 'absolute' });
    };

    // defaults, e.g., width and height
    Dialog.prototype.defaults = {};

    // event listeners; this is processed by Voltron.prototype.bind
    Dialog.prototype.events = {};

    // process template for injection into DOM
    Dialog.prototype.render = function() {};

    // makes dialog visible in the UI
    Dialog.prototype.show = function() {
        // this will adjust z-index, set the display property,
        // and position the dialog
        this.overlay.position();
    };

    // makes dialog invisible in the UI
    Dialog.prototype.hide = function() {};

    Dialog.prototype.destroy = function() {
        // clean up overlay
        this.overlay.destroy();

        // clean up draggable
        if (this.shamen) {
            this.shamen.destroy();
        }

        // clean up resizable
        if (this.apacheChief) {
            this.apacheChief.destroy();
        }

        // call super class
        Voltron.prototype.destroy.call(this);
    };

    window.Dialog = window.Dialog || Dialog;

})(window, jQuery, Voltron, Duvet, Shamen, ApacheChief);

function DialogTemplate(options) {
    this.querySelector = '[role="dialog"]';
    this.template = document.querySelector('#dialog');
    this.el = document.querySelector(this.querySelector);
    this.options = options;

    if (!this.el) {
        this.clone = document.importNode(this.template.content, true);
        document.body.appendChild(this.clone);
        this.el = document.querySelector('[role="dialog"]');
    }

    this.options.$el = this.querySelector;
    this.api = new Dialog(this.options);

    this.api.$el.find('#title').html(this.options.title);
    this.api.$el.find('#content').html(this.options.content);

    console.log("EU: ");
    console.log(this);

    return this;
}