import "../css/app.less";
import $ from "jquery";
import "../components/monister/eyes.js";
import "waypoints";
import "scrollTo";
import "./min/app.js";
import "./min/init.min.js";


function progressTicker() {
    $(".grp3 img.profile").removeClass().next("img").last().addClass("profile");
}

// update carousel navigation for accessibility
function tabSetter() {
    $("#workStage a").attr("tabindex", -1);
    $("#workStage .opaque a").attr("tabindex", 0);
};
tabSetter();

//Pause and resume animation function
(function() {
    var $ = jQuery,
        pauseId = 'jQuery.pause',
        uuid = 1,
        oldAnimate = $.fn.animate,
        anims = {};

    function now() { return new Date().getTime(); }

    $.fn.animate = function(prop, speed, easing, callback) {
        var optall = $.speed(speed, easing, callback);
        optall.complete = optall.old; // unwrap callback
        return this.each(function() {
            // check pauseId
            if (! this[pauseId])
                this[pauseId] = uuid++;
            // start animation
            var opt = $.extend({}, optall);
            oldAnimate.apply($(this), [prop, $.extend({}, opt)]);
            // store data
            anims[this[pauseId]] = {
                run: true,
                prop: prop,
                opt: opt,
                start: now(),
                done: 0
            };
        });
    };

    $.fn.pause = function() {
        return this.each(function() {
            // check pauseId
            if (! this[pauseId])
                this[pauseId] = uuid++;
            // fetch data
            var data = anims[this[pauseId]];
            if (data && data.run) {
                data.done += now() - data.start;
                if (data.done > data.opt.duration) {
                    // remove stale entry
                    delete anims[this[pauseId]];
                } else {
                    // pause animation
                    $(this).stop();
                    data.run = false;
                }
            }
        });
    };

    $.fn.resume = function() {
        return this.each(function() {
            // check pauseId
            if (! this[pauseId])
                this[pauseId] = uuid++;
            // fetch data
            var data = anims[this[pauseId]];
            if (data && ! data.run) {
                // resume animation
                data.opt.duration -= data.done;
                data.done = 0;
                data.run = true;
                data.start = now();
                oldAnimate.apply($(this), [data.prop, $.extend({}, data.opt)]);
            }
        });
    };
})();

