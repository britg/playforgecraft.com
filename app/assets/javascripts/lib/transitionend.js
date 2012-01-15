// Extracted from the Modernizer source code

var transEndEventNames = {
  'WebkitTransition' : 'webkitTransitionEnd',
  'MozTransition'    : 'transitionend',
  'OTransition'      : 'oTransitionEnd',
  'msTransition'     : 'msTransitionEnd', // maybe?
  'transition'       : 'transitionEnd'
}, 

CSS3_TRANSITION_END = transEndEventNames[ Modernizr.prefixed('transition') ];