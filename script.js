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
        window.addEventListener('load', this.bind(this.cleanInit));
    }

    /**
     * 技能一：初始化清除悬浮链接
     */
    Leon.prototype.cleanInit = function() {
        this.oneByOne();
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
    Leon.prototype.initCleanOpenUrl = function(url) {
        var context = this;
        setTimeout(function() {
            var domScript = document.createElement("script");
            domScript.textContent = '(' + context.openOverride().toString() + '());';
            document.body.appendChild(domScript);
        }, 50);
    }

    Leon.prototype.openOverride = function() {
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
                    return {};
                } else {
                    return originOpen.apply(window, arguments);
                }
            }
        }
    }

    /**
     * 技能二：轮询
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
     * 绑定函数
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