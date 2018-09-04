function openApp() {
    // 判断浏览器
    var Navigator = navigator.userAgent;
    var ifChrome = Navigator.match(/Chrome/i) != null && Navigator.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i) == null ? true : false;
    var ifAndroid = (Navigator.match(/(Android);?[\s\/]+([\d.]+)?/)) ? true : false;
    var ifiPad = (Navigator.match(/(iPad).*OS\s([\d_]+)/)) ? true : false;
    var ifiPhone = (!ifiPad && Navigator.match(/(iPhone\sOS)\s([\d_]+)/)) ? true : false;
    var ifSafari = (ifiPhone || ifiPad) && Navigator.match(/Safari/);
    var version = 0;
    ifSafari && (version = Navigator.match(/Version\/([\d\.]+)/));
    // safari浏览器版本
    version = parseFloat(version[1], 10);
    // 是否从微信打开
    var ifWeixin = navigator.userAgent.indexOf("MicroMessenger") >= 0; // weixin

    // 由安卓APP提供
    var AppConfig = {
        "scheme": "imeituan://",
        "package": "com.wtkj.toydb",
        "action": "android.intent.action.VIEW",
        "category": "android.intent.category.BROWSABLE",
        "FAILBACK_ANDROID": "http://a.app.qq.com/o/simple.jsp?pkgname=com.wtkj.toydb",
        "FAILBACK_IOS": "https://itunes.apple.com/cn/app/id423084029"
    };

    // android打开app 地址
    function getAndroidSchema() {
        var schemaStr = 'www.xxx.com/open?a=test';
        if (ifChrome) {
            schemaStr = "intent://" + schemaStr + "#Intent;" +
                "scheme=" + AppConfig.scheme + ";" +
                "package=" + AppConfig.package + ";" +
                "category=" + AppConfig.category + ";" +
                "S.browser_fallback_url=" + encodeURIComponent(AppConfig.FAILBACK_ANDROID) + ";" +
                "end";
        } else {
            schemaStr = "xxx://www.xxx.com/open";
        }
        return schemaStr;
    }

    if (ifAndroid) {
        var s = getAndroidSchema();
        if (ifChrome) { // chrome会自动识别S.browser_fallback_url如果没有安装则打开下载链接地址
            window.location.href = s;
        } else if (ifWeixin) { // 微信无法打开APP，跳转到下载页面
            window.location.href = AppConfig.FAILBACK_ANDROID;
        } else { // 其他浏览器3秒内没打开则跳转到下载链接
            window.location.href = s;
            var start = Date.now();
            // 如果页面在后台运行返回，如果超过2秒没有打开APP，则没有安装，跳转到应用市场
            loadTimer = setTimeout(function() {
                if (document.hidden || document.webkitHidden) {
                    return;
                }
                if (Date.now() - start <= 3000 + 200) {
                    window.location.href = AppConfig.FAILBACK_ANDROID;
                } else {}
            }, 2000);
        }
    }

    if (ifiPhone) {
        return
        var openUrl = 'imeituan://';
        var universalUrl = "http://a.app.qq.com/o/simple.jsp?pkgname=com.wtkj.toydb";

        if (ifWeixin) { // 微信
            window.location.href = universalUrl;
            return;
        }

        if (ifSafari && version >= 9) { // 判断IOS版本 如果大于9
            setTimeout(function() { // 必须要使用settimeout
                var ar = document.createElement("a");
                ar.setAttribute("href", openUrl);
                ar.style.display = "none";
                document.body.appendChild(ar);
                var av = document.createEvent("HTMLEvents");
                av.initEvent("click", !1, !1);
                ar.dispatchEvent(av);
            }, 0)
        } else {
            window.location.href = openUrl;
        }
        // 如果页面在后台运行返回，如果超过3秒没有打开APP，则没有安装，跳转到IOS应用市场
        loadTimer = setTimeout(function() {
            if (document.hidden || document.webkitHidden) {
                return;
            }
            if (Date.now() - start > 3000 + 200) {

            } else {
                window.location.href = AppConfig.FAILBACK_IOS;
            }
        }, 3000);
    }

    // 当页面在后台运行时清空定时器防止页面跳转到下载页
    var visibilitychange = function() {
        var tag = document.hidden || document.webkitHidden;
        tag && clearTimeout(loadTimer);
    }
    document.addEventListener('visibilitychange', visibilitychange, false);
    document.addEventListener("webkitvisibilitychange", visibilitychange, false);
    window.addEventListener("pagehide", function() {
        clearTimeout(loadTimer);
    }, false);

};