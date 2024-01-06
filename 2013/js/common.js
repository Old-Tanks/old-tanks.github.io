navigator.sayswho = (function () {
    var N = navigator.appName, ua = navigator.userAgent, tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null)
        M[2] = tem[1];
    M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
    return M;
})();

if (navigator.userAgent.indexOf('Edge') >= 0 && window.jQuery) {
    $(document.body).bind('mousewheel', function (e) {
    });
}
function getNavigator() {
    return navigator.sayswho;
}
function nodesToHosts() {
    var re = /^.*\.([^\.]+)$/;
    for (var node in stat.nodes) {
        var nodeHost = node.match(re);
        if (nodeHost) {
            stat.nodes[nodeHost[1]] = stat.nodes[node];
        }
    }
}

function showBraintreePayment(token, amount, currency, lang, merchId, productionMode) {
    var popupWidth = 490;
    var popupHeight = 400;
    var popupLeft = (screen.width) ? (screen.width - popupWidth) / 2 : 0;
    var popupTop = (screen.height) ? (screen.height - popupHeight) / 2 : 0;
    var popupSettings =
        'height=' + popupHeight +
        ',width=' + popupWidth +
        ',left=' + popupLeft +
        ',top=' + popupTop +
        ',resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes';
    var url =
        "/pages/braintree/?token=" + encodeURIComponent(token) +
        "&amount=" + amount +
        "&currency=" + encodeURIComponent(currency) +
        "&lang=" + lang +
        "&merch=" + merchId +
        "&production=" + productionMode;
    var popupWindow = window.open(url, 'popupWindow', popupSettings);

    popupWindow.onload = function () {
        popupWindow.callbackFunction = paymentProceed;
    };

}

function paymentProceed(nonce, deviceData) {
    document.getElementById("TANKI").paymentConfirmed(nonce, deviceData);
}

Array.prototype.shuffle = function () {
    var i = this.length, j, temp;
    if (i == 0) {
        return this;
    }
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}

function selectProperServer() {
    nodesToHosts();
    var minFill = 1;
    var server;
    var minNodes = [];
    var maxNodes = [];
    for (var i in nodeNames) {
        if (stat.nodes[nodeNames[i].name]) {
            var online = parseInt(stat.nodes[nodeNames[i].name].online);
            var fill = online / nodeNames[i].maxUsers;
            if (fill < minFill) {
                minNodes.push(i);
            } else {
                maxNodes.push(i);
            }
        }
    }
    if (minNodes.length) {
        server = minNodes.shuffle()[Math.floor(Math.random() * minNodes.length)];
    } else if (maxNodes.length) {
        server = maxNodes.shuffle()[Math.floor(Math.random() * maxNodes.length)];
    }
    return server;
}

function getStat() {
    jQuery.get("/s/status.js?rnd=" + Math.random(), function (data) {
        eval("stat=" + data);
        nodesToHosts();
    });
}

function getPreferGameServerUrl() {
    return '//' + document.location.host + '/lucky.html' + document.location.search;
}

function gameServerExists() {
    if (nodeId && nodeNames) {
        for (var i in nodeNames) {
            if (nodeNames[i].name == nodeId) {
                return true;
            }
        }
    }
    return false;
}

function anotherGameServerExists() {
    var srv = selectProperServer();
    if (srv) {
        return true;
    }
    return false;
}

Cookie = {
    isSupported: function () {
        return !!navigator.cookieEnabled;
    },
    exists: function (name) {
        return document.cookie.indexOf(name + "=") + 1;
    },
    write: function (name, value, expires, path, domain, secure) {
        expires instanceof Date ? expires = expires.toGMTString()
            : typeof (expires) == 'number' && (expires = (new Date(+(new Date) + expires * 1e3)).toGMTString());
        var r = [name + "=" + escape(value)], s, i;
        for (i in s = {
            expires: expires,
            path: path,
            domain: domain
        })
            s[i] && r.push(i + "=" + s[i]);
        return secure && r.push("secure"), document.cookie = r.join(";"), true;
    },
    read: function (name) {
        var c = document.cookie, s = this.exists(name), e;
        return s ? unescape(c.substring(s += name.length, (c.indexOf(";", s) + 1 || c.length + 1) - 1)) : "";
    },
    remove: function (name, path, domain) {
        return this.exists(name) && this.write(name, "", new Date(0), path, domain);
    }
};
var TNK_visit = 1;
var TNK_exp = 60 * 60 * 24 * 365;
if (Cookie.read('TNK_visit') == '') {
    Cookie.write('TNK_CDN', 1, TNK_exp, '/', '.tankionline.com');
    Cookie.write('TNK_NEW_USER', 1, 60, '/', '.tankionline.com');
}
Cookie.write('TNK_visit', TNK_visit, TNK_exp, '/', '.tankionline.com');
Cookie.write('TNK_cluster', 'eu', TNK_exp, '/', '.tankionline.com');

