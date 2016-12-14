(function($) {
	"use strict";

	var airSpace = document.getElementById('airSpace');
    var angerKong = document.getElementById('kongFace');
    var kongSlap = document.getElementById('kongSlap');
	var defaultOptions = {
		padding: 0,
		reset: false,
		radius: 'natural',
		position: 'center',
		trigger: airSpace,
        goloco: angerKong,
        tooClose: kongSlap
	};

	var positions = {
		top: 90,
		bottom: -90,
		left: 180,
		right: 0,
		topRight: 45,
		topLeft: 135,
		bottomRight: -45,
		bottomLeft: -135
	};

	function Iris($iris) {
		this.$iris = $iris;
		$iris.css('position', 'absolute');

		this.width  = $iris.outerWidth();
		this.height = $iris.outerHeight();

		this.resetOffset = function() {
			var offset = $iris.offset();
			this.offset = {
				x: offset.left + (this.width / 2) - parseInt($iris.css("left")),
				y: offset.top + (this.height / 2) - parseInt($iris.css("top"))
			};
		};
	}

	function Eye($eye, $iris) {
		this.$eye = $eye;

		$eye.css('position', 'relative');

		this.width  = $eye.width();
		this.height = $eye.height();

		this.iris   = new Iris($iris);

		this.pos = {
			x: (this.width - this.iris.width) / 2,
			y: (this.height - this.iris.height) / 2
		};

		$iris.css("left", this.pos.x + "px").css("top", this.pos.y + "px");

		this.padding = 0;
	}

	Eye.prototype.follow = function(mouse) {
		mouse.x = mouse.x - this.pos.x;
		mouse.y = mouse.y - this.pos.y;

		this.iris.resetOffset();

		var degree = Math.atan(( mouse.y - this.iris.offset.y) / ( mouse.x - this.iris.offset.x)),
		direction = (this.iris.offset.x > mouse.x) ? -1 : 1,
		newX = Math.cos(degree) * ((this.width - this.iris.width) / 2 - this.padding) * direction,
		newY = Math.sin(degree) * ((this.height - this.iris.height) / 2 - this.padding) * direction,
		radius = Math.sqrt(Math.pow(newX, 2) + Math.pow(newY, 2)),
		distance = Math.sqrt(Math.pow(mouse.y - this.iris.offset.y, 2) + Math.pow(mouse.x - this.iris.offset.x, 2));

		if (radius > distance) {
			this.iris.$iris.css("left", ( mouse.x - this.iris.offset.x + this.pos.x) + "px").css("top", (mouse.y - this.iris.offset.y + this.pos.y) + "px");
		} else {
			this.iris.$iris.css("left", this.pos.x + newX + "px").css("top", this.pos.y + newY + "px");
		}
	};

	Eye.prototype.setPosition = function(position) {
		if (position.x !== undefined && position.y !== undefined) {
			this.iris.$iris.css("left", this.pos.x - position.x + "px").css("top", this.pos.y - position.y + "px");
		} else if (typeof position === "number") {
			var deg = position * Math.PI / -180;
			this.iris.$iris.css("left", this.pos.x + Math.cos(deg) * (this.width / 2 - this.iris.width / 2 - this.padding) + "px").css("top", this.pos.y + Math.sin(deg) * (this.height / 2 - this.iris.height / 2 - this.padding) + "px");
		} else if (position === "center") {
			this.iris.$iris.css("left", this.pos.x + "px").css("top", this.pos.y + "px");
		} else if (positions[position] !== undefined) {
			var deg2 = positions[position] * Math.PI / -180;
			this.iris.$iris.css("left", this.pos.x + Math.cos(deg2) * (this.width / 2 - this.iris.width / 2 - this.padding) + "px").css("top", this.pos.y + Math.sin(deg2) * (this.height / 2 - this.iris.height / 2 - this.padding) + "px");
		}
	};

	$.fn.xeyes = function(options) {
		options = $.extend(defaultOptions, options);
		var padding = parseInt(options.padding, 10),
            arm = document.getElementById('monsterWrap__arm'),
		    $trigger = $(options.trigger),
            $goloco = $(options.goloco),
            $tooClose = $(options.tooClose);

		this.each(function(index, irisEl) {
			var $iris = $(irisEl),
			$eye = $iris.parent();

			var eye = new Eye($eye, $iris);
			eye.padding = padding;

			if (options.radius == 'circular' && eye.width > eye.height)
				eye.width = eye.height;
			else if (options.radius == 'circular')
				eye.height = eye.width;

			eye.setPosition(options.position);

			$trigger.mousemove(function(e) {
				eye.follow({ x: e.pageX, y: e.pageY });
				$iris.removeClass('easeAnime');
			});
			$trigger.mouseleave(function(e) {
				eye.setPosition(options.position);
				$iris.addClass('easeAnime');
			});

			if (options.reset) {
				$trigger.mouseleave(function(e) {
					eye.setPosition(options.position);
					$iris.addClass('easeAnime');
				});
			}

            $goloco.mousemove(function(e) {
                eye.follow({ x: e.pageX, y: e.pageY });
                $iris.addClass('red').removeClass('easeAnime').removeClass('clearEyes');
            });
            $goloco.mouseleave(function(e) {
                $iris.removeClass('red').addClass('clearEyes');
            });

            $tooClose.mousemove(function(e) {
                eye.follow({ x: e.pageX, y: e.pageY });
                $iris.addClass('red').removeClass('easeAnime').removeClass('clearEyes');
                $(arm).addClass('swingIt');
            });
            $tooClose.mouseleave(function() {
                $iris.removeClass('red').addClass('clearEyes');
                $(arm).removeClass('swingIt');
            });
		});
	};
})(jQuery);


var mX = 0;
var lastTimeMouseMoved = '';
$('#airSpace').mousemove(function(e) {

lastTimeMouseMoved = new Date().getTime();
    var isRetina = (
    window.devicePixelRatio > 1 ||
    (window.matchMedia && window.matchMedia("(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)").matches)
    );
    var t=setTimeout(function(){
        var currentTime = new Date().getTime();
        if(currentTime - lastTimeMouseMoved > 500){
            /* if(isRetina){
                $('#noflyZone').css({'cursor': 'url(img/biplane@2x.png), default'});
            }
            else {
                $('#noflyZone').css({'cursor': 'url(img/biplane.png), default'});
            } */
            $('#airSpace, #kongFace, #kongSlap').css({'cursor': 'url(img/cursor/biplane.png), default'});
        }
    },500);

    // moving left
    if (e.pageX < mX) {
        /* if(isRetina){
            $('#noflyZone').css({'cursor': 'url(img/cursor/biplaneLeft@2x.png), default'});
        }
        else {
            $('#noflyZone').css({'cursor': 'url(img/cursor/biplaneLeft.png), default'});
        } */
        $('#airSpace, #kongFace, #kongSlap').css({'cursor': 'url(img/cursor/biplaneLeft.png), default'});
    // moving right
    } else {
        /* if(isRetina){
            $('#noflyZone').css({'cursor': 'url(img/cursor/biplaneRight@2x.png), default'});
        }
        else {
            $('#noflyZone').css({'cursor': 'url(img/cursor/biplaneRight.png), default'});
        } */
        $('#airSpace, #kongFace, #kongSlap').css({'cursor': 'url(img/cursor/biplaneRight.png), default'});
    }

    // set new mY after doing test above
    mX = e.pageX;

});


jQuery(".monsterWrap__iris").xeyes();