// PAGE INTERACTIONS
$(function() {
    // default screen titles for ADA
    $("#workStage .mobileScreen span a").attr("title", "Zoom mobile screen view");
    $("#workStage .desktopScreen span a").attr("title", "Zoom desktop screen view");
    $("#workStage .tabletScreen span a").attr("title", "Zoom tablet screen view");

    // progress ticker for selfie snapshot
    var refreshIntervalId = setInterval(progressTicker, 1000);

    $(".selfieXO .description p a:nth-child(3)").click(function() {
        refreshIntervalId = setInterval(progressTicker, 1000);
    })

    $(".selfieXO .description p a:nth-child(3)").click(function() {
        $(".grp3 span").next("img").addClass("profile");
        clearInterval(refreshIntervalId);
    })

    // scroll to sections
    $("[id^=scrollTo]").click(function() {
        var id = $(this).attr("id").slice(9);
        $(window).scrollTo($("#" + id), 1000, { offset: { top: 50, left: 0 } });
        return false;
    });
    // Project gallery navigation
    $("#workStage ul").on("click", "li", function() {
        var newSlide = $(this).index();
        var idx = $("#workStage section").eq(newSlide);

        // Resetting, swapping and blocking
        $(idx).find("a").on("click", function(){
            return false;
        });
        // Show/hide sections & update tab nav
        $("#workStage section").removeClass("opaque").attr("aria-hidden", "true").children("a").attr("tabindex", -1);
        $(idx).addClass("opaque").attr("aria-hidden", "false");
        tabSetter();
        // Carousel navigation aria and styling
        $("#workStage ul li").removeClass("selected").attr("aria-selected", "false");
        $(this).addClass("selected").attr("aria-selected", "true");
        // Individual slide navigation styling
        $("#workStage section p a").removeClass("active");
        $("#workStage section p a.specs").show();
        $("#workStage section.opaque a.specs").length ?
            $("#workStage section p:last-child").prev("p").find("a:first-child").addClass("active") :
            $("#workStage section").find(".scroll").next("a:not('.specs')").addClass("active");
        // Reset individual slide content
        $(idx).find("div[class*='grp']").hide();
        $(idx).find(".grp1").show();

        // Strike thru to remove scroll nav without UI weirdness
        $("#workStage .ppcc p a:first-child").removeClass("strike-thru");
        $("#workStage .ppcc p a").on("click", function(){
            if ($(this).is(":last-child")) {
                $("#workStage .ppcc p a:first-child").addClass("strike-thru");
            } else if ($(this).is(":first-child") && $(this).hasClass("strike-thru")) {
                return false;
            } else {
                $("#workStage .ppcc p a:first-child").removeClass("strike-thru");
            }
        });

        // Pagination reset if there are or aren't other nav elems
        if (($(idx).has(".scroll").length && $(idx).has("a:not(:contains('Scroll'))").length) ||
            ($(idx).has(".scroll").length && $(idx).has("a:not(:contains('Scroll''))").length === 0)) {
            $(idx).next("a:not('.scroll')").addClass("active");
        } else if (($(idx).has(".scroll").length === 0 && $(idx).has("a:not(:contains('Scroll'))").length)) {
            $(idx).find("a:first-child").addClass("active");
        }
        // Sets device display to desktop only as needed
        $(".selfieXO, .seamless, .cardFinder, .bofaStyleguide, .viewCards").hasClass("opaque") ?
            $("#devices").fadeOut(function () {$("#devices").addClass("dskTopOnly").fadeIn(500)})
            : $("#devices").removeClass("dskTopOnly");

        // Sets device display to mobile only as needed
        $(".autoCoupons").hasClass("opaque") ?
            $("#devices").fadeOut(function () {$("#devices").addClass("mobileOnly").fadeIn(500)})
            : $("#devices").removeClass("mobileOnly");
    });

    // Project screens pagination
    $("#workStage section").find("p a:not('.scroll, .specs')").on("click", function(){
        var txt = $(this).text();
        $("#workStage section").find("a").removeClass("active");
        $(this).addClass("active");
        $("#workStage section div:not(.description)").hide();
        $("#workStage section").find(".grp" + txt).show();
        $("#workStage .bofaStyleguide.opaque .grp8").is(":visible") === true ?
            $("a.specs").hide() :
            $("a.specs").show();
        return false;
    });

    // Toggle specs on styleguide slide
    $("#workStage .bofaStyleguide p a.specs").click(function () {
        ($(this).text() === "Show Positioning") ? $(this).text("Hide Positioning") : $(this).text("Show Positioning");
        $("#workStage .bofaStyleguide div img").toggleClass("down");
        $("#workStage .bofaStyleguide div img:last-child").toggleClass("down");
    });

    // Project screen animations
    $('a.scroll').hover(function(){
        $(this).text('Hold-click will pause');
    }, function() {
        $(this).text('Scroll the experience');
    });
    $("a.scroll").bind("click mousedown" ,
        function () {
            $("#workStage section span img").pause();
            $(this).text('Release to resume');
            return false
        }
    );
    $("a.scroll").bind("click mouseup" ,
        function () {
            $("#workStage section span img").resume();
            $(this).text('Scroll the experience');
        }
    );
    $("#workStage .ppgf p a.scroll").bind("mouseenter focus" ,
        function () {
            $("#workStage .ppgf .grp1 .mobileScreen img").stop().animate({top: "-6.5%"}, 500);
            if ($(window).width() < 460) {
                $("#workStage .ppgf .grp1 .tabletScreen img").stop().animate({top: "-57%"}, 1000);
                $("#workStage .ppgf .grp2 .tabletScreen img").stop().animate({top: "-210%"}, 2000);
            }
            else {
                $("#workStage .ppgf .grp1 .tabletScreen img").stop().animate({top: "-60%"}, 1000);
                $("#workStage .ppgf .grp2 .tabletScreen img").stop().animate({top: "-227%"}, 2000);
            }
            $("#workStage .ppgf .grp2 .mobileScreen img").stop().animate({top: "-56%"}, 2000);
            $("#workStage .ppgf .grp2 .desktopScreen img").stop().animate({top: "-141%"}, 2000);
        }
    );
    $("#workStage .ppgf2 p a").bind("mouseenter focus" ,
        function () {
            if ($(window).width() < 460 ) {
                $("#workStage .ppgf2 .mobileScreen img").stop().animate({top: "-415%"}, 2500);
            }
            else if ($(window).width() > 460 && $(window).width() < 680 ) {
                $("#workStage .ppgf2 .mobileScreen img").stop().animate({top: "-445%"}, 2500);
            }
            else {
                $("#workStage .ppgf2 .mobileScreen img").stop().animate({top: "-422%"}, 2500);
            }
            if ($(window).width() < 420 ) {
                $("#workStage .ppgf2 .tabletScreen img").stop().animate({top: "-306%"}, 2500);
            }
            else if ($(window).width() > 420 && $(window).width() < 680 ) {
                $("#workStage .ppgf2 .tabletScreen img").stop().animate({top: "-320%"}, 2500);
            }
            else {
                $("#workStage .ppgf2 .tabletScreen img").stop().animate({top: "-333.5%"}, 2500);
            }
            $("#workStage .ppgf2 .desktopScreen img").stop().animate({top: "-145%"}, 2500);
        }
    );
    $("#workStage .p2p p a.scroll").bind("mouseenter focus" ,
        function () {
            $("#workStage .p2p .grp1 .tabletScreen img").stop().animate({top: "-60%"}, 1000);
            $("#workStage .p2p .grp2 .tabletScreen img").stop().animate({top: "-60%"}, 1000);
            $("#workStage .p2p .grp3 .mobileScreen img").stop().animate({top: "-15%"}, 1000);
            $("#workStage .p2p .grp3 .desktopScreen img").stop().animate({top: "-35%"}, 1000);
            $("#workStage .p2p .grp3 .tabletScreen img").stop().animate({top: "-148%"}, 1000);
            $("#workStage .p2p .grp4 .mobileScreen img").stop().animate({top: "-37%"}, 1000);
            $("#workStage .p2p .grp4 .desktopScreen img").stop().animate({top: "-72%"}, 1000);
            $("#workStage .p2p .grp4 .tabletScreen img").stop().animate({top: "-215%"}, 1000);
            $("#workStage .p2p .grp5 .mobileScreen img").stop().animate({top: "-11%"}, 1000);
            $("#workStage .p2p .grp5 .desktopScreen img").stop().animate({top: "-30%"}, 1000);
            $("#workStage .p2p .grp5 .tabletScreen img").stop().animate({top: "-212%"}, 1000);
            $("#workStage .p2p .grp6 .desktopScreen img").stop().animate({top: "-6%"}, 1000);
            $("#workStage .p2p .grp6 .tabletScreen img").stop().animate({top: "-82%"}, 1000);
        }
    );
    $("#workStage .cardFinder p a.scroll").bind("mouseenter focus" ,
        function () {
            $("#workStage .cardFinder .grp1 .desktopScreen img").stop().animate({top: "-150%"}, 2000);
            $("#workStage .cardFinder .grp2 .desktopScreen img").stop().animate({top: "-150%"}, 2000);
        }
    );
    $("#workStage .dtc p a").bind("mouseenter focus" ,
        function () {
            if ($(window).width() > 701 && $(window).width() < 740) {
                $("#workStage .dtc .mobileScreen img").stop().animate({top: "-460%"}, 4000);
                $("#workStage .dtc .tabletScreen img").stop().animate({top: "-565%"}, 4000);
                $("#workStage .dtc .desktopScreen img").stop().animate({top: "-323%"}, 4000);
            }
            else if ($(window).width() > 620 && $(window).width() < 700) {
                $("#workStage .dtc .mobileScreen img").stop().animate({top: "-480%"}, 4000);
                $("#workStage .dtc .tabletScreen img").stop().animate({top: "-525%"}, 4000);
                $("#workStage .dtc .desktopScreen img").stop().animate({top: "-315%"}, 4000);
            }
            else if ($(window).width() > 560 && $(window).width() < 619) {
                $("#workStage .dtc .mobileScreen img").stop().animate({top: "-440%"}, 4000);
                $("#workStage .dtc .tabletScreen img").stop().animate({top: "-540%"}, 4000);
                $("#workStage .dtc .desktopScreen img").stop().animate({top: "-320%"}, 4000);
            }
            else if ($(window).width() > 500 && $(window).width() < 559) {
                $("#workStage .dtc .mobileScreen img").stop().animate({top: "-475%"}, 4000);
                $("#workStage .dtc .tabletScreen img").stop().animate({top: "-550%"}, 4000);
                $("#workStage .dtc .desktopScreen img").stop().animate({top: "-330%"}, 4000);
            }
            else if ($(window).width() > 440 && $(window).width() < 499) {
                $("#workStage .dtc .mobileScreen img").stop().animate({top: "-455%"}, 4000);
                $("#workStage .dtc .tabletScreen img").stop().animate({top: "-550%"}, 4000);
                $("#workStage .dtc .desktopScreen img").stop().animate({top: "-330%"}, 4000);
            }
            else {
                $("#workStage .dtc .mobileScreen img").stop().animate({top: "-455%"}, 4000);
                $("#workStage .dtc .tabletScreen img").stop().animate({top: "-575%"}, 4000);
                $("#workStage .dtc .desktopScreen img").stop().animate({top: "-323%"}, 4000);
            }

        }
    );
    $("#workStage .ppcc p a.scroll").bind("mouseenter focus" ,
        function () {
            $("#workStage .ppcc .grp1 .mobileScreen img").stop().animate({top: "-223%"}, 2000);
            $("#workStage .ppcc .grp1 .desktopScreen img").stop().animate({top: "-221%"}, 2000);
            $("#workStage .ppcc .grp1 .tabletScreen img").stop().animate({top: "-406%"}, 2000);
            $("#workStage .ppcc .grp2 .mobileScreen img").stop().animate({top: "-140%"}, 1000);
            $("#workStage .ppcc .grp2 .desktopScreen img").stop().animate({top: "-58%"}, 1000);
            $("#workStage .ppcc .grp2 .tabletScreen img").stop().animate({top: "-173%"}, 1000);
        }
    );
    $("#workStage .d2ppAcq p a.scroll").bind("mouseenter focus" ,
        function () {
            $("#workStage .d2ppAcq .grp1 .mobileScreen img:last-child").stop().animate({top: "-125%"}, 2000);
            $("#workStage .d2ppAcq .grp1 .desktopScreen img:last-child").stop().animate({top: "-375%"}, 2000);
            $("#workStage .d2ppAcq .grp1 .tabletScreen img:last-child").stop().animate({top: "-241%"}, 2000);
            $("#workStage .d2ppAcq .grp2 .desktopScreen img").stop().animate({top: "-22%"}, 1000);
        }
    );
    $("#workStage .bofaStyleguide p a.scroll").bind("mouseenter focus" ,
        function () {
            $("#workStage .bofaStyleguide .grp1 .desktopScreen img").stop().animate({top: "-440%"}, 3000);
            $("#workStage .bofaStyleguide .grp2 .desktopScreen img").stop().animate({top: "-240%"}, 2000);
            $("#workStage .bofaStyleguide .grp3 .desktopScreen img").stop().animate({top: "-242.5%"}, 2000);
            $("#workStage .bofaStyleguide .grp4 .desktopScreen img").stop().animate({top: "-340%"}, 2000);
            $("#workStage .bofaStyleguide .grp5 .desktopScreen img").stop().animate({top: "-190%"}, 2000);
            $("#workStage .bofaStyleguide .grp6 .desktopScreen img").stop().animate({top: "-240%"}, 2000);
            $("#workStage .bofaStyleguide .grp7 .desktopScreen img").stop().animate({top: "-212%"}, 2000);
            $("#workStage .bofaStyleguide .grp8 .desktopScreen img").stop().animate({top: "-60%"}, 1000);
        }
    );
    $("#workStage .adGen p a.scroll").bind("mouseenter focus" ,
        function () {
            $("#workStage .adGen .grp1 .mobileScreen img").stop().animate({top: "-80%"}, 2000);
            $("#workStage .adGen .grp1 .desktopScreen img").stop().animate({top: "-90%"}, 2000);
            $("#workStage .adGen .grp1 .tabletScreen img").stop().animate({top: "-55%"}, 2000);
            $("#workStage .adGen .grp2 .mobileScreen img").stop().animate({top: "-80%"}, 1000);
            $("#workStage .adGen .grp2 .desktopScreen img").stop().animate({top: "-90%"}, 1000);
            $("#workStage .adGen .grp2 .tabletScreen img").stop().animate({top: "-50%"}, 1000);
            $("#workStage .adGen .grp3 .mobileScreen img").stop().animate({top: "-38%"}, 1000);
            $("#workStage .adGen .grp3 .desktopScreen img").stop().animate({top: "-85%"}, 1000);
            $("#workStage .adGen .grp3 .tabletScreen img").stop().animate({top: "-56%"}, 1000);
            $("#workStage .adGen .grp4 .mobileScreen img").stop().animate({top: "-38%"}, 1000);
            $("#workStage .adGen .grp4 .desktopScreen img").stop().animate({top: "-85%"}, 1000);
            $("#workStage .adGen .grp4 .tabletScreen img").stop().animate({top: "-56%"}, 1000);
            $("#workStage .adGen .grp5 .mobileScreen img").stop().animate({top: "-38%"}, 1000);
            $("#workStage .adGen .grp5 .desktopScreen img").stop().animate({top: "-85%"}, 1000);
            $("#workStage .adGen .grp5 .tabletScreen img").stop().animate({top: "-56%"}, 1000);
            $("#workStage .adGen .grp6 .mobileScreen img").stop().animate({top: "-82%"}, 1000);
            $("#workStage .adGen .grp6 .desktopScreen img").stop().animate({top: "-125%"}, 1000);
            $("#workStage .adGen .grp6 .tabletScreen img").stop().animate({top: "-84%"}, 1000);
            $("#workStage .adGen .grp7 .mobileScreen img").stop().animate({top: "-23%"}, 1000);
            $("#workStage .adGen .grp7 .desktopScreen img").stop().animate({top: "-46%"}, 1000);
            $("#workStage .adGen .grp7 .tabletScreen img").stop().animate({top: "-20%"}, 1000);
        }
    );
    $("#workStage .viewCards p a.scroll").bind("mouseenter focus" ,
        function () {
            $("#workStage .viewCards .grp1 .desktopScreen img").stop().animate({top: "-325%"}, 3000);
            $("#workStage .viewCards .grp2 .desktopScreen img").stop().animate({top: "-325%"}, 2000);
            $("#workStage .viewCards .grp3 .desktopScreen img").stop().animate({top: "-169%"}, 2000);
            $("#workStage .viewCards .grp4 .desktopScreen img").stop().animate({top: "-327.5%"}, 2000);
        }
    );
    $("#workStage section p a").bind("mouseleave blur" ,
        function () {
            $("#workStage section span img").stop().animate({top: "0"}, "slow");
            $("#workStage .d2ppAcq .grp1 .mobileScreen img:last-child").stop().animate({top: "7%"}, "slow");
            $("#workStage .d2ppAcq .grp1 .desktopScreen img:last-child").stop().animate({top: "12%"}, "slow");
            $("#workStage .d2ppAcq .grp1 .tabletScreen img:last-child").stop().animate({top: "5px"}, "slow");
        }
    );

    // Screen zoom
    $("#workStage section span a").bind("click" ,
        function () {
            $("#home-top").addClass("hidden");
            $("#myWork, #empireBldg").css("z-index", "initial");
            $("#workStage section.opaque").addClass("zoomed");
            $(this).parent().addClass("screenZoom");
            $(this).next("img").addClass("lrg");
            $(".overlay").addClass("open");
            $("#me").waypoint(
                function(direction) {
                    if (direction ==="up") {
                        $(".overlay-close").trigger("click");
                    }
                }, { offset: "-50%" });
            return false
        }
    );
    $(".overlay-close").bind("click" ,
        function () {
            $("#home-top").removeClass("hidden");
            $("#myWork").css("z-index", "995");
            $("#empireBldg").css("z-index", "981");
            $("#workStage section.opaque").removeClass("zoomed");
            $("#workStage section.opaque span").removeClass("screenZoom");
            $("#workStage section.opaque span img").removeClass("lrg");
            $(".overlay").removeClass("open");
            return false
        }
    );
});




