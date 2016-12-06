import '../css/app.less';
import $ from 'jquery';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../components/monister/eyes.js';
import '../components/slider/unslider.js';
import 'waypoints';
import 'scrollTo';
import './min/app.js';
import './min/init.min.js';


$(function() {
    var refreshIntervalId = setInterval(progressTicker, 1000);

    $('.selfieXO .description p a:nth-child(3)').click(function() {
        refreshIntervalId = setInterval(progressTicker, 1000);
    })

    $('.selfieXO .description p a:nth-child(3)').click(function() {
        $('.grp3 span').next('img').addClass('profile');
        clearInterval(refreshIntervalId);
    })
});

function progressTicker() {
    $('.grp3 img.profile').removeClass().next('img').last().addClass('profile');
}




$(function() {
    $('[id^=scrollTo]').click(function() {
        var id = $(this).attr('id').slice(9);
        $(window).scrollTo($('#' + id), 1000, { offset: { top: -51, left: 0 } });
    });

    $('#marketing').waypoint(function() {
        $('.img-circle').addClass('animated zoomIn');
    }, {
        offset: '50%',
        triggerOnce: true
    });

    $('.featurette').waypoint(function() {
        $('#' + this.element.id + ' .featurette-image').addClass('animated pulse');
    }, {
        offset: '50%',
        triggerOnce: true
    });
});
// Project gallery navigation
$(function() {
    $('#workStage ul').on('click', 'li', function() {
        var newSlide = $(this).index();
        var idx = $('#workStage section').eq(newSlide);

        // Resetting, swapping and blocking
        $('#workStage section').removeClass('opaque');
        $(idx).addClass('opaque');
        $('#workStage ul li').removeClass('selected');
        $(this).addClass('selected');
        $('#workStage section p a').removeClass('active');
        $('#workStage section').find('p a:contains("Scroll")').next('a').addClass('active');
        $('#workStage .ppcc p a:first-child').removeClass('strike-thru');
        $(idx).find('div[class*="grp"]').hide();
        $(idx).find('.grp1').show();
        $(idx).find('a').on('click', function(){
            return false;
        });

        // Strike thru to remove scroll nav without UI weirdness
        $('#workStage .ppcc p a').on('click', function(){
            if ($(this).is(':last-child')) {
                $('#workStage .ppcc p a:first-child').addClass('strike-thru');
            } else if ($(this).is(':first-child') && $(this).hasClass('strike-thru')) {
                return false;
            } else {
                $('#workStage .ppcc p a:first-child').removeClass('strike-thru');
            }
        });

        // Pagination reset
        if (($(idx).has('.scroll').length && $(idx).has('a:not(:contains("Scroll"))').length) ||
            ($(idx).has('.scroll').length && $(idx).has('a:not(:contains("Scroll"))').length === 0)) {
            $(idx).next('a:not(:contains("Scroll"))').addClass('active');
        } else if (($(idx).has('.scroll').length === 0 && $(idx).has('a:not(:contains("Scroll"))').length)) {
            $(idx).find('a:first-child').addClass('active');
        }

        $('.selfieXO').hasClass('opaque') || $('.seamless').hasClass('opaque') ?
            $('#devices').fadeOut(function () {$('#devices').addClass('dskTopOnly').fadeIn(500)})
            : $('#devices').removeClass('dskTopOnly');
    });

    // Project screens pagination
    $('#workStage section').find('p a:not(:contains("Scroll"))').on('click', function(){
        var txt = $(this).text();
        $('#workStage section').find('a').removeClass('active');
        $(this).addClass('active');
        $('#workStage section div:not(.description)').hide();
        $('#workStage section').find('.grp' + txt).show();
        return false;
    });
});


