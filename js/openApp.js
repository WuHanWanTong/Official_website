;(function(){
  var browser = {
    versions: function () {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      return {
        trident: u.indexOf('Trident') > -1,
        presto: u.indexOf('Presto') > -1,
        webKit: u.indexOf('AppleWebKit') > -1,
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
        mobile: !!u.match(/AppleWebKit.*Mobile.*/),
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
        iPhone: u.indexOf('iPhone') > -1,
        iPad: u.indexOf('iPad') > -1,
        webApp: u.indexOf('Safari') == -1,
        souyue: u.indexOf('souyue') > -1,
        superapp: u.indexOf('superapp') > -1,
        weixin: u.toLowerCase().indexOf('micromessenger') > -1,
        Safari: u.indexOf('Safari') > -1,
        WeixinBrowser: (/micromessenger/.test(u)) ? true : false,
        QQBrowser: (u.match(/QQ/i) == "qq") ? true : false
      };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    link: {
      iosShop: 'https://itunes.apple.com/cn/app/%E9%A1%BD%E7%AB%A5%E6%98%9F%E7%90%83/id1433882394?mt=8',
      yingyongbao: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wtkj.toydb'
    }
  };
  var loadTimer = null;
  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  }
  function getType() {
    var pathName = window.location.pathname.split('/')
    return pathName[pathName.length - 1]
  }
  function openApp() {
    var schame = ""
    var thatid = GetQueryString('id')
    var type = getType()
    schame = "toydb://www.toydb.cn?type=" + type + "&id=" + thatid + ""

    if (browser.versions.ios) {
      window.location.href = schame;
      loadTimer = setTimeout(function () {
        if (document.hidden || document.webkitHidden) {
          return;
        }
        window.location.href = browser.link.iosShop;
      }, 2000);
    } else if (browser.versions.android) {
      if (browser.versions.WeixinBrowser || browser.versions.QQBrowser) {
        window.location.href = browser.link.yingyongbao
        return
      }
      window.location.href = schame; // android对应的schame URL
      var start = Date.now();
      loadTimer = setTimeout(function () {
        if (document.hidden || document.webkitHidden) {
          return;
        } else {
          window.location.href = browser.link.yingyongbao;
        }
      }, 2000);
    }
  }
  // 当页面在后台运行时清空定时器防止页面跳转到下载页
  var visibilitychange = function () {
    var tag = document.hidden || document.webkitHidden;
    if (tag && loadTimer) {
      clearTimeout(loadTimer);
    }
  }
  document.addEventListener('visibilitychange', visibilitychange, false);
  document.addEventListener("webkitvisibilitychange", visibilitychange, false);
  window.addEventListener("pagehide", function () {
    loadTimer && clearTimeout(loadTimer);
  }, false);
  var downloadDom = document.getElementById('download')
  downloadDom.onclick = function(){
    openApp()
  }
})()