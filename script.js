/**
 * 名称：网页清道夫
 * 日志：2016-08-06
 * 作者：Beven
 */
(function() {

    /**
     * 网页清道夫
     */
    function Leon() {
        this.init();
    }

    /**
     * 初始化清道夫
     */
    Leon.prototype.init = function() {
        this.host = location.host;
        this.initCleanOpenUrl();
        this.listener('mousedown', this.cleanCoverLink, true);
        window.addEventListener('load', this.bind(this.onReady));
        this.predelay(this.cleanInit, 500)
    }

    /**
     * 技能0：窗口加载完毕
     */
    Leon.prototype.onReady = function() {
        this.delay(this.cleanInit, 500);
    }

    /**
     * 技能一：初始化清除悬浮链接
     */
    Leon.prototype.cleanInit = function() {
        //轮询
        this.oneByOne();
        //剔除悬层广告
        this.cleanCoverAdvertisment();
    }

    /**
     * 技能二:悬浮链接清除
     */
    Leon.prototype.cleanCoverLink = function(ev) {
        this.oneByOne();
        var disguiser = this.getClosestLink(ev.target);
        if (!this.isOutLink(disguiser)) {
            return;
        }
        if (this.doCoverLink(disguiser)) {
            ev.preventDefault();
        }
    }

    /**
     * 技能三：window.open监听
     */
    Leon.prototype.initCleanOpenUrl = function() {
        var context = this;
        setTimeout(function() {
            var domScript = document.createElement("script");
            domScript.textContent = '(' + context.getOpenOverride().toString() + '());';
            document.body.appendChild(domScript);
        }, 40);
    }

    /**
     * 技能四: 清除悬浮广告
     */
    Leon.prototype.cleanCoverAdvertisment = function() {
        var children = document.body.children;
        var item = null;
        var cleanList = [];
        for (var i = 0, k = children.length; i < k; i++) {
            item = children[i];
            if (item.style.position == 'fixed' && this.isOutLinkOwner(item)) {
                cleanList.push(item);
            }
        }
        for (var i = 0, k = cleanList.length; i < k; i++) {
            item = cleanList[i];
            item.parentElement.removeChild(item);
        }
    }

    /**
     * 判断制定内容是否包含外链
     */
    Leon.prototype.isOutLinkOwner = function(dom) {
        var links = dom ? dom.getElementsByTagName("a") : [];
        var outCount = 0;
        for (var i = 0, k = links.length; i < k; i++) {
            if (this.isOutLink(links[i])) {
                outCount++;
            }
        }
        return outCount == links.length;
    }

    /**
     * 返回一个widow.open函数外链跳转监听代码函数
     */
    Leon.prototype.getOpenOverride = function() {
        return function() {
            var host = location.host;
            var originOpen = window.open;
            var domLink = null;
            window.open = function(url) {
                if (!domLink) {
                    domLink = document.createElement("a");
                    domLink.style.display = "none";
                    document.body.appendChild(domLink);
                }
                domLink.href = url;
                if (domLink.host !== host) {
                    console.log('拦截:' + url);
                    return {};
                } else {
                    return originOpen.apply(window, arguments);
                }
            }
        }
    }

    /**
     * 本能：轮询
     */
    Leon.prototype.oneByOne = function() {
        var links = document.links;
        for (var i = 0, k = links.length; i < k; i++) {
            this.doCoverLink(links[i]);
        }
    }

    /**
     * 本能：监听
     */
    Leon.prototype.listener = function(type, handler, useCapture) {
        document.addEventListener(type, this.bind(handler));
    }

    /**
     * 本能：迟疑
     */
    Leon.prototype.delay = function(handler, delay) {
        return setTimeout(this.bind(handler), delay);
    }

    /**
     * 本能：预设迟疑
     */
    Leon.prototype.predelay = function(handler, delay) {
        var context = this;
        var args = Array.prototype.slice.apply(arguments);
        return function() {
            return context.delay.apply(context, args);
        }
    }

    /**
     * 本能：代理
     */
    Leon.prototype.bind = function(handler) {
        var context = this;
        return function() {
            return handler.apply(context, arguments);
        }
    }

    /**
     * 本能：判断是否为一个链接
     */
    Leon.prototype.isLink = function(dom) {
        if (dom && dom.tagName == "A") {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 本能：判断是否为一个外部链接
     */
    Leon.prototype.isOutLink = function(dom) {
        return this.isLink(dom) && dom.host !== this.host;
    }

    /**
     * 获取指定元素父级a标签
     */
    Leon.prototype.getClosestLink = function(dom) {
        if (this.isLink(dom)) {
            return dom;
        }
        var link = null;
        var maybeLink = dom.parentElement;
        while (maybeLink) {
            if (this.isLink(maybeLink)) {
                link = maybeLink;
                break;
            }
            maybeLink = maybeLink.parentElement;
        }
        return link;
    }

    /**
     * 技能：判断是否为悬浮链接,如果是则移除该元素
     */
    Leon.prototype.doCoverLink = function(disguiser) {
        if (disguiser) {
            var position = disguiser.style.position;
            var xLarge = (disguiser.scrollWidth >= window.innerWidth - 100);
            var yLarge = (disguiser.scrollHeight >= window.innerHeight - 100)
            var isCover = position == 'absolute' && (xLarge || yLarge);
            if (isCover) {
                disguiser.setAttribute("href", "#");
                disguiser.style.display = "none";
                disguiser.parentElement.removeChild(disguiser);
            }
            return isCover || (disguiser.parentElement == null);
        }
    }

    //创建清道夫
    var leon = window.leon = new Leon();

}());