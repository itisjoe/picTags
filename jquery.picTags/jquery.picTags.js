/*!
 * jQuery picTags
 * version 1.0.0
 * Copyright (C) 2016 Feng Hsin Chiao
 * 
 * Edited From 
 * jQuery Taggd
 * A helpful plugin that helps you adding 'tags' on images.
 *
 * License: MIT
 */

(function($) {
	'use strict';

    // for save
	var save_data = {
    	id : '',
    	title: '',
    	x: 0,
    	y: 0
	};

	var defaults = {
		edit: false,
		
		align: {
			x: 'center',
			y: 'center'
		},

		handlers: {},

		offset: {
			left: 0,
			top: 0
		},
		
		strings: {
			save: '&#x2713;',
			delete: '&#x00D7;'
		}
	};
	
	var methods = {

        // save data
    	updateInfo: function(){},
    	
		show: function() {
			var $this = $(this),
				$label = $this.next();

			$this.addClass('active');
			$label.addClass('show').find('input').focus();
		},
		
		hide: function() {
			var $this = $(this);
			$this.removeClass('active');
			$this.next().removeClass('show');
		},
		
		toggle: function() {
			var $hover = $(this).next();
			
			if($hover.hasClass('show')) {
				methods.hide.call(this);
			} else {
				methods.show.call(this);
			}
		}
	};
	
	
	/****************************************************************
	 * TAGGD
	 ****************************************************************/
	
	var Taggd = function(element, options, data) {
		var _this = this;
		
		if(options.edit) {
			options.handlers = {
				click: function() {
					_this.hide();

                    $('.taggd-item').each(function(){
                        if (typeof $(this).attr('id') == 'undefined') {
//                            $(this).next().remove();
//                            $(this).remove();
                        }
                    });

					methods.show.call(this);
				}
			};
		}

        // extend method
        if (typeof options.updateInfo === 'function') {
    		methods['updateInfo'] = options.updateInfo;
        }
		
		this.element = $(element);
		this.options = $.extend(true, {}, defaults, options);
		this.data = data;
		this.initialized = false;
		
		if(!this.element.height() || !this.element.width()) {
			this.element.on('load', _this.initialize.bind(this));
		} else this.initialize();
	};
	
	/****************************************************************
	 * INITIALISATION
	 ****************************************************************/
	
	Taggd.prototype.initialize = function() {
		var _this = this;
		
		this.initialized = true;
		
		this.initWrapper();
		this.addDOM();
		
		if(this.options.edit) {
			this.element.on('click', function(e) {
				var poffset = $(this).parent().offset(),
					x = (e.pageX - poffset.left) / _this.element.width(),
					y = (e.pageY - poffset.top) / _this.element.height();

				_this.addData({
					x: x,
					y: y,
					text: ''
				});

/*
                if (typeof _this.data[_this.data.length - 1].attributes === 'undefined') {
                    var x = _this.data[_this.data.length - 1].x;
                    var y = _this.data[_this.data.length - 1].y;

                    _this.data = $.grep(_this.data, function(v) {
                        return v.x != x || v.y != y;
                    });

                    _this.show(_this.data.length);
                } else {
    				_this.show(_this.data.length - 1);                    
                }
*/

    				_this.show(_this.data.length - 1);                    


			});
		}
		
		$(window).resize(function() {
			_this.updateDOM();
		});
	};
	
	Taggd.prototype.initWrapper = function() {
		var wrapper = $('<div class="taggd-wrapper" />');
		this.element.wrap(wrapper);
		
		this.wrapper = this.element.parent('.taggd-wrapper');
	};
	
	Taggd.prototype.alterDOM = function() {
		var _this = this;
		
		this.wrapper.find('.taggd-item-hover').each(function() {
			var $e = $(this),
				
				$input = $('<input type="text" size="16" />')
					.val($e.text()),
				$button_ok = $('<button />')
					.html(_this.options.strings.save);
//				$button_delete = $('<button />')
//					.html(_this.options.strings.delete);
			
			$button_ok.on('click', function() {
				_this.hide();
			});

/*			
			$button_delete.on('click', function() {
				var x = $e.attr('data-x'),
					y = $e.attr('data-y');
				
				_this.data = $.grep(_this.data, function(v) {
					return v.x != x || v.y != y;
				});
				
				_this.addDOM();
				_this.element.triggerHandler('change');
			});
*/
			
			$input.on('change', function() {

				var x = $e.attr('data-x'),
					y = $e.attr('data-y'),
					item = $.grep(_this.data, function(v) {
						return v.x == x && v.y == y;
					}).pop();
				
				if(item) item.text = $input.val();

                // save
                $.each(_this.data, function(i, v) {
                    if (typeof v.attributes == 'undefined') {
                        v.attributes = {id:'new'};
                    }
                });

                if ($e.prev().attr('id')) {
        			save_data.id = $e.prev().attr('id');
                } else {
                    save_data.id = 'new';
                }
    			save_data.title = $input.val();
    			save_data.x = x;
    			save_data.y = y;
                methods.updateInfo(save_data);

				_this.addDOM();
				_this.element.triggerHandler('change');
			});
			
//			$e.empty().append($input, $button_ok, $button_delete);
			$e.empty().append($input, $button_ok);
		});
		
		_this.updateDOM();
	};
	
	/****************************************************************
	 * DATA MANAGEMENT
	 ****************************************************************/
	
	Taggd.prototype.addData = function(data) {
		if($.isArray(data)) {
			this.data = $.merge(this.data, data);
		} else {
			this.data.push(data);
		}

		if(this.initialized) {
			this.addDOM();
			this.element.triggerHandler('change');
		}
	};
	
	Taggd.prototype.setData = function(data) {
		this.data = data;
		
		if(this.initialized) {
			this.addDOM();
		}
	};
	
	Taggd.prototype.clear = function() {
		if(!this.initialized) return;
		this.wrapper.find('.taggd-item, .taggd-item-hover').remove();
	};
	
	
	/****************************************************************
	 * EVENTS
	 ****************************************************************/
	
	Taggd.prototype.on = function(event, handler) {
		if(
			typeof event !== 'string' ||
			typeof handler !== 'function'
		) return;
		
		this.element.on(event, handler);
	};
	
	
	/****************************************************************
	 * TAGS MANAGEMENT
	 ****************************************************************/
	
	Taggd.prototype.iterateTags = function(a, yep) {
		var func;
		
		if($.isNumeric(a)) {
			func = function(i, e) { return a === i; };
		} else if(typeof a === 'string') {
			func = function(i, e) { return $(e).is(a); }
		} else if($.isArray(a)) {
			func = function(i, e) {
				var $e = $(e);
				var result = false;
				
				$.each(a, function(ai, ae) {
					if(
						i === ai ||
						e === ae ||
						$e.is(ae)
					) {
						result = true;
						return false;
					}
				});
				
				return result;
			}
		} else if(typeof a === 'object') {
			func = function(i, e) {
				var $e = $(e);
				return $e.is(a);
			};
		} else if($.isFunction(a)) {
			func = a;
		} else if(!a) {
			func = function() { return true; }
		} else return this;

		console.log(this.wrapper);

		this.wrapper.find('.taggd-item').each(function(i, e) {
			if(typeof yep === 'function' && func.call(this, i, e)) {
				yep.call(this, i, e);
			}
		});
		
		return this;
	};
	
	Taggd.prototype.show = function(a) {
		return this.iterateTags(a, methods.show);
	};
	
	Taggd.prototype.hide = function(a) {
		return this.iterateTags(a, methods.hide);
	};
	
	Taggd.prototype.toggle = function(a) {
		return this.iterateTags(a, methods.toggle);
	};
	
	/****************************************************************
	 * CLEANING UP
	 ****************************************************************/
	
	Taggd.prototype.dispose = function() {
		this.clear();
		this.element.unwrap(this.wrapper);
	};
	
	
	/****************************************************************
	 * SEMI-PRIVATE
	 ****************************************************************/
	
	Taggd.prototype.addDOM = function() {
		var _this = this;
		
		this.clear();
		this.element.css({ height: 'auto', width: 'auto' });
		
		var height = this.element.height();
		var width = this.element.width();

		$.each(this.data, function(i, v) {

			var $item = $('<span />');
			var $hover;
			
			if(
				v.x > 1 && v.x % 1 === 0 &&
				v.y > 1 && v.y % 1 === 0
			) {
				v.x = v.x / width;
				v.y = v.y / height;
			}
			
			if(typeof v.attributes === 'object') {
				$item.attr(v.attributes);
			}
			
			$item.attr({
				'data-x': v.x,
				'data-y': v.y,
				'data-position': v.position
			});
			
			$item.css('position', 'absolute');
			$item.addClass('taggd-item');
			
			_this.wrapper.append($item);
			
			if(typeof v.text === 'string' && (v.text.length > 0 || _this.options.edit)) {
				$hover = $('<span class="taggd-item-hover" style="position: absolute;" />').html(v.text);
				
				$hover.attr({
					'data-x': v.x,
					'data-y': v.y,
                    'data-position': v.position
				});
				
				_this.wrapper.append($hover);
			}
			
			if(typeof _this.options.handlers === 'object') {
				$.each(_this.options.handlers, function(event, func) {
					var handler;
					
					if(typeof func === 'string' && methods[func]) {
						handler = methods[func];
					} else if(typeof func === 'function') {
						handler = func;
					}
					
					$item.on(event, function(e) {
						if(!handler) return;
						handler.call($item, e, _this.data[i]);
					});
				});
			}
		});
		
		this.element.removeAttr('style');
		
		if(this.options.edit) {
			this.alterDOM();
		}
		
		this.updateDOM();
	};
	
	Taggd.prototype.updateDOM = function() {
		var _this = this;
		
		this.wrapper.removeAttr('style').css({
			height: this.element.height(),
			width: this.element.width()
		});
		
		this.wrapper.find('span').each(function(i, e) {
			var $el = $(e);
			
			var left = $el.attr('data-x') * _this.element.width();
			var top = $el.attr('data-y') * _this.element.height();
			var final_answer = {align:_this.options.align,offset:_this.options.offset};
			var addition_position = $el.attr('data-position');
			if (typeof addition_position != 'undefined') {
    			if (addition_position == 'top') {
        			final_answer = {align: {x:'center',y: 'bottom'},offset: {top: -40,left:0}};
    			} else if (addition_position == 'bottom') {
        			final_answer = {align: {x:'center',y: 'top'},offset: {top: 20,left:0}};
    			} else if (addition_position == 'left') {
        			final_answer = {align: {x: 'right',y:'center'},offset: {left: -20,top:0}};
    			} else if (addition_position == 'right') {
        			final_answer = {align: {x: 'left',y:'center'},offset: {left: 20,top:0}};        			
    			}
			}
			
			if($el.hasClass('taggd-item')) {
				$el.css({
					left: left - $el.outerWidth(true) / 2,
					top: top - $el.outerHeight(true) / 2
				});
			} else if($el.hasClass('taggd-item-hover')) {
				if(final_answer.align.x === 'center') {
					left -= $el.outerWidth(true) / 2;
				} else if(final_answer.align.x === 'right') {
					left -= $el.outerWidth(true);
				}
				
				if(final_answer.align.y === 'center') {
					top -= $el.outerHeight(true) / 2;
				} else if(final_answer.align.y === 'bottom') {
					top -= $el.outerHeight(true);
				}
				
				$el.attr('data-align', $el.outerWidth(true));
				
				//console.log(final_answer.offset.left);
				
				$el.css({
					left: left + final_answer.offset.left,
					top: top + final_answer.offset.top
				});
			}
		});
	};
	
	
	/****************************************************************
	 * JQUERY LINK
	 ****************************************************************/
	
	$.fn.picTags = function(options, data) {
		return new Taggd(this, options, data);
	};
})(jQuery);