function mobileRedirect() {
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Puffin: function () {
            return navigator.userAgent.match(/Puffin/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    console.log(isMobile.any());
    if(!isMobile.Puffin() && isMobile.any()) {
        window.location.href = "/";
    }
}
mobileRedirect();

var _todl = document.location;

var hashChanged = false;

var tnk_dumper = false;

var buffer_hash = '';

var never_changed = true;


function getHash(trunc) {
    var truncate = trunc == undefined ? false : trunc;
    if (truncate) {
        return _todl.hash.substr(1);
    }
    return _todl.hash;
}

function pushHash() {
    document.getElementById('AlternativaLoader').changeHash(getHash(1));
}

var hashChangeHandler = function () {
    pushHash();
    hashChanged = true;
}

function isHashChanged() {
    if (hashChanged) {
        hashChanged = false;
        return true;
    }
    return false;
}

function isMSIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0) {
        return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
    } else {
        return -1;
    }
}

function getDomain(full) {
    var prefix = !full ? '' : '//';
    return prefix + _todl.host;
}

var baseDomain = getDomain();

function getBaseDomain() {
    return baseDomain;
}

function reloadPage() {
    _todl.reload();
}

function setBaseDomain(domain) {
    if (domain && domain != '') {
        baseDomain = domain;
    }
}

function setHash(h) {
    SWFAddress.setValue(h);
    if (never_changed) {
        setTimeout('pushHash()', 50);
        never_changed = false;
    }
}

function clearHash() {
    setHash('');
}

function goToMainPage(url) {
    var dest = url == undefined ? '//' + baseDomain + '/' : url;
    _todl.href = dest;
}

function goToLucky(url) {
    var dest = url == undefined ? '//' + baseDomain + '/lucky.html' : url;
    _todl.href = dest;
}

function getBaseURL(full) {
    var prefix = !full ? '' : '//';
    return prefix + _todl.host + _todl.pathname;
}

function getParams(array) {
    var asArray = array == undefined ? false : array;
    var get = _todl.search;
    if (!asArray) {
        return get.substr(1);
    }
    var param = {}, tmp, tmp2;
    if (get != '') {
        tmp = (get.substr(1)).split('&');
        for (var i = 0; i < tmp.length; i++) {
            tmp2 = tmp[i].split('=');
            param[tmp2[0]] = tmp2[1];
        }
    }
    return param;
}

function getHashParams(array) {
    var asArray = array == undefined ? false : array;
    var get = _todl.hash;
    if (!asArray) {
        return get.substr(1);
    }
    var param = {}, tmp, tmp2;
    if (get != '') {
        tmp = (get.substr(1)).split('&');
        for (var i = 0; i < tmp.length; i++) {
            tmp2 = tmp[i].split('=');
            param[tmp2[0]] = tmp2[1];
        }
    }
    return param;
}

var GALoaded = false;
function checkGALoaded() {
    if (window._gat && window._gat._getTracker) {
        GALoaded = true;
    }
    return GALoaded;
}
function GATrackPageView(page) {
    if (!GALoaded) {
        checkGALoaded();
    }
    if (GALoaded) {
        if (page == undefined) {
            page = '';
        }
        if (page == '/registered') {
            trackRegistration();
        }
        try {
            _gaq.push(['_trackPageview', page]);
        } catch (e) {
        }
    }
    return GALoaded;
}
function GATrackEvent(category, action, label) {
    if (!GALoaded) {
        checkGALoaded();
    }
    if (GALoaded) {
        category = category === undefined ? '' : category;
        action = action === undefined ? '' : action;
        label = label === undefined ? '' : label;
        if (category === 'lobby' && action === 'lobbyLoaded<=initTracker') {
            trackEntering();
        }
        try {
            _gaq.push(['_trackEvent', category, action, label]);
        } catch (e) {
        }
    }
    return GALoaded;
}

var YMLoaded = false;
function checkYMLoaded() {
    if (window.yaCounter10288858 && window.yaCounter10288858.reachGoal) {
        YMLoaded = true;
    }
    return YMLoaded;
}
function YMReachGoal(goal) {
    yaCounter10288858.reachGoal(goal);
}

function trackEntering() {
}

function trackRegistration() {
    GATrackEvent('Entrance', 'registered');
    if (!Cookie.read('TNK_registrationDate')) {
        Cookie.write('TNK_registrationDate', (new Date()).getTime(), 60 * 60 * 24 * 365, '/', '.tankionline.com');
    }

}
function newPopup(url) {
    var w = 800;
    var h = 500;
    LeftPosition = (screen.width) ? (screen.width - w) / 2 : 0;
    TopPosition = (screen.height) ? (screen.height - h) / 2 : 0;
    settings = 'height=' + h + ',width=' + w + ',left=' + LeftPosition + ',top=' + TopPosition + ',resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes';
    popupWindow = window.open(url, 'popUpWindow', settings);
}
// if (navigator.sayswho[0] == 'Chrome') {
//     var script_add = document.createElement('script');
//     script_add.src = '/js/chromeDetector.js';
//     script_add.async = false;
//     document.head.appendChild(script_add);
// }
