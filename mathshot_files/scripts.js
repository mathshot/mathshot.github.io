(function($) {
	$(document).ready(function() {
		$('.portfolio-item').live('mouseenter', function() { // mousein
			$(this).find('.portfolio-meta').fadeIn(350);
		}).live('mouseleave', function() { // mouseout
			$(this).find('.portfolio-meta').fadeOut(350);
		});
		
		$('.latest-blog-module').click(function() {
			$('.blog-module-latest').removeClass('hidden');
			$('.blog-module-popular').addClass('hidden');
			return false;
		});
		
		$('.popular-blog-module').click(function() {
			$('.blog-module-popular').removeClass('hidden');
			$('.blog-module-latest').addClass('hidden');
			return false;
		});
		
		$('#top .portfolio-slider').cycle({
			'fx' : 'scrollHorz',
			'timeout' : 0,
			'before': adjustHeight,
			'pager' : '#portfolio-pager',
		});
		
		$('#top .featured').cycle({
			'fx' : 'fade',
			'timeout' : 4000,
			'pager' : '#static-pager',
		});
		
		$('.portfolio-single .portfolio-item-images .portfolio-images').cycle({
			'fx' : 'fade',
			'timeout' : 0,
			'before': adjustHeightSingle,
			'pager' : '#portfolio-pager',
		});

			function adjustHeight(curr, next, opts, fwd) {
				var index = opts.currSlide;
				$('#prev')[index == 0 ? 'hide' : 'show']();
				$('#next')[index == opts.slideCount - 1 ? 'hide' : 'show']();
				//get the height of the current slide
				var $ht = $(this).height();
				//set the container's height to that of the current slide
				$(this).parent().animate({
					'height' : $ht
				}, 1000);
			}
			
			function adjustHeightSingle(curr, next, opts, fwd) {
				var index = opts.currSlide;
				$('#prev')[index == 0 ? 'hide' : 'show']();
				$('#next')[index == opts.slideCount - 1 ? 'hide' : 'show']();
				//get the height of the current slide
				var $ht = $(this).height();
				//set the container's height to that of the current slide
				$(this).parent().animate({
					'height' : $ht
				});
			}
		
		$('#navigation').superfish({ 
		            delay:       800,                            // one second delay on mouseout 
		            animation:   {opacity:'show',height:'show'},  // fade-in and slide-down animation 
		            speed:       'fast',                          // faster animation speed 
		            autoArrows:  false,                           // disable generation of arrow mark-up 
					dropShadows:   false   						// turn on drop shadows
		});
		
		$('#navigation li ul li:nth-child(2)').addClass('second-item');
		$('#navigation li ul li:last-child').addClass('last-item');
		$('#navigation li ul li:first-child').removeClass('last-item').addClass('first-item');
		
		//center menu under main menu item
		$('.sf-menu > li').each(function() {
			var $ul = $(this).children('ul');
			var width = $(this).width();
			$ul.css('left', (-((151 - width - 40) / 2)) + 'px')
		});
		
		$('#navigation li ul').each(function() {
			if ($(this).children('li').length == 1) {
				//console.log($(this).children().length);
				$(this).addClass('single');
			}
		});

		// Clone applications to get a second collection
		var $data = $(".portfolio").clone();

		//NOTE: Only filter on the main portfolio page, not on the subcategory pages
		$('.portfolio-selector li').click(function(e) {
			
			$(".filter li").removeClass("active");	
			// Use the last category class as the category to filter by. This means that multiple categories are not supported (yet)
			var filterClass=$(this).attr('class').split(' ').slice(-1)[0];

			if (filterClass == 'all-projects') {
				var $filteredData = $data.find('.portfolio-item');
			} else {
				var $filteredData = $data.find('.portfolio-item[data-type*=' + filterClass + ']');
			}
			//$filteredData.find('.portfolio-item').removeClass('last');
			//$filteredData.find('.portfolio-item:nth-child(3n)').addClass('last');
			$(".portfolio").quicksand($filteredData, {
				duration: 800,
				easing: 'swing',
				adjustHeight: 'dynamic'
			}, function() {

			});
			$(this).addClass("active"); 			
			return false;
		});
		
		
		// tabs
		//When page loads...
		$(".tab-content").hide(); //Hide all content
		$("ul.sidebar-tabs li:first").addClass("active").show(); //Activate first tab
		$(".tab-content:first").show(); //Show first tab content

		//On Click Event
		$("ul.sidebar-tabs li").click(function() {

			$("ul.sidebar-tabs li").removeClass("active"); //Remove any "active" class
			$(this).addClass("active"); //Add "active" class to selected tab
			$(".tab-content").hide(); //Hide all tab content

			var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
			$(activeTab).fadeIn(); //Fade in the active ID content
			return false;
		});	
		
		$.validator.setDefaults({
			submitHandler: function() {
				$('.responseText').remove();
				$('#contact-form').append('<h3 class="responseText">Sending message...</h3>');
				
				var path = $("meta[name=temp_url]").attr('content');
				
				var name = $("#name").val();  
				var email = $("#email").val(); 
				var message = $("#comment").val(); 
				var to = $("#to").val(); 
				var subject = $("#subject").val(); 

				var dataString = 'name='+ name + '&email=' + email + '&message=' + message + '&to=' + to + '&subject=' + subject;  

					$.ajax({

					url: path + "/mail.php",
					data: dataString,
					type: "GET",
					success: function(responseText) {
							$('.responseText').text(responseText);

							}
					});
			}
		});

		$("#contact-form .comment-form").validate();
			
		// Like System 
		$('.portfolio .portfolio-item .like, .portfolio-single .portfolio-item-images .like').live('click', function() {
				var	$like		= $(this),
					post_id		= $like.attr('data-post'),
					like_action	= $like.attr('data-like');

					if( post_id >= 1 )
					{
						//$like.text('');
						var like = window.setInterval( function() {
							$like.addClass('liked loading');
							var loading = $like.text();
							if ( loading.length < 3 ) {
								$like.text(loading + '.');					
							} else {
								$like.text('');				
							}
						}, 300);
						
							$.post(
								ajaxurl,
								{
									action: 		'bc_like_ajax_post_action',
									type: 			'bc_like',
									post_id: 		post_id,
									like_action:	like_action
								}, 
								function( result )
								{
									$like.replaceWith( result.substring(0, result.length - 1) );
									$data = $(".portfolio").clone()
								}
							);
						
						
					}
		});
		
	});
})(jQuery);