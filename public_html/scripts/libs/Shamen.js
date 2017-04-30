var Shamen = (function(global, $) {
    'use strict';
    var defaults = {
        dragHandle: null
    };

    function Shamen(el, options) {
        this.options = $.extend({}, defaults, options);
        var css = { cursor: (this.options.cursor || 'move') };

        this.isChildOfDocFragment = isChildOfDocFragment(el);
        this.el = el;
        this.$el = $(el);
        this.$dragHandle = this.options.dragHandle ? this.$el.find(this.options.dragHandle) : this.$el;
        this.bind();
        this.originalDragHandleCursor = this.$dragHandle.css('cursor');
        this.$dragHandle.css(css);
    }

    Shamen.prototype.bind = function() {};
    Shamen.prototype.destroy = function() {}

    return Shamen;
})(window, jQuery);