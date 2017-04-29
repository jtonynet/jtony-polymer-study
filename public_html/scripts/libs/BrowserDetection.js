var browsers = {
    chrome: {
        fixed: 22
    }
};

var browser = (function() {
    var N = navigator.appName;
    var ua = navigator.userAgent;
    var tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);

    if (M && ua.match(/version\/([\.\d]+)/i) != null) {
        M[2] = tem[1];
    }

    M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];

    return {
        name: M[0].toLowerCase(),
        version: M[1]
    };
})();