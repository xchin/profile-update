! function($) {
    $ && ($.fn.headroom = function(t) {
        return this.each(function() {
            var e = $(this),
                n = e.data("headroom"),
                i = "object" == typeof t && t;
            i = $.extend(!0, {}, Headroom.options, i), n || (n = new Headroom(this, i), n.init(), e.data("headroom", n)), "string" == typeof t && n[t]()
        })
    }, $("[data-headroom]").each(function() {
        var t = $(this);
        t.headroom(t.data())
    }))
}(window.Zepto || window.jQuery), ! function(t, e) {
    "use strict";

    function n(t) {
        this.callback = t, this.ticking = !1
    }

    function i(e) {
        return e && "undefined" != typeof t && (e === t || e.nodeType)
    }

    function o(t) {
        if (arguments.length <= 0) throw new Error("Missing arguments in extend function");
        var e, n, r = t || {};
        for (n = 1; n < arguments.length; n++) {
            var s = arguments[n] || {};
            for (e in s) r[e] = "object" != typeof r[e] || i(r[e]) ? r[e] || s[e] : o(r[e], s[e])
        }
        return r
    }

    function r(t) {
        return t === Object(t) ? t : {
            down: t,
            up: t
        }
    }

    function s(t, e) {
        e = o(e, s.options), this.lastKnownScrollY = 0, this.elem = t, this.debouncer = new n(this.update.bind(this)), this.tolerance = r(e.tolerance), this.classes = e.classes, this.offset = e.offset, this.scroller = e.scroller, this.initialised = !1, this.onPin = e.onPin, this.onUnpin = e.onUnpin, this.onTop = e.onTop, this.onNotTop = e.onNotTop
    }
    var l = {
        bind: !! function() {}.bind,
        classList: "classList" in e.documentElement,
        rAF: !!(t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame)
    };
    t.requestAnimationFrame = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame, n.prototype = {
        constructor: n,
        update: function() {
            this.callback && this.callback(), this.ticking = !1
        },
        requestTick: function() {
            this.ticking || (requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this))), this.ticking = !0)
        },
        handleEvent: function() {
            this.requestTick()
        }
    }, s.prototype = {
        constructor: s,
        init: function() {
            return s.cutsTheMustard ? (this.elem.classList.add(this.classes.initial), setTimeout(this.attachEvent.bind(this), 100), this) : void 0
        },
        destroy: function() {
            var t = this.classes;
            this.initialised = !1, this.elem.classList.remove(t.unpinned, t.pinned, t.top, t.initial), this.scroller.removeEventListener("scroll", this.debouncer, !1)
        },
        attachEvent: function() {
            this.initialised || (this.lastKnownScrollY = this.getScrollY(), this.initialised = !0, this.scroller.addEventListener("scroll", this.debouncer, !1), this.debouncer.handleEvent())
        },
        unpin: function() {
            var t = this.elem.classList,
                e = this.classes;
            (t.contains(e.pinned) || !t.contains(e.unpinned)) && (t.add(e.unpinned), t.remove(e.pinned), this.onUnpin && this.onUnpin.call(this))
        },
        pin: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.unpinned) && (t.remove(e.unpinned), t.add(e.pinned), this.onPin && this.onPin.call(this))
        },
        top: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.top) || (t.add(e.top), t.remove(e.notTop), this.onTop && this.onTop.call(this))
        },
        notTop: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.notTop) || (t.add(e.notTop), t.remove(e.top), this.onNotTop && this.onNotTop.call(this))
        },
        getScrollY: function() {
            return void 0 !== this.scroller.pageYOffset ? this.scroller.pageYOffset : void 0 !== this.scroller.scrollTop ? this.scroller.scrollTop : (e.documentElement || e.body.parentNode || e.body).scrollTop
        },
        getViewportHeight: function() {
            return t.innerHeight || e.documentElement.clientHeight || e.body.clientHeight
        },
        getDocumentHeight: function() {
            var t = e.body,
                n = e.documentElement;
            return Math.max(t.scrollHeight, n.scrollHeight, t.offsetHeight, n.offsetHeight, t.clientHeight, n.clientHeight)
        },
        getElementHeight: function(t) {
            return Math.max(t.scrollHeight, t.offsetHeight, t.clientHeight)
        },
        getScrollerHeight: function() {
            return this.scroller === t || this.scroller === e.body ? this.getDocumentHeight() : this.getElementHeight(this.scroller)
        },
        isOutOfBounds: function(t) {
            var e = 0 > t,
                n = t + this.getViewportHeight() > this.getScrollerHeight();
            return e || n
        },
        toleranceExceeded: function(t, e) {
            return Math.abs(t - this.lastKnownScrollY) >= this.tolerance[e]
        },
        shouldUnpin: function(t, e) {
            var n = t > this.lastKnownScrollY,
                i = t >= this.offset;
            return n && i && e
        },
        shouldPin: function(t, e) {
            var n = t < this.lastKnownScrollY,
                i = t <= this.offset;
            return n && e || i
        },
        update: function() {
            var t = this.getScrollY(),
                e = t > this.lastKnownScrollY ? "down" : "up",
                n = this.toleranceExceeded(t, e);
            this.isOutOfBounds(t) || (t <= this.offset ? this.top() : this.notTop(), this.shouldUnpin(t, n) ? this.unpin() : this.shouldPin(t, n) && this.pin(), this.lastKnownScrollY = t)
        }
    }, s.options = {
        tolerance: {
            up: 0,
            down: 0
        },
        offset: 0,
        scroller: t,
        classes: {
            pinned: "headroom--pinned",
            unpinned: "headroom--unpinned",
            top: "headroom--top",
            notTop: "headroom--not-top",
            initial: "headroom"
        }
    }, s.cutsTheMustard = "undefined" != typeof l && l.rAF && l.bind && l.classList, t.Headroom = s
}(window, document), ! function(t, e, n, i) {
    var o = t(e);
    t.fn.lazyload = function(r) {
        function s() {
            var e = 0;
            a.each(function() {
                var n = t(this);
                if (!h.skip_invisible || n.is(":visible"))
                    if (t.abovethetop(this, h) || t.leftofbegin(this, h));
                    else if (t.belowthefold(this, h) || t.rightoffold(this, h)) {
                    if (++e > h.failure_limit) return !1
                } else n.trigger("appear"), e = 0
            })
        }
        var l, a = this,
            h = {
                threshold: 0,
                failure_limit: 0,
                event: "scroll",
                effect: "show",
                container: e,
                data_attribute: "original",
                skip_invisible: !0,
                appear: null,
                load: null,
                placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
            };
        return r && (i !== r.failurelimit && (r.failure_limit = r.failurelimit, delete r.failurelimit), i !== r.effectspeed && (r.effect_speed = r.effectspeed, delete r.effectspeed), t.extend(h, r)), l = h.container === i || h.container === e ? o : t(h.container), 0 === h.event.indexOf("scroll") && l.bind(h.event, function() {
            return s()
        }), this.each(function() {
            var e = this,
                n = t(e);
            e.loaded = !1, (n.attr("src") === i || n.attr("src") === !1) && n.attr("src", h.placeholder), n.one("appear", function() {
                if (!this.loaded) {
                    if (h.appear) {
                        var i = a.length;
                        h.appear.call(e, i, h)
                    }
                    t("<img />").bind("load", function() {
                        var i = n.data(h.data_attribute);
                        n.hide(), n.is("img") ? n.attr("src", i) : n.css("background-image", "url('" + i + "')"), n[h.effect](h.effect_speed), e.loaded = !0;
                        var o = t.grep(a, function(t) {
                            return !t.loaded
                        });
                        if (a = t(o), h.load) {
                            var r = a.length;
                            h.load.call(e, r, h)
                        }
                    }).attr("src", n.data(h.data_attribute))
                }
            }), 0 !== h.event.indexOf("scroll") && n.bind(h.event, function() {
                e.loaded || n.trigger("appear")
            })
        }), o.bind("resize", function() {
            s()
        }), /iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion) && o.bind("pageshow", function(e) {
            e.originalEvent && e.originalEvent.persisted && a.each(function() {
                t(this).trigger("appear")
            })
        }), t(n).ready(function() {
            s()
        }), this
    }, t.belowthefold = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? (e.innerHeight ? e.innerHeight : o.height()) + o.scrollTop() : t(r.container).offset().top + t(r.container).height(), s <= t(n).offset().top - r.threshold
    }, t.rightoffold = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.width() + o.scrollLeft() : t(r.container).offset().left + t(r.container).width(), s <= t(n).offset().left - r.threshold
    }, t.abovethetop = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.scrollTop() : t(r.container).offset().top, s >= t(n).offset().top + r.threshold + t(n).height()
    }, t.leftofbegin = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.scrollLeft() : t(r.container).offset().left, s >= t(n).offset().left + r.threshold + t(n).width()
    }, t.inviewport = function(e, n) {
        return !(t.rightoffold(e, n) || t.leftofbegin(e, n) || t.belowthefold(e, n) || t.abovethetop(e, n))
    }, t.extend(t.expr[":"], {
        "below-the-fold": function(e) {
            return t.belowthefold(e, {
                threshold: 0
            })
        },
        "above-the-top": function(e) {
            return !t.belowthefold(e, {
                threshold: 0
            })
        },
        "right-of-screen": function(e) {
            return t.rightoffold(e, {
                threshold: 0
            })
        },
        "left-of-screen": function(e) {
            return !t.rightoffold(e, {
                threshold: 0
            })
        },
        "in-viewport": function(e) {
            return t.inviewport(e, {
                threshold: 0
            })
        },
        "above-the-fold": function(e) {
            return !t.belowthefold(e, {
                threshold: 0
            })
        },
        "right-of-fold": function(e) {
            return t.rightoffold(e, {
                threshold: 0
            })
        },
        "left-of-fold": function(e) {
            return !t.rightoffold(e, {
                threshold: 0
            })
        }
    })
}(jQuery, window, document), ! function($) {
    $ && ($.fn.headroom = function(t) {
        return this.each(function() {
            var e = $(this),
                n = e.data("headroom"),
                i = "object" == typeof t && t;
            i = $.extend(!0, {}, Headroom.options, i), n || (n = new Headroom(this, i), n.init(), e.data("headroom", n)), "string" == typeof t && n[t]()
        })
    }, $("[data-headroom]").each(function() {
        var t = $(this);
        t.headroom(t.data())
    }))
}(window.Zepto || window.jQuery), ! function(t, e) {
    "use strict";

    function n(t) {
        this.callback = t, this.ticking = !1
    }

    function i(e) {
        return e && "undefined" != typeof t && (e === t || e.nodeType)
    }

    function o(t) {
        if (arguments.length <= 0) throw new Error("Missing arguments in extend function");
        var e, n, r = t || {};
        for (n = 1; n < arguments.length; n++) {
            var s = arguments[n] || {};
            for (e in s) r[e] = "object" != typeof r[e] || i(r[e]) ? r[e] || s[e] : o(r[e], s[e])
        }
        return r
    }

    function r(t) {
        return t === Object(t) ? t : {
            down: t,
            up: t
        }
    }

    function s(t, e) {
        e = o(e, s.options), this.lastKnownScrollY = 0, this.elem = t, this.debouncer = new n(this.update.bind(this)), this.tolerance = r(e.tolerance), this.classes = e.classes, this.offset = e.offset, this.scroller = e.scroller, this.initialised = !1, this.onPin = e.onPin, this.onUnpin = e.onUnpin, this.onTop = e.onTop, this.onNotTop = e.onNotTop
    }
    var l = {
        bind: !! function() {}.bind,
        classList: "classList" in e.documentElement,
        rAF: !!(t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame)
    };
    t.requestAnimationFrame = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame, n.prototype = {
        constructor: n,
        update: function() {
            this.callback && this.callback(), this.ticking = !1
        },
        requestTick: function() {
            this.ticking || (requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this))), this.ticking = !0)
        },
        handleEvent: function() {
            this.requestTick()
        }
    }, s.prototype = {
        constructor: s,
        init: function() {
            return s.cutsTheMustard ? (this.elem.classList.add(this.classes.initial), setTimeout(this.attachEvent.bind(this), 100), this) : void 0
        },
        destroy: function() {
            var t = this.classes;
            this.initialised = !1, this.elem.classList.remove(t.unpinned, t.pinned, t.top, t.initial), this.scroller.removeEventListener("scroll", this.debouncer, !1)
        },
        attachEvent: function() {
            this.initialised || (this.lastKnownScrollY = this.getScrollY(), this.initialised = !0, this.scroller.addEventListener("scroll", this.debouncer, !1), this.debouncer.handleEvent())
        },
        unpin: function() {
            var t = this.elem.classList,
                e = this.classes;
            (t.contains(e.pinned) || !t.contains(e.unpinned)) && (t.add(e.unpinned), t.remove(e.pinned), this.onUnpin && this.onUnpin.call(this))
        },
        pin: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.unpinned) && (t.remove(e.unpinned), t.add(e.pinned), this.onPin && this.onPin.call(this))
        },
        top: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.top) || (t.add(e.top), t.remove(e.notTop), this.onTop && this.onTop.call(this))
        },
        notTop: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.notTop) || (t.add(e.notTop), t.remove(e.top), this.onNotTop && this.onNotTop.call(this))
        },
        getScrollY: function() {
            return void 0 !== this.scroller.pageYOffset ? this.scroller.pageYOffset : void 0 !== this.scroller.scrollTop ? this.scroller.scrollTop : (e.documentElement || e.body.parentNode || e.body).scrollTop
        },
        getViewportHeight: function() {
            return t.innerHeight || e.documentElement.clientHeight || e.body.clientHeight
        },
        getDocumentHeight: function() {
            var t = e.body,
                n = e.documentElement;
            return Math.max(t.scrollHeight, n.scrollHeight, t.offsetHeight, n.offsetHeight, t.clientHeight, n.clientHeight)
        },
        getElementHeight: function(t) {
            return Math.max(t.scrollHeight, t.offsetHeight, t.clientHeight)
        },
        getScrollerHeight: function() {
            return this.scroller === t || this.scroller === e.body ? this.getDocumentHeight() : this.getElementHeight(this.scroller)
        },
        isOutOfBounds: function(t) {
            var e = 0 > t,
                n = t + this.getViewportHeight() > this.getScrollerHeight();
            return e || n
        },
        toleranceExceeded: function(t, e) {
            return Math.abs(t - this.lastKnownScrollY) >= this.tolerance[e]
        },
        shouldUnpin: function(t, e) {
            var n = t > this.lastKnownScrollY,
                i = t >= this.offset;
            return n && i && e
        },
        shouldPin: function(t, e) {
            var n = t < this.lastKnownScrollY,
                i = t <= this.offset;
            return n && e || i
        },
        update: function() {
            var t = this.getScrollY(),
                e = t > this.lastKnownScrollY ? "down" : "up",
                n = this.toleranceExceeded(t, e);
            this.isOutOfBounds(t) || (t <= this.offset ? this.top() : this.notTop(), this.shouldUnpin(t, n) ? this.unpin() : this.shouldPin(t, n) && this.pin(), this.lastKnownScrollY = t)
        }
    }, s.options = {
        tolerance: {
            up: 0,
            down: 0
        },
        offset: 0,
        scroller: t,
        classes: {
            pinned: "headroom--pinned",
            unpinned: "headroom--unpinned",
            top: "headroom--top",
            notTop: "headroom--not-top",
            initial: "headroom"
        }
    }, s.cutsTheMustard = "undefined" != typeof l && l.rAF && l.bind && l.classList, t.Headroom = s
}(window, document), ! function(t, e, n, i) {
    var o = t(e);
    t.fn.lazyload = function(r) {
        function s() {
            var e = 0;
            a.each(function() {
                var n = t(this);
                if (!h.skip_invisible || n.is(":visible"))
                    if (t.abovethetop(this, h) || t.leftofbegin(this, h));
                    else if (t.belowthefold(this, h) || t.rightoffold(this, h)) {
                    if (++e > h.failure_limit) return !1
                } else n.trigger("appear"), e = 0
            })
        }
        var l, a = this,
            h = {
                threshold: 0,
                failure_limit: 0,
                event: "scroll",
                effect: "show",
                container: e,
                data_attribute: "original",
                skip_invisible: !0,
                appear: null,
                load: null,
                placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
            };
        return r && (i !== r.failurelimit && (r.failure_limit = r.failurelimit, delete r.failurelimit), i !== r.effectspeed && (r.effect_speed = r.effectspeed, delete r.effectspeed), t.extend(h, r)), l = h.container === i || h.container === e ? o : t(h.container), 0 === h.event.indexOf("scroll") && l.bind(h.event, function() {
            return s()
        }), this.each(function() {
            var e = this,
                n = t(e);
            e.loaded = !1, (n.attr("src") === i || n.attr("src") === !1) && n.attr("src", h.placeholder), n.one("appear", function() {
                if (!this.loaded) {
                    if (h.appear) {
                        var i = a.length;
                        h.appear.call(e, i, h)
                    }
                    t("<img />").bind("load", function() {
                        var i = n.data(h.data_attribute);
                        n.hide(), n.is("img") ? n.attr("src", i) : n.css("background-image", "url('" + i + "')"), n[h.effect](h.effect_speed), e.loaded = !0;
                        var o = t.grep(a, function(t) {
                            return !t.loaded
                        });
                        if (a = t(o), h.load) {
                            var r = a.length;
                            h.load.call(e, r, h)
                        }
                    }).attr("src", n.data(h.data_attribute))
                }
            }), 0 !== h.event.indexOf("scroll") && n.bind(h.event, function() {
                e.loaded || n.trigger("appear")
            })
        }), o.bind("resize", function() {
            s()
        }), /iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion) && o.bind("pageshow", function(e) {
            e.originalEvent && e.originalEvent.persisted && a.each(function() {
                t(this).trigger("appear")
            })
        }), t(n).ready(function() {
            s()
        }), this
    }, t.belowthefold = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? (e.innerHeight ? e.innerHeight : o.height()) + o.scrollTop() : t(r.container).offset().top + t(r.container).height(), s <= t(n).offset().top - r.threshold
    }, t.rightoffold = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.width() + o.scrollLeft() : t(r.container).offset().left + t(r.container).width(), s <= t(n).offset().left - r.threshold
    }, t.abovethetop = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.scrollTop() : t(r.container).offset().top, s >= t(n).offset().top + r.threshold + t(n).height()
    }, t.leftofbegin = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.scrollLeft() : t(r.container).offset().left, s >= t(n).offset().left + r.threshold + t(n).width()
    }, t.inviewport = function(e, n) {
        return !(t.rightoffold(e, n) || t.leftofbegin(e, n) || t.belowthefold(e, n) || t.abovethetop(e, n))
    }, t.extend(t.expr[":"], {
        "below-the-fold": function(e) {
            return t.belowthefold(e, {
                threshold: 0
            })
        },
        "above-the-top": function(e) {
            return !t.belowthefold(e, {
                threshold: 0
            })
        },
        "right-of-screen": function(e) {
            return t.rightoffold(e, {
                threshold: 0
            })
        },
        "left-of-screen": function(e) {
            return !t.rightoffold(e, {
                threshold: 0
            })
        },
        "in-viewport": function(e) {
            return t.inviewport(e, {
                threshold: 0
            })
        },
        "above-the-fold": function(e) {
            return !t.belowthefold(e, {
                threshold: 0
            })
        },
        "right-of-fold": function(e) {
            return t.rightoffold(e, {
                threshold: 0
            })
        },
        "left-of-fold": function(e) {
            return !t.rightoffold(e, {
                threshold: 0
            })
        }
    })
}(jQuery, window, document),
function($) {
    $ && ($.fn.headroom = function(t) {
        return this.each(function() {
            var e = $(this),
                n = e.data("headroom"),
                i = "object" == typeof t && t;
            i = $.extend(!0, {}, Headroom.options, i), n || (n = new Headroom(this, i), n.init(), e.data("headroom", n)), "string" == typeof t && n[t]()
        })
    }, $("[data-headroom]").each(function() {
        var t = $(this);
        t.headroom(t.data())
    }))
}(window.Zepto || window.jQuery), ! function(t, e) {
    "use strict";

    function n(t) {
        this.callback = t, this.ticking = !1
    }

    function i(e) {
        return e && "undefined" != typeof t && (e === t || e.nodeType)
    }

    function o(t) {
        if (arguments.length <= 0) throw new Error("Missing arguments in extend function");
        var e, n, r = t || {};
        for (n = 1; n < arguments.length; n++) {
            var s = arguments[n] || {};
            for (e in s) r[e] = "object" != typeof r[e] || i(r[e]) ? r[e] || s[e] : o(r[e], s[e])
        }
        return r
    }

    function r(t) {
        return t === Object(t) ? t : {
            down: t,
            up: t
        }
    }

    function s(t, e) {
        e = o(e, s.options), this.lastKnownScrollY = 0, this.elem = t, this.debouncer = new n(this.update.bind(this)), this.tolerance = r(e.tolerance), this.classes = e.classes, this.offset = e.offset, this.scroller = e.scroller, this.initialised = !1, this.onPin = e.onPin, this.onUnpin = e.onUnpin, this.onTop = e.onTop, this.onNotTop = e.onNotTop
    }
    var l = {
        bind: !! function() {}.bind,
        classList: "classList" in e.documentElement,
        rAF: !!(t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame)
    };
    t.requestAnimationFrame = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame, n.prototype = {
        constructor: n,
        update: function() {
            this.callback && this.callback(), this.ticking = !1
        },
        requestTick: function() {
            this.ticking || (requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this))), this.ticking = !0)
        },
        handleEvent: function() {
            this.requestTick()
        }
    }, s.prototype = {
        constructor: s,
        init: function() {
            return s.cutsTheMustard ? (this.elem.classList.add(this.classes.initial), setTimeout(this.attachEvent.bind(this), 100), this) : void 0
        },
        destroy: function() {
            var t = this.classes;
            this.initialised = !1, this.elem.classList.remove(t.unpinned, t.pinned, t.top, t.initial), this.scroller.removeEventListener("scroll", this.debouncer, !1)
        },
        attachEvent: function() {
            this.initialised || (this.lastKnownScrollY = this.getScrollY(), this.initialised = !0, this.scroller.addEventListener("scroll", this.debouncer, !1), this.debouncer.handleEvent())
        },
        unpin: function() {
            var t = this.elem.classList,
                e = this.classes;
            (t.contains(e.pinned) || !t.contains(e.unpinned)) && (t.add(e.unpinned), t.remove(e.pinned), this.onUnpin && this.onUnpin.call(this))
        },
        pin: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.unpinned) && (t.remove(e.unpinned), t.add(e.pinned), this.onPin && this.onPin.call(this))
        },
        top: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.top) || (t.add(e.top), t.remove(e.notTop), this.onTop && this.onTop.call(this))
        },
        notTop: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.notTop) || (t.add(e.notTop), t.remove(e.top), this.onNotTop && this.onNotTop.call(this))
        },
        getScrollY: function() {
            return void 0 !== this.scroller.pageYOffset ? this.scroller.pageYOffset : void 0 !== this.scroller.scrollTop ? this.scroller.scrollTop : (e.documentElement || e.body.parentNode || e.body).scrollTop
        },
        getViewportHeight: function() {
            return t.innerHeight || e.documentElement.clientHeight || e.body.clientHeight
        },
        getDocumentHeight: function() {
            var t = e.body,
                n = e.documentElement;
            return Math.max(t.scrollHeight, n.scrollHeight, t.offsetHeight, n.offsetHeight, t.clientHeight, n.clientHeight)
        },
        getElementHeight: function(t) {
            return Math.max(t.scrollHeight, t.offsetHeight, t.clientHeight)
        },
        getScrollerHeight: function() {
            return this.scroller === t || this.scroller === e.body ? this.getDocumentHeight() : this.getElementHeight(this.scroller)
        },
        isOutOfBounds: function(t) {
            var e = 0 > t,
                n = t + this.getViewportHeight() > this.getScrollerHeight();
            return e || n
        },
        toleranceExceeded: function(t, e) {
            return Math.abs(t - this.lastKnownScrollY) >= this.tolerance[e]
        },
        shouldUnpin: function(t, e) {
            var n = t > this.lastKnownScrollY,
                i = t >= this.offset;
            return n && i && e
        },
        shouldPin: function(t, e) {
            var n = t < this.lastKnownScrollY,
                i = t <= this.offset;
            return n && e || i
        },
        update: function() {
            var t = this.getScrollY(),
                e = t > this.lastKnownScrollY ? "down" : "up",
                n = this.toleranceExceeded(t, e);
            this.isOutOfBounds(t) || (t <= this.offset ? this.top() : this.notTop(), this.shouldUnpin(t, n) ? this.unpin() : this.shouldPin(t, n) && this.pin(), this.lastKnownScrollY = t)
        }
    }, s.options = {
        tolerance: {
            up: 0,
            down: 0
        },
        offset: 0,
        scroller: t,
        classes: {
            pinned: "headroom--pinned",
            unpinned: "headroom--unpinned",
            top: "headroom--top",
            notTop: "headroom--not-top",
            initial: "headroom"
        }
    }, s.cutsTheMustard = "undefined" != typeof l && l.rAF && l.bind && l.classList, t.Headroom = s
}(window, document), ! function(t, e, n, i) {
    var o = t(e);
    t.fn.lazyload = function(r) {
        function s() {
            var e = 0;
            a.each(function() {
                var n = t(this);
                if (!h.skip_invisible || n.is(":visible"))
                    if (t.abovethetop(this, h) || t.leftofbegin(this, h));
                    else if (t.belowthefold(this, h) || t.rightoffold(this, h)) {
                    if (++e > h.failure_limit) return !1
                } else n.trigger("appear"), e = 0
            })
        }
        var l, a = this,
            h = {
                threshold: 0,
                failure_limit: 0,
                event: "scroll",
                effect: "show",
                container: e,
                data_attribute: "original",
                skip_invisible: !0,
                appear: null,
                load: null,
                placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
            };
        return r && (i !== r.failurelimit && (r.failure_limit = r.failurelimit, delete r.failurelimit), i !== r.effectspeed && (r.effect_speed = r.effectspeed, delete r.effectspeed), t.extend(h, r)), l = h.container === i || h.container === e ? o : t(h.container), 0 === h.event.indexOf("scroll") && l.bind(h.event, function() {
            return s()
        }), this.each(function() {
            var e = this,
                n = t(e);
            e.loaded = !1, (n.attr("src") === i || n.attr("src") === !1) && n.attr("src", h.placeholder), n.one("appear", function() {
                if (!this.loaded) {
                    if (h.appear) {
                        var i = a.length;
                        h.appear.call(e, i, h)
                    }
                    t("<img />").bind("load", function() {
                        var i = n.data(h.data_attribute);
                        n.hide(), n.is("img") ? n.attr("src", i) : n.css("background-image", "url('" + i + "')"), n[h.effect](h.effect_speed), e.loaded = !0;
                        var o = t.grep(a, function(t) {
                            return !t.loaded
                        });
                        if (a = t(o), h.load) {
                            var r = a.length;
                            h.load.call(e, r, h)
                        }
                    }).attr("src", n.data(h.data_attribute))
                }
            }), 0 !== h.event.indexOf("scroll") && n.bind(h.event, function() {
                e.loaded || n.trigger("appear")
            })
        }), o.bind("resize", function() {
            s()
        }), /iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion) && o.bind("pageshow", function(e) {
            e.originalEvent && e.originalEvent.persisted && a.each(function() {
                t(this).trigger("appear")
            })
        }), t(n).ready(function() {
            s()
        }), this
    }, t.belowthefold = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? (e.innerHeight ? e.innerHeight : o.height()) + o.scrollTop() : t(r.container).offset().top + t(r.container).height(), s <= t(n).offset().top - r.threshold
    }, t.rightoffold = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.width() + o.scrollLeft() : t(r.container).offset().left + t(r.container).width(), s <= t(n).offset().left - r.threshold
    }, t.abovethetop = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.scrollTop() : t(r.container).offset().top, s >= t(n).offset().top + r.threshold + t(n).height()
    }, t.leftofbegin = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.scrollLeft() : t(r.container).offset().left, s >= t(n).offset().left + r.threshold + t(n).width()
    }, t.inviewport = function(e, n) {
        return !(t.rightoffold(e, n) || t.leftofbegin(e, n) || t.belowthefold(e, n) || t.abovethetop(e, n))
    }, t.extend(t.expr[":"], {
        "below-the-fold": function(e) {
            return t.belowthefold(e, {
                threshold: 0
            })
        },
        "above-the-top": function(e) {
            return !t.belowthefold(e, {
                threshold: 0
            })
        },
        "right-of-screen": function(e) {
            return t.rightoffold(e, {
                threshold: 0
            })
        },
        "left-of-screen": function(e) {
            return !t.rightoffold(e, {
                threshold: 0
            })
        },
        "in-viewport": function(e) {
            return t.inviewport(e, {
                threshold: 0
            })
        },
        "above-the-fold": function(e) {
            return !t.belowthefold(e, {
                threshold: 0
            })
        },
        "right-of-fold": function(e) {
            return t.rightoffold(e, {
                threshold: 0
            })
        },
        "left-of-fold": function(e) {
            return !t.rightoffold(e, {
                threshold: 0
            })
        }
    })
}(jQuery, window, document),
function($) {
    $ && ($.fn.headroom = function(t) {
        return this.each(function() {
            var e = $(this),
                n = e.data("headroom"),
                i = "object" == typeof t && t;
            i = $.extend(!0, {}, Headroom.options, i), n || (n = new Headroom(this, i), n.init(), e.data("headroom", n)), "string" == typeof t && n[t]()
        })
    }, $("[data-headroom]").each(function() {
        var t = $(this);
        t.headroom(t.data())
    }))
}(window.Zepto || window.jQuery), ! function(t, e) {
    "use strict";

    function n(t) {
        this.callback = t, this.ticking = !1
    }

    function i(e) {
        return e && "undefined" != typeof t && (e === t || e.nodeType)
    }

    function o(t) {
        if (arguments.length <= 0) throw new Error("Missing arguments in extend function");
        var e, n, r = t || {};
        for (n = 1; n < arguments.length; n++) {
            var s = arguments[n] || {};
            for (e in s) r[e] = "object" != typeof r[e] || i(r[e]) ? r[e] || s[e] : o(r[e], s[e])
        }
        return r
    }

    function r(t) {
        return t === Object(t) ? t : {
            down: t,
            up: t
        }
    }

    function s(t, e) {
        e = o(e, s.options), this.lastKnownScrollY = 0, this.elem = t, this.debouncer = new n(this.update.bind(this)), this.tolerance = r(e.tolerance), this.classes = e.classes, this.offset = e.offset, this.scroller = e.scroller, this.initialised = !1, this.onPin = e.onPin, this.onUnpin = e.onUnpin, this.onTop = e.onTop, this.onNotTop = e.onNotTop
    }
    var l = {
        bind: !! function() {}.bind,
        classList: "classList" in e.documentElement,
        rAF: !!(t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame)
    };
    t.requestAnimationFrame = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame, n.prototype = {
        constructor: n,
        update: function() {
            this.callback && this.callback(), this.ticking = !1
        },
        requestTick: function() {
            this.ticking || (requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this))), this.ticking = !0)
        },
        handleEvent: function() {
            this.requestTick()
        }
    }, s.prototype = {
        constructor: s,
        init: function() {
            return s.cutsTheMustard ? (this.elem.classList.add(this.classes.initial), setTimeout(this.attachEvent.bind(this), 100), this) : void 0
        },
        destroy: function() {
            var t = this.classes;
            this.initialised = !1, this.elem.classList.remove(t.unpinned, t.pinned, t.top, t.initial), this.scroller.removeEventListener("scroll", this.debouncer, !1)
        },
        attachEvent: function() {
            this.initialised || (this.lastKnownScrollY = this.getScrollY(), this.initialised = !0, this.scroller.addEventListener("scroll", this.debouncer, !1), this.debouncer.handleEvent())
        },
        unpin: function() {
            var t = this.elem.classList,
                e = this.classes;
            (t.contains(e.pinned) || !t.contains(e.unpinned)) && (t.add(e.unpinned), t.remove(e.pinned), this.onUnpin && this.onUnpin.call(this))
        },
        pin: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.unpinned) && (t.remove(e.unpinned), t.add(e.pinned), this.onPin && this.onPin.call(this))
        },
        top: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.top) || (t.add(e.top), t.remove(e.notTop), this.onTop && this.onTop.call(this))
        },
        notTop: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.notTop) || (t.add(e.notTop), t.remove(e.top), this.onNotTop && this.onNotTop.call(this))
        },
        getScrollY: function() {
            return void 0 !== this.scroller.pageYOffset ? this.scroller.pageYOffset : void 0 !== this.scroller.scrollTop ? this.scroller.scrollTop : (e.documentElement || e.body.parentNode || e.body).scrollTop
        },
        getViewportHeight: function() {
            return t.innerHeight || e.documentElement.clientHeight || e.body.clientHeight
        },
        getDocumentHeight: function() {
            var t = e.body,
                n = e.documentElement;
            return Math.max(t.scrollHeight, n.scrollHeight, t.offsetHeight, n.offsetHeight, t.clientHeight, n.clientHeight)
        },
        getElementHeight: function(t) {
            return Math.max(t.scrollHeight, t.offsetHeight, t.clientHeight)
        },
        getScrollerHeight: function() {
            return this.scroller === t || this.scroller === e.body ? this.getDocumentHeight() : this.getElementHeight(this.scroller)
        },
        isOutOfBounds: function(t) {
            var e = 0 > t,
                n = t + this.getViewportHeight() > this.getScrollerHeight();
            return e || n
        },
        toleranceExceeded: function(t, e) {
            return Math.abs(t - this.lastKnownScrollY) >= this.tolerance[e]
        },
        shouldUnpin: function(t, e) {
            var n = t > this.lastKnownScrollY,
                i = t >= this.offset;
            return n && i && e
        },
        shouldPin: function(t, e) {
            var n = t < this.lastKnownScrollY,
                i = t <= this.offset;
            return n && e || i
        },
        update: function() {
            var t = this.getScrollY(),
                e = t > this.lastKnownScrollY ? "down" : "up",
                n = this.toleranceExceeded(t, e);
            this.isOutOfBounds(t) || (t <= this.offset ? this.top() : this.notTop(), this.shouldUnpin(t, n) ? this.unpin() : this.shouldPin(t, n) && this.pin(), this.lastKnownScrollY = t)
        }
    }, s.options = {
        tolerance: {
            up: 0,
            down: 0
        },
        offset: 0,
        scroller: t,
        classes: {
            pinned: "headroom--pinned",
            unpinned: "headroom--unpinned",
            top: "headroom--top",
            notTop: "headroom--not-top",
            initial: "headroom"
        }
    }, s.cutsTheMustard = "undefined" != typeof l && l.rAF && l.bind && l.classList, t.Headroom = s
}(window, document), ! function(t, e, n, i) {
    var o = t(e);
    t.fn.lazyload = function(r) {
        function s() {
            var e = 0;
            a.each(function() {
                var n = t(this);
                if (!h.skip_invisible || n.is(":visible"))
                    if (t.abovethetop(this, h) || t.leftofbegin(this, h));
                    else if (t.belowthefold(this, h) || t.rightoffold(this, h)) {
                    if (++e > h.failure_limit) return !1
                } else n.trigger("appear"), e = 0
            })
        }
        var l, a = this,
            h = {
                threshold: 0,
                failure_limit: 0,
                event: "scroll",
                effect: "show",
                container: e,
                data_attribute: "original",
                skip_invisible: !0,
                appear: null,
                load: null,
                placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
            };
        return r && (i !== r.failurelimit && (r.failure_limit = r.failurelimit, delete r.failurelimit), i !== r.effectspeed && (r.effect_speed = r.effectspeed, delete r.effectspeed), t.extend(h, r)), l = h.container === i || h.container === e ? o : t(h.container), 0 === h.event.indexOf("scroll") && l.bind(h.event, function() {
            return s()
        }), this.each(function() {
            var e = this,
                n = t(e);
            e.loaded = !1, (n.attr("src") === i || n.attr("src") === !1) && n.attr("src", h.placeholder), n.one("appear", function() {
                if (!this.loaded) {
                    if (h.appear) {
                        var i = a.length;
                        h.appear.call(e, i, h)
                    }
                    t("<img />").bind("load", function() {
                        var i = n.data(h.data_attribute);
                        n.hide(), n.is("img") ? n.attr("src", i) : n.css("background-image", "url('" + i + "')"), n[h.effect](h.effect_speed), e.loaded = !0;
                        var o = t.grep(a, function(t) {
                            return !t.loaded
                        });
                        if (a = t(o), h.load) {
                            var r = a.length;
                            h.load.call(e, r, h)
                        }
                    }).attr("src", n.data(h.data_attribute))
                }
            }), 0 !== h.event.indexOf("scroll") && n.bind(h.event, function() {
                e.loaded || n.trigger("appear")
            })
        }), o.bind("resize", function() {
            s()
        }), /iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion) && o.bind("pageshow", function(e) {
            e.originalEvent && e.originalEvent.persisted && a.each(function() {
                t(this).trigger("appear")
            })
        }), t(n).ready(function() {
            s()
        }), this
    }, t.belowthefold = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? (e.innerHeight ? e.innerHeight : o.height()) + o.scrollTop() : t(r.container).offset().top + t(r.container).height(), s <= t(n).offset().top - r.threshold
    }, t.rightoffold = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.width() + o.scrollLeft() : t(r.container).offset().left + t(r.container).width(), s <= t(n).offset().left - r.threshold
    }, t.abovethetop = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.scrollTop() : t(r.container).offset().top, s >= t(n).offset().top + r.threshold + t(n).height()
    }, t.leftofbegin = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.scrollLeft() : t(r.container).offset().left, s >= t(n).offset().left + r.threshold + t(n).width()
    }, t.inviewport = function(e, n) {
        return !(t.rightoffold(e, n) || t.leftofbegin(e, n) || t.belowthefold(e, n) || t.abovethetop(e, n))
    }, t.extend(t.expr[":"], {
        "below-the-fold": function(e) {
            return t.belowthefold(e, {
                threshold: 0
            })
        },
        "above-the-top": function(e) {
            return !t.belowthefold(e, {
                threshold: 0
            })
        },
        "right-of-screen": function(e) {
            return t.rightoffold(e, {
                threshold: 0
            })
        },
        "left-of-screen": function(e) {
            return !t.rightoffold(e, {
                threshold: 0
            })
        },
        "in-viewport": function(e) {
            return t.inviewport(e, {
                threshold: 0
            })
        },
        "above-the-fold": function(e) {
            return !t.belowthefold(e, {
                threshold: 0
            })
        },
        "right-of-fold": function(e) {
            return t.rightoffold(e, {
                threshold: 0
            })
        },
        "left-of-fold": function(e) {
            return !t.rightoffold(e, {
                threshold: 0
            })
        }
    })
}(jQuery, window, document),
function($) {
    $ && ($.fn.headroom = function(t) {
        return this.each(function() {
            var e = $(this),
                n = e.data("headroom"),
                i = "object" == typeof t && t;
            i = $.extend(!0, {}, Headroom.options, i), n || (n = new Headroom(this, i), n.init(), e.data("headroom", n)), "string" == typeof t && n[t]()
        })
    }, $("[data-headroom]").each(function() {
        var t = $(this);
        t.headroom(t.data())
    }))
}(window.Zepto || window.jQuery), ! function(t, e) {
    "use strict";

    function n(t) {
        this.callback = t, this.ticking = !1
    }

    function i(e) {
        return e && "undefined" != typeof t && (e === t || e.nodeType)
    }

    function o(t) {
        if (arguments.length <= 0) throw new Error("Missing arguments in extend function");
        var e, n, r = t || {};
        for (n = 1; n < arguments.length; n++) {
            var s = arguments[n] || {};
            for (e in s) r[e] = "object" != typeof r[e] || i(r[e]) ? r[e] || s[e] : o(r[e], s[e])
        }
        return r
    }

    function r(t) {
        return t === Object(t) ? t : {
            down: t,
            up: t
        }
    }

    function s(t, e) {
        e = o(e, s.options), this.lastKnownScrollY = 0, this.elem = t, this.debouncer = new n(this.update.bind(this)), this.tolerance = r(e.tolerance), this.classes = e.classes, this.offset = e.offset, this.scroller = e.scroller, this.initialised = !1, this.onPin = e.onPin, this.onUnpin = e.onUnpin, this.onTop = e.onTop, this.onNotTop = e.onNotTop
    }
    var l = {
        bind: !! function() {}.bind,
        classList: "classList" in e.documentElement,
        rAF: !!(t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame)
    };
    t.requestAnimationFrame = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame, n.prototype = {
        constructor: n,
        update: function() {
            this.callback && this.callback(), this.ticking = !1
        },
        requestTick: function() {
            this.ticking || (requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this))), this.ticking = !0)
        },
        handleEvent: function() {
            this.requestTick()
        }
    }, s.prototype = {
        constructor: s,
        init: function() {
            return s.cutsTheMustard ? (this.elem.classList.add(this.classes.initial), setTimeout(this.attachEvent.bind(this), 100), this) : void 0
        },
        destroy: function() {
            var t = this.classes;
            this.initialised = !1, this.elem.classList.remove(t.unpinned, t.pinned, t.top, t.initial), this.scroller.removeEventListener("scroll", this.debouncer, !1)
        },
        attachEvent: function() {
            this.initialised || (this.lastKnownScrollY = this.getScrollY(), this.initialised = !0, this.scroller.addEventListener("scroll", this.debouncer, !1), this.debouncer.handleEvent())
        },
        unpin: function() {
            var t = this.elem.classList,
                e = this.classes;
            (t.contains(e.pinned) || !t.contains(e.unpinned)) && (t.add(e.unpinned), t.remove(e.pinned), this.onUnpin && this.onUnpin.call(this))
        },
        pin: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.unpinned) && (t.remove(e.unpinned), t.add(e.pinned), this.onPin && this.onPin.call(this))
        },
        top: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.top) || (t.add(e.top), t.remove(e.notTop), this.onTop && this.onTop.call(this))
        },
        notTop: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.notTop) || (t.add(e.notTop), t.remove(e.top), this.onNotTop && this.onNotTop.call(this))
        },
        getScrollY: function() {
            return void 0 !== this.scroller.pageYOffset ? this.scroller.pageYOffset : void 0 !== this.scroller.scrollTop ? this.scroller.scrollTop : (e.documentElement || e.body.parentNode || e.body).scrollTop
        },
        getViewportHeight: function() {
            return t.innerHeight || e.documentElement.clientHeight || e.body.clientHeight
        },
        getDocumentHeight: function() {
            var t = e.body,
                n = e.documentElement;
            return Math.max(t.scrollHeight, n.scrollHeight, t.offsetHeight, n.offsetHeight, t.clientHeight, n.clientHeight)
        },
        getElementHeight: function(t) {
            return Math.max(t.scrollHeight, t.offsetHeight, t.clientHeight)
        },
        getScrollerHeight: function() {
            return this.scroller === t || this.scroller === e.body ? this.getDocumentHeight() : this.getElementHeight(this.scroller)
        },
        isOutOfBounds: function(t) {
            var e = 0 > t,
                n = t + this.getViewportHeight() > this.getScrollerHeight();
            return e || n
        },
        toleranceExceeded: function(t, e) {
            return Math.abs(t - this.lastKnownScrollY) >= this.tolerance[e]
        },
        shouldUnpin: function(t, e) {
            var n = t > this.lastKnownScrollY,
                i = t >= this.offset;
            return n && i && e
        },
        shouldPin: function(t, e) {
            var n = t < this.lastKnownScrollY,
                i = t <= this.offset;
            return n && e || i
        },
        update: function() {
            var t = this.getScrollY(),
                e = t > this.lastKnownScrollY ? "down" : "up",
                n = this.toleranceExceeded(t, e);
            this.isOutOfBounds(t) || (t <= this.offset ? this.top() : this.notTop(), this.shouldUnpin(t, n) ? this.unpin() : this.shouldPin(t, n) && this.pin(), this.lastKnownScrollY = t)
        }
    }, s.options = {
        tolerance: {
            up: 0,
            down: 0
        },
        offset: 0,
        scroller: t,
        classes: {
            pinned: "headroom--pinned",
            unpinned: "headroom--unpinned",
            top: "headroom--top",
            notTop: "headroom--not-top",
            initial: "headroom"
        }
    }, s.cutsTheMustard = "undefined" != typeof l && l.rAF && l.bind && l.classList, t.Headroom = s
}(window, document), ! function(t, e, n, i) {
    var o = t(e);
    t.fn.lazyload = function(r) {
        function s() {
            var e = 0;
            a.each(function() {
                var n = t(this);
                if (!h.skip_invisible || n.is(":visible"))
                    if (t.abovethetop(this, h) || t.leftofbegin(this, h));
                    else if (t.belowthefold(this, h) || t.rightoffold(this, h)) {
                    if (++e > h.failure_limit) return !1
                } else n.trigger("appear"), e = 0
            })
        }
        var l, a = this,
            h = {
                threshold: 0,
                failure_limit: 0,
                event: "scroll",
                effect: "show",
                container: e,
                data_attribute: "original",
                skip_invisible: !0,
                appear: null,
                load: null,
                placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
            };
        return r && (i !== r.failurelimit && (r.failure_limit = r.failurelimit, delete r.failurelimit), i !== r.effectspeed && (r.effect_speed = r.effectspeed, delete r.effectspeed), t.extend(h, r)), l = h.container === i || h.container === e ? o : t(h.container), 0 === h.event.indexOf("scroll") && l.bind(h.event, function() {
            return s()
        }), this.each(function() {
            var e = this,
                n = t(e);
            e.loaded = !1, (n.attr("src") === i || n.attr("src") === !1) && n.attr("src", h.placeholder), n.one("appear", function() {
                if (!this.loaded) {
                    if (h.appear) {
                        var i = a.length;
                        h.appear.call(e, i, h)
                    }
                    t("<img />").bind("load", function() {
                        var i = n.data(h.data_attribute);
                        n.hide(), n.is("img") ? n.attr("src", i) : n.css("background-image", "url('" + i + "')"), n[h.effect](h.effect_speed), e.loaded = !0;
                        var o = t.grep(a, function(t) {
                            return !t.loaded
                        });
                        if (a = t(o), h.load) {
                            var r = a.length;
                            h.load.call(e, r, h)
                        }
                    }).attr("src", n.data(h.data_attribute))
                }
            }), 0 !== h.event.indexOf("scroll") && n.bind(h.event, function() {
                e.loaded || n.trigger("appear")
            })
        }), o.bind("resize", function() {
            s()
        }), /iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion) && o.bind("pageshow", function(e) {
            e.originalEvent && e.originalEvent.persisted && a.each(function() {
                t(this).trigger("appear")
            })
        }), t(n).ready(function() {
            s()
        }), this
    }, t.belowthefold = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? (e.innerHeight ? e.innerHeight : o.height()) + o.scrollTop() : t(r.container).offset().top + t(r.container).height(), s <= t(n).offset().top - r.threshold
    }, t.rightoffold = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.width() + o.scrollLeft() : t(r.container).offset().left + t(r.container).width(), s <= t(n).offset().left - r.threshold
    }, t.abovethetop = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.scrollTop() : t(r.container).offset().top, s >= t(n).offset().top + r.threshold + t(n).height()
    }, t.leftofbegin = function(n, r) {
        var s;
        return s = r.container === i || r.container === e ? o.scrollLeft() : t(r.container).offset().left, s >= t(n).offset().left + r.threshold + t(n).width()
    }, t.inviewport = function(e, n) {
        return !(t.rightoffold(e, n) || t.leftofbegin(e, n) || t.belowthefold(e, n) || t.abovethetop(e, n))
    }, t.extend(t.expr[":"], {
        "below-the-fold": function(e) {
            return t.belowthefold(e, {
                threshold: 0
            })
        },
        "above-the-top": function(e) {
            return !t.belowthefold(e, {
                threshold: 0
            })
        },
        "right-of-screen": function(e) {
            return t.rightoffold(e, {
                threshold: 0
            })
        },
        "left-of-screen": function(e) {
            return !t.rightoffold(e, {
                threshold: 0
            })
        },
        "in-viewport": function(e) {
            return t.inviewport(e, {
                threshold: 0
            })
        },
        "above-the-fold": function(e) {
            return !t.belowthefold(e, {
                threshold: 0
            })
        },
        "right-of-fold": function(e) {
            return t.rightoffold(e, {
                threshold: 0
            })
        },
        "left-of-fold": function(e) {
            return !t.rightoffold(e, {
                threshold: 0
            })
        }
    })
}(jQuery, window, document);