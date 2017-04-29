var Jenga = (function(global) {
    'use strict';

    var isStackingCtx = function(el) {
        return el.tagName === 'HTML' || (isPosAndHasZindex(el) && doesStyleCreateStackingCtx(el));
    };

    var getStackingCtx = function getStackingCtx(el) {
        var parentNode = el.parentNode;

        while (!Jenga.isStackingCtx(parentNode)) {
            parentNode = parentNode.parentNode;
        }

        return parentNode;
    };

    var bringToFront = function(el, createStackingCtx, root) {
        moveUpDown(el, createStackingCtx, root, true);
    };

    var sendToBack = function(el, createStackingCtx, root) {
        moveUpDown(el, createStackingCtx, root, false);
    };

    return {
        isStackingCtx: isStackingCtx,
        getStackingCtx: getStackingCtx,
        bringToFront: bringToFront,
        sendToBack: sendToBack
    };
})(this);

var isFixedStackingCtx = (function() {
    return browsers[browser.name].fixed >= parseInt(browser.version, 10);
})();

function isFunction(thing) {
    return typeof thing === 'function';
};

function isPosAndHasZindex(el) {
    return el.style.position !== 'static' && el.style.zIndex !== 'auto';
}

function doesStyleCreateStackingCtx(el) {
    var styles = el.style;

    if (styles.opacity < 1) {
        return true;
    }

    if (styles.transform !== 'none') {
        return true;
    }

    if (styles.transformStyle === 'preserve-3D') {
        return true;
    }

    if (styles.perspective !== 'none') {
        return true;
    }

    if (styles.flowFrom !== 'none' && styles.content !== 'normal') {
        return true;
    }

    if (styles.position === 'fixed' && isFixedStackingCtx) {
        return true;
    }

    return false;
}

function moveUpDown(el, createStackingCtx, root, increment) {
    var stackingCtxEl = Jenga.getStackingCtx(el);

    if (createStackingCtx && stackingCtxEl !== el.parentNode) {
        if (isFunction(createStackingCtx)) {
            createStackingCtx(el.parentNode);
        } else {
            el.parentNode.position = 'relative';
            el.parentNode.style.zIndex = 0;
        }
    }

    modifyZindex(el, increment);

    if (root && (root !== Jenga.getStackingCtx(el) && stackingCtxEl.tagName !== 'HTML')) {
        moveUpDown(stackingCtxEl, createStackingCtx, root, increment);
    }
}

function modifyZindex(el, increment) {
    var stackingCtxEl = Jenga.getStackingCtx(el);
    var siblings = stackingCtxEl.childNodes;
    var siblingsMaxMinZindex = increment ? 0 : -1;

    var siblingZindex;

    for (var i = 0; i < siblings.length; i++) {
        if (siblings[i].nodeType === 1 && isPosAndHasZindex(siblings[i]) && siblings[i] !== el) {
            siblingZindex = parseInt(siblings[i].style.zIndex, 10);

            if (isNaN(siblingZindex)) {
                continue;
            }

            if (increment) {
                siblingsMaxMinZindex = siblingZindex > siblingsMaxMinZindex ? siblingZindex : siblingsMaxMinZindex;
            } else {
                siblingsMaxMinZindex = siblingsMaxMinZindex < 0 ||
                    (siblingZindex < siblingsMaxMinZindex ? siblingZindex : siblingsMaxMinZindex);
            }
        }
    }

    if (!siblingsMaxMinZindex && !increment) {
        for (i = 0; i < siblings.length; i++) {
            if (siblings[i].nodeType === 1 && siblings[i] !== el) {
                siblingZindex = parseInt(siblings[i].style.zIndex, 10);
                if (isNaN(siblingZindex)) {
                    continue;
                }

                siblings[i].style.zIndex = ++siblingZindex;
            }
        }
    }

    el.style.zIndex = increment ? siblingsMaxMinZindex + 1 :
        (siblingZindex ? siblingsMaxMinZindex - 1 : 0);
}

function getMargins(el) {
    var $el = $(el);
    var marginTop = parseInt($el.css('margin-top'), 10);
    var marginLeft = parseInt($el.css('margin-left'), 10);

    return {
        top: isNaN(marginTop) ? 0 : marginTop,
        left: isNaN(marginLeft) ? 0 : marginLeft
    };
}

function align(el, options) {
    var alignToElDim = getDimensions(options.alignToEl);
    var css = { display: 'block', visibility: 'visible', position: 'absolute' };
    var $el = $(el);
    var parentAlignToElMargins = getMargins(options.alignToEl.parentNode);

    $el.css({
        visibility: 'hidden',
        display: 'block',
        'z-index': -1000
    });

    var elDim = getDimensions(el);

    if (options.alignToEl.parentNode !== options.alignToEl.offsetParent) {
        options.alignToEl.parentNode.style.position = 'relative';
    }

    switch (options.align) {
        case 'TL':
            css.top = (alignToElDim.top - elDim.height) - parentAlignToElMargins.top;
            css.left = alignToElDim.left - parentAlignToElMargins.left;
            break;
        case 'TR':
            css.top = alignToElDim.top - elDim.height;
            css.left = alignToElDim.right - elDim.width;
            break;
        case 'BL':
            css.top = alignToElDim.bottom - parentAlignToElMargins.top;
            css.left = alignToElDim.left - parentAlignToElMargins.left;
            break;
        case 'BR':
            css.top = alignToElDim.bottom - parentAlignToElMargins.top;
            css.left = (alignToElDim.right - elDim.width) - parentAlignToElMargins.left;
            break;
        case 'BC':
            css.top = alignToElDim.bottom - parentAlignToElMargins.top;
            css.left = (((alignToElDim.width - elDim.width) / 2) + alignToElDim.left) - parentAlignToElMargins.left;
            break;
        case 'TC':
            css.top = (alignToElDim.top - elDim.height) - parentAlignToElMargins.top;
            css.left = (((alignToElDim.width - elDim.width) / 2) + alignToElDim.left) - parentAlignToElMargins.left;
            break;
        case 'M':
            css.top = (alignToElDim.top - elDim.height) - parentAlignToElMargins.top;
            css.left = alignToElDim.left - parentAlignToElMargins.left;
            break;
    }

    jenga.bringToFront(el, true);
    $el.css(css);

    /*
    pos.left = pos.left > 0 ? pos.left : 0;
    pos.top = pos.top > 0 ? pos.top : 0;

    $el.css($.extend({
        position: absolute,
        display: block
    }, pos));

    if (options.fixed && options.align == 'M' && !options.bound) {
        options.bound = true;
        bindListeners($parent, function() {
            position(el, options);
        });
    }
    */
}

//wraper jQuery
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function($) {
    $.fn.bringToFront = function(options) {
        options = options || {};

        if (this[0]) {
            Jenga.bringToFront(this[0], options.createStackingCtx, options.root);
        }
        return this;
    };

    $.fn.sendToBack = function(options) {
        options = options || {};

        if (this[0]) {
            Jenga.sendToBack(this[0], options.createStackingCtx, options.root);
        }
        return this;
    };

    $.fn.isStackingCtx = function() {
        return this[0] ? Jenga.isStackingCtx(this[0]) : false;
    };

    $.fn.getStackingCtx = function() {
        return this[0] ? Jenga.getStackingCtx(this[0]) : undefined;
    };
}));