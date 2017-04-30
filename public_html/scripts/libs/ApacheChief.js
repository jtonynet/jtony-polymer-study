var ApacheChief = (function(global, $) {
    'use strict';

    var handleCss = {
        width: '10px',
        height: '10px',
        cursor: 'se-resize'
    };

    var defults = {
        handles: ['BR'],
        handleCss: {
            BR: handleCss
        }
    };

    function mergeResizeHandleCss(defaultCss, instanceCss) {
        var retVal = {};
        for (k in defaultCss) {
            retVal[k] = instanceCss[k] || defaultCss[k];
        }

        return retVal;
    }

    function ApacheChief(el, options) {
        this.el = el;
        this.$el = $(el);

        this.options = $.extend({}, defaults, options);
        mergeResizeHandleCss(this.options, options || {});

        this.createResizeHandles();

        this.bind();
    }

    ApacheChief.prototype.createResizeHandles = function() {
        var handleCss = this.options.handleCss;
        var handles = this.options.handles;
        var $handles;

        for (var i = 0; i < handles.length; i++) {
            if (handleCss[handles[i]]) {
                this.$el
                    .append($('<div class="apache-chief-resize" data-handle="' + handles[i] + '">'))
                    .css(handleCss[handles[i]]);
            }
        }

        $handles = this.$el.find('.apache-chief-resize');
        if (this.$el !== $handles.offsetParent()) {
            this.$el.css('position', 'relative');
        }

        $handles.css('display', 'block');
    };

    ApacheChief.prototype.resize = function() {};
    ApacheChief.prototype.bind = function() {};
    ApacheChief.prototype.destroy = function() {};

    return ApacheChief;

})(window, jQuery);