/**
* Copyright © Cenzic, Inc. 2004-2013
* Author: Quoc Quach
* Email: quoc_cooc@yahoo.com
* Released under the MIT license
* Date: 11/22/2013
*/
(function($){
	var defaultOptions = {
		codeWidth: 200,		
		lineWidth: 1,//width of the smallest line
		barHeight: 50,//height of each bar.	
		showCode: true,
		font: 12,//px
		codePadding: 5,
		padding: 10
	};
	/**
	 * hash with type point to render function.
	 */
	var barCodeRenders = {};
	$.fn.czBarCode = function(code,type,opts){
		if($(this).length==0){
			console.error('select element to place bar code into');
			return;
		}
		
		var t = type.toLowerCase();
		var plugin = barCodeRenders[t];
		
		if(!plugin){
			console.error('request type to render invalid');
			return;
		}			
		
		if(!plugin.validate(code,type)){
			console.error('The supply code is invalid for requested type: %s', type);
			return;
		}
		
		var options = $.extend({},defaultOptions,opts,{code:code, type:type});		
		render = new $.czBarCode($(this),options);
		render.generate();
		return render;
	};
	
	$.czBarCode = function(jObj,options){
		this.jObj = jObj;
		this.options = options;
		this.init();
		console.log("options: %s",JSON.stringify(options));
		var width = this.options.codeWidth  + 2*this.options.padding;
		var height = this.options.barHeight + 2* this.options.padding + (this.options.showCode ? this.options.font + this.options.codePadding : 0 );
		var canvas = $(format('<canvas style="border: black 1px solid;" width="%d" height="%d"/>', width, height));
		this.jObj.append(canvas);
		var el = canvas.get(0);
		this.canvas = el;
		//special initialize for canvas context with excanvas library
		if(typeof(HTMLCanvasElement) != "undefined") {
			this.context = el.getContext("2d");
		}else {					
			G_vmlCanvasManager.initElement(el);
			this.context = el.getContext('2d');	
		}
	};
	$.czBarCode.types = barCodeRenders;
	$.czBarCode.register = function(render){		
		console.log("$.czBarCode.register");
		for(var i = 0; i<render.types.length; i++){
			var type = render.types[i];
			console.log("type: %s",type);
			barCodeRenders[type.toLowerCase()] = render;			
		}
		$.extend($.czBarCode.prototype,render.prototype);
		$.extend(defaultOptions,render.defaultOptions);
	}
	
	$.czBarCode.prototype = {
		init:function(){
			var plugin = barCodeRenders[this.options.type.toLowerCase()];
			plugin.init.apply(this);
		},
		generate:function(){
			var plugin = barCodeRenders[this.options.type.toLowerCase()];
			plugin.generate.apply(this);
			if(this.options.showCode){
				if(plugin.showCode){
					plugin.showCode.apply(this);
				}
				else{
					this.drawText(this.options.code);
				}
			}
		},
		/**
		 * code is a string of the binary 0 and 1 represent for space for line
		 */
		drawCode: function(codeStr,start){			
			//console.log("codeStr: %s, start: %d", codeStr, start);
			for(var i = 0; i< codeStr.length; i++,start++){
				var code = codeStr.charAt(i);
				if(code=='0') continue;
				this.drawLine(start);
			}
			return start;
		},
		/**
		 * draw vertical line for each bar with provide where to start and the width of the line.
		 */
		drawLine: function(start,width){
			//console.log("drawLine | start: %d, width: %d", start, width);
			var top = this.options.padding,
				bottom = top + this.options.barHeight,
				width = width || 1;
			this.context.save();
			this.context.beginPath();
			this.context.strokeStyle = "black";
			this.context.lineWidth=width;		
			this.context.moveTo(start+0.5,top);
			this.context.lineTo(start+0.5,bottom);
			this.context.stroke();
			this.context.restore();
		},
		drawText: function(text,x,y,textAlign){
			//console.log("drawText | text: %s, x: %d, y: %s, textAlign: %s",text, x, y, textAlign);
			x = x || this.canvas.width/2;			
			y = y || (this.options.padding + this.options.barHeight + this.options.codePadding);
			textAlign = textAlign || 'center';
			//console.log("y: %d",y);
			textAlign = textAlign || "start";
			this.context.save();
			this.context.fillStyle = "black";
			this.context.font = format("%dpx Arial",this.options.font);
			this.context.textAlign = textAlign;
			this.context.textBaseline = "top";
			this.context.fillText(text,x,y)
			this.context.restore();
		}
	}			
	/**
	 * helper function to format string
	 */
	function format() {
		var format = arguments[0] || "";
		var match = format.match(/%s|%d|%j/g);
		if (!match) return format;

		if (match.length != arguments.length - 1) throw { name: "Argument Error", message: "Number of arguments mismatch" };
		for (var i = 1; i < arguments.length; i++) {
			var matchIndex = i - 1;
			var value = (match[matchIndex] == "%j") ? JSON.stringify(arguments[i]) : arguments[i];
			format = format.replace(match[matchIndex], value);
		}
		return format;
	}	
})(jQuery);

