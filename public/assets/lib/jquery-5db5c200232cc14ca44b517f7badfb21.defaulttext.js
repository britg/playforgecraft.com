/*
 * Default text - jQuery plugin for setting default text on inputs
 *
 * Author: Weixi Yen
 *
 * Email: [Firstname][Lastname]@gmail.com
 * 
 * Copyright (c) 2010 Resopollution
 * 
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.github.com/weixiyen/jquery-defaultText
 *
 * Version:  0.1.0
 *
 * Features:
 *      Auto-clears default text on form submit, then resets default text after submission.
 *      Allows context definition for better performance (uses event delegation)
 *      Allow user to set events to auto-clear fields.
 *          - defaultText automatically resets after event is run.  No need to manually re-populate default text.
 *      
 * Usage (MUST READ):
 *      
 *      <input type="text" title="enter your username" />   // the title field is mandatory for this to work
 *
 *      $.defaultText()                                     // input will show "enter your username" by default
 *                                                          // and have a css class of 'default'
 *                                                          // form fields with default text automatically clear when submitting form
 *
 *      $.defaultText({
 *          context:'form',                                 // only inputs inside of 'form' will be set with defaultText
 *          css:'myclass',                                  // class of input when default text is showing, default class is 'default'
 *          clearEvents:[
 *              {selector: '#button2', type:'click'},       // when button2 is clicked, inputs with default text will clear
 *              {selector: '#link3', type:'click'}          // this is useful for clearing inputs on ajax calls
 *          ]                                               // otherwise, you'll send default text to the server
 *      });
 *
 */
(function(a){a.defaultText=function(b){function g(a){var b=a.attr("title"),c=a.val();a.removeClass(e),b===c&&a.val("")}function h(){a(c).each(function(){g(a(this))}),setTimeout(function(){a(c).trigger("focusout")},1)}var c="input:text[title],textarea[title]",d=b&&b.context?b.context:"body",e=b&&b.css?b.css:"default",f=[{selector:"form",type:"submit"}];clear_events=b&&b.clearEvents?f.concat(b.clearEvents):f,a(d).delegate(c,"focusin",function(b){b.stopPropagation(),g(a(this))}).delegate(c,"focusout",function(b){b.stopPropagation();var c=a(this),d=c.attr("title"),f=c.val();(a.trim(f)===""||f===d)&&c.val(d).addClass(e)}),a.each(clear_events,function(b,c){var d=c.type,e=a(c.selector),f=e.length;if(e.size()){var g=a.data(e.get(0),"events");if(g)for(var i=0;i<f;i++){var j=a.data(e.get(i),"events");typeof j!="undefined"&&j[d].unshift({type:d,guid:null,namespace:"",data:undefined,handler:function(){h()}})}else e.bind(d,function(){h()})}})}})(jQuery)