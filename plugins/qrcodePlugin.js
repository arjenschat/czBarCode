/**
* Copyright © Cenzic, Inc. 2004-2013
* Author: Quoc Quach
* Email: quoc_cooc@yahoo.com
* Released under the MIT license
* Date: 10/29/2013
*/
(function($){
	if($.czBarCode == undefined || !qrcode){
		console.error("qrcodePlugin depended on czBarCode and qrcode");
		return;
	}	
	var qrCodeRender = {
		/**
		 * type of chart will be render when user call. Array of all types that the plugin able to handle.
		 */
		types: ["qrcode"],
		/**
		 * set default options for bar code
		 */
		options:{
			typeNumber: 4, 
			errorCorrectLevel: 'M',
			size: 82
		},
		/**
		 * Validate data before rendering
		 */
		/**
		 * Initialize any data to help create canvas by setting width and height,
		 * if width and height was not know ahead of time.
		 */
		init: function(){
			this.options.codeWidth = this.options.size -10;
		},
		/**
		 * Validate data before rendering. It call before object created
		 */
		validate: function(code,type){
			return true;
		},
		/**
		 * generate bar code, need to handler all type of bar codes declare in the 
		 */
		generate: function(){
			var qr = qrcode(this.options.typeNumber, this.options.errorCorrectLevel);
			qr.addData(this.options.code);
			qr.make();
			var img = $(qr.createImgTag()).get(0);
			this.context.drawImage(img, 5, 5);
		},
		/**
		 * show code value for current barcode, set to null to use default render
		 */
		showCode: function(){},
		/**
		 * share function among all chart object. Corresponse to the prototype of a function (class).
		 * to use the properties of the object.
		 */
		prototype: {}
	};
	$.czBarCode.register(qrCodeRender);
	
})(jQuery);