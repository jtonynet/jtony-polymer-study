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

    Shamen.prototype.bind = function() {
        var selector = this.options.dragHandle || null;
        var self = this;

        var parentMargins = this.$el.attr('position') === 'absolute' ?
            getMargins(this.$el.parent()[0]) : { top: 0, left: 0 };

        $('body').on('mouseup.shamen', function(e) {
            $(window).off('mousemove.shamen');
        });

        this.$el.on('mousedown.shamen', selector, function(e) {
            var mousePos = {
                x: e.pageX,
                y: e.pageY
            };

            $(window).on('mousemove.shamen', function(e) {
                var xDiff = e.pageX - mousePos.x;
                var yDiff = e.pageY - mousePos.y;

                var elPos = self.$el.offset();

                self.$el.css({
                    top: elPos.top + yDiff,
                    left: elPos.left + xDiff,
                    position: 'absolute'
                });

                mousePos = {
                    x: e.pageX,
                    y: e.pageY
                };
            });
        });
    };

    Shamen.prototype.destroy = function() {
        this.$el.off('mousedown.shamen');
        this.$dragHandle({ cursor: this.originalDragHandleCursor });

        this.el = null;
        this.$el = null;
        this.$dragHandle = null;

        this.options = defaults;
    };

    return Shamen;
})(window, jQuery);