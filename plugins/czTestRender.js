/**
* Copyright © Cenzic, Inc. 2004-2013
* Author: Quoc Quach
* Email: quoc_cooc@yahoo.com
* Released under the MIT license
* Date: 10/29/2013
*/
(function($){
	if($.czBarCode == undefined){
		console.error("czIRender depended on czBarCode");
		return;
	}	
	var testRender = {
		/**
		 * type of chart will be render when user call. Array of all types that the plugin able to handle.
		 */
		types: ["testCode"],
		/**
		 * set default options for bar code
		 */
		defaultOptions:{
			test:{
				padding: 10				
			}
		},
		/**
		 * Initialize any data to help create canvas by setting width and height,
		 * if width and height was not know ahead of time.
		 */
		init: function(){
			this.options.codeWidth = 4*(this.options.code.length-1)*this.options.lineWidth + 2*this.options.test.padding;
			console.log("width: %d", this.options.width);
		},
		/**
		 * Validate data before rendering
		 */
		validate: function(code){
			return code.length >= 10;
		},
		/**
		 * generate bar code: it needs to handler all type of bar codes declare in the 
		 */
		generate: function(){
			var start = this.options.padding + this.options.test.padding,
				width = 2*this.options.lineWidth;
			for(var i = 0; i< this.options.code.length; i++ ){
				this.drawLine(start,width);
				//add space
				start += 2*width;
			}
		},
		/**
		 * show code value for current barcode
		 */
		showCode: null,
		/**
		 * share function among all bar code object. Corresponse to the prototype of a function (class).
		 * to use the properties of the object.
		 */
		prototype: {}
	};
	$.czBarCode.register(testRender);
	
})(jQuery);