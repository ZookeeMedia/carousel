/* Simple Carousel - v0.1.0 - 2013-05-29
 * https://github.com/ZookeeMedia
 * Copyright (c) 2013 Zookee Media Ltd; Licensed MIT, GPL 
 */

/* Carousel */
var oCarousel = {
	GetImages: function(sXML) {
		$.get(sXML, function(xml) { oCarousel.BuildCarousel(xml) });
	},
	BuildCarousel: function(xml) {
		try {
			var aoImages = [];
			$(xml).find('image').each(
				function() {
					var sTitle = $(this).find('title').text();
					var sPath = ($(this).find('path').text()); //.replace(/\n/g, '<br/>');
					var sLink = $(this).find('link').text();
					if (sLink == "") {
						aoImages[aoImages.length] = '<li><img alt="' + sTitle + '" height="276" src="' + sPath + '" width="855"></li>';
					} else {
						aoImages[aoImages.length] = '<li><a href="' + sLink + '"><img alt="' + sTitle + '" height="276" src="' + sPath + '" width="855"></a></li>';
					}
				}
			);
			$('.pix').html(aoImages.join('\n'));
			oCarousel.ShowCarousel();
		} catch (e) {
			return;
		}
	},
	rotate: function() {
		$('#next').click();
	},
	li_pos: function(cPage) {
		$('.pagination li span').removeClass('indicator_on').addClass('indicator_off');
		$('.pagination li:eq(' + (cPage - 1) + ') span').removeClass('indicator_off').addClass('indicator_on');
	},
	ShowCarousel: function() {
		var speed = 8000;
		var run = setInterval('oCarousel.rotate()', speed);
		var slidewidth = 855; /* one slide picture length */
		var numslides = ($('#slides ul.pix li').length) + 1;
		var tSlides = (slidewidth * (numslides + 1));
		var totalslides = tSlides + 'px';
		var cPage = 1;
		var nPage = 1;
		$('#slides ul.pix').css({ 'width': totalslides });
		// build pagination
		// grab the width and calculate left value
		var item_width = $('#slides ul.pix li').outerWidth();
		var left_value = item_width * (-1);
		// move the last item before first item, just in case user click prev button
		theFirst = $('#slides ul.pix li:last').html();
		$('#slides ul.pix').prepend('<li>' + theFirst + '<\/li>')
		theLast = $('#slides ul.pix li:eq(1)').html();
		$('#slides ul.pix').append('<li>' + theLast + '<\/li>');
		//set the default item to the correct position 
		$('#slides ul.pix').css({ 'left': left_value });
		//if user clicked on prev button
		$('#prev').click(function() {
			//get the right position            
			var left_indent = parseInt($('#slides ul.pix').css('left')) + item_width;
			//slide the item            
			$('#slides ul.pix:not(:animated)').animate({ 'left': left_indent }, 600, function() {
				cLeft = $('#slides ul.pix').css('left').split('px');
				cLeft[0] *= -1;
				cPage = (cLeft[0] / slidewidth);
				if (cPage == 0) {
					negslidewidth = tSlides - (slidewidth * 2);
					negslidewidth *= -1;
					$('#slides ul.pix').css({ 'left': negslidewidth });
					cPage = numslides - 1;
				}
				oCarousel.li_pos(cPage);
			});
			return false;
		});
		//if user clicked on next button
		$('#next').click(function() {
			//get the right position
			var left_indent = parseInt($('#slides ul.pix').css('left')) - item_width;
			//slide the item
			$('#slides ul.pix:not(:animated)').animate({ 'left': left_indent }, 600, function() {
				cLeft = $('#slides ul.pix').css('left').split('px');
				cLeft[0] *= -1;
				cPage = (cLeft[0] / slidewidth);
				if (cPage == numslides) {
					negslidewidth = -slidewidth;
					$('#slides ul.pix').css({ 'left': negslidewidth });
					cPage = 1;
				}
				oCarousel.li_pos(cPage);
			});
			return false;
		});
		//if mouse hover, pause the auto rotation, otherwise rotate it
		//$('#slides').hover(
		//	function() {
		//		clearInterval(run);
		//	}, 
		//	function() {
		//		run = setInterval('rotate()', speed);   
		//	}
		//);
		$('.carousel-pause').click(function() {
			if (run) {
				$(this).find('span.sprite_pause').addClass('sprite_play');
				$(this).find('span.control_text').text('Play Slideshow');
				clearInterval(run);
				run = false;
			} else {
				$(this).find('span.sprite_pause').removeClass('sprite_play');
				$(this).find('span.control_text').text('Pause Slideshow');
				run = setInterval('oCarousel.rotate()', speed);
			}
		});
		// click a blob
		$('.pagination li').click(function() {
			nPage = $(this).attr('rel');
			var left_indent = item_width * nPage;
			left_indent *= -1;
			//slide the item
			$('#slides ul.pix:not(:animated)').animate({ 'left': left_indent }, 600, function() {
			});
			li_pos(nPage);
		});
	}
}

/*
 * Simple Carousel
 * https://github.com/ZookeeMedia
 *
 * Copyright (c) 2013 Zookee Media Ltd.
 * Licensed under the MIT, GPL licenses.
 */

$(document).ready(function() {
		oCarousel.GetImages('carousel.xml');
});