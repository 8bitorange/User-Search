(function($) {
	
	$.fn.userSearch = function(options) {
		
		var config = $.extend({
			
			inputReturn: '.user-search-return',
			speed: 'fast',
			limit: 5,
			userArray: null,
			onComplete: $.noop
			
		}, options);
				
		var pagingButton = false;	
		
		return this.each(function(){		
			$(this).bind('focus', function(e){
							
				var searchStr;
				var returnList = [];
				var currentObj = $(this);
				
				$('.user-search-list .user-search-item').die('click');
		
				$(this).keyup(function(e){
					var charcode = e.which;
					var char = String.fromCharCode(charcode);
					var regex = new RegExp("[a-zA-Z\- \.]", "gi");
					
					if(regex.test(char) || charcode === 8 || e.which === null){
						
						returnList = createArray($(this).val());
						
						createList(returnList, $(this), 0);
	
					} else if (charcode === 27) {
					
						pagingButton = false;
						$(this).blur();
					
					} else if (charcode === 38 || charcode === 40) {
						var selected = $(".user-search-item.selected");
						if(charcode === 38){
							if(selected.prev().length > 0){
								selected.removeClass('selected');
								selected.prev().addClass('selected');
							} else {
								$(this).val(searchStr);
								$(config.inputReturn).find('input').val('');
							}
						} else {
							if(selected.length === 0){
								$('.user-search-item:first-child').addClass('selected');
							} else {
								if(selected.next().length > 0 && !selected.next().is('.user-search-paging')){
									selected.removeClass('selected');
									selected.next().addClass('selected');
								}
							}
						}
						return false;
					}
				}).keydown(function(e){
				
					if(e.which === 13 || e.which === 9){
						if($('.user-search-item.selected').length){
							selectName($('.user-search-item.selected'), $(this), config.inputReturn);
						}					
						if(e.which === 13){
							e.preventDefault();
						}
					} else {
						$(config.inputReturn).val('');
					}
				
				});
				
				$('.user-search-list > .user-search-item:not(".selected")').live('hover', function(){
					$('.user-search-item.selected').removeClass('selected');
					$(this).addClass('selected');
				});
				
				$('.user-search-list .user-search-item').live('click', function(){
					
					selectName($(this), $(this).parent().prev('input'), config.inputReturn);
				
					if(pagingButton){
						pagingButton = false;
					}
					
					
				}).live('mouseover', function(){
					pagingButton = true;
				}).live('mouseout', function(){
					pagingButton = false;
				});
				
				
			
				$(".user-search-paging > a").live('click', function(e){
				
					e.preventDefault();
					var start;
					
					if($(this).hasClass('user-search-more')){
						start = parseInt($(this).attr('rel')) + config.limit;
					} else if($(this).hasClass('user-search-prev')) {
						start = parseInt($(this).attr('rel')) - config.limit;
					}
					
					var list = createArray($(currentObj).val());
					createList(list, $(currentObj), start);
									
					if(pagingButton){
						pagingButton = false;
					}
					
					currentObj.focus();
					
					return false;			
					
				}).live('mouseover', function(){
					pagingButton = true;
				}).live('mouseout', function(){
					pagingButton = false;
				});
				
				e.preventDefault();
			
			}).blur(function(e){
			
				if(!pagingButton){
					removeElement($(this));
				}
				
				
			});	

		});
		
		function selectName(el, obj, target){
		
			$(obj).val($(el).find('.name').text());
			$(target).val($(el).attr('rel'));

			$(obj).trigger('user-search-selected', [$(el).find('.name').text(), $(el).attr('rel')]);
			removeElement(obj);

		}
		
		function removeElement(obj){
			
			$('.user-search-list').slideUp(config.speed, function(){
				$(this).remove();
				$(obj).unbind('focus');
			});
		
		}
	
		function createArray(search){
		
			var list = [];
			var users = config.userArray;
			
			if(search.length > 0){
			
				$.each(users, function(e, i){
					
					var reg = new RegExp(search, "gi");
					if(reg.test(i.User.full_name)){
						list.push(i);
					}
					
				});
				
				return list;
			}
		
		}
		
		function createList(list, el, start){
			
			var slide = false;
			if(el.next('.user-search-list').length !== 0){
				el.next('.user-search-list').html('');
			} else {
				el.after('<div class="user-search-list" />');
				slide = true;		
			}
			var target = el.next('.user-search-list');
			if(slide){
				target.hide();
			}
				
			var count = 0;
			
			if(typeof list !== 'undefined' && list.length){
				$.each(list, function(e, i){
				
					if(e >= start && count < config.limit){
					
						target.append('<div class="user-search-item clearfix" rel="' + i.User.id + '"></div>');
						
						var item = target.find('.user-search-item:last-child');
						
						var image = '';
						if(i.User.avatar === null){
							image = 'default_profile.png';
						} else {
							image = i.User.nid + '/' + i.User.avatar;
						}
						
						item.append('<img height="35" src="/files/' + image + '" />');
						item.append('<span class="name">' + i.User.full_name + '</span><br />');
						item.append('<span class="dept">' + i.HrDepartment.name + '</span>');
						
						count = parseInt(count) + 1;
					
					}
					
				});
				
				if(list.length > config.limit){
					target.append('<div class="user-search-paging" />');	
				}
						
				if(start > 0){
					target.find('div.user-search-paging').append('<a href="#" rel="' + start + '" class="user-search-prev btn small">Prev</a>');
				}
				
				if(list.length > (parseInt(config.limit) + start)){
					target.find('div.user-search-paging').append('<a href="#" rel="' + start + '" class="user-search-more btn small">More</a>');
				}
				
				$(".user-search-item:first-child").hover();
				
				if(slide){
					target.slideDown(config.speed);
				}
			} else {
				if($('.user-search-item').length === 0){
					$('.user-search-list').remove();
				}
			}
			
		}
		
	};

})(jQuery);