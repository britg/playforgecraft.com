/*global jQuery */
/*! 
* FitText.js 1.0
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/
(function(a){a.fn.fitText=function(b,c){var d={minFontSize:Number.NEGATIVE_INFINITY,maxFontSize:Number.POSITIVE_INFINITY};return this.each(function(){var e=a(this),f=b||1;c&&a.extend(d,c);var g=function(){e.css("font-size",Math.max(Math.min(e.width()/(f*10),parseFloat(d.maxFontSize)),parseFloat(d.minFontSize)))};g(),a(window).resize(g)})}})(jQuery)