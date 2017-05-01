var ApacheChief = (function(global, $) {
    'use strict';

    var handleCss = {
        width: '10px',
        height: '10px',
        cursor: 'se-resize',
        position: 'absolute',
        display: 'none',
        'background-color': '#000'
    };

    var defults = {
        handles: ['BR'],
        handleCss: {
            TM: $.extend({}, handleCss, {
                cursor: 'n-resize',
                top: 0,
                left: '50%'
            }),
            TR: $.extend({}, handleCss, {
                cursor: 'ne-resize',
                top: 0,
                right: 0
            }),
            MR: $.extend({}, handleCss, {
                cursor: 'e-resize',
                bottom: '50%',
                right: 0
            }),
            BR: $.extend({}, handleCss, {
                bottom: 0,
                right: 0
            }),
            BM: $.extend({}, handleCss, {
                cursor: 's-resize',
                bottom: 0,
                left: 0
            }),
            ML: $.extend({}, handleCss, {
                cursor: 'w-resize',
                bottom: '50%',
                left: 0
            }),
            BL: $.extend({}, handleCss, {
                cursor: 'sw-resize',
                bottom: 0,
                left: 0
            }),
            TL: $.extend({}, handleCss, {
                cursor: 'nw-resize'
            })
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
                    .append($('<div class="apache-chief-resize" data-handle="' + handles[i] + '">')
                        .css(handleCss[handles[i]]));
            }
        }

        $handles = this.$el.find('.apache-chief-resize');
        if (this.$el !== $handles.offsetParent()) {
            this.$el.css('position', 'relative');
        }

        $handles.css('display', 'block');
    };

    ApacheChief.prototype.resize = function() {};

    ApacheChief.prototype.bind = function() {
        var self = this;

        $('body').on('mouseup.apache-chief', function(e) {
            $(window).off('mousemove.apache-chief');
        });

        //$('.apache-chief-resize').on('mousedown.apache-chief', function(e) {
        this.$el.find('.apache-chief-resize').on('mousedown.apache-chief', function(e) {
            var $handle = $(this);
            var direction = $handle.attr('data-handle');

            var adjustPosition = direction !== 'BM' && direction !== 'MR' && direction !== 'BR';

            var mousePos = {
                x: e.pageX,
                y: e.pageY
            };

            function getPositionDiffs(adjustPosition, e, mousePos, direction) {
                var diffs = {
                    xDim: direction === 'BM' ? 0 : e.pageX - mousePos.x,
                    yDim: direction === 'MR' ? 0 : e.pageY - mousePos.y,
                    xPos: 0,
                    yPos: 0
                };

                if (!adjustPosition) {
                    return diffs;
                }

                switch (direction) {
                    case 'TR':
                        diffs.yPos = diffs.yDim;
                        diffs.yDim = -diffs.yDim;
                        break;
                    case 'TL':
                        diffs.xPos = diffs.xDim;
                        diffs.xDim = -diffs.xDim;
                        diffs.yPos = diffs.yDim;
                        diffs.yDim = -diffs.yDim;
                        break;
                    case 'BL':
                        diffs.xPos = diffs.xDim;
                        diffs.xDim = -diffs.xDim;
                        break;
                    case 'ML':
                        diffs.xPos = diffs.xDim;
                        diffs.xDim = -diffs.xDim;
                        diffs.yDim = 0;
                        break;
                    case 'TM':
                        diffs.yPos = diffs.yDim;
                        diffs.yDim = -diffs.yDim;
                        diffs.xDim = 0;
                        break;
                }
                return diffs;
            }

            $(window).on('mousemove.apache-chief', function(e) {
                var diffs = getPositionDiffs(adjustPosition, e, mousePos, direction);
                var elPos;

                self.$el.css({
                    width: self.$el.width() + diffs.xDim,
                    heigh: self.$el.heigh() + diffs.yDim
                });

                if (adjustPosition) {
                    elPos = self.$el.offset();

                    self.$el.css({
                        top: elPos.top + diffs.yPos,
                        left: elPos.left + diffs.xPos,
                        position: 'absolute'
                    });
                }

                mousePos = {
                    x: e.pageX,
                    y: e.pageY
                };
            });
        });

    };

    ApacheChief.prototype.destroy = function() {
        this.$el.find('.apache-chief-resize').remove();
        this.el = null;
        this.$el = null;
        this.options = null;
    };

    return ApacheChief;

})(window, jQuery);