// Project screen animations
$(function() {
    $('#workStage .ppgf p a:first-child').mouseenter(
        function () {
            $('#workStage .ppgf .grp1 .mobileScreen img').stop().animate({top: '-6.5%'}, 500);
            $('#workStage .ppgf .grp1 .tabletScreen img').stop().animate({top: '-60%'}, 1000);
            $('#workStage .ppgf .grp2 .mobileScreen img').stop().animate({top: '-56%'}, 2000);
            $('#workStage .ppgf .grp2 .desktopScreen img').stop().animate({top: '-141%'}, 2000);
            $('#workStage .ppgf .grp2 .tabletScreen img').stop().animate({top: '-229%'}, 2000);
        }
    );
    $('#workStage .ppgf2 p a').mouseenter(
        function () {
            $('#workStage .ppgf2 .mobileScreen img').stop().animate({top: '-402%'}, 2500);
            $('#workStage .ppgf2 .desktopScreen img').stop().animate({top: '-145%'}, 2500);
            $('#workStage .ppgf2 .tabletScreen img').stop().animate({top: '-336%'}, 2500);
        }
    );
    $('#workStage .p2p p a:first-child').mouseenter(
        function () {
            $('#workStage .p2p .grp1 .tabletScreen img').stop().animate({top: '-60%'}, 1000);
            $('#workStage .p2p .grp2 .tabletScreen img').stop().animate({top: '-60%'}, 1000);
            $('#workStage .p2p .grp3 .mobileScreen img').stop().animate({top: '-15%'}, 1000);
            $('#workStage .p2p .grp3 .desktopScreen img').stop().animate({top: '-35%'}, 1000);
            $('#workStage .p2p .grp3 .tabletScreen img').stop().animate({top: '-148%'}, 1000);
            $('#workStage .p2p .grp4 .mobileScreen img').stop().animate({top: '-37%'}, 1000);
            $('#workStage .p2p .grp4 .desktopScreen img').stop().animate({top: '-72%'}, 1000);
            $('#workStage .p2p .grp4 .tabletScreen img').stop().animate({top: '-215%'}, 1000);
            $('#workStage .p2p .grp5 .mobileScreen img').stop().animate({top: '-11%'}, 1000);
            $('#workStage .p2p .grp5 .desktopScreen img').stop().animate({top: '-30%'}, 1000);
            $('#workStage .p2p .grp5 .tabletScreen img').stop().animate({top: '-212%'}, 1000);
            $('#workStage .p2p .grp6 .desktopScreen img').stop().animate({top: '-6%'}, 1000);
            $('#workStage .p2p .grp6 .tabletScreen img').stop().animate({top: '-82%'}, 1000);
        }
    );
    $('#workStage .dtc p a').mouseenter(
        function () {
            $('#workStage .dtc .mobileScreen img').stop().animate({top: '-433%'}, 4000);
            $('#workStage .dtc .desktopScreen img').stop().animate({top: '-326%'}, 4000);
            $('#workStage .dtc .tabletScreen img').stop().animate({top: '-578%'}, 4000);
        }
    );
    $('#workStage .ppcc p a:first-child').mouseenter(
        function () {
            $('#workStage .ppcc .grp1 .mobileScreen img').stop().animate({top: '-223%'}, 2000);
            $('#workStage .ppcc .grp1 .desktopScreen img').stop().animate({top: '-223%'}, 2000);
            $('#workStage .ppcc .grp1 .tabletScreen img').stop().animate({top: '-408%'}, 2000);
            $('#workStage .ppcc .grp2 .mobileScreen img').stop().animate({top: '-140%'}, 1000);
            $('#workStage .ppcc .grp2 .desktopScreen img').stop().animate({top: '-58%'}, 1000);
            $('#workStage .ppcc .grp2 .tabletScreen img').stop().animate({top: '-173%'}, 1000);
        }
    );
    $('#workStage .d2ppAcq p a:first-child').mouseenter(
        function () {
            $('#workStage .d2ppAcq .grp1 .mobileScreen img:last-child').stop().animate({top: '-125%'}, 2000);
            $('#workStage .d2ppAcq .grp1 .desktopScreen img:last-child').stop().animate({top: '-305%'}, 2000);
            $('#workStage .d2ppAcq .grp1 .tabletScreen img:last-child').stop().animate({top: '-241%'}, 2000);
            $('#workStage .d2ppAcq .grp2 .desktopScreen img').stop().animate({top: '-22%'}, 1000);
        }
    );
    $('#workStage .adGen p a:first-child').mouseenter(
        function () {
            $('#workStage .adGen .grp1 .mobileScreen img').stop().animate({top: '-80%'}, 2000);
            $('#workStage .adGen .grp1 .desktopScreen img').stop().animate({top: '-90%'}, 2000);
            $('#workStage .adGen .grp1 .tabletScreen img').stop().animate({top: '-55%'}, 2000);
            $('#workStage .adGen .grp2 .mobileScreen img').stop().animate({top: '-80%'}, 1000);
            $('#workStage .adGen .grp2 .desktopScreen img').stop().animate({top: '-90%'}, 1000);
            $('#workStage .adGen .grp2 .tabletScreen img').stop().animate({top: '-50%'}, 1000);
            $('#workStage .adGen .grp3 .mobileScreen img').stop().animate({top: '-38%'}, 1000);
            $('#workStage .adGen .grp3 .desktopScreen img').stop().animate({top: '-85%'}, 1000);
            $('#workStage .adGen .grp3 .tabletScreen img').stop().animate({top: '-56%'}, 1000);
            $('#workStage .adGen .grp4 .mobileScreen img').stop().animate({top: '-38%'}, 1000);
            $('#workStage .adGen .grp4 .desktopScreen img').stop().animate({top: '-85%'}, 1000);
            $('#workStage .adGen .grp4 .tabletScreen img').stop().animate({top: '-56%'}, 1000);
            $('#workStage .adGen .grp5 .mobileScreen img').stop().animate({top: '-38%'}, 1000);
            $('#workStage .adGen .grp5 .desktopScreen img').stop().animate({top: '-85%'}, 1000);
            $('#workStage .adGen .grp5 .tabletScreen img').stop().animate({top: '-56%'}, 1000);
            $('#workStage .adGen .grp6 .mobileScreen img').stop().animate({top: '-82%'}, 1000);
            $('#workStage .adGen .grp6 .desktopScreen img').stop().animate({top: '-125%'}, 1000);
            $('#workStage .adGen .grp6 .tabletScreen img').stop().animate({top: '-84%'}, 1000);
            $('#workStage .adGen .grp7 .mobileScreen img').stop().animate({top: '-23%'}, 1000);
            $('#workStage .adGen .grp7 .desktopScreen img').stop().animate({top: '-46%'}, 1000);
            $('#workStage .adGen .grp7 .tabletScreen img').stop().animate({top: '-20%'}, 1000);
        }
    );
    $('#workStage section p a').mouseleave(
        function () {
            $('#workStage section span img').stop().animate({top: '0'}, 'slow');
        }
    );
});

