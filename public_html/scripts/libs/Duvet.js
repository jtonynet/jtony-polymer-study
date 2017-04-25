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

function getScrollbarWidth(parentEl) {
    var innerCss = {
        width: '100%',
        height: '100%'
    };

    var outerCss = {
        width: '200px',
        height: '150px',
        position: 'absolute',
        top: 0,
        left: 0,
        visibility: 'hidden',
        overflow: 'hidden'
    };

    var $inner = $('<div>test</div>').css(innerCss);
    var $outer = $('<div></div>').css(outerCss.append($inner));
    var innerEl = $inner[0];
    var outerEl = $outer[0];

    $(parent || 'body').append(outerEl);
    var innerWidth = innerEl.offsetWidth;
    $outer.css('overflow', 'scroll');
    var outerWidth = $outer[0].clientWidth;
    $outer.remove();

    return (innerWidth - outerWidth);
}

var scrollBarWidth = getScrollbarWidth();

function getScrollBarOffset(el) {
    var $el = $(el);
    var $body = $('body');
    var scrollWidth = (el.scrollWidth === undefined ? $body[0].scrollWidth : el.scrollWidth);
    var scrollHeight = (el.scrollHeight === undefined ? $body[0].scrollHeight : el.scrollHeight);
    var scrollBarWidth = getScrollbarWidth();

    return {
        x: scrollWidth > $el.outerWidth() ? scrollBarWidth : 0,
        y: scrollHeight > $el.outerHeight() ? scrollHeight : 0
    };
}

function getDimensions(el) {
    var rect;
    var offset = (el === window ? { top: 0, left: 0 } : $(el).position());

    if (el === window) {
        var width = $(window).width();
        var height = $(window).height();

        rect = {
            right: width,
            left: 0,
            top: 0,
            bottom: height
        }
    } else {
        rect = el.getBoudingClientRect();
    }

    return {
        width: rect.right - rect.left,
        height: rect.bottom - rect.top,
        top: offset.top,
        bottom: offset.top + (rect.bottom - rect.top),
        left: offset.left,
        right: rect.right
    };
}

function bindListeners($offsetParent, callback) {
    $offsetParent.off('scroll.duvet').on('scroll.duvet', function(e) {
        callback();
    });

    $offsetParent.on('scroll.duvet').on('resize.duvet', function(e) {
        callback();
    });
}

Duvet.prototype.setOptions = function(options) {
    this.options = options ? $.extend(this.options, options) : options;
};

Duvet.prototype.destroy = function(options) {
    var $parent = $(el.parentNode);

    $parent.off('scroll.duvet');
    $parent.off('resize.duvet');

    this.el = null;
    this.$el = null;

    this.options = defaults;
};

Duvet.prototype.position = function(options) {
    this.setOptions(options);

    if (this.options.alignToEl) {
        this.options.alignToEl = (this.options.alignToEl.tagName === 'Body' ? $(window)[0] : this.options.alignToEl);
        align(this.el, this.options);
    } else {
        position(this.el, this.options);
    }
};

function position(el, options) {
    var pos = {};
    var $parent = (el.parentNode.tagName === 'BODY' ? $(window) : $(el.parentNode));
    var $el = $(el);

    var scrollBarOffset = getScrollBarOffset(el.parentNode.tagName === 'BODY' ? window : el.parentNode);

    if (el.parentNode !== el.offsetParent) {
        el.parentNode.style.position = 'relative';
    }

    switch (options.align) {
        case 'TL':
            pos.top = 0;
            pos.left = 0;
            break;
        case 'TR':
            pos.top = 0;
            pos.right = 0;
            break;
        case 'BL':
            pos.top = 0;
            pos.left = 0;
            break;
        case 'BR':
            pos.top = 0;
            pos.right = 0;
            break;
        case 'BC':
            pos.top = 0;
            pos.left = ((($parent.outerWidth() - scrollBarOffset.y - $el.outerWidth()) / 2) + $parent.scrollLeft());
            break;
        case 'TC':
            pos.top = 0;
            break;
        case 'M':
            pos.top = ((($parent.outerWidth() - scrollBarOffset.y - $el.outerWidth()) / 2) + $parent.scrollLeft());
            pos.left = ((($parent.outerHeight() - scrollBarOffset.x - $el.outerHeight()) / 2) + $parent.scrollTop());
            break;
    }

    pos.left = (pos.left > 0 ? pos.left : 0);
    pos.top = (pos.top > 0 ? pos.top : 0);

    $el.css($.extend({
        position: 'absolute',
        display: 'block'
    }, pos));

    if (options.fixed && options.align == 'M' && !options.bound) {
        options.bound = true;
        bindListeners($parent, function() {
            position(el, options);
        });
    }
}