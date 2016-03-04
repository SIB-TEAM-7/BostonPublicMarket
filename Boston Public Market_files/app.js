// Foundation IE8 fix: http://foundation.zurb.com/forum/posts/3189-foundation-5-orbit-slider-ie8-issue
(function($) {
  if (!Foundation.stylesheet) {
    Foundation._style_element = $("<style></style>").appendTo("head")[0];
    Foundation.stylesheet = Foundation._style_element.styleSheet;
    if (Foundation.stylesheet) {
      Foundation.stylesheet.cssRules = {
        length: 0
      };
      Foundation.stylesheet.insertRule = function(rule, index) {
        var media, mediaMatch, mediaRegex, namespace, ruleMatch, ruleRegex;
        mediaRegex = /^\s*@media\s*(.*?)\s*\{\s*(.*?)\s*\}\s*$/;
        mediaMatch = mediaRegex.exec(rule);
        media = "";
        if (mediaMatch) {
          media = "@media " + mediaMatch[1] + " ";
          rule = mediaMatch[2];
        }
        ruleRegex = /^\s*(.*?)\s*\{\s*(.*?)\s*\}\s*$/;
        ruleMatch = ruleRegex.exec(rule);
        namespace = "" + media + ruleMatch[1];
        rule = ruleMatch[2];
        return this.addRule(namespace, rule);
      };
    } else if (window.console) {
      console.log("Could not fix Foundation css rules...");
    }
  }
})(jQuery);

// Detect any IE
$(function() {
	if (navigator.appName == 'Microsoft Internet Explorer' || !!navigator.userAgent.match(/Trident/)) {
		$('html').addClass('ie');
	}
});

$(function() {
	// $.get('/templates/partials/person.mustache', function(partial) {
	// 	var partials = {
	// 		person: partial
	// 	};
	// 	$.get('/templates/partials/test.mustache', function(template) {
	// 		var rendered = Mustache.render(template, {
	// 			test: 'from javascript',
	// 			person: {
	// 				first_name: 'Oscar Javascript',
	// 				html: '<a href="http:/google.com">Raw HTML</a>'
	// 			}
	// 		}, partials);
	// 		$('#js-test').html(rendered);
	// 	}, 'html');
	// }, 'html');
	// $('a.load-more').click(function(e) {
	// 	e.preventDefault();
	// 	console.log('get json');
	// 	$.getJSON('/posts/3', function(data) {
	// 		for (i = 0; i < data.length; i++) {
	// 			console.log(data[i]);
	// 			$('#front-posts').append(Mustache.render($('#template-single-post').html(), data[i]));
	// 		}
	// 	})
		
	// 	return false;
	// });
	var $error = $('#h5val_errbuf');

	if ($error.length) {
		var html = $error.html();
		var $table = $('<table class="alog"><tr class="Error"><td>' + html + '</td></tr></table>');
		$error.remove();
		$('body').prepend($table);
	}

	$('table.alog pre').click(function(e) {
		$(this).addClass('expanded');
	})
});

$(document).foundation();

function dbg(str) {
	if (!window.console)
		return;

	console.log(str);
}

if (!window.console) window.console = {log:function() {}};

function ga_setdata(current, args) {
	var campaign, label, action, ga_data = '';

	if (current)
		ga_data = current.data();

	campaign = 'default_campaign';
	if (ga_data.ga_campaign)
		campaign = ga_data.ga_campaign;
	if (args.campaign)
		campaign = args.campaign;

	action = $(current).attr('href');
	if (ga_data.ga_action)
		action = ga_data.ga_action;
	if (args.action)
		action = args.action;

	label = $(current).text();
	if (!label)
		label = $(current).val();
	if (ga_data.ga_label)
		label = ga_data.ga_label;

	var ga_obj = {
		campaign: campaign,
		action: action,
		label: label
	};

	return (ga_obj);
}

