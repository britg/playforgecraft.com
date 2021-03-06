/*
 * Jeditable - jQuery in place edit plugin
 *
 * Copyright (c) 2006-2009 Mika Tuupola, Dylan Verheul
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/jeditable
 *
 * Based on editable by Dylan Verheul <dylan_at_dyve.net>:
 *    http://www.dyve.net/jquery/?editable
 *
 */
/**
  * Version 1.7.1
  *
  * ** means there is basic unit tests for this parameter. 
  *
  * @name  Jeditable
  * @type  jQuery
  * @param String  target             (POST) URL or function to send edited content to **
  * @param Hash    options            additional options 
  * @param String  options[method]    method to use to send edited content (POST or PUT) **
  * @param Function options[callback] Function to run after submitting edited content **
  * @param String  options[name]      POST parameter name of edited content
  * @param String  options[id]        POST parameter name of edited div id
  * @param Hash    options[submitdata] Extra parameters to send when submitting edited content.
  * @param String  options[type]      text, textarea or select (or any 3rd party input type) **
  * @param Integer options[rows]      number of rows if using textarea ** 
  * @param Integer options[cols]      number of columns if using textarea **
  * @param Mixed   options[height]    'auto', 'none' or height in pixels **
  * @param Mixed   options[width]     'auto', 'none' or width in pixels **
  * @param String  options[loadurl]   URL to fetch input content before editing **
  * @param String  options[loadtype]  Request type for load url. Should be GET or POST.
  * @param String  options[loadtext]  Text to display while loading external content.
  * @param Mixed   options[loaddata]  Extra parameters to pass when fetching content before editing.
  * @param Mixed   options[data]      Or content given as paramameter. String or function.**
  * @param String  options[indicator] indicator html to show when saving
  * @param String  options[tooltip]   optional tooltip text via title attribute **
  * @param String  options[event]     jQuery event such as 'click' of 'dblclick' **
  * @param String  options[submit]    submit button value, empty means no button **
  * @param String  options[cancel]    cancel button value, empty means no button **
  * @param String  options[cssclass]  CSS class to apply to input form. 'inherit' to copy from parent. **
  * @param String  options[style]     Style to apply to input form 'inherit' to copy from parent. **
  * @param String  options[select]    true or false, when true text is highlighted ??
  * @param String  options[placeholder] Placeholder text or html to insert when element is empty. **
  * @param String  options[onblur]    'cancel', 'submit', 'ignore' or function ??
  *             
  * @param Function options[onsubmit] function(settings, original) { ... } called before submit
  * @param Function options[onreset]  function(settings, original) { ... } called before reset
  * @param Function options[onerror]  function(settings, original, xhr) { ... } called on error
  *             
  * @param Hash    options[ajaxoptions]  jQuery Ajax options. See docs.jquery.com.
  *             
  */
(function($){$.fn.editable=function(a,b){if("disable"==a){$(this).data("disabled.editable",!0);return}if("enable"==a){$(this).data("disabled.editable",!1);return}if("destroy"==a){$(this).unbind($(this).data("event.editable")).removeData("disabled.editable").removeData("event.editable");return}var c=$.extend({},$.fn.editable.defaults,{target:a},b),d=$.editable.types[c.type].plugin||function(){},e=$.editable.types[c.type].submit||function(){},f=$.editable.types[c.type].buttons||$.editable.types.defaults.buttons,g=$.editable.types[c.type].content||$.editable.types.defaults.content,h=$.editable.types[c.type].element||$.editable.types.defaults.element,i=$.editable.types[c.type].reset||$.editable.types.defaults.reset,j=c.callback||function(){},k=c.onedit||function(){},l=c.onsubmit||function(){},m=c.onreset||function(){},n=c.onerror||i;return c.tooltip&&$(this).attr("title",c.tooltip),c.autowidth="auto"==c.width,c.autoheight="auto"==c.height,this.each(function(){var a=this,b=$(a).width(),o=$(a).height();$(this).data("event.editable",c.event),$.trim($(this).html())||$(this).html(c.placeholder),$(this).bind(c.event,function(m){if(!0===$(this).data("disabled.editable"))return;if(a.editing)return;if(!1===k.apply(this,[c,a]))return;m.preventDefault(),m.stopPropagation(),c.tooltip&&$(a).removeAttr("title"),0==$(a).width()?(c.width=b,c.height=o):(c.width!="none"&&(c.width=c.autowidth?$(a).width():c.width),c.height!="none"&&(c.height=c.autoheight?$(a).height():c.height)),$(this).html().toLowerCase().replace(/(;|")/g,"")==c.placeholder.toLowerCase().replace(/(;|")/g,"")&&$(this).html(""),a.editing=!0,a.revert=$(a).html(),$(a).html("");var p=$("<form />");c.cssclass&&("inherit"==c.cssclass?p.attr("class",$(a).attr("class")):p.attr("class",c.cssclass)),c.style&&("inherit"==c.style?(p.attr("style",$(a).attr("style")),p.css("display",$(a).css("display"))):p.attr("style",c.style));var q=h.apply(p,[c,a]),r;if(c.loadurl){var s=setTimeout(function(){q.disabled=!0,g.apply(p,[c.loadtext,c,a])},100),t={};t[c.id]=a.id,$.isFunction(c.loaddata)?$.extend(t,c.loaddata.apply(a,[a.revert,c])):$.extend(t,c.loaddata),$.ajax({type:c.loadtype,url:c.loadurl,data:t,async:!1,success:function(a){window.clearTimeout(s),r=a,q.disabled=!1}})}else c.data?(r=c.data,$.isFunction(c.data)&&(r=c.data.apply(a,[a.revert,c]))):r=a.revert;g.apply(p,[r,c,a]),q.attr("name",c.name),f.apply(p,[c,a]),$(a).append(p),d.apply(p,[c,a]),$(":input:visible:enabled:first",p).focus(),c.select&&q.select(),q.keydown(function(b){b.keyCode==27&&(b.preventDefault(),i.apply(p,[c,a]))});var s;"cancel"==c.onblur?q.blur(function(b){s=setTimeout(function(){i.apply(p,[c,a])},500)}):"submit"==c.onblur?q.blur(function(a){s=setTimeout(function(){p.submit()},200)}):$.isFunction(c.onblur)?q.blur(function(b){c.onblur.apply(a,[q.val(),c])}):q.blur(function(a){}),p.submit(function(b){s&&clearTimeout(s),b.preventDefault();if(!1!==l.apply(p,[c,a])&&!1!==e.apply(p,[c,a]))if($.isFunction(c.target)){var d=c.target.apply(a,[q.val(),c]);$(a).html(d),a.editing=!1,j.apply(a,[a.innerHTML,c]),$.trim($(a).html())||$(a).html(c.placeholder)}else{var f={};f[c.name]=q.val(),f[c.id]=a.id,$.isFunction(c.submitdata)?$.extend(f,c.submitdata.apply(a,[a.revert,c])):$.extend(f,c.submitdata),"PUT"==c.method&&(f._method="put"),$(a).html(c.indicator);var g={type:"POST",data:f,dataType:"html",url:c.target,success:function(b,d){g.dataType=="html"&&$(a).html(b),a.editing=!1,j.apply(a,[b,c]),$.trim($(a).html())||$(a).html(c.placeholder)},error:function(b,d,e){n.apply(p,[c,a,b])}};$.extend(g,c.ajaxoptions),$.ajax(g)}return $(a).attr("title",c.tooltip),!1})}),this.reset=function(b){this.editing&&!1!==m.apply(b,[c,a])&&($(a).html(a.revert),a.editing=!1,$.trim($(a).html())||$(a).html(c.placeholder),c.tooltip&&$(a).attr("title",c.tooltip))}})},$.editable={types:{defaults:{element:function(a,b){var c=$('<input type="hidden"></input>');return $(this).append(c),c},content:function(a,b,c){$(":input:first",this).val(a)},reset:function(a,b){b.reset(this)},buttons:function(a,b){var c=this;if(a.submit){if(a.submit.match(/>$/))var d=$(a.submit).click(function(){d.attr("type")!="submit"&&c.submit()});else{var d=$('<button type="submit" />');d.html(a.submit)}$(this).append(d)}if(a.cancel){if(a.cancel.match(/>$/))var e=$(a.cancel);else{var e=$('<button type="cancel" />');e.html(a.cancel)}$(this).append(e),$(e).click(function(d){if($.isFunction($.editable.types[a.type].reset))var e=$.editable.types[a.type].reset;else var e=$.editable.types.defaults.reset;return e.apply(c,[a,b]),!1})}}},text:{element:function(a,b){var c=$("<input />");return a.width!="none"&&c.width(a.width),a.height!="none"&&c.height(a.height),c.attr("autocomplete","off"),$(this).append(c),c}},textarea:{element:function(a,b){var c=$("<textarea />");return a.rows?c.attr("rows",a.rows):a.height!="none"&&c.height(a.height),a.cols?c.attr("cols",a.cols):a.width!="none"&&c.width(a.width),$(this).append(c),c}},select:{element:function(a,b){var c=$("<select />");return $(this).append(c),c},content:function(data,settings,original){if(String==data.constructor)eval("var json = "+data);else var json=data;for(var key in json){if(!json.hasOwnProperty(key))continue;if("selected"==key)continue;var option=$("<option />").val(key).append(json[key]);$("select",this).append(option)}$("select",this).children().each(function(){($(this).val()==json.selected||$(this).text()==$.trim(original.revert))&&$(this).attr("selected","selected")})}}},addInputType:function(a,b){$.editable.types[a]=b}},$.fn.editable.defaults={name:"value",id:"id",type:"text",width:"auto",height:"auto",event:"click.editable",onblur:"cancel",loadtype:"GET",loadtext:"Loading...",placeholder:"Click to edit",loaddata:{},submitdata:{},ajaxoptions:{}}})(jQuery)