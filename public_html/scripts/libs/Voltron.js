/*Super.prototype.doSomething = function() {
    Base.prototype.doSomething.call(this);
};*/

(function(root, $) {
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    function Voltron(options) {
        this.init(options);
        return this;
    }

    Voltron.prototype.defaults = {};

    Voltron.prototype.events = {};

    Voltron.prototype.init = function(options) {
        this.options = $.extend({}, this.defaults, options);
        this.$el = $(options.$el);
        this.bind();
        return this;
    };

    Voltron.prototype.bind = function() {
        var events = this.options.events ? Voltron.result(this.options.events) : null;

        if (!events) {
            return this;
        }

        this.unbind();

        for (var key in events) {
            var method = events[key];
            if (!$.isFunction(method)) {
                method = this[events[key]];
            }

            if (!method) {
                continue;
            }

            var match = key.match(delegateEventSplitter);
            var eventName = match[1];
            var selector = match[2];

            method = $.proxy(method, this);
            if (selector.length) {
                this.$el.on(eventName, selector, method);
            } else {
                this.$el.on(eventName, method);
            }
        }
    };

    Voltron.prototype.unbind = function() {
        this.$el.off();
        return this;
    };

    Voltron.prototype.destroy = function() {
        this.unbind();
        this.$el.remove();
    };

    Voltron.result = function(val) {
        return $.isFunction(val) ? val() : val;
    };

    window.Voltron = window.Voltron || Voltron;
})(window, jQuery);