function ga_trackevent(ga_obj) {
	var trackevent = [];

	if (ga_obj.label) {
		trackevent = ['_trackEvent', ga_obj.campaign, ga_obj.action,
			ga_obj.label
		];
	} else {
		trackevent = ['_trackEvent', ga_obj.campaign, ga_obj.action];
	}

	if (trackevent)
		google_analytics(trackevent);
}

function ga_sendevent(current, args) {
	args = args || {};

	var ga_obj = ga_setdata(current, args);
	ga_trackevent(ga_obj);
}

function google_analytics(data) {
	var category, action, label, value;
	category = data[1];
	action = data[2];

	if (data[3])
		label = data[3];

	if (window.ga) {
		ga('send', 'event', category, action, label);
		dbg(category + " " + action + " " + label);
	}
}
$('body').on('click', '[data-ga_campaign]', function(e) {
	ga_sendevent($(this));
});


// Gets a URL parameter value by name
function getUrlParameter(name) {'use strict';
	var query = window.location.search.slice(1);
	var pairs = query.split(/&|;/);
	for (var i=0, len=pairs.length; i<len; i++)
	{
		var keyValue = pairs[i].split('=');
		if (keyValue[0] == name) {
			return keyValue[1];
		}
	}
}

// Given an anchor element, go to that link.
function goToLink(anchorElement) {'use strict';
	var $a = $(anchorElement);
	window.open($a.prop('href'), $a.prop('target') || '_self');
}

// #main-nav .dropdown
$(function() {'use strict';
	
	// vertical positioning and horizontal indent
	
	$(window).on('resize.mainNavDropDown', function() {
		$('#main-nav').find('.dropdown').css('padding-left', function() {
			if (Modernizr.mq(Foundation.media_queries.large)) {
				var $dropdown = $(this);
				var $link = $dropdown.prev('a');
				var linkCenter = $link.offset().left + parseFloat($link.css('padding-left')) + $link.width()/2;
				return linkCenter - $dropdown.children('li').filter(':visible').width()/2;
			}
			return '';
		});
	})
	.trigger('resize.mainNavDropDown')
	.load(function() {$(window).trigger('resize.mainNavDropDown');})
	.on('scroll.mainNavDropDown', function() {
		if (Modernizr.mq(Foundation.media_queries.medium)) {
			var compensation = -$(window).scrollTop();
		} else {
			var compensation = 0;
		}
		$('#main-nav').find('.dropdown').css('margin-top', compensation);
	})
	.trigger('scroll.mainNavDropDown');
	
	// hover timeout
	
	$('#main-nav li.has-dropdown.not-click').on('mouseenter.mainNavDropDown', function() {
		$('#main-nav').find('li.has-dropdown.not-click').removeClass('hover');
		var $li = $(this).addClass('hover');
		var timeout = $li.attr('data-timeout');
		if (timeout) {
			$li.removeAttr('data-timeout');
			clearTimeout(timeout);
		}
	})
	.on('mouseleave.mainNavDropDown', function() {
		var $li = $(this);
		$li.attr('data-timeout', setTimeout(function() {
			$li.removeClass('hover').removeAttr('data-timeout');
		}, 500));
	});
});


// .google-map
$(function() {'use strict';
	var $window = $(window);
	$window.on('resize.googleMap', function() {
		var mapHeight = $window.height();
		if (!Modernizr.mq(Foundation.media_queries.large)) {
			mapHeight *= 0.75;
		}
		$('.google-map').height(mapHeight);
	})
	.trigger('resize.googleMap');
});


// footer
$(function() {'use strict';
	$(window).on('resize.footer', function() {
		$('body').css('padding-bottom', $('footer').outerHeight());
	})
	.trigger('resize.footer');
	
	$('footer').on('click', function(ev) {		
		if (!$(ev.target).is('.show-mailing-list-form') && !$(ev.target).parents('footer .mailing-list-form').length) {
			var $mailingListContainer = $('footer').find('.mailing-list-form-container');
			$mailingListContainer.removeClass('active-mailing-list');
			$mailingListContainer.find('.mailing-list-form').removeClass('error');
		}
	});
	
	setTimeout(function() {
		$(window).trigger('resize.footer');
	}, 0);
});


// .mailing-list-form
$(function() {'use strict';
	
	// http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
	var emailRE = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
	
	$('.mailing-list-form').on('submit', submit);
	$('.mailing-list-form .simple-submit').on('click', submit);
	$('.show-mailing-list-form').click(function() {
		$(this).closest('.mailing-list-form-container')
			.addClass('active-mailing-list')
			.find('.mailing-list-form :text').first().focus();
			return false;
	});
	
	function submit() {
		var $form = $(this).closest('.mailing-list-form');
		if ($form.find('.simple-submit').attr('disabled')) {
			return false;
		}
		$form.removeClass('error');
		
		if (emailRE.test($form.find('[data-email-input]').val())) {
			validSubmit($form);
		} else {
			invalidSubmit($form);
		}
		return false;
	}
	
	function validSubmit($form) {
		var submission = $form.serialize();
		$form.find('input, .simple-submit').attr('disabled', '');
		$.post('/sign_up_for_email.php', submission, null, 'json')
			.done(function(response) {
				if (response.response_div === 'success') {
					successfulResponse($form, response);
				} else {
					$('#mailing-list-warning-modal')
						.html($('<p></p>').text(response.msg))
						.foundation('reveal', 'open');
				}
				$form.not('.final-form').find(':text, textarea').val('');
				$form.closest('.mailing-list-form-container').removeClass('active-mailing-list');
			})
			.fail(function() {
				$('#mailing-list-fail-modal').foundation('reveal', 'open');
			})
			.always(function() {
				$form.find('input, .simple-submit').attr('disabled', null);
			});
	}
	
	function invalidSubmit($form) {
		$form.addClass('error');
	}
	
	function successfulResponse($form, response) {
		if ($form.hasClass('final-form')) {
			$('#mailing-list-success-modal')
				.html(response.msg)
				.foundation('reveal', 'open');
		} else {
			var email = encodeURIComponent($form.find('[data-email-input]').val() || '');
			window.open('/mailing-list-details?mailing_list_email=' + email, '_self');
		}
	}
	
	$(document).keydown(function(ev) {
		if (ev.which == 13) {
			$('#mailing-list-success-modal').foundation('reveal', 'close');
			$('#mailing-list-warning-modal').foundation('reveal', 'close');
			$('#mailing-list-fail-modal').foundation('reveal', 'close');
		}
	});
});


// .icon-shifter
$(function() {'use strict';
	$('.icon-shifter').each(function() {
		var $shifter = $(this);
		var iconNumber = 0;
		function changeIcon() {
			$shifter.attr('data-current', iconNumber++ % 4);
		}
		changeIcon();
		setInterval(changeIcon, 3000);
	});
});

// .social-feed-widget
$(function() {'use strict';
	$(document).on('click', '.social-item .social-item-inner', function() {
		var anchorElement = $(this).find('a')[0];
		if (anchorElement) {goToLink(anchorElement);}
	});
	
	$(document).on('click', '.social-feed-widget.preview [data-alert] .close', function() {
		$(window).trigger('resize.socialFeedWidget');
	});
	
	if (typeof Masonry === 'undefined') {return;}
	var $feeds = $('.social-feed-widget').find('.social-feed').masonry();
	
	$feeds.each(function() {
		var $feed = $(this);
		$feed.find('img').on('load', function() {
			$feed.masonry();
		}).each(function() {
			if (this.complete) $feed.masonry();
		});
	});
	
	$(window).on('resize.socialFeedWidget', function() {
		// Adjust maximum height of preview .social-feed
		var previewFeedHeight = $(window).height() - $('#main-nav').outerHeight();
		if (!Modernizr.mq(Foundation.media_queries.medium)) {
			previewFeedHeight *= 2;
		}
		$('.social-feed-widget.preview').height(previewFeedHeight);
	})
	.trigger('resize.socialFeedWidget');
});

// .featured-post
$(function() {'use strict';
	
	var IE8 = $('html').hasClass('lt-ie9');
	var highestZIndex = 0;
	
	// Add listener for when post images have loaded
	$('.featured-post').each(function() {
		var $post = $(this);
		var src = ($post.find('.img-div').css('background-image') || '').replace(/^url\(['"]?|['"]?\)$/gim, '');
		if (IE8 || src === 'none' || !src) {
			$post.addClass('loaded');
		} else {
			$('<img>').attr('src', src).load(function() {
				$post.addClass('loaded');
				$(this).remove();
			});
		}
	});
	
	// Add listener for scrolling the backside content
	$('.featured-post').find('.backside-inner').scroll(function() {
		var $this = $(this);
		var state = ~~($this.scrollTop() + $this.innerHeight()) == ~~($this.find('.backside-content').outerHeight());
		$this.closest('.featured-post').toggleClass('scrolled-to-bottom', state);
	});
	
	// Add click listeners for posts
	$(document).on('click', '.featured-post-inner', function(ev) {
		var $this = $(this);
		var $post = $this.closest('.featured-post');
		
		if ($post.hasClass('loaded') && !$post.hasClass('flipped')) {
			if ($this.find('.backside').length) {
				$post.css('zIndex', ++highestZIndex).addClass('flipped');
			} else {
				goToLink($this.find('a')[0]);
			}
			return false;
		}
	});
	
	function resize(ev) {
		var $posts = $('.featured-post');
		
		// Media Query resize functions
		if (Modernizr.mq(Foundation.media_queries.medium)) {
			resizeMediumUp.call(this, ev, $posts);
		} else {
			resizeSmallOnly.call(this, ev, $posts);
		}
		
		// Make all post captions the same height
		var $largeBlurbs = $posts.not('.small').find('.blurb');
		var $smallBlurbs = $posts.filter('.small').find('.blurb');
		$smallBlurbs.height($largeBlurbs.innerHeight());
		
		// Truncate blurbs
		$posts.find('.blurb').attr('data-truncated', 0);
		if (truncateBlurbs.defer) {clearTimeout(truncateBlurbs.defer);}
		truncateBlurbs.defer = setTimeout(function() {
			truncateBlurbs($posts);
		}, 0);
		
		// Update "no-scroll" class
		$posts.each(function() {
			var $this = $(this);
			$this.toggleClass('no-scroll', $this.find('.backside-content').outerHeight() <= $this.find('.backside').height());
		});
	}
	function resizeSmallOnly(ev, $posts) {
		// Prevent posts from being too thin (constrain to squares)
		$posts.css('max-height', $posts.width());
	}
	function resizeMediumUp(ev, $posts) {
		// Remove style from resizeSmallOnly
		$posts.css('max-height', '');
	}
	
	
	// Truncate small blurbs (.featured-post.small .blurb) that are too long
	// (large blurbs, are already truncated by CSS)
	function truncateBlurbs($posts) {
		var spacesRE = /\s+/mg;
		var trimRE = /^\s+|$\s+/mg;
		var viewportTop = $(window).height() * -0.5;
		var viewportBottom = $(window).height() * 1.5;
		var mediumUp = Modernizr.mq(Foundation.media_queries.medium);
		$posts.filter('.small').filter(isNearVisible).find('.blurb').each(function() {
			var $blurb = $(this);
			if (~~$blurb.attr('data-truncated')) {return;}
			var $p = $blurb.find('p').first();
			
			var originalWords = $blurb.attr('data-original-text').replace(trimRE, '').split(spacesRE);
			var originalSpans = $.map(originalWords, wrapInSpan);
			$p.html(originalSpans.join(''));
			
			if (mediumUp) {
				var $spans = $p.children('span');
				var blurbHeight = $blurb.height();
				for (var i=0, len=$spans.length; i<len; i++) {
					var span = $spans[i];
					if (span.offsetTop + span.offsetHeight > blurbHeight) {break;}
				}
				if (i < len) {
					$p.html(originalSpans.slice(0, i).join('') + '<span>\u2026</span>');
					$spans = $p.children('span');
					
					var i = $spans.length - 2;
					var ellipses = $spans[i + 1];
					while (ellipses.offsetTop + ellipses.offsetHeight > blurbHeight) {
						$spans.eq(i--).remove();
					}
				}
			}
			
			$blurb.attr('data-truncated', 1);
		});
		function isNearVisible() {
			var rect = this.getBoundingClientRect();
			return rect.bottom > viewportTop && rect.top < viewportBottom;
		}
		function wrapInSpan(word) {
			return '<span> ' + word + '</span>';
		}
	}
	
	$(window).on('scroll.featuredPost', function() {truncateBlurbs($('.featured-post'));});
	$(window).on('resize.featuredPost load.featuredPost', resize);
	setTimeout(function() {
		$(window).trigger('resize.featuredPost');
	}, 0);
	
});


// .full-height
$(function() {'use strict';
	$(window).on('resize.fullHeight', function() {
		$('.row.full-height').height($(window).height() - $('#main-nav').outerHeight());
	})
	.trigger('resize.fullHeight');
});


// .square
$(function() {'use strict';
	$(window).on('resize.square', function() {
		$('.square').height(function() {
			return $(this).width();
		});
	})
	.trigger('resize.square');
});


// sliding scroll links
$(function() {'use strict';
	var idRE = /^#\S+$/i;
	$(document).on('click', 'a', function() {
		var href = $(this).attr('href');
		if (idRE.test(href)) {
			var padding = $(href).outerHeight() - $(href).height();
			$('html, body').animate({scrollTop: $(href).offset().top - padding});
			return false;
		}
	});
});

// .event-list
$(function() {'use strict';
	
	function updateVisibility(onlyShow) {
		var windowHeight = $(window).height();
		var viewportTop = windowHeight * -0.5;
		var viewportBottom = windowHeight * 1.5;
		
		function isNearVisible(el) {
			var rect = el.getBoundingClientRect();
			return rect.bottom > viewportTop && rect.top < viewportBottom;
		}
		
		var $listItems = $('.event-list-item.auto-ellipsis');
		var visibleListItems = [];
		var notVisibleListItems = [];
		$listItems.each(function () {
			if (isNearVisible(this)) {visibleListItems.push(this);}
			else {notVisibleListItems.push(this);}
		});
		
		$(visibleListItems).css('visibility', 'visible');
		if (onlyShow !== true) $(notVisibleListItems).css('visibility', 'hidden');
	}
	$(window).on('resize scroll ready', updateVisibility);
	
	
	$(document).on('click', '.event-list-item .caption', function (ev) {
		if ($(ev.target).closest('.event-list-item .action-link').length) {
			return;
		}
		var $listItem = $(this).closest('.event-list-item').toggleClass('active');
		
		var $downArrow = $listItem.find('.down-arrow');
		$downArrow.addClass('hidden');
		
		$listItem.find('.details')
			.slideToggle($listItem.hasClass('active'))
			.promise().done(function () {
				$downArrow.removeClass('hidden');
				updateVisibility(true);
			});
		if ($listItem.hasClass('active')) {
			$listItem.velocity('scroll');
		}
	});
	
	$(document).on('mouseenter', '.event-list-item .caption', function () {
		$(this).closest('.event-list-item').addClass('hovering-caption');
	});
	$(document).on('mouseleave', '.event-list-item .caption', function () {
		$(this).closest('.event-list-item').removeClass('hovering-caption');
	});
	
	
	$(document).on('mouseenter', '.event-list-item .caption .action-link a', function () {
		$(this).closest('.event-list-item').addClass('hovering-button');
	});
	$(document).on('mouseleave', '.event-list-item .caption .action-link a', function () {
		$(this).closest('.event-list-item').removeClass('hovering-button');
	});
});
