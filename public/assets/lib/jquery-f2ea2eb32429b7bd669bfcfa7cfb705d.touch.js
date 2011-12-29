/**
 * touch for jQuery
 * 
 * Copyright (c) 2008 Peter Schmalfeldt (ManifestInteractive.com) <manifestinteractive@gmail.com>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details. 
 *
 * @license http://www.gnu.org/licenses/gpl.html 
 * @project jquery.touch
 */
// DEFINE DEFAULT VARIABLES
function touchstart(a){_target=this.id,_dragx=this.opts.dragx,_dragy=this.opts.dragy,_resort=this.opts.resort,_animate=this.opts.animate,_xspeed=0,_yspeed=0,$(a.changedTouches).each(function(){var b=$("#"+_target).css("left")=="auto"?this.pageX:parseInt($("#"+_target).css("left")),c=$("#"+_target).css("top")=="auto"?this.pageY:parseInt($("#"+_target).css("top"));!_dragging&&!_sizing&&(_left=a.pageX-b,_top=a.pageY-c,_dragging=[_left,_top],_resort&&(_zindex=$("#"+_target).css("z-index")==_zindex?_zindex:_zindex+1,$("#"+_target).css({zIndex:_zindex})))})}function touchmove(a){if(_dragging&&!_sizing&&_animate)var b=isNaN(parseInt($("#"+_target).css("left")))?0:parseInt($("#"+_target).css("left")),c=isNaN(parseInt($("#"+_target).css("top")))?0:parseInt($("#"+_target).css("top"));$(a.changedTouches).each(function(){a.preventDefault(),_left=this.pageX-parseInt($("#"+_target).css("width"))/2,_top=this.pageY-parseInt($("#"+_target).css("height"))/2,_dragging&&!_sizing&&(_animate&&(_xspeed=Math.round((_xspeed+Math.round(_left-b))/1.5),_yspeed=Math.round((_yspeed+Math.round(_top-c))/1.5)),(_dragx||_dragy)&&$("#"+_target).css({position:"absolute"}),_dragx&&$("#"+_target).css({left:_left+"px"}),_dragy&&$("#"+_target).css({top:_top+"px"}))})}function touchend(a){$(a.changedTouches).each(function(){if(!a.targetTouches.length){_dragging=!1;if(_animate){_left=$("#"+_target).css("left")=="auto"?this.pageX:parseInt($("#"+_target).css("left")),_top=$("#"+_target).css("top")=="auto"?this.pageY:parseInt($("#"+_target).css("top"));var b=_dragx?_left+_xspeed+"px":_left+"px",c=_dragy?_top+_yspeed+"px":_top+"px";(_dragx||_dragy)&&$("#"+_target).animate({left:b,top:c},"fast")}}})}function gesturestart(a){_sizing=[$("#"+this.id).css("width"),$("#"+this.id).css("height")]}function gesturechange(a){_sizing&&(_width=this.opts.scale?Math.min(parseInt(_sizing[0])*a.scale,300):_sizing[0],_height=this.opts.scale?Math.min(parseInt(_sizing[1])*a.scale,300):_sizing[1],_rotate=this.opts.rotate?"rotate("+(_rotating+a.rotation)%360+"deg)":"0deg",$("#"+this.id).css({width:_width+"px",height:_height+"px",webkitTransform:_rotate}))}function gestureend(a){_sizing=!1,_rotating=(_rotating+a.rotation)%360}var _target=null,_dragx=null,_dragy=null,_rotate=null,_resort=null,_dragging=!1,_sizing=!1,_animate=!1,_rotating=0,_width=0,_height=0,_left=0,_top=0,_xspeed=0,_yspeed=0,_zindex=1e3;jQuery.fn.touch=function(a){a=jQuery.extend({animate:!0,sticky:!1,dragx:!0,dragy:!0,rotate:!1,resort:!0,scale:!1},a);var b=[];b=$.extend({},$.fn.touch.defaults,a),this.each(function(){this.opts=b,this.ontouchstart=touchstart,this.ontouchend=touchend,this.ontouchmove=touchmove,this.ongesturestart=gesturestart,this.ongesturechange=gesturechange,this.ongestureend=gestureend})}