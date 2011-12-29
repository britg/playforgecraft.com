/*!
 * jQuery JavaScript Library v1.6.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Jun 30 14:16:56 2011 -0400
 */

(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z])/ig,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.6.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.done( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery._Deferred();

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return (new Function( "return " + data ))();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	// (xml & tmp used internally)
	parseXML: function( data , xml , tmp ) {

		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}

		tmp = xml.documentElement;

		if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
			jQuery.error( "Invalid XML: " + data );
		}

		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Converts a dashed string to camelCased string;
	// Used by both the css and data modules
	camelCase: function( string ) {
		return string.replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {

		if ( indexOf ) {
			return indexOf.call( array, elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


var // Promise methods
	promiseMethods = "done fail isResolved isRejected promise then always pipe".split( " " ),
	// Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({
	// Create a simple deferred (one callbacks list)
	_Deferred: function() {
		var // callbacks list
			callbacks = [],
			// stored [ context , args ]
			fired,
			// to avoid firing when already doing so
			firing,
			// flag to know if the deferred has been cancelled
			cancelled,
			// the deferred itself
			deferred  = {

				// done( f1, f2, ...)
				done: function() {
					if ( !cancelled ) {
						var args = arguments,
							i,
							length,
							elem,
							type,
							_fired;
						if ( fired ) {
							_fired = fired;
							fired = 0;
						}
						for ( i = 0, length = args.length; i < length; i++ ) {
							elem = args[ i ];
							type = jQuery.type( elem );
							if ( type === "array" ) {
								deferred.done.apply( deferred, elem );
							} else if ( type === "function" ) {
								callbacks.push( elem );
							}
						}
						if ( _fired ) {
							deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
						}
					}
					return this;
				},

				// resolve with given context and args
				resolveWith: function( context, args ) {
					if ( !cancelled && !fired && !firing ) {
						// make sure args are available (#8421)
						args = args || [];
						firing = 1;
						try {
							while( callbacks[ 0 ] ) {
								callbacks.shift().apply( context, args );
							}
						}
						finally {
							fired = [ context, args ];
							firing = 0;
						}
					}
					return this;
				},

				// resolve with this as context and given arguments
				resolve: function() {
					deferred.resolveWith( this, arguments );
					return this;
				},

				// Has this deferred been resolved?
				isResolved: function() {
					return !!( firing || fired );
				},

				// Cancel
				cancel: function() {
					cancelled = 1;
					callbacks = [];
					return this;
				}
			};

		return deferred;
	},

	// Full fledged deferred (two callbacks list)
	Deferred: function( func ) {
		var deferred = jQuery._Deferred(),
			failDeferred = jQuery._Deferred(),
			promise;
		// Add errorDeferred methods, then and promise
		jQuery.extend( deferred, {
			then: function( doneCallbacks, failCallbacks ) {
				deferred.done( doneCallbacks ).fail( failCallbacks );
				return this;
			},
			always: function() {
				return deferred.done.apply( deferred, arguments ).fail.apply( this, arguments );
			},
			fail: failDeferred.done,
			rejectWith: failDeferred.resolveWith,
			reject: failDeferred.resolve,
			isRejected: failDeferred.isResolved,
			pipe: function( fnDone, fnFail ) {
				return jQuery.Deferred(function( newDefer ) {
					jQuery.each( {
						done: [ fnDone, "resolve" ],
						fail: [ fnFail, "reject" ]
					}, function( handler, data ) {
						var fn = data[ 0 ],
							action = data[ 1 ],
							returned;
						if ( jQuery.isFunction( fn ) ) {
							deferred[ handler ](function() {
								returned = fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise().then( newDefer.resolve, newDefer.reject );
								} else {
									newDefer[ action ]( returned );
								}
							});
						} else {
							deferred[ handler ]( newDefer[ action ] );
						}
					});
				}).promise();
			},
			// Get a promise for this deferred
			// If obj is provided, the promise aspect is added to the object
			promise: function( obj ) {
				if ( obj == null ) {
					if ( promise ) {
						return promise;
					}
					promise = obj = {};
				}
				var i = promiseMethods.length;
				while( i-- ) {
					obj[ promiseMethods[i] ] = deferred[ promiseMethods[i] ];
				}
				return obj;
			}
		});
		// Make sure only one callback list will be used
		deferred.done( failDeferred.cancel ).fail( deferred.cancel );
		// Unexpose cancel
		delete deferred.cancel;
		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = arguments,
			i = 0,
			length = args.length,
			count = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					// Strange bug in FF4:
					// Values changed onto the arguments object sometimes end up as undefined values
					// outside the $.when method. Cloning the object into a fresh array solves the issue
					deferred.resolveWith( deferred, sliceDeferred.call( args, 0 ) );
				}
			};
		}
		if ( length > 1 ) {
			for( ; i < length; i++ ) {
				if ( args[ i ] && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return deferred.promise();
	}
});



jQuery.support = (function() {

	var div = document.createElement( "div" ),
		documentElement = document.documentElement,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		support,
		fragment,
		body,
		testElementParent,
		testElement,
		testElementStyle,
		tds,
		events,
		eventName,
		i,
		isSupported;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName( "tbody" ).length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName( "link" ).length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute( "href" ) === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains it's value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	div.innerHTML = "";

	// Figure out if the W3C box model works as expected
	div.style.width = div.style.paddingLeft = "1px";

	body = document.getElementsByTagName( "body" )[ 0 ];
	// We use our own, invisible, body unless the body is already present
	// in which case we use a div (#9239)
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0
	};
	if ( body ) {
		jQuery.extend( testElementStyle, {
			position: "absolute",
			left: -1000,
			top: -1000
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	support.boxModel = div.offsetWidth === 2;

	if ( "zoom" in div.style ) {
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		// (IE < 8 does this)
		div.style.display = "inline";
		div.style.zoom = 1;
		support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

		// Check if elements with layout shrink-wrap their children
		// (IE 6 does this)
		div.style.display = "";
		div.innerHTML = "<div style='width:4px;'></div>";
		support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
	}

	div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
	tds = div.getElementsByTagName( "td" );

	// Check if table cells still have offsetWidth/Height when they are set
	// to display:none and there are still other visible table cells in a
	// table row; if so, offsetWidth/Height are not reliable for use when
	// determining if an element has been hidden directly using
	// display:none (it is still safe to use offsets if a parent element is
	// hidden; don safety goggles and see bug #4512 for more information).
	// (only IE 8 fails this test)
	isSupported = ( tds[ 0 ].offsetHeight === 0 );

	tds[ 0 ].style.display = "";
	tds[ 1 ].style.display = "none";

	// Check if empty table cells still have offsetWidth/Height
	// (IE < 8 fail this test)
	support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( document.defaultView && document.defaultView.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( document.defaultView.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Remove the body element we added
	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		} ) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Null connected elements to avoid leaks in IE
	testElement = fragment = select = opt = body = marginDiv = div = input = null;

	return support;
})();

// Keep track of boxModel
jQuery.boxModel = jQuery.support.boxModel;




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([a-z])([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
			} else {
				cache[ id ] = jQuery.extend(cache[ id ], name);
			}
		}

		thisCache = cache[ id ];

		// Internal jQuery data is stored in a separate object inside the object's data
		// cache in order to avoid key collisions between internal data and user-defined
		// data
		if ( pvt ) {
			if ( !thisCache[ internalKey ] ) {
				thisCache[ internalKey ] = {};
			}

			thisCache = thisCache[ internalKey ];
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
		// not attempt to inspect the internal events object using jQuery.data, as this
		// internal data object is undocumented and subject to change.
		if ( name === "events" && !thisCache[name] ) {
			return thisCache[ internalKey ] && thisCache[ internalKey ].events;
		}

		return getByName ? 
			// Check for both converted-to-camel and non-converted data property names
			thisCache[ jQuery.camelCase( name ) ] || thisCache[ name ] :
			thisCache;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {
			var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

			if ( thisCache ) {
				delete thisCache[ name ];

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !isEmptyDataObject(thisCache) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( pvt ) {
			delete cache[ id ][ internalKey ];

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		var internalCache = cache[ id ][ internalKey ];

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		if ( jQuery.support.deleteExpando || cache != window ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the entire user cache at once because it's faster than
		// iterating through each key, but we need to continue to persist internal
		// data if it existed
		if ( internalCache ) {
			cache[ id ] = {};
			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}

			cache[ id ][ internalKey ] = internalCache;

		// Otherwise, we need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		} else if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 ) {
			    var attr = this[0].attributes, name;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		var name = "data-" + key.replace( rmultiDash, "$1-$2" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery.data( elem, deferDataKey, undefined, true );
	if ( defer &&
		( src === "queue" || !jQuery.data( elem, queueDataKey, undefined, true ) ) &&
		( src === "mark" || !jQuery.data( elem, markDataKey, undefined, true ) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery.data( elem, queueDataKey, undefined, true ) &&
				!jQuery.data( elem, markDataKey, undefined, true ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.resolve();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = (type || "fx") + "mark";
			jQuery.data( elem, type, (jQuery.data(elem,type,undefined,true) || 0) + 1, true );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery.data( elem, key, undefined, true) || 1 ) - 1 );
			if ( count ) {
				jQuery.data( elem, key, count, true );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		if ( elem ) {
			type = (type || "fx") + "queue";
			var q = jQuery.data( elem, type, undefined, true );
			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery.data( elem, type, jQuery.makeArray(data), true );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			defer;

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery._Deferred(), true ) )) {
				count++;
				tmp.done( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	rinvalidChar = /\:|^on/,
	formHook, boolHook;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},
	
	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},
	
	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = (value || "").split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret,
			elem = this[0];
		
		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ? 
					// handle most common string cases
					ret.replace(rreturn, "") : 
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return undefined;
		}

		var isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
					var option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
	
	attrFix: {
		// Always normalize to ensure hook usage
		tabindex: "tabIndex"
	},
	
	attr: function( elem, name, value, pass ) {
		var nType = elem.nodeType;
		
		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( !("getAttribute" in elem) ) {
			return jQuery.prop( elem, name, value );
		}

		var ret, hooks,
			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// Normalize the name if needed
		if ( notxml ) {
			name = jQuery.attrFix[ name ] || name;

			hooks = jQuery.attrHooks[ name ];

			if ( !hooks ) {
				// Use boolHook for boolean attributes
				if ( rboolean.test( name ) ) {

					hooks = boolHook;

				// Use formHook for forms and if the name contains certain characters
				} else if ( formHook && name !== "className" &&
					(jQuery.nodeName( elem, "form" ) || rinvalidChar.test( name )) ) {

					hooks = formHook;
				}
			}
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return undefined;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, name ) {
		var propName;
		if ( elem.nodeType === 1 ) {
			name = jQuery.attrFix[ name ] || name;
		
			if ( jQuery.support.getSetAttribute ) {
				// Use removeAttribute in browsers that support it
				elem.removeAttribute( name );
			} else {
				jQuery.attr( elem, name, "" );
				elem.removeAttributeNode( elem.getAttributeNode( name ) );
			}

			// Set corresponding property to false for boolean attributes
			if ( rboolean.test( name ) && (propName = jQuery.propFix[ name ] || name) in elem ) {
				elem[ propName ] = false;
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabIndex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		},
		// Use the value property for back compat
		// Use the formHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( formHook && jQuery.nodeName( elem, "button" ) ) {
					return formHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( formHook && jQuery.nodeName( elem, "button" ) ) {
					return formHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},
	
	prop: function( elem, name, value ) {
		var nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		var ret, hooks,
			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return (elem[ name ] = value);
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== undefined ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},
	
	propHooks: {}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		return jQuery.prop( elem, name ) ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !jQuery.support.getSetAttribute ) {

	// propFix is more comprehensive and contains all fixes
	jQuery.attrFix = jQuery.propFix;
	
	// Use this for any attribute on a form in IE6/7
	formHook = jQuery.attrHooks.name = jQuery.attrHooks.title = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			// Return undefined if nodeValue is empty string
			return ret && ret.nodeValue !== "" ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Check form objects in IE (multiple bugs related)
			// Only use nodeValue if the attribute node exists on the form
			var ret = elem.getAttributeNode( name );
			if ( ret ) {
				ret.nodeValue = value;
				return value;
			}
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return (elem.style.cssText = "" + value);
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	});
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return (elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0);
			}
		}
	});
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspaces = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
			return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery._data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events,
			eventHandle = elemData.handle;

		if ( !events ) {
			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" +
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem, undefined, true );
			}
		}
	},
	
	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			exclusive;

		if ( type.indexOf("!") >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.exclusive = exclusive;
		event.namespace = namespaces.join(".");
		event.namespace_re = new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");
		
		// triggerHandler() and global events don't bubble or run the default action
		if ( onlyHandlers || !elem ) {
			event.preventDefault();
			event.stopPropagation();
		}

		// Handle a global trigger
		if ( !elem ) {
			// TODO: Stop taunting the data cache; remove global events and always attach to document
			jQuery.each( jQuery.cache, function() {
				// internalKey variable is just used to make it easier to find
				// and potentially change this stuff later; currently it just
				// points to jQuery.expando
				var internalKey = jQuery.expando,
					internalCache = this[ internalKey ];
				if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
					jQuery.event.trigger( event, data, internalCache.handle.elem );
				}
			});
			return;
		}

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		event.target = elem;

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		var cur = elem,
			// IE doesn't like method names with a colon (#3533, #8272)
			ontype = type.indexOf(":") < 0 ? "on" + type : "";

		// Fire event on the current element, then bubble up the DOM tree
		do {
			var handle = jQuery._data( cur, "handle" );

			event.currentTarget = cur;
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Trigger an inline bound script
			if ( ontype && jQuery.acceptData( cur ) && cur[ ontype ] && cur[ ontype ].apply( cur, data ) === false ) {
				event.result = false;
				event.preventDefault();
			}

			// Bubble up to document, then to window
			cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
		} while ( cur && !event.isPropagationStopped() );

		// If nobody prevented the default action, do it now
		if ( !event.isDefaultPrevented() ) {
			var old,
				special = jQuery.event.special[ type ] || {};

			if ( (!special._default || special._default.call( elem.ownerDocument, event ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction)() check here because IE6/7 fails that test.
				// IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
				try {
					if ( ontype && elem[ type ] ) {
						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ ontype ];

						if ( old ) {
							elem[ ontype ] = null;
						}

						jQuery.event.triggered = type;
						elem[ type ]();
					}
				} catch ( ieError ) {}

				if ( old ) {
					elem[ ontype ] = old;
				}

				jQuery.event.triggered = undefined;
			}
		}
		
		return event.result;
	},

	handle: function( event ) {
		event = jQuery.event.fix( event || window.event );
		// Snapshot the handlers list since a called handler may add/remove events.
		var handlers = ((jQuery._data( this, "events" ) || {})[ event.type ] || []).slice(0),
			run_all = !event.exclusive && !event.namespace,
			args = Array.prototype.slice.call( arguments, 0 );

		// Use the fix-ed Event rather than the (read-only) native event
		args[0] = event;
		event.currentTarget = this;

		for ( var j = 0, l = handlers.length; j < l; j++ ) {
			var handleObj = handlers[ j ];

			// Triggered event must 1) be non-exclusive and have no namespace, or
			// 2) have namespace(s) a subset or equal to those in the bound event.
			if ( run_all || event.namespace_re.test( handleObj.namespace ) ) {
				// Pass in a reference to the handler function itself
				// So that we can later remove it
				event.handler = handleObj.handler;
				event.data = handleObj.data;
				event.handleObj = handleObj;

				var ret = handleObj.handler.apply( this, args );

				if ( ret !== undefined ) {
					event.result = ret;
					if ( ret === false ) {
						event.preventDefault();
						event.stopPropagation();
					}
				}

				if ( event.isImmediatePropagationStopped() ) {
					break;
				}
			}
		}
		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			// Fixes #1925 where srcElement might not be defined either
			event.target = event.srcElement || document;
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var eventDocument = event.target.ownerDocument || document,
				doc = eventDocument.documentElement,
				body = eventDocument.body;

			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {

	// Check if mouse(over|out) are still within the same parent element
	var related = event.relatedTarget,
		inside = false,
		eventType = event.type;

	event.type = event.data;

	if ( related !== this ) {

		if ( related ) {
			inside = jQuery.contains( this, related );
		}

		if ( !inside ) {

			jQuery.event.handle.apply( this, arguments );

			event.type = eventType;
		}
	}
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( !jQuery.nodeName( this, "form" ) ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						trigger( "submit", this, arguments );
					}
				});

				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( jQuery.nodeName( elem, "select" ) ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery._data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery._data( elem, "_change_data", val );
		}

		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange,

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

				if ( type === "radio" || type === "checkbox" || jQuery.nodeName( elem, "select" ) ) {
					testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

				if ( (e.keyCode === 13 && !jQuery.nodeName( elem, "textarea" ) ) ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery._data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	// Piggyback on a donor event to simulate a different one.
	// Fake originalEvent to avoid donor's stopPropagation, but if the
	// simulated event prevents default then we do the same on the donor.
	// Don't pass args or remember liveFired; they apply to the donor event.
	var event = jQuery.extend( {}, args[ 0 ] );
	event.type = type;
	event.originalEvent = {};
	event.liveFired = undefined;
	jQuery.event.handle.call( elem, event );
	if ( event.isDefaultPrevented() ) {
		args[ 0 ].preventDefault();
	}
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0;

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};

		function handler( donor ) {
			// Donor event is always a native one; fix it and switch its type.
			// Let focusin/out handler cancel the donor focus/blur event.
			var e = jQuery.event.fix( donor );
			e.type = fix;
			e.originalEvent = {};
			jQuery.event.trigger( e, null, e.target );
			if ( e.isDefaultPrevented() ) {
				donor.preventDefault();
			}
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		var handler;

		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}

		if ( arguments.length === 2 || data === false ) {
			fn = data;
			data = undefined;
		}

		if ( name === "one" ) {
			handler = function( event ) {
				jQuery( this ).unbind( event, handler );
				return fn.apply( this, arguments );
			};
			handler.guid = fn.guid || jQuery.guid++;
		} else {
			handler = fn;
		}

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},

	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
			return this.unbind( "live" );

		} else {
			return this.die( types, null, fn, selector );
		}
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}

			return this;
		}

		if ( name === "die" && !types &&
					origSelector && origSelector.charAt(0) === "." ) {

			context.unbind( origSelector );

			return this;
		}

		if ( data === false || jQuery.isFunction( data ) ) {
			fn = data || returnFalse;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( liveMap[ type ] ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}

		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
	if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];

					// Make sure not to accidentally match a child element with the same selector
					if ( related && jQuery.contains( elem, related ) ) {
						related = elem;
					}
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspaces, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( typeof selector === "string" ?
			jQuery.filter( selector, this ).length > 0 :
			this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array
		if ( jQuery.isArray( selectors ) ) {
			var match, selector,
				matches = {},
				level = 1;

			if ( cur && selectors.length ) {
				for ( i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[ selector ] ) {
						matches[ selector ] = POS.test( selector ) ?
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[ selector ];

						if ( match.jquery ? match.index( cur ) > -1 : jQuery( cur ).is( match ) ) {
							ret.push({ selector: selector, elem: cur, level: level });
						}
					}

					cur = cur.parentNode;
					level++;
				}
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until ),
			// The variable 'args' was introduced in
			// https://github.com/jquery/jquery/commit/52a0238
			// to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
			// http://code.google.com/p/v8/issues/detail?id=1050
			args = slice.call(arguments);

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, args.join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
}




var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<(?:script|object|embed|option|style)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || (l > 1 && i < lastIndex) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var internalKey = jQuery.expando,
		oldData = jQuery.data( src ),
		curData = jQuery.data( dest, oldData );

	// Switch to use the internal data object, if it exists, for the next
	// stage of data copying
	if ( (oldData = oldData[ internalKey ]) ) {
		var events = oldData.events;
				curData = curData[ internalKey ] = jQuery.extend({}, oldData);

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
				}
			}
		}
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc;

  // nodes may contain either an explicit document object,
  // a jQuery collection or context object.
  // If nodes[0] contains a valid object to assign to doc
  if ( nodes && nodes[0] ) {
    doc = nodes[0].ownerDocument || nodes[0];
  }

  // Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( "getElementsByTagName" in elem ) {
		return elem.getElementsByTagName( "*" );

	} else if ( "querySelectorAll" in elem ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	if ( jQuery.nodeName( elem, "input" ) ) {
		fixDefaultChecked( elem );
	} else if ( "getElementsByTagName" in elem ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var clone = elem.cloneNode(true),
				srcElements,
				destElements,
				i;

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName
			// instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				cloneFixAttributes( srcElements[i], destElements[i] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ] && cache[ id ][ internalKey ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}



var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^[+\-]=/,
	rrelNumFilter = /[^+\-\.\de]+/g,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Make sure that NaN and null values aren't set. See: #7116
			if ( type === "number" && isNaN( value ) || value == null ) {
				return;
			}

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && rrelNum.test( value ) ) {
				value = +value.replace( rrelNumFilter, "" ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle;

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// Set the alpha filter to set the opacity
			var opacity = jQuery.isNaN( value ) ?
				"" :
				"alpha(opacity=" + value * 100 + ")",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
			style = elem.style;

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
			// Remember the original values
			left = style.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : (ret || 0);
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			jQuery.each( which, function() {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
				}
			});
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		jQuery.each( which, function() {
			val += parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
			}
		});
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts;

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for(; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for(; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.bind( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function ( target, settings ) {
		if ( !settings ) {
			// Only one parameter, we extend ajaxSettings
			settings = target;
			target = jQuery.extend( true, jQuery.ajaxSettings, settings );
		} else {
			// target was provided, we extend into it
			jQuery.extend( true, target, jQuery.ajaxSettings, settings );
		}
		// Flatten fields we don't want deep extended
		for( var field in { context: 1, url: 1 } ) {
			if ( field in settings ) {
				target[ field ] = settings[ field ];
			} else if( field in jQuery.ajaxSettings ) {
				target[ field ] = jQuery.ajaxSettings[ field ];
			}
		}
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": "*/*"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery._Deferred(),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, statusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status ? 4 : 0;

			var isSuccess,
				success,
				error,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = statusText;

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.resolveWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.done;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", */*; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( status < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					jQuery.error( e );
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for( key in s.converters ) {
				if( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow,
	requestAnimationFrame = window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[i];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
						jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[i];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data(elem, "olddisplay") || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				if ( this[i].style ) {
					var display = jQuery.css( this[i], "display" );

					if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
						jQuery._data( this[i], "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p,
				display, e,
				parts, start, end, unit;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height
					// animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {
						if ( !jQuery.support.inlineBlockNeedsLayout ) {
							this.style.display = "inline-block";

						} else {
							display = defaultDisplay( this.nodeName );

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if ( display === "inline" ) {
								this.style.display = "inline-block";

							} else {
								this.style.display = "inline";
								this.style.zoom = 1;
							}
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]();

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ((end || 1) / e.cur()) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			var timers = jQuery.timers,
				i = timers.length;
			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}
			while ( i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue !== false ) {
				jQuery.dequeue( this );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx,
			raf;

		this.startTime = fxNow || createFxNow();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );
		this.now = this.start;
		this.pos = this.state = 0;

		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			// Use requestAnimationFrame instead of setInterval if available
			if ( requestAnimationFrame ) {
				timerId = true;
				raf = function() {
					// When timerId gets set to null at any point, this stops
					if ( timerId ) {
						requestAnimationFrame( raf );
						fx.tick();
					}
				};
				requestAnimationFrame( raf );
			} else {
				timerId = setInterval( fx.tick, fx.interval );
			}
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options,
			i, n;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( i in options.animatedProperties ) {
				if ( options.animatedProperties[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function (index, value) {
						elem.style[ "overflow" + value ] = options.overflow[index];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery(elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( var p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[p] );
					}
				}

				// Execute the complete function
				options.complete.call( elem );
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[ this.prop ] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ((this.end - this.start) * this.pos);
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		for ( var timers = jQuery.timers, i = 0 ; i < timers.length ; ++i ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );

		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );

			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed";
		checkDiv.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden";
		innerDiv.style.position = "relative";

		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if (options.top != null) {
			props.top = (options.top - curOffset.top) + curTop;
		}
		if (options.left != null) {
			props.left = (options.left - curOffset.left) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem && elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem && elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ];
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				elem.document.body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNaN( ret ) ? orig : ret;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;
})(window);
/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.6.0 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =============================
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * ===========================
 *
 * If any blank required inputs (required="required") are detected in the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, elements){
 *       // Returning false in this handler tells rails.js to submit the form anyway.
 *       // The blank required inputs are passed to this function in `elements`.
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */


(function($, undefined) {
  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]',

		// Select elements bound by jquery-ujs
		selectChangeSelector: 'select[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input:file',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data,
        crossDomain = element.data('cross-domain') || null,
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

      if (rails.fire(element, 'ajax:before')) {

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is('select')) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params'); 
        } else {
           method = element.data('method');
           url = element.attr('href');
           data = element.data('params') || null; 
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType, crossDomain: crossDomain,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          }
        };
        // Do not pass url to `ajax` options if blank
        if (url) { $.extend(options, { url: url }); }

        rails.ajax(options);
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = link.attr('href'),
        method = link.data('method'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Adds disabled=disabled attribute
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.attr('disabled', 'disabled');
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Removes disabled attribute
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.removeAttr('disabled');
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input,
        selector = specifiedSelector || 'input,textarea';
      form.find(selector).each(function() {
        input = $(this);
        // Collect non-blank inputs if nonBlank option is true, otherwise, collect blank inputs
        if (nonBlank ? input.val() : !input.val()) {
          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(obj.data);
        });
      }
      return continuePropagation;
    }
  };

  $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

  $(rails.linkClickSelector).live('click.rails', function(e) {
    var link = $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    if (link.data('remote') !== undefined) {
      rails.handleRemote(link);
      return false;
    } else if (link.data('method')) {
      rails.handleMethod(link);
      return false;
    }
  });

	$(rails.selectChangeSelector).live('change.rails', function(e) {
    var link = $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    rails.handleRemote(link);
    return false;
  });	

  $(rails.formSubmitSelector).live('submit.rails', function(e) {
    var form = $(this),
      remote = form.data('remote') !== undefined,
      blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
      nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

    if (!rails.allowAction(form)) return rails.stopEverything(e);

    // skip other logic when required values are missing or file upload is present
    if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
      return rails.stopEverything(e);
    }

    if (remote) {
      if (nonBlankFileInputs) {
        return rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);
      }

      // If browser does not support submit bubbling, then this live-binding will be called before direct
      // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
      if (!$.support.submitBubbles && rails.callFormSubmitBindings(form) === false) return rails.stopEverything(e);

      rails.handleRemote(form);
      return false;
    } else {
      // slight timeout so that the submit button gets properly serialized
      setTimeout(function(){ rails.disableFormElements(form); }, 13);
    }
  });

  $(rails.formInputClickSelector).live('click.rails', function(event) {
    var button = $(this);

    if (!rails.allowAction(button)) return rails.stopEverything(event);

    // register the pressed submit button
    var name = button.attr('name'),
      data = name ? {name:name, value:button.val()} : null;

    button.closest('form').data('ujs:submit-button', data);
  });

  $(rails.formSubmitSelector).live('ajax:beforeSend.rails', function(event) {
    if (this == event.target) rails.disableFormElements($(this));
  });

  $(rails.formSubmitSelector).live('ajax:complete.rails', function(event) {
    if (this == event.target) rails.enableFormElements($(this));
  });

})( jQuery );
//     Underscore.js 1.1.7
//     (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **CommonJS**, with backwards-compatibility
  // for the old `require()` API. If we're not in CommonJS, add `_` to the
  // global object.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = _;
    _._ = _;
  } else {
    // Exported as a string, for Closure Compiler "advanced" mode.
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.1.7';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = memo !== void 0;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError("Reduce of empty array with no initial value");
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return memo !== void 0 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = (_.isArray(obj) ? obj.slice() : _.toArray(obj)).reverse();
    return _.reduce(reversed, iterator, memo, context);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result |= iterator.call(context, value, index, list)) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    any(obj, function(value) {
      if (found = value === target) return true;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (method.call ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion produced by an iterator
  _.groupBy = function(obj, iterator) {
    var result = {};
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return slice.call(iterable);
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Get the last element of an array.
  _.last = function(array) {
    return array[array.length - 1];
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var result = [];
    _.reduce(initial, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) {
        memo[memo.length] = el;
        result[result.length] = array[i];
      }
      return memo;
    }, []);
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and another.
  // Only the elements present in just the first array will remain.
  _.difference = function(array, other) {
    return _.filter(array, function(value){ return !_.include(other, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };


  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function(func, obj) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(obj, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return hasOwnProperty.call(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Internal function used to implement `_.throttle` and `_.debounce`.
  var limit = function(func, wait, debounce) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var throttler = function() {
        timeout = null;
        func.apply(context, args);
      };
      if (debounce) clearTimeout(timeout);
      if (debounce || !timeout) timeout = setTimeout(throttler, wait);
    };
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    return limit(func, wait, false);
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    return limit(func, wait, true);
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = slice.call(arguments);
    return function() {
      var args = slice.call(arguments);
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };


  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (source[prop] !== void 0) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    // Check object identity.
    if (a === b) return true;
    // Different types?
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    // Basic equality test (watch out for coercions).
    if (a == b) return true;
    // One is falsy and the other truthy.
    if ((!a && b) || (a && !b)) return false;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // One of them implements an isEqual()?
    if (a.isEqual) return a.isEqual(b);
    if (b.isEqual) return b.isEqual(a);
    // Check dates' integer values.
    if (_.isDate(a) && _.isDate(b)) return a.getTime() === b.getTime();
    // Both are NaN?
    if (_.isNaN(a) && _.isNaN(b)) return false;
    // Compare regular expressions.
    if (_.isRegExp(a) && _.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    // If a is not an object by this point, we can't handle it.
    if (atype !== 'object') return false;
    // Check for different array lengths before comparing contents.
    if (a.length && (a.length !== b.length)) return false;
    // Nothing else worked, deep compare the contents.
    var aKeys = _.keys(a), bKeys = _.keys(b);
    // Different object sizes?
    if (aKeys.length != bKeys.length) return false;
    // Recursive comparison of contents.
    for (var key in a) if (!(key in b) || !_.isEqual(a[key], b[key])) return false;
    return true;
  };

  // Is a given array or object empty?
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return !!(obj && hasOwnProperty.call(obj, 'callee'));
  };

  // Is a given value a function?
  _.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
  };

  // Is the given value `NaN`? `NaN` happens to be the only value in JavaScript
  // that does not equal itself.
  _.isNaN = function(obj) {
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false;
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.interpolate, function(match, code) {
           return "'," + code.replace(/\\'/g, "'") + ",'";
         })
         .replace(c.evaluate || null, function(match, code) {
           return "');" + code.replace(/\\'/g, "'")
                              .replace(/[\r\n\t]/g, ' ') + "__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', tmpl);
    return data ? func(data) : func;
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

})();
//     Backbone.js 0.5.3
//     (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://documentcloud.github.com/backbone

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object.
  var root = this;

  // Save the previous value of the `Backbone` variable.
  var previousBackbone = root.Backbone;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.5.3';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore')._;

  // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
  var $ = root.jQuery || root.Zepto || root.ender;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option will
  // fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and set a
  // `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may `bind` or `unbind` a callback function to an event;
  // `trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.bind('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  Backbone.Events = {

    // Bind an event, specified by a string name, `ev`, to a `callback` function.
    // Passing `"all"` will bind the callback to all events fired.
    bind : function(ev, callback, context) {
      var calls = this._callbacks || (this._callbacks = {});
      var list  = calls[ev] || (calls[ev] = []);
      list.push([callback, context]);
      return this;
    },

    // Remove one or many callbacks. If `callback` is null, removes all
    // callbacks for the event. If `ev` is null, removes all bound callbacks
    // for all events.
    unbind : function(ev, callback) {
      var calls;
      if (!ev) {
        this._callbacks = {};
      } else if (calls = this._callbacks) {
        if (!callback) {
          calls[ev] = [];
        } else {
          var list = calls[ev];
          if (!list) return this;
          for (var i = 0, l = list.length; i < l; i++) {
            if (list[i] && callback === list[i][0]) {
              list[i] = null;
              break;
            }
          }
        }
      }
      return this;
    },

    // Trigger an event, firing all bound callbacks. Callbacks are passed the
    // same arguments as `trigger` is, apart from the event name.
    // Listening for `"all"` passes the true event name as the first argument.
    trigger : function(eventName) {
      var list, calls, ev, callback, args;
      var both = 2;
      if (!(calls = this._callbacks)) return this;
      while (both--) {
        ev = both ? eventName : 'all';
        if (list = calls[ev]) {
          for (var i = 0, l = list.length; i < l; i++) {
            if (!(callback = list[i])) {
              list.splice(i, 1); i--; l--;
            } else {
              args = both ? Array.prototype.slice.call(arguments, 1) : arguments;
              callback[0].apply(callback[1] || this, args);
            }
          }
        }
      }
      return this;
    }

  };

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (defaults = this.defaults) {
      if (_.isFunction(defaults)) defaults = defaults.call(this);
      attributes = _.extend({}, defaults, attributes);
    }
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.set(attributes, {silent : true});
    this._changed = false;
    this._previousAttributes = _.clone(this.attributes);
    if (options && options.collection) this.collection = options.collection;
    this.initialize(attributes, options);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Backbone.Model.prototype, Backbone.Events, {

    // A snapshot of the model's previous attributes, taken immediately
    // after the last `"change"` event was fired.
    _previousAttributes : null,

    // Has the item been changed since the last `"change"` event?
    _changed : false,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute : 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Return a copy of the model's `attributes` object.
    toJSON : function() {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get : function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape : function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.attributes[attr];
      return this._escapedAttributes[attr] = escapeHTML(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has : function(attr) {
      return this.attributes[attr] != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless you
    // choose to silence it.
    set : function(attrs, options) {

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs.attributes) attrs = attrs.attributes;
      var now = this.attributes, escaped = this._escapedAttributes;

      // Run validation.
      if (!options.silent && this.validate && !this._performValidation(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // We're about to start triggering change events.
      var alreadyChanging = this._changing;
      this._changing = true;

      // Update attributes.
      for (var attr in attrs) {
        var val = attrs[attr];
        if (!_.isEqual(now[attr], val)) {
          now[attr] = val;
          delete escaped[attr];
          this._changed = true;
          if (!options.silent) this.trigger('change:' + attr, this, val, options);
        }
      }

      // Fire the `"change"` event, if the model has been changed.
      if (!alreadyChanging && !options.silent && this._changed) this.change(options);
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset : function(attr, options) {
      if (!(attr in this.attributes)) return this;
      options || (options = {});
      var value = this.attributes[attr];

      // Run validation.
      var validObj = {};
      validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      // Remove the attribute.
      delete this.attributes[attr];
      delete this._escapedAttributes[attr];
      if (attr == this.idAttribute) delete this.id;
      this._changed = true;
      if (!options.silent) {
        this.trigger('change:' + attr, this, void 0, options);
        this.change(options);
      }
      return this;
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear : function(options) {
      options || (options = {});
      var attr;
      var old = this.attributes;

      // Run validation.
      var validObj = {};
      for (attr in old) validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      this.attributes = {};
      this._escapedAttributes = {};
      this._changed = true;
      if (!options.silent) {
        for (attr in old) {
          this.trigger('change:' + attr, this, void 0, options);
        }
        this.change(options);
      }
      return this;
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch : function(options) {
      options || (options = {});
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save : function(attrs, options) {
      options || (options = {});
      if (attrs && !this.set(attrs, options)) return false;
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp, xhr);
      };
      options.error = wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      return (this.sync || Backbone.sync).call(this, method, this, options);
    },

    // Destroy this model on the server if it was already persisted. Upon success, the model is removed
    // from its collection, if it has one.
    destroy : function(options) {
      options || (options = {});
      if (this.isNew()) return this.trigger('destroy', this, this.collection, options);
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        model.trigger('destroy', model, model.collection, options);
        if (success) success(model, resp);
      };
      options.error = wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'delete', this, options);
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url : function() {
      var base = getUrl(this.collection) || this.urlRoot || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse : function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone : function() {
      return new this.constructor(this);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew : function() {
      return this.id == null;
    },

    // Call this method to manually fire a `change` event for this model.
    // Calling this will cause all objects observing the model to update.
    change : function(options) {
      this.trigger('change', this, options);
      this._previousAttributes = _.clone(this.attributes);
      this._changed = false;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged : function(attr) {
      if (attr) return this._previousAttributes[attr] != this.attributes[attr];
      return this._changed;
    },

    // Return an object containing all the attributes that have changed, or false
    // if there are no changed attributes. Useful for determining what parts of a
    // view need to be updated and/or what attributes need to be persisted to
    // the server.
    changedAttributes : function(now) {
      now || (now = this.attributes);
      var old = this._previousAttributes;
      var changed = false;
      for (var attr in now) {
        if (!_.isEqual(old[attr], now[attr])) {
          changed = changed || {};
          changed[attr] = now[attr];
        }
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous : function(attr) {
      if (!attr || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes : function() {
      return _.clone(this._previousAttributes);
    },

    // Run validation against a set of incoming attributes, returning `true`
    // if all is well. If a specific `error` callback has been passed,
    // call that instead of firing the general `"error"` event.
    _performValidation : function(attrs, options) {
      var error = this.validate(attrs);
      if (error) {
        if (options.error) {
          options.error(this, error, options);
        } else {
          this.trigger('error', this, error, options);
        }
        return false;
      }
      return true;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.comparator) this.comparator = options.comparator;
    _.bindAll(this, '_onModelEvent', '_removeReference');
    this._reset();
    if (models) this.reset(models, {silent: true});
    this.initialize.apply(this, arguments);
  };

  // Define the Collection's inheritable methods.
  _.extend(Backbone.Collection.prototype, Backbone.Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model : Backbone.Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON : function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `added` event for every new model.
    add : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._add(models[i], options);
        }
      } else {
        this._add(models, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `removed` event for every model removed.
    remove : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._remove(models[i], options);
        }
      } else {
        this._remove(models, options);
      }
      return this;
    },

    // Get a model from the set by id.
    get : function(id) {
      if (id == null) return null;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid : function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Force the collection to re-sort itself. You don't need to call this under normal
    // circumstances, as the set will maintain sort order as each item is added.
    sort : function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      this.models = this.sortBy(this.comparator);
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck : function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `added` or `removed` events. Fires `reset` when finished.
    reset : function(models, options) {
      models  || (models = []);
      options || (options = {});
      this.each(this._removeReference);
      this._reset();
      this.add(models, {silent: true});
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch : function(options) {
      options || (options = {});
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. After the model
    // has been created on the server, it will be added to the collection.
    // Returns the model, or 'false' if validation on a new model fails.
    create : function(model, options) {
      var coll = this;
      options || (options = {});
      model = this._prepareModel(model, options);
      if (!model) return false;
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        coll.add(nextModel, options);
        if (success) success(nextModel, resp, xhr);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse : function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset : function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model to be added to this collection
    _prepareModel: function(model, options) {
      if (!(model instanceof Backbone.Model)) {
        var attrs = model;
        model = new this.model(attrs, {collection: this});
        if (model.validate && !model._performValidation(attrs, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal implementation of adding a single model to the set, updating
    // hash indexes for `id` and `cid` lookups.
    // Returns the model, or 'false' if validation on a new model fails.
    _add : function(model, options) {
      options || (options = {});
      model = this._prepareModel(model, options);
      if (!model) return false;
      var already = this.getByCid(model);
      if (already) throw new Error(["Can't add the same model to a set twice", already.id]);
      this._byId[model.id] = model;
      this._byCid[model.cid] = model;
      var index = options.at != null ? options.at :
                  this.comparator ? this.sortedIndex(model, this.comparator) :
                  this.length;
      this.models.splice(index, 0, model);
      model.bind('all', this._onModelEvent);
      this.length++;
      if (!options.silent) model.trigger('add', model, this, options);
      return model;
    },

    // Internal implementation of removing a single model from the set, updating
    // hash indexes for `id` and `cid` lookups.
    _remove : function(model, options) {
      options || (options = {});
      model = this.getByCid(model) || this.get(model);
      if (!model) return null;
      delete this._byId[model.id];
      delete this._byCid[model.cid];
      this.models.splice(this.indexOf(model), 1);
      this.length--;
      if (!options.silent) model.trigger('remove', model, this, options);
      this._removeReference(model);
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference : function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.unbind('all', this._onModelEvent);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent : function(ev, model, collection, options) {
      if ((ev == 'add' || ev == 'remove') && collection != this) return;
      if (ev == 'destroy') {
        this._remove(model, options);
      }
      if (model && ev === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect',
    'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include',
    'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size',
    'first', 'rest', 'last', 'without', 'indexOf', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Backbone.Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:([\w\d]+)/g;
  var splatParam    = /\*([\w\d]+)/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Backbone.Router.prototype, Backbone.Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route : function(route, name, callback) {
      Backbone.history || (Backbone.history = new Backbone.History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
      }, this));
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate : function(fragment, triggerRoute) {
      Backbone.history.navigate(fragment, triggerRoute);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes : function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp : function(route) {
      route = route.replace(escapeRegExp, "\\$&")
                   .replace(namedParam, "([^\/]*)")
                   .replace(splatParam, "(.*?)");
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters : function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning hashes.
  var hashStrip = /^#*/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  var historyStarted = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(Backbone.History.prototype, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment : function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
          if (fragment.indexOf(this.options.root) == 0) fragment = fragment.substr(this.options.root.length);
        } else {
          fragment = window.location.hash;
        }
      }
      return decodeURIComponent(fragment.replace(hashStrip, ''));
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start : function(options) {

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      if (historyStarted) throw new Error("Backbone.history has already been started");
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if ('onhashchange' in window && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else {
        setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      historyStarted = true;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;
      if (this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = loc.hash.replace(hashStrip, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Add a route to be tested when the fragment changes. Routes added later may
    // override previous routes.
    route : function(route, callback) {
      this.handlers.unshift({route : route, callback : callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl : function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.iframe.location.hash);
      if (current == this.fragment || current == decodeURIComponent(this.fragment)) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(window.location.hash);
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl : function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history. You are responsible for properly
    // URL-encoding the fragment in advance. This does not trigger
    // a `hashchange` event.
    navigate : function(fragment, triggerRoute) {
      var frag = (fragment || '').replace(hashStrip, '');
      if (this.fragment == frag || this.fragment == decodeURIComponent(frag)) return;
      if (this._hasPushState) {
        var loc = window.location;
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history.pushState({}, document.title, loc.protocol + '//' + loc.host + frag);
      } else {
        window.location.hash = this.fragment = frag;
        if (this.iframe && (frag != this.getFragment(this.iframe.location.hash))) {
          this.iframe.document.open().close();
          this.iframe.location.hash = frag;
        }
      }
      if (triggerRoute) this.loadUrl(fragment);
    }

  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.delegateEvents();
    this.initialize.apply(this, arguments);
  };

  // Element lookup, scoped to DOM elements within the current view.
  // This should be prefered to global lookups, if you're dealing with
  // a specific view.
  var selectorDelegate = function(selector) {
    return $(selector, this.el);
  };

  // Cached regex to split keys for `delegate`.
  var eventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(Backbone.View.prototype, Backbone.Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName : 'div',

    // Attach the `selectorDelegate` function as the `$` property.
    $       : selectorDelegate,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render : function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove : function() {
      $(this.el).remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make : function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Set callbacks, where `this.callbacks` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents : function(events) {
      if (!(events || (events = this.events))) return;
      if (_.isFunction(events)) events = events.call(this);
      $(this.el).unbind('.delegateEvents' + this.cid);
      for (var key in events) {
        var method = this[events[key]];
        if (!method) throw new Error('Event "' + events[key] + '" does not exist');
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          $(this.el).bind(eventName, method);
        } else {
          $(this.el).delegate(selector, eventName, method);
        }
      }
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure : function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement : function() {
      if (!this.el) {
        var attrs = this.attributes || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.el = this.make(this.tagName, attrs);
      } else if (_.isString(this.el)) {
        this.el = $(this.el).get(0);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Backbone.Model.extend = Backbone.Collection.extend =
    Backbone.Router.extend = Backbone.View.extend = extend;

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, uses makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded` instead of
  // `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default JSON-request options.
    var params = _.extend({
      type:         type,
      dataType:     'json'
    }, options);

    // Ensure that we have a URL.
    if (!params.url) {
      params.url = getUrl(model) || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!params.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data        = params.data ? {model : params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request.
    return $.ajax(params);
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call `super()`.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a URL from a Model or Collection as a property
  // or as a function.
  var getUrl = function(object) {
    if (!(object && object.url)) return null;
    return _.isFunction(object.url) ? object.url() : object.url;
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(onError, model, options) {
    return function(resp) {
      if (onError) {
        onError(model, resp, options);
      } else {
        model.trigger('error', model, resp, options);
      }
    };
  };

  // Helper function to escape a string for HTML rendering.
  var escapeHTML = function(string) {
    return string.replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

}).call(this);
(function() {
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };
  
  var getUrl = function(object) {
    if (!(object && object.url)) return null;
    return _.isFunction(object.url) ? object.url() : object.url;
  };
  
  var urlError = function() {
    throw new Error("A 'url' property or function must be specified");
  };

  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default JSON-request options.
    var params = _.extend({
      type:         type,
      dataType:     'json',
      beforeSend: function( xhr ) {
        var token = $('meta[name="csrf-token"]').attr('content');
        if (token) xhr.setRequestHeader('X-CSRF-Token', token);
      }
    }, options);

    if (!params.url) {
      params.url = getUrl(model) || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!params.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';

      var data = {}

      if(model.paramRoot) {
        data[model.paramRoot] = model.toJSON();
      } else {
        data = model.toJSON();
      }

      params.data = JSON.stringify(data)
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET') {
      params.processData = false;
    }
    
    // Make the request.
    return $.ajax(params);
  }
  
}).call(this);
(function($) {
  return $.extend($.fn, {
    backboneLink: function(model) {
      return $(this).find(":input").each(function() {
        var el, name;
        el = $(this);
        name = el.attr("name");
        model.bind("change:" + name, function() {
          return el.val(model.get(name));
        });
        return $(this).bind("change", function() {
          var attrs;
          el = $(this);
          attrs = {};
          attrs[el.attr("name")] = el.val();
          return model.set(attrs);
        });
      });
    }
  });
})(jQuery);
/* ==========================================================
 * bootstrap-alerts.js v1.4.0
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2011 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function( $ ){

  "use strict"

  /* CSS TRANSITION SUPPORT (https://gist.github.com/373874)
   * ======================================================= */

   var transitionEnd

   $(document).ready(function () {

     $.support.transition = (function () {
       var thisBody = document.body || document.documentElement
         , thisStyle = thisBody.style
         , support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined
       return support
     })()

     // set CSS transition event type
     if ( $.support.transition ) {
       transitionEnd = "TransitionEnd"
       if ( $.browser.webkit ) {
        transitionEnd = "webkitTransitionEnd"
       } else if ( $.browser.mozilla ) {
        transitionEnd = "transitionend"
       } else if ( $.browser.opera ) {
        transitionEnd = "oTransitionEnd"
       }
     }

   })

 /* ALERT CLASS DEFINITION
  * ====================== */

  var Alert = function ( content, options ) {
    this.settings = $.extend({}, $.fn.alert.defaults, options)
    this.$element = $(content)
      .delegate(this.settings.selector, 'click', this.close)
  }

  Alert.prototype = {

    close: function (e) {
      var $element = $(this).parent('.alert-message')

      e && e.preventDefault()
      $element.removeClass('in')

      function removeElement () {
        $element.remove()
      }

      $.support.transition && $element.hasClass('fade') ?
        $element.bind(transitionEnd, removeElement) :
        removeElement()
    }

  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function ( options ) {

    if ( options === true ) {
      return this.data('alert')
    }

    return this.each(function () {
      var $this = $(this)

      if ( typeof options == 'string' ) {
        return $this.data('alert')[options]()
      }

      $(this).data('alert', new Alert( this, options ))

    })
  }

  $.fn.alert.defaults = {
    selector: '.close'
  }

  $(document).ready(function () {
    new Alert($('body'), {
      selector: '.alert-message[data-alert] .close'
    })
  })

}( window.jQuery || window.ender );
/* ==========================================================
 * bootstrap-twipsy.js v1.4.0
 * http://twitter.github.com/bootstrap/javascript.html#twipsy
 * Adapted from the original jQuery.tipsy by Jason Frame
 * ==========================================================
 * Copyright 2011 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function( $ ) {

  "use strict"

 /* CSS TRANSITION SUPPORT (https://gist.github.com/373874)
  * ======================================================= */

  var transitionEnd

  $(document).ready(function () {

    $.support.transition = (function () {
      var thisBody = document.body || document.documentElement
        , thisStyle = thisBody.style
        , support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined
      return support
    })()

    // set CSS transition event type
    if ( $.support.transition ) {
      transitionEnd = "TransitionEnd"
      if ( $.browser.webkit ) {
      	transitionEnd = "webkitTransitionEnd"
      } else if ( $.browser.mozilla ) {
      	transitionEnd = "transitionend"
      } else if ( $.browser.opera ) {
      	transitionEnd = "oTransitionEnd"
      }
    }

  })


 /* TWIPSY PUBLIC CLASS DEFINITION
  * ============================== */

  var Twipsy = function ( element, options ) {
    this.$element = $(element)
    this.options = options
    this.enabled = true
    this.fixTitle()
  }

  Twipsy.prototype = {

    show: function() {
      var pos
        , actualWidth
        , actualHeight
        , placement
        , $tip
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animate) {
          $tip.addClass('fade')
        }

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .prependTo(document.body)

        pos = $.extend({}, this.$element.offset(), {
          width: this.$element[0].offsetWidth
        , height: this.$element[0].offsetHeight
        })

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        placement = maybeCall(this.options.placement, this, [ $tip[0], this.$element[0] ])

        switch (placement) {
          case 'below':
            tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'above':
            tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , setContent: function () {
      var $tip = this.tip()
      $tip.find('.twipsy-inner')[this.options.html ? 'html' : 'text'](this.getTitle())
      $tip[0].className = 'twipsy'
    }

  , hide: function() {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeElement () {
        $tip.remove()
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip.bind(transitionEnd, removeElement) :
        removeElement()
    }

  , fixTitle: function() {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getTitle: function() {
      var title
        , $e = this.$element
        , o = this.options

        this.fixTitle()

        if (typeof o.title == 'string') {
          title = $e.attr(o.title == 'title' ? 'data-original-title' : o.title)
        } else if (typeof o.title == 'function') {
          title = o.title.call($e[0])
        }

        title = ('' + title).replace(/(^\s*|\s*$)/, "")

        return title || o.fallback
    }

  , tip: function() {
      return this.$tip = this.$tip || $('<div class="twipsy" />').html(this.options.template)
    }

  , validate: function() {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function() {
      this.enabled = true
    }

  , disable: function() {
      this.enabled = false
    }

  , toggleEnabled: function() {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* TWIPSY PRIVATE METHODS
  * ====================== */

   function maybeCall ( thing, ctx, args ) {
     return typeof thing == 'function' ? thing.apply(ctx, args) : thing
   }

 /* TWIPSY PLUGIN DEFINITION
  * ======================== */

  $.fn.twipsy = function (options) {
    $.fn.twipsy.initWith.call(this, options, Twipsy, 'twipsy')
    return this
  }

  $.fn.twipsy.initWith = function (options, Constructor, name) {
    var twipsy
      , binder
      , eventIn
      , eventOut

    if (options === true) {
      return this.data(name)
    } else if (typeof options == 'string') {
      twipsy = this.data(name)
      if (twipsy) {
        twipsy[options]()
      }
      return this
    }

    options = $.extend({}, $.fn[name].defaults, options)

    function get(ele) {
      var twipsy = $.data(ele, name)

      if (!twipsy) {
        twipsy = new Constructor(ele, $.fn.twipsy.elementOptions(ele, options))
        $.data(ele, name, twipsy)
      }

      return twipsy
    }

    function enter() {
      var twipsy = get(this)
      twipsy.hoverState = 'in'

      if (options.delayIn == 0) {
        twipsy.show()
      } else {
        twipsy.fixTitle()
        setTimeout(function() {
          if (twipsy.hoverState == 'in') {
            twipsy.show()
          }
        }, options.delayIn)
      }
    }

    function leave() {
      var twipsy = get(this)
      twipsy.hoverState = 'out'
      if (options.delayOut == 0) {
        twipsy.hide()
      } else {
        setTimeout(function() {
          if (twipsy.hoverState == 'out') {
            twipsy.hide()
          }
        }, options.delayOut)
      }
    }

    if (!options.live) {
      this.each(function() {
        get(this)
      })
    }

    if (options.trigger != 'manual') {
      binder   = options.live ? 'live' : 'bind'
      eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus'
      eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur'
      this[binder](eventIn, enter)[binder](eventOut, leave)
    }

    return this
  }

  $.fn.twipsy.Twipsy = Twipsy

  $.fn.twipsy.defaults = {
    animate: true
  , delayIn: 0
  , delayOut: 0
  , fallback: ''
  , placement: 'above'
  , html: false
  , live: false
  , offset: 0
  , title: 'title'
  , trigger: 'hover'
  , template: '<div class="twipsy-arrow"></div><div class="twipsy-inner"></div>'
  }

  $.fn.twipsy.rejectAttrOptions = [ 'title' ]

  $.fn.twipsy.elementOptions = function(ele, options) {
    var data = $(ele).data()
      , rejects = $.fn.twipsy.rejectAttrOptions
      , i = rejects.length

    while (i--) {
      delete data[rejects[i]]
    }

    return $.extend({}, options, data)
  }

}( window.jQuery || window.ender );
/* ===========================================================
 * bootstrap-popover.js v1.4.0
 * http://twitter.github.com/bootstrap/javascript.html#popover
 * ===========================================================
 * Copyright 2011 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */



!function( $ ) {

 "use strict"

  var Popover = function ( element, options ) {
    this.$element = $(element)
    this.options = options
    this.enabled = true
    this.fixTitle()
  }

  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TWIPSY.js
     ========================================= */

  Popover.prototype = $.extend({}, $.fn.twipsy.Twipsy.prototype, {

    setContent: function () {
      var $tip = this.tip()
      $tip.find('.title')[this.options.html ? 'html' : 'text'](this.getTitle())
      $tip.find('.content p')[this.options.html ? 'html' : 'text'](this.getContent())
      $tip[0].className = 'popover'
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
       , $e = this.$element
       , o = this.options

      if (typeof this.options.content == 'string') {
        content = $e.attr(this.options.content)
      } else if (typeof this.options.content == 'function') {
        content = this.options.content.call(this.$element[0])
      }

      return content
    }

  , tip: function() {
      if (!this.$tip) {
        this.$tip = $('<div class="popover" />')
          .html(this.options.template)
      }
      return this.$tip
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (options) {
    if (typeof options == 'object') options = $.extend({}, $.fn.popover.defaults, options)
    $.fn.twipsy.initWith.call(this, options, Popover, 'popover')
    return this
  }

  $.fn.popover.defaults = $.extend({} , $.fn.twipsy.defaults, {
    placement: 'right'
  , content: 'data-content'
  , template: '<div class="arrow"></div><div class="inner"><h3 class="title"></h3><div class="content"><p></p></div></div>'
  })

  $.fn.twipsy.rejectAttrOptions.push( 'content' )

}( window.jQuery || window.ender );
/*!
* Crafty v0.4.4
* http://craftyjs.com
*
* Copyright 2010, Louis Stowasser
* Dual licensed under the MIT or GPL licenses.
*/


(function(window, undefined) {

  /**@
   * #Crafty
   * @category Core
   * Select a set of or single entities by components or an entity's ID.
   *
   * Crafty uses syntax similar to jQuery by having a selector engine to select entities by their components.
   *
   * @example
   * ~~~
   *    Crafty("MyComponent")
   *    Crafty("Hello 2D Component")
   *    Crafty("Hello, 2D, Component")
   * ~~~
   * The first selector will return all entities that has the component `MyComponent`. The second will return all entities that has `Hello` and `2D` and `Component` whereas the last will return all entities that has at least one of those components (or).
   * ~~~
   *   Crafty(1)
   * ~~~
   * Passing an integer will select the entity with that `ID`.
   *
   * Finding out the `ID` of an entity can be done by returning the property `0`.
   * ~~~
   *    var ent = Crafty.e("2D");
   *    ent[0]; //ID
   * ~~~
   */
  var Crafty = function(selector) {
    return new Crafty.fn.init(selector);
  },
      
      
      GUID = 1,
       //GUID for entity IDs
      FPS = 50,
      frame = 1,
      
      
      components = {},
       //map of components and their functions
      entities = {},
       //map of entities and their data
      handlers = {},
       //global event handlers
      onloads = [],
       //temporary storage of onload handlers
      tick, tickID,
      
      noSetter,
      
      loops = 0,
      skipTicks = 1000 / FPS,
      nextGameTick = (new Date).getTime(),
      
      
      slice = Array.prototype.slice,
      rlist = /\s*,\s*/,
      rspace = /\s+/;

  /**@
   * #Crafty Core
   * @category Core
   * Set of methods added to every single entity.
   */
  Crafty.fn = Crafty.prototype = {

    init: function(selector) {
      //select entities by component
      if (typeof selector === "string") {
        var elem = 0,
             //index elements
            e, //entity forEach
            current, and = false,
             //flags for multiple
            or = false,
            del, comps, score, i, l;

        if (selector === '*') {
          for (e in entities) {
            this[+e] = entities[e];
            elem++;
          }
          this.length = elem;
          return this;
        }

        //multiple components OR
        if (selector.indexOf(',') !== -1) {
          or = true;
          del = rlist;
          //deal with multiple components AND
        } else if (selector.indexOf(' ') !== -1) {
          and = true;
          del = rspace;
        }

        //loop over entities
        for (e in entities) {
          if (!entities.hasOwnProperty(e)) continue; //skip
          current = entities[e];

          if (and || or) { //multiple components
            comps = selector.split(del);
            i = 0;
            l = comps.length;
            score = 0;

            for (; i < l; i++) //loop over components
            if (current.__c[comps[i]]) score++; //if component exists add to score 
            //if anded comps and has all OR ored comps and at least 1
            if (and && score === l || or && score > 0) this[elem++] = +e;

          } else if (current.__c[selector]) this[elem++] = +e; //convert to int
        }

        //extend all common components
        if (elem > 0 && !and && !or) this.extend(components[selector]);
        if (comps && and) for (i = 0; i < l; i++) this.extend(components[comps[i]]);

        this.length = elem; //length is the last index (already incremented)
      } else { //Select a specific entity
        if (!selector) { //nothin passed creates God entity
          selector = 0;
          if (!(selector in entities)) entities[selector] = this;
        }

        //if not exists, return undefined
        if (!(selector in entities)) {
          this.length = 0;
          return this;
        }

        this[0] = selector;
        this.length = 1;

        //update from the cache
        if (!this.__c) this.__c = {};

        //update to the cache if NULL
        if (!entities[selector]) entities[selector] = this;
        return entities[selector]; //return the cached selector
      }

      return this;
    },

    /**@
     * #.addComponent
     * @comp Crafty Core
     * @sign public this .addComponent(String componentList)
     * @param componentList - A string of components to add seperated by a comma `,`
     * @sign public this .addComponent(String Component1[, .., String ComponentN])
     * @param Component# - Component ID to add.
     * Adds a component to the selected entities or entity. 
     *
     * Components are used to extend the functionality of entities. 
     * This means it will copy properties and assign methods to 
     * augment the functionality of the entity.
     * 
     * There are multiple methods of adding components. Passing a 
     * string with a list of component names or passing multiple 
     * arguments with the component names.
     *
     * @example
     * ~~~
     * this.addComponent("2D, Canvas");
     * this.addComponent("2D", "Canvas");
     * ~~~
     */
    addComponent: function(id) {
      var uninit = [],
          c = 0,
          ul, //array of components to init
          i = 0,
          l, comps;

      //add multiple arguments
      if (arguments.length > 1) {
        l = arguments.length;
        for (; i < l; i++) {
          this.__c[arguments[i]] = true;
          uninit.push(arguments[i]);
        }
        //split components if contains comma
      } else if (id.indexOf(',') !== -1) {
        comps = id.split(rlist);
        l = comps.length;
        for (; i < l; i++) {
          this.__c[comps[i]] = true;
          uninit.push(comps[i]);
        }
        //single component passed
      } else {
        this.__c[id] = true;
        uninit.push(id);
      }

      //extend the components
      ul = uninit.length;
      for (; c < ul; c++) {
        comp = components[uninit[c]];
        this.extend(comp);

        //if constructor, call it
        if (comp && "init" in comp) {
          comp.init.call(this);
        }
      }

      this.trigger("NewComponent", ul);
      return this;
    },

    /**@
     * #.requires
     * @comp Crafty Core
     * @sign public this .requires(String componentList)
     * @param componentList - List of components that must be added
     * Makes sure the entity has the components listed. If the entity does not
     * have the component, it will add it.
     * @see .addComponent
     */
    requires: function(list) {
      var comps = list.split(rlist),
          i = 0,
          l = comps.length,
          comp;

      //loop over the list of components and add if needed
      for (; i < l; ++i) {
        comp = comps[i];
        if (!this.has(comp)) this.addComponent(comp);
      }

      return this;
    },

    /**@
     * #.removeComponent
     * @comp Crafty Core
     * @sign public this .removeComponent(String Component[, soft])
     * @param component - Component to remove
     * @param soft - Whether to soft remove it (defaults to `true`)
     * Removes a component from an entity. A soft remove will only 
     * refrain `.has()` from returning true. Hard will remove all
     * associated properties and methods.
     */
    removeComponent: function(id, soft) {
      if (soft === false) {
        var props = components[id],
            prop;
        for (prop in props) {
          delete this[prop];
        }
      }
      delete this.__c[id];

      this.trigger("RemoveComponent", id);
      return this;
    },

    /**@
     * #.has
     * @comp Crafty Core
     * @sign public Boolean .has(String component)
     * Returns `true` or `false` depending on if the 
     * entity has the given component.
     *
     * For better performance, simply use the `.__c` object 
     * which will be `true` if the entity has the component or 
     * will not exist (or be `false`).
     */
    has: function(id) {
      return !!this.__c[id];
    },

    /**@
     * #.attr
     * @comp Crafty Core
     * @sign public this .attr(String property, * value)
     * @param property - Property of the entity to modify
     * @param value - Value to set the property to
     * @sign public this .attr(Object map)
     * @param map - Object where the key is the property to modify and the value as the property value
     * Use this method to set any property of the entity.
     * @example
     * ~~~
     * this.attr({key: "value", prop: 5});
     * this.key; //value
     * this.prop; //5
     *
     * this.attr("key", "newvalue");
     * this.key; //newvalue
     * ~~~
     */
    attr: function(key, value) {
      if (arguments.length === 1) {
        //if just the key, return the value
        if (typeof key === "string") {
          return this[key];
        }

        //extend if object
        this.extend(key);
        this.trigger("Change", key); //trigger change event
        return this;
      }
      //if key value pair
      this[key] = value;

      var change = {};
      change[key] = value;
      this.trigger("Change", change); //trigger change event
      return this;
    },

    /**@
     * #.toArray
     * @comp Crafty Core
     * @sign public this .toArray(void)
     * This method will simply return the found entities as an array.
     */
    toArray: function() {
      return slice.call(this, 0);
    },

    /**@
     * #.delay
     * @comp Crafty Core
     * @sign public this .delay(Function callback, Number delay)
     * @param callback - Method to execute after given amount of milliseconds
     * @param delay - Amount of milliseconds to execute the method
     * The delay method will execute a function after a given amount of time in milliseconds.
     *
     * Essentially a wrapper for `setTimeout`.
     *
     * @example
     * Destroy itself after 100 milliseconds
     * ~~~
     * this.delay(function() {
     this.destroy();
     * }, 100);
     * ~~~
     */
    delay: function(fn, duration) {
      this.each(function() {
        var self = this;
        setTimeout(function() {
          fn.call(self);
        }, duration);
      });
      return this;
    },

    /**@
     * #.bind
     * @comp Crafty Core
     * @sign public this .bind(String eventName, Function callback)
     * @param eventName - Name of the event to bind to
     * @param callback - Method to execute when the event is triggered
     * Attach the current entity (or entities) to listen for an event.
     *
     * Callback will be invoked when an event with the event name passed 
     * is triggered. Depending on the event, some data may be passed 
     * via an argument to the callback function.
     *
     * The first argument is the event name (can be anything) whilst the 
     * second argument is the callback. If the event has data, the 
     * callback should have an argument.
     *
     * Events are arbitrary and provide communication between components. 
     * You can trigger or bind an event even if it doesn't exist yet.
     * @example
     * ~~~
     * this.attr("triggers", 0); //set a trigger count
     * this.bind("myevent", function() {
     *     this.triggers++; //whenever myevent is triggered, increment
     * });
     * this.bind("EnterFrame", function() {
     *     this.trigger("myevent"); //trigger myevent on every frame
     * });
     * ~~~
     * @see .trigger, .unbind
     */
    bind: function(event, fn) {
      //optimization for 1 entity
      if (this.length === 1) {
        if (!handlers[event]) handlers[event] = {};
        var h = handlers[event];

        if (!h[this[0]]) h[this[0]] = []; //init handler array for entity
        h[this[0]].push(fn); //add current fn
        return this;
      }

      this.each(function() {
        //init event collection
        if (!handlers[event]) handlers[event] = {};
        var h = handlers[event];

        if (!h[this[0]]) h[this[0]] = []; //init handler array for entity
        h[this[0]].push(fn); //add current fn
      });
      return this;
    },

    /**@
     * #.unbind
     * @comp Crafty Core
     * @sign public this .unbind(String eventName[, Function callback])
     * @param eventName - Name of the event to unbind
     * @param callback - Function to unbind
     * Removes binding with an event from current entity. 
     *
     * Passing an event name will remove all events binded to 
     * that event. Passing a reference to the callback will 
     * unbind only that callback.
     * @see .bind, .trigger
     */
    unbind: function(event, fn) {
      this.each(function() {
        var hdl = handlers[event],
            i = 0,
            l, current;
        //if no events, cancel
        if (hdl && hdl[this[0]]) l = hdl[this[0]].length;
        else
        return this;

        //if no function, delete all
        if (!fn) {
          delete hdl[this[0]];
          return this;
        }
        //look for a match if the function is passed
        for (; i < l; i++) {
          current = hdl[this[0]];
          if (current[i] == fn) {
            current.splice(i, 1);
            i--;
          }
        }
      });

      return this;
    },

    /**@
     * #.trigger
     * @comp Crafty Core
     * @sign public this .trigger(String eventName[, Object data])
     * @param eventName - Event to trigger
     * @param data - Arbitrary data that will be passed into every callback as an argument
     * Trigger an event with arbitrary data. Will invoke all callbacks with 
     * the context (value of `this`) of the current entity object.
     *
     * *Note: This will only execute callbacks within the current entity, no other entity.*
     *
     * The first argument is the event name to trigger and the optional 
     * second argument is the arbitrary event data. This can be absolutely anything.
     */
    trigger: function(event, data) {
      if (this.length === 1) {
        //find the handlers assigned to the event and entity
        if (handlers[event] && handlers[event][this[0]]) {
          var fns = handlers[event][this[0]],
              i = 0,
              l = fns.length;
          for (; i < l; i++) {
            fns[i].call(this, data);
          }
        }
        return this;
      }

      this.each(function() {
        //find the handlers assigned to the event and entity
        if (handlers[event] && handlers[event][this[0]]) {
          var fns = handlers[event][this[0]],
              i = 0,
              l = fns.length;
          for (; i < l; i++) {
            fns[i].call(this, data);
          }
        }
      });
      return this;
    },

    /**@
     * #.each
     * @sign public this .each(Function method)
     * @param method - Method to call on each iteration
     * Iterates over found entities, calling a function for every entity. 
     *
     * The function will be called for every entity and will pass the index 
     * in the iteration as an argument. The context (value of `this`) of the 
     * function will be the current entity in the iteration.
     * @example
     * Destroy every second 2D entity
     * ~~~
     * Crafty("2D").each(function(i) {
     *     if(i % 2 === 0) {
     *         this.destroy();
     *     }
     * });
     * ~~~
     */
    each: function(fn) {
      var i = 0,
          l = this.length;
      for (; i < l; i++) {
        //skip if not exists
        if (!entities[this[i]]) continue;
        fn.call(entities[this[i]], i);
      }
      return this;
    },

    /**@
     * #.clone
     * @comp Crafty Core
     * @sign public Entity .clone(void)
     * @returns Cloned entity of the current entity
     * Method will create another entity with the exact same
     * properties, components and methods as the current entity.
     */
    clone: function() {
      var comps = this.__c,
          comp, prop, clone = Crafty.e();

      for (comp in comps) {
        clone.addComponent(comp);
      }
      for (prop in this) {
        clone[prop] = this[prop];
      }

      return clone;
    },

    /**@
     * #.setter
     * @comp Crafty Core
     * @sign public this .setter(String property, Function callback)
     * @param property - Property to watch for modification
     * @param callback - Method to execute if the property is modified
     * Will watch a property waiting for modification and will then invoke the
     * given callback when attempting to modify.
     *
     * *Note: Support in IE<9 is slightly different. The method will be executed
     * after the property has been set*
     */
    setter: function(prop, fn) {
      if (Crafty.support.setter) {
        this.__defineSetter__(prop, fn);
      } else if (Crafty.support.defineProperty) {
        Object.defineProperty(this, prop, {
          set: fn,
          configurable: true
        });
      } else {
        noSetter.push({
          prop: prop,
          obj: this,
          fn: fn
        });
      }
      return this;
    },

    /**@
     * #.destroy
     * @comp Crafty Core
     * @sign public this .destroy(void)
     * @triggers Remove
     * Will remove all event listeners and delete all properties as well as removing from the stage
     */
    destroy: function() {
      //remove all event handlers, delete from entities
      this.each(function() {
        this.trigger("Remove");
        for (var e in handlers) {
          this.unbind(e);
        }
        delete entities[this[0]];
      });
    }
  };

  //give the init instances the Crafty prototype
  Crafty.fn.init.prototype = Crafty.fn;

  /**
   * Extension method to extend the namespace and
   * selector instances
   */
  Crafty.extend = Crafty.fn.extend = function(obj) {
    var target = this,
        key;

    //don't bother with nulls
    if (!obj) return target;

    for (key in obj) {
      if (target === obj[key]) continue; //handle circular reference
      target[key] = obj[key];
    }

    return target;
  };

  /**@
   * #Crafty.extend
   * @category Core
   * Used to extend the Crafty namespace.
   */
  Crafty.extend({
    /**@
     * #Crafty.init
     * @category Core
     * @sign public this Crafty.init([Number width, Number height])
     * @param width - Width of the stage
     * @param height - Height of the stage
     * Starts the `EnterFrame` interval. This will call the `EnterFrame` event for every frame.
     *
     * Can pass width and height values for the stage otherwise will default to window size (see `Crafty.DOM.window`).
     *
     * All `Load` events will be executed.
     *
     * Uses `requestAnimationFrame` to sync the drawing with the browser but will default to `setInterval` if the browser does not support it.
     * @see Crafty.stop
     */
    init: function(w, h) {
      Crafty.viewport.init(w, h);

      //call all arbitrary functions attached to onload
      this.trigger("Load");
      this.timer.init();

      return this;
    },

    /**@
     * #Crafty.stop
     * @category Core
     * @sign public this Crafty.stop(void)
     * Stops the EnterFrame interval and removes the stage element.
     *
     * To restart, use `Crafty.init()`.
     * @see Crafty.init
     */
    stop: function() {
      this.timer.stop();
      Crafty.stage.elem.parentNode.removeChild(Crafty.stage.elem);

      return this;
    },

    /**@
     * #Crafty.pause
     * @comp Core
     * @sign public this Crafty.pause(void)
     * Pauses the game by stoping the EnterFrame event from firing. Pauses automatically
     * when the user navigates away from the window. This can be turned off in `Crafty.settings`.
     * @example
     * Have an entity pause the game when it is clicked.
     * ~~~
     * button.bind("click", function() {
     *  Crafty.pause(); 
     * });
     * ~~~
     */
    pause: function() {
      if (!this._paused) {
        this.trigger('Pause');
        this._paused = true;

        Crafty.timer.stop();
        Crafty.keydown = {};
      } else {
        this.trigger('Unpause');
        this._paused = false;

        Crafty.timer.init();
      }
      return this;
    },

    timer: {
      prev: (+new Date),
      current: (+new Date),
      fps: 0,

      init: function() {
        var onFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;

        if (onFrame) {
          tick = function() {
            Crafty.timer.step();
            tickID = onFrame(tick);
          }

          tick();
        } else {
          tick = setInterval(Crafty.timer.step, 1000 / FPS);
        }
      },

      stop: function() {
        Crafty.trigger("CraftyStop");

        if (typeof tick === "number") clearInterval(tick);

        var onFrame = window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || null;

        if (onFrame) onFrame(tickID);
        tick = null;
      },

      step: function() {
        loops = 0;
        while ((new Date).getTime() > nextGameTick) {
          Crafty.trigger("EnterFrame", {
            frame: frame++
          });
          nextGameTick += skipTicks;
          loops++;
        }
        if (loops) {
          Crafty.DrawManager.draw();
        }
      },

      getFPS: function() {
        return this.fps;
      }
    },

    /**@
     * #Crafty.e
     * @category Core
     * @sign public Entity Crafty.e(String componentList)
     * @param componentList - List of components to assign to new entity
     * @sign public Entity Crafty.e(String component1[, .., String componentN])
     * @param component# - Component to add
     * Creates an entity. Any arguments will be applied in the same 
     * way `.addComponent()` is applied as a quick way to add components.
     *
     * From here, any component added will augment the functionality of 
     * that entity by assigning the properties and methods to that entity. 
     */
    e: function() {
      var id = UID(),
          craft;

      entities[id] = null; //register the space
      entities[id] = craft = Crafty(id);

      if (arguments.length > 0) {
        craft.addComponent.apply(craft, arguments);
      }
      craft.addComponent("obj"); //every entity automatically assumes obj
      return craft;
    },

    /**@
     * #Crafty.c
     * @category Core
     * @sign public void Crafty.c(String name, Object component)
     * @param name - Name of the component
     * @param component - Object with the components properties and methods
     * Creates a component where the first argument is the ID and the second 
     * is the object that will be inherited by entities.
     *
     * There is a convention for writing components. For instance properties or 
     * methods that start with an underscore are considered private. A method called 
     * `init` will automatically be called as soon as the component is added to 
     * an entity. 
     * 
     * A method with the same name as the component ID is considered to be a constructor 
     * and is generally used when data is needed before executing.
     */
    c: function(id, fn) {
      components[id] = fn;
    },

    /**@
     * #Crafty.trigger
     * @category Core, Events
     * @sign public void Crafty.trigger(String eventName, * data)
     * @param eventName - Name of the event to trigger
     * @param data - Arbitrary data to pass into the callback as an argument
     * This method will trigger every single callback attached to the event name. This means
     * every global event and every entity that has a callback.
     * @see Crafty.bind
     */
    trigger: function(event, data) {
      var hdl = handlers[event],
          h, i, l;
      //loop over every object bound
      for (h in hdl) {
        if (!hdl.hasOwnProperty(h)) continue;

        //loop over every handler within object
        for (i = 0, l = hdl[h].length; i < l; i++) {
          if (hdl[h] && hdl[h][i]) {
            //if an entity, call with that context
            if (entities[h]) {
              hdl[h][i].call(Crafty(+h), data);
            } else { //else call with Crafty context
              hdl[h][i].call(Crafty, data);
            }
          }
        }
      }
    },

    /**@
     * #Crafty.bind
     * @category Core, Events
     * @sign public Number bind(String eventName, Function callback)
     * @param eventName - Name of the event to bind to
     * @param callback - Method to execute upon event triggered
     * @returns ID of the current callback used to unbind
     * Binds to a global event. Method will be executed when `Crafty.trigger` is used
     * with the event name.
     * @see Crafty.trigger, Crafty.unbind
     */
    bind: function(event, callback) {
      if (!handlers[event]) handlers[event] = {};
      var hdl = handlers[event];

      if (!hdl.global) hdl.global = [];
      return hdl.global.push(callback) - 1;
    },

    /**@
     * #Crafty.unbind
     * @category Core, Events
     * @sign public Boolean Crafty.unbind(String eventName, Function callback)
     * @param eventName - Name of the event to unbind
     * @param callback - Function to unbind
     * @sign public Boolean Crafty.unbind(String eventName, Number callbackID)
     * @param callbackID - ID of the callback
     * @returns True or false depending on if a callback was unbound
     * Unbind any event from any entity or global event.
     */
    unbind: function(event, callback) {
      var hdl = handlers[event],
          h, i, l;

      //loop over every object bound
      for (h in hdl) {
        if (!hdl.hasOwnProperty(h)) continue;

        //if passed the ID
        if (typeof callback === "number") {
          delete hdl[h][callback];
          return true;
        }

        //loop over every handler within object
        for (i = 0, l = hdl[h].length; i < l; i++) {
          if (hdl[h][i] === callback) {
            delete hdl[h][i];
            return true;
          }
        }
      }

      return false;
    },

    /**@
     * #Crafty.frame
     * @category Core
     * @sign public Number Crafty.frame(void)
     * Returns the current frame number
     */
    frame: function() {
      return frame;
    },

    components: function() {
      return components;
    },

    isComp: function(comp) {
      return comp in components;
    },

    debug: function() {
      return entities;
    },

    /**@
     * #Crafty.settings
     * @category Core
     * Modify the inner workings of Crafty through the settings.
     */
    settings: (function() {
      var states = {},
          callbacks = {};

      return {
        /**@
         * #Crafty.settings.register
         * @comp Crafty.settings
         * @sign public void Crafty.settings.register(String settingName, Function callback)
         * @param settingName - Name of the setting
         * @param callback - Function to execute when use modifies setting
         * Use this to register custom settings. Callback will be executed when `Crafty.settings.modify` is used.
         * @see Crafty.settings.modify
         */
        register: function(setting, callback) {
          callbacks[setting] = callback;
        },

        /**@
         * #Crafty.settings.modify
         * @comp Crafty.settings
         * @sign public void Crafty.settings.modify(String settingName, * value)
         * @param settingName - Name of the setting
         * @param value - Value to set the setting to
         * Modify settings through this method.
         * @see Crafty.settings.register, Crafty.settings.get
         */
        modify: function(setting, value) {
          if (!callbacks[setting]) return;
          callbacks[setting].call(states[setting], value);
          states[setting] = value;
        },

        /**@
         * #Crafty.settings.get
         * @comp Crafty.settings
         * @sign public * Crafty.settings.get(String settingName)
         * @param settingName - Name of the setting
         * @returns Current value of the setting
         * Returns the current value of the setting.
         * @see Crafty.settings.register, Crafty.settings.get
         */
        get: function(setting) {
          return states[setting];
        }
      };
    })(),

    clone: clone
  });

  /**
   * Return a unique ID
   */

  function UID() {
    var id = GUID++;
    //if GUID is not unique
    if (id in entities) {
      return UID(); //recurse until it is unique
    }
    return id;
  }

  /**
   * Clone an Object
   */

  function clone(obj) {
    if (obj === null || typeof(obj) != 'object') return obj;

    var temp = obj.constructor(); // changed
    for (var key in obj)
    temp[key] = clone(obj[key]);
    return temp;
  }

  Crafty.bind("Load", function() {
    if (!Crafty.support.setter && Crafty.support.defineProperty) {
      noSetter = [];
      Crafty.bind("EnterFrame", function() {
        var i = 0,
            l = noSetter.length,
            current;
        for (; i < l; ++i) {
          current = noSetter[i];
          if (current.obj[current.prop] !== current.obj['_' + current.prop]) {
            current.fn.call(current.obj, current.obj[current.prop]);
          }
        }
      });
    }
  });

  //make Crafty global
  window.Crafty = Crafty;
})(window);

//wrap around components
(function(Crafty, window, document) {


  /**
   * Spatial HashMap for broad phase collision
   *
   * @author Louis Stowasser
   */
  (function(parent) {

    var cellsize, HashMap = function(cell) {
      cellsize = cell || 64;
      this.map = {};
    },
        SPACE = " ";

    HashMap.prototype = {
      insert: function(obj) {
        var keys = HashMap.key(obj),
            entry = new Entry(keys, obj, this),
            i = 0,
            j, hash;

        //insert into all x buckets
        for (i = keys.x1; i <= keys.x2; i++) {
          //insert into all y buckets
          for (j = keys.y1; j <= keys.y2; j++) {
            hash = i + SPACE + j;
            if (!this.map[hash]) this.map[hash] = [];
            this.map[hash].push(obj);
          }
        }

        return entry;
      },

      search: function(rect, filter) {
        var keys = HashMap.key(rect),
            i, j, hash, results = [];

        if (filter === undefined) filter = true; //default filter to true
        //search in all x buckets
        for (i = keys.x1; i <= keys.x2; i++) {
          //insert into all y buckets
          for (j = keys.y1; j <= keys.y2; j++) {
            hash = i + SPACE + j;

            if (this.map[hash]) {
              results = results.concat(this.map[hash]);
            }
          }
        }

        if (filter) {
          var obj, id, finalresult = [],
              found = {};
          //add unique elements to lookup table with the entity ID as unique key
          for (i = 0, l = results.length; i < l; i++) {
            obj = results[i];
            if (!obj) continue; //skip if deleted
            id = obj[0]; //unique ID
            //check if not added to hash and that actually intersects
            if (!found[id] && obj.x < rect._x + rect._w && obj._x + obj._w > rect._x && obj.y < rect._y + rect._h && obj._h + obj._y > rect._y) found[id] = results[i];
          }

          //loop over lookup table and copy to final array
          for (obj in found) finalresult.push(found[obj]);

          return finalresult;
        } else {
          return results;
        }
      },

      remove: function(keys, obj) {
        var i = 0,
            j, hash;

        if (arguments.length == 1) {
          obj = keys;
          keys = HashMap.key(obj);
        }

        //search in all x buckets
        for (i = keys.x1; i <= keys.x2; i++) {
          //insert into all y buckets
          for (j = keys.y1; j <= keys.y2; j++) {
            hash = i + SPACE + j;

            if (this.map[hash]) {
              var cell = this.map[hash],
                  m = 0,
                  n = cell.length;
              //loop over objs in cell and delete
              for (; m < n; m++) if (cell[m] && cell[m][0] === obj[0]) cell.splice(m, 1);
            }
          }
        }
      }
    };

    HashMap.key = function(obj) {
      if (obj.hasOwnProperty('mbr')) {
        obj = obj.mbr();
      }
      var x1 = ~~ (obj._x / cellsize),
          y1 = ~~ (obj._y / cellsize),
          x2 = ~~ ((obj._w + obj._x) / cellsize),
          y2 = ~~ ((obj._h + obj._y) / cellsize);
      return {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
      };
    };

    HashMap.hash = function(keys) {
      return keys.x1 + SPACE + keys.y1 + SPACE + keys.x2 + SPACE + keys.y2;
    };

    function Entry(keys, obj, map) {
      this.keys = keys;
      this.map = map;
      this.obj = obj;
    }

    Entry.prototype = {
      update: function(rect) {
        //check if buckets change
        if (HashMap.hash(HashMap.key(rect)) != HashMap.hash(this.keys)) {
          this.map.remove(this.keys, this.obj);
          var e = this.map.insert(this.obj);
          this.keys = e.keys;
        }
      }
    };

    parent.HashMap = HashMap;
  })(Crafty);

  Crafty.map = new Crafty.HashMap();
  var M = Math,
      Mc = M.cos,
      Ms = M.sin,
      PI = M.PI,
      DEG_TO_RAD = PI / 180;


  /**@
   * #2D
   * @comp 2D
   * Component for any entity that has a position on the stage.
   */
  Crafty.c("2D", {
    /**@
     * #.x
     * The `x` position on the stage. When modified, will automatically be redrawn.
     * Is actually a getter/setter so when using this value for calculations and not modifying it,
     * use the `._x` property.
     */
    _x: 0,
    /**@
     * #.y
     * The `y` position on the stage. When modified, will automatically be redrawn.
     * Is actually a getter/setter so when using this value for calculations and not modifying it,
     * use the `._y` property.
     */
    _y: 0,
    /**@
     * #.w
     * The width of the entity. When modified, will automatically be redrawn.
     * Is actually a getter/setter so when using this value for calculations and not modifying it,
     * use the `._w` property.
     *
     * Changing this value is not recommended as canvas has terrible resize quality and DOM will just clip the image.
     */
    _w: 0,
    /**@
     * #.x
     * The height of the entity. When modified, will automatically be redrawn.
     * Is actually a getter/setter so when using this value for calculations and not modifying it,
     * use the `._h` property.
     *
     * Changing this value is not recommended as canvas has terrible resize quality and DOM will just clip the image.
     */
    _h: 0,
    /**@
     * #.z
     * The `z` index on the stage. When modified, will automatically be redrawn.
     * Is actually a getter/setter so when using this value for calculations and not modifying it,
     * use the `._z` property.
     *
     * A higher `z` value will be closer to the front of the stage. A smaller `z` value will be closer to the back.
     * A global Z index is produced based on its `z` value as well as the GID (which entity was created first).
     * Therefore entities will naturally maintain order depending on when it was created if same z value.
     */
    _z: 0,
    /**@
     * #.rotation
     * Set the rotation of your entity. Rotation takes degrees in a clockwise direction.
     * It is important to note there is no limit on the rotation value. Setting a rotation 
     * mod 360 will give the same rotation without reaching huge numbers.
     */
    _rotation: 0,
    /**@
     * #.alpha
     * Transparency of an entity. Must be a decimal value between 0.0 being fully transparent to 1.0 being fully opaque.
     */
    _alpha: 1.0,
    /**@
     * #.visible
     * If the entity is visible or not. Accepts a true or false value.
     * Can be used for optimization by setting an entities visibility to false when not needed to be drawn.
     *
     * The entity will still exist and can be collided with but just won't be drawn.
     */
    _visible: true,
    _global: null,

    _origin: null,
    _mbr: null,
    _entry: null,
    _children: null,
    _parent: null,
    _changed: false,

    init: function() {
      this._global = this[0];
      this._origin = {
        x: 0,
        y: 0
      };
      this._children = [];

      if (Crafty.support.setter) {
        //create getters and setters
        this.__defineSetter__('x', function(v) {
          this._attr('_x', v);
        });
        this.__defineSetter__('y', function(v) {
          this._attr('_y', v);
        });
        this.__defineSetter__('w', function(v) {
          this._attr('_w', v);
        });
        this.__defineSetter__('h', function(v) {
          this._attr('_h', v);
        });
        this.__defineSetter__('z', function(v) {
          this._attr('_z', v);
        });
        this.__defineSetter__('rotation', function(v) {
          this._attr('_rotation', v);
        });
        this.__defineSetter__('alpha', function(v) {
          this._attr('_alpha', v);
        });
        this.__defineSetter__('visible', function(v) {
          this._attr('_visible', v);
        });

        this.__defineGetter__('x', function() {
          return this._x;
        });
        this.__defineGetter__('y', function() {
          return this._y;
        });
        this.__defineGetter__('w', function() {
          return this._w;
        });
        this.__defineGetter__('h', function() {
          return this._h;
        });
        this.__defineGetter__('z', function() {
          return this._z;
        });
        this.__defineGetter__('rotation', function() {
          return this._rotation;
        });
        this.__defineGetter__('alpha', function() {
          return this._alpha;
        });
        this.__defineGetter__('visible', function() {
          return this._visible;
        });
        this.__defineGetter__('parent', function() {
          return this._parent;
        });
        this.__defineGetter__('numChildren', function() {
          return this._children.length;
        });

        //IE9 supports Object.defineProperty
      } else if (Crafty.support.defineProperty) {

        Object.defineProperty(this, 'x', {
          set: function(v) {
            this._attr('_x', v);
          },
          get: function() {
            return this._x;
          }
        });
        Object.defineProperty(this, 'y', {
          set: function(v) {
            this._attr('_y', v);
          },
          get: function() {
            return this._y;
          }
        });
        Object.defineProperty(this, 'w', {
          set: function(v) {
            this._attr('_w', v);
          },
          get: function() {
            return this._w;
          }
        });
        Object.defineProperty(this, 'h', {
          set: function(v) {
            this._attr('_h', v);
          },
          get: function() {
            return this._h;
          }
        });
        Object.defineProperty(this, 'z', {
          set: function(v) {
            this._attr('_z', v);
          },
          get: function() {
            return this._z;
          }
        });

        Object.defineProperty(this, 'rotation', {
          set: function(v) {
            this._attr('_rotation', v);
          },
          get: function() {
            return this._rotation;
          }
        });

        Object.defineProperty(this, 'alpha', {
          set: function(v) {
            this._attr('_alpha', v);
          },
          get: function() {
            return this._alpha;
          }
        });

        Object.defineProperty(this, 'visible', {
          set: function(v) {
            this._attr('_visible', v);
          },
          get: function() {
            return this._visible;
          }
        });

      } else {
/*
            if no setters, check on every frame for a difference 
            between this._(x|y|w|h|z...) and this.(x|y|w|h|z)
            */

        //set the public properties to the current private properties
        this.x = this._x;
        this.y = this._y;
        this.w = this._w;
        this.h = this._h;
        this.z = this._z;
        this.rotation = this._rotation;
        this.alpha = this._alpha;
        this.visible = this._visible;

        //on every frame check for a difference in any property
        this.bind("EnterFrame", function() {
          //if there are differences between the public and private properties
          if (this.x !== this._x || this.y !== this._y || this.w !== this._w || this.h !== this._h || this.z !== this._z || this.rotation !== this._rotation || this.alpha !== this._alpha || this.visible !== this._visible) {

            //save the old positions
            var old = this.mbr() || this.pos();

            //if rotation has changed, use the private rotate method
            if (this.rotation !== this._rotation) {
              this._rotate(this.rotation);
            } else {
              //update the MBR
              var mbr = this._mbr,
                  moved = false;
              if (mbr) { //check each value to see which has changed
                if (this.x !== this._x) {
                  mbr._x -= this.x - this._x;
                  moved = true;
                } else if (this.y !== this._y) {
                  mbr._y -= this.y - this._y;
                  moved = true;
                } else if (this.w !== this._w) {
                  mbr._w -= this.w - this._w;
                  moved = true;
                } else if (this.h !== this._h) {
                  mbr._h -= this.h - this._h;
                  moved = true;
                } else if (this.z !== this._z) {
                  mbr._z -= this.z - this._z;
                  moved = true;
                }
              }

              //if the moved flag is true, trigger a move
              if (moved) this.trigger("Move", old);
            }

            //set the public properties to the private properties
            this._x = this.x;
            this._y = this.y;
            this._w = this.w;
            this._h = this.h;
            this._z = this.z;
            this._rotation = this.rotation;
            this._alpha = this.alpha;
            this._visible = this.visible;

            //trigger the changes
            this.trigger("Change", old);
            //without this entities weren't added correctly to Crafty.map.map in IE8.
            //not entirely sure this is the best way to fix it though
            this.trigger("Move", old);
          }
        });
      }

      //insert self into the HashMap
      this._entry = Crafty.map.insert(this);

      //when object changes, update HashMap
      this.bind("Move", function(e) {
        var area = this._mbr || this;
        this._entry.update(area);
        this._cascade(e);
      });

      this.bind("Rotate", function(e) {
        var old = this._mbr || this;
        this._entry.update(old);
        this._cascade(e);
      });

      //when object is removed, remove from HashMap
      this.bind("Remove", function() {
        Crafty.map.remove(this);

        this.detach();
      });
    },

    /**
     * Calculates the MBR when rotated with an origin point
     */
    _rotate: function(v) {
      var theta = -1 * (v % 360),
           //angle always between 0 and 359
          rad = theta * DEG_TO_RAD,
          ct = Math.cos(rad),
           //cache the sin and cosine of theta
          st = Math.sin(rad),
          o = {
          x: this._origin.x + this._x,
          y: this._origin.y + this._y
          };

      //if the angle is 0 and is currently 0, skip
      if (!theta) {
        this._mbr = null;
        if (!this._rotation % 360) return;
      }

      var x0 = o.x + (this._x - o.x) * ct + (this._y - o.y) * st,
          y0 = o.y - (this._x - o.x) * st + (this._y - o.y) * ct,
          x1 = o.x + (this._x + this._w - o.x) * ct + (this._y - o.y) * st,
          y1 = o.y - (this._x + this._w - o.x) * st + (this._y - o.y) * ct,
          x2 = o.x + (this._x + this._w - o.x) * ct + (this._y + this._h - o.y) * st,
          y2 = o.y - (this._x + this._w - o.x) * st + (this._y + this._h - o.y) * ct,
          x3 = o.x + (this._x - o.x) * ct + (this._y + this._h - o.y) * st,
          y3 = o.y - (this._x - o.x) * st + (this._y + this._h - o.y) * ct,
          minx = Math.floor(Math.min(x0, x1, x2, x3)),
          miny = Math.floor(Math.min(y0, y1, y2, y3)),
          maxx = Math.ceil(Math.max(x0, x1, x2, x3)),
          maxy = Math.ceil(Math.max(y0, y1, y2, y3));

      this._mbr = {
        _x: minx,
        _y: miny,
        _w: maxx - minx,
        _h: maxy - miny
      };

      //trigger rotation event
      var difference = this._rotation - v,
          drad = difference * DEG_TO_RAD;

      this.trigger("Rotate", {
        cos: Math.cos(drad),
        sin: Math.sin(drad),
        deg: difference,
        rad: drad,
        o: {
          x: o.x,
          y: o.y
        },
        matrix: {
          M11: ct,
          M12: st,
          M21: -st,
          M22: ct
        }
      });
    },

    /**@
     * #.area
     * @comp 2D
     * @sign public Number .area(void)
     * Calculates the area of the entity
     */
    area: function() {
      return this._w * this._h;
    },

    /**@
     * #.intersect
     * @comp 2D
     * @sign public Boolean .intersect(Number x, Number y, Number w, Number h)
     * @param x - X position of the rect
     * @param y - Y position of the rect
     * @param w - Width of the rect
     * @param h - Height of the rect
     * @sign public Boolean .intersect(Object rect)
     * @param rect - An object that must have the `x, y, w, h` values as properties
     * Determines if this entity intersects a rectangle.
     */
    intersect: function(x, y, w, h) {
      var rect, obj = this._mbr || this;
      if (typeof x === "object") {
        rect = x;
      } else {
        rect = {
          x: x,
          y: y,
          w: w,
          h: h
        };
      }

      return obj._x < rect.x + rect.w && obj._x + obj._w > rect.x && obj._y < rect.y + rect.h && obj._h + obj._y > rect.y;
    },

    /**@
     * #.within
     * @comp 2D
     * @sign public Boolean .within(Number x, Number y, Number w, Number h)
     * @param x - X position of the rect
     * @param y - Y position of the rect
     * @param w - Width of the rect
     * @param h - Height of the rect
     * @sign public Boolean .within(Object rect)
     * @param rect - An object that must have the `x, y, w, h` values as properties
     * Determines if this current entity is within another rectangle.
     */
    within: function(x, y, w, h) {
      var rect;
      if (typeof x === "object") {
        rect = x;
      } else {
        rect = {
          x: x,
          y: y,
          w: w,
          h: h
        };
      }

      return rect.x <= this.x && rect.x + rect.w >= this.x + this.w && rect.y <= this.y && rect.y + rect.h >= this.y + this.h;
    },

    /**@
     * #.contains
     * @comp 2D
     * @sign public Boolean .contains(Number x, Number y, Number w, Number h)
     * @param x - X position of the rect
     * @param y - Y position of the rect
     * @param w - Width of the rect
     * @param h - Height of the rect
     * @sign public Boolean .contains(Object rect)
     * @param rect - An object that must have the `x, y, w, h` values as properties
     * Determines if the rectangle is within the current entity.
     */
    contains: function(x, y, w, h) {
      var rect;
      if (typeof x === "object") {
        rect = x;
      } else {
        rect = {
          x: x,
          y: y,
          w: w,
          h: h
        };
      }

      return rect.x >= this.x && rect.x + rect.w <= this.x + this.w && rect.y >= this.y && rect.y + rect.h <= this.y + this.h;
    },

    /**@
     * #.pos
     * @comp 2D
     * @sign public Object .pos(void)
     * Returns the x, y, w, h properties as a rect object 
     * (a rect object is just an object with the keys _x, _y, _w, _h).
     *
     * The keys have an underscore prefix. This is due to the x, y, w, h 
     * properties being merely setters and getters that wrap the properties with an underscore (_x, _y, _w, _h).
     */
    pos: function() {
      return {
        _x: (this._x),
        _y: (this._y),
        _w: (this._w),
        _h: (this._h)
      };
    },

    /**
     * Returns the minimum bounding rectangle. If there is no rotation
     * on the entity it will return the rect.
     */
    mbr: function() {
      if (!this._mbr) return this.pos();
      return {
        _x: (this._mbr._x),
        _y: (this._mbr._y),
        _w: (this._mbr._w),
        _h: (this._mbr._h)
      };
    },

    /**@
     * #.isAt
     * @comp 2D
     * @sign public Boolean .isAt(Number x, Number y)
     * @param x - X position of the point
     * @param y - Y position of the point
     * Determines whether a point is contained by the entity. Unlike other methods, 
     * an object can't be passed. The arguments require the x and y value
     */
    isAt: function(x, y) {
      if (this.map) {
        return this.map.containsPoint(x, y);
      }
      return this.x <= x && this.x + this.w >= x && this.y <= y && this.y + this.h >= y;
    },

    /**@
     * #.move
     * @comp 2D
     * @sign public this .move(String dir, Number by)
     * @param dir - Direction to move (n,s,e,w,ne,nw,se,sw)
     * @param by - Amount to move in the specified direction
     * Quick method to move the entity in a direction (n, s, e, w, ne, nw, se, sw) by an amount of pixels.
     */
    move: function(dir, by) {
      if (dir.charAt(0) === 'n') this.y -= by;
      if (dir.charAt(0) === 's') this.y += by;
      if (dir === 'e' || dir.charAt(1) === 'e') this.x += by;
      if (dir === 'w' || dir.charAt(1) === 'w') this.x -= by;

      return this;
    },

    /**@
     * #.shift
     * @comp 2D
     * @sign public this .shift(Number x, Number y, Number w, Number h)
     * @param x - Amount to move X 
     * @param y - Amount to move Y
     * @param w - Amount to widen
     * @param h - Amount to increase height
     * Shift or move the entity by an amount. Use negative values
     * for an opposite direction.
     */
    shift: function(x, y, w, h) {
      if (x) this.x += x;
      if (y) this.y += y;
      if (w) this.w += w;
      if (h) this.h += h;

      return this;
    },

    /**
     * Move or rotate all the children for this entity
     */
    _cascade: function(e) {
      if (!e) return; //no change in position
      var i = 0,
          children = this._children,
          l = children.length,
          obj;
      //rotation
      if (e.cos) {
        for (; i < l; ++i) {
          obj = children[i];
          if ('rotate' in obj) obj.rotate(e);
        }
      } else {
        //use MBR or current
        var rect = this._mbr || this,
            dx = rect._x - e._x,
            dy = rect._y - e._y,
            dw = rect._w - e._w,
            dh = rect._h - e._h;

        for (; i < l; ++i) {
          obj = children[i];
          obj.shift(dx, dy, dw, dh);
        }
      }
    },

    /**
     * #.attach
     * @comp 2D
     * @sign public this .attach(Entity obj[, .., Entity objN])
     * @param obj - Entity(s) to attach
     * Attaches an entities position and rotation to current entity. When the current entity moves, 
     * the attached entity will move by the same amount.
     *
     * As many objects as wanted can be attached and a hierarchy of objects is possible by attaching.
     */
    attach: function() {
      var i = 0,
          arg = arguments,
          l = arguments.length,
          obj;
      for (; i < l; ++i) {
        obj = arg[i];
        if (obj._parent) {
          obj._parent.detach(obj);
        }
        obj._parent = this;
        this._children.push(obj);
      }

      return this;
    },

    /**@
     * #.detach
     * @comp 2D
     * @sign public this .detach([Entity obj])
     * @param obj - The entity to detach. Left blank will remove all attached entities
     * Stop an entity from following the current entity. Passing no arguments will stop
     * every entity attached.
     */
    detach: function(obj) {
      //if nothing passed, remove all attached objects
      if (!obj) {
        for (var i = 0; i < this._children.length; i++) {
          this._children[i]._parent = null;
        }
        this._children = [];
        return this;
      }

      //if obj passed, find the handler and unbind
      for (var i = 0; i < this._children.length; i++) {
        if (this._children[i] == obj) {
          this._children.splice(i, 1);
        }
      }
      obj._parent = null;

      return this;
    },

    /**@
     * #.origin
     * @comp 2D
     * @sign public this .origin(Number x, Number y)
     * @param x - Pixel value of origin offset on the X axis
     * @param y - Pixel value of origin offset on the Y axis
     * @sign public this .origin(String offset)
     * @param offset - Combination of center, top, bottom, middle, left and right
     * Set the origin point of an entity for it to rotate around. 
     * @example
     * ~~~
     * this.origin("top left")
     * this.origin("center")
     * this.origin("bottom right")
     * this.origin("middle right")
     * ~~~
     * @see .rotation
     */
    origin: function(x, y) {
      //text based origin
      if (typeof x === "string") {
        if (x === "centre" || x === "center" || x.indexOf(' ') === -1) {
          x = this._w / 2;
          y = this._h / 2;
        } else {
          var cmd = x.split(' ');
          if (cmd[0] === "top") y = 0;
          else if (cmd[0] === "bottom") y = this._h;
          else if (cmd[0] === "middle" || cmd[1] === "center" || cmd[1] === "centre") y = this._h / 2;

          if (cmd[1] === "center" || cmd[1] === "centre" || cmd[1] === "middle") x = this._w / 2;
          else if (cmd[1] === "left") x = 0;
          else if (cmd[1] === "right") x = this._w;
        }
      }

      this._origin.x = x;
      this._origin.y = y;

      return this;
    },

    flip: function(dir) {
      dir = dir || "X";
      this["_flip" + dir] = true;
      this.trigger("Change");
    },

    /**
     * Method for rotation rather than through a setter
     */
    rotate: function(e) {
      //assume event data origin
      this._origin.x = e.o.x - this._x;
      this._origin.y = e.o.y - this._y;

      //modify through the setter method
      this._attr('_rotation', e.theta);
    },

    /**
     * Setter method for all 2D properties including 
     * x, y, w, h, alpha, rotation and visible.
     */
    _attr: function(name, value) {
      //keep a reference of the old positions
      var pos = this.pos(),
          old = this.mbr() || pos;

      //if rotation, use the rotate method
      if (name === '_rotation') {
        this._rotate(value);
        //set the global Z and trigger reorder just incase
      } else if (name === '_z') {
        this._global = parseInt(value + Crafty.zeroFill(this[0], 5), 10); //magic number 10e5 is the max num of entities
        this.trigger("reorder");
        //if the rect bounds change, update the MBR and trigger move
      } else if (name == '_x' || name === '_y' || name === '_w' || name === '_h') {
        var mbr = this._mbr;
        if (mbr) {
          mbr[name] -= this[name] - value;
        }
        this[name] = value;
        this.trigger("Move", old);
      }

      //everything will assume the value
      this[name] = value;

      //trigger a change
      this.trigger("Change", old);
    }
  });

  Crafty.c("Physics", {
    _gravity: 0.4,
    _friction: 0.2,
    _bounce: 0.5,

    gravity: function(gravity) {
      this._gravity = gravity;
    }
  });

  Crafty.c("Gravity", {
    _gravity: 0.2,
    _gy: 0,
    _falling: true,
    _anti: null,

    init: function() {
      this.requires("2D");
    },

    gravity: function(comp) {
      if (comp) this._anti = comp;

      this.bind("EnterFrame", this._enterframe);

      return this;
    },

    _enterframe: function() {
      if (this._falling) {
        //if falling, move the players Y
        this._gy += this._gravity * 2;
        this.y += this._gy;
      } else {
        this._gy = 0; //reset change in y
      }

      var obj, hit = false,
          pos = this.pos(),
          q, i = 0,
          l;

      //Increase by 1 to make sure map.search() finds the floor
      pos._y++;

      //map.search wants _x and intersect wants x...
      pos.x = pos._x;
      pos.y = pos._y;
      pos.w = pos._w;
      pos.h = pos._h;

      q = Crafty.map.search(pos);
      l = q.length;

      for (; i < l; ++i) {
        obj = q[i];
        //check for an intersection directly below the player
        if (obj !== this && obj.has(this._anti) && obj.intersect(pos)) {
          hit = obj;
          break;
        }
      }

      if (hit) { //stop falling if found
        if (this._falling) this.stopFalling(hit);
      } else {
        this._falling = true; //keep falling otherwise
      }
    },

    stopFalling: function(e) {
      if (e) this.y = e._y - this._h; //move object
      //this._gy = -1 * this._bounce;
      this._falling = false;
      if (this._up) this._up = false;
      this.trigger("hit");
    },

    antigravity: function() {
      this.unbind("EnterFrame", this._enterframe);
    }
  });

  /**@
   * #Crafty.Polygon
   * @category 2D
   * Polygon object used for hitboxes and click maps. Must pass an Array for each point as an
   * argument where index 0 is the x position and index 1 is the y position.
   *
   * For example one point of a polygon will look like this: `[0,5]` where the `x` is `0` and the `y` is `5`.
   *
   * Can pass an array of the points or simply put each point as an argument.
   *
   * When creating a polygon for an entity, each point should be offset or relative from the entities `x` and `y`
   * (don't include the absolute values as it will automatically calculate this).
   */
  Crafty.polygon = function(poly) {
    if (arguments.length > 1) {
      poly = Array.prototype.slice.call(arguments, 0);
    }
    this.points = poly;
  };

  Crafty.polygon.prototype = {
    /**@
     * #.containsPoint
     * @comp Crafty.Polygon
     * @sign public Boolean .containsPoint(Number x, Number y)
     * @param x - X position of the point
     * @param y - Y position of the point
     * Method is used to determine if a given point is contained by the polygon.
     * @example
     * ~~~
     * var poly = new Crafty.polygon([50,0],[100,100],[0,100]);
     * poly.containsPoint(50, 50); //TRUE
     * poly.containsPoint(0, 0); //FALSE
     * ~~~
     */
    containsPoint: function(x, y) {
      var p = this.points,
          i, j, c = false;

      for (i = 0, j = p.length - 1; i < p.length; j = i++) {
        if (((p[i][1] > y) != (p[j][1] > y)) && (x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0])) {
          c = !c;
        }
      }

      return c;
    },

    /**@
     * #.shift
     * @comp Crafty.Polygon
     * @sign public void .shift(Number x, Number y)
     * @param x - Amount to shift the `x` axis
     * @param y - Amount to shift the `y` axis
     * Shifts every single point in the polygon by the specified amount.
     * @example
     * ~~~
     * var poly = new Crafty.polygon([50,0],[100,100],[0,100]);
     * poly.shift(5,5);
     * //[[55,5], [105,5], [5,105]];
     * ~~~
     */
    shift: function(x, y) {
      var i = 0,
          l = this.points.length,
          current;
      for (; i < l; i++) {
        current = this.points[i];
        current[0] += x;
        current[1] += y;
      }
    },

    rotate: function(e) {
      var i = 0,
          l = this.points.length,
          current, x, y;

      for (; i < l; i++) {
        current = this.points[i];

        x = e.o.x + (current[0] - e.o.x) * e.cos + (current[1] - e.o.y) * e.sin;
        y = e.o.y - (current[0] - e.o.x) * e.sin + (current[1] - e.o.y) * e.cos;

        current[0] = Math.floor(x);
        current[1] = Math.floor(y);
      }
    }
  };

  /**@
   * #Crafty.Circle
   * @category 2D
   * Circle object used for hitboxes and click maps. Must pass a `x`, a `y` and a `radius` value.
   *
   * ~~~
   * var centerX = 5,
   *     centerY = 10,
   *     radius = 25;
   *
   * new Crafty.circle(centerX, centerY, radius);
   * ~~~
   *
   * When creating a circle for an entity, each point should be offset or relative from the entities `x` and `y`
   * (don't include the absolute values as it will automatically calculate this).
   */
  Crafty.circle = function(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    // Creates an octogon that aproximate the circle for backward compatibility.
    this.points = [];
    var theta;

    for (var i = 0; i < 8; i++) {
      theta = i * Math.PI / 4;
      this.points[i] = [Math.sin(theta) * radius, Math.cos(theta) * radius];
    }
  };

  Crafty.circle.prototype = {
    /**@
     * #.containsPoint
     * @comp Crafty.Circle
     * @sign public Boolean .containsPoint(Number x, Number y)
     * @param x - X position of the point
     * @param y - Y position of the point
     * Method is used to determine if a given point is contained by the circle.
     * @example
     * ~~~
     * var circle = new Crafty.circle(0, 0, 10);
     * circle.containsPoint(0, 0); //TRUE
     * circle.containsPoint(50, 50); //FALSE
     * ~~~
     */
    containsPoint: function(x, y) {
      var radius = this.radius,
          sqrt = Math.sqrt,
          deltaX = this.x - x,
          deltaY = this.y - y;

      return (deltaX * deltaX + deltaY * deltaY) < (radius * radius);
    },

    /**@
     * #.shift
     * @comp Crafty.Circle
     * @sign public void .shift(Number x, Number y)
     * @param x - Amount to shift the `x` axis
     * @param y - Amount to shift the `y` axis
     * Shifts the circle by the specified amount.
     * @example
     * ~~~
     * var poly = new Crafty.circle(0, 0, 10);
     * circle.shift(5,5);
     * //{x: 5, y: 5, radius: 10};
     * ~~~
     */
    shift: function(x, y) {
      this.x += x;
      this.y += y;

      var i = 0,
          l = this.points.length,
          current;
      for (; i < l; i++) {
        current = this.points[i];
        current[0] += x;
        current[1] += y;
      }
    },

    rotate: function() {
      // We are a circle, we don't have to rotate :)
    }
  };


  Crafty.matrix = function(m) {
    this.mtx = m;
    this.width = m[0].length;
    this.height = m.length;
  };

  Crafty.matrix.prototype = {
    x: function(other) {
      if (this.width != other.height) {
        return;
      }

      var result = [];
      for (var i = 0; i < this.height; i++) {
        result[i] = [];
        for (var j = 0; j < other.width; j++) {
          var sum = 0;
          for (var k = 0; k < this.width; k++) {
            sum += this.mtx[i][k] * other.mtx[k][j];
          }
          result[i][j] = sum;
        }
      }
      return new Crafty.matrix(result);
    },


    e: function(row, col) {
      //test if out of bounds
      if (row < 1 || row > this.mtx.length || col < 1 || col > this.mtx[0].length) return null;
      return this.mtx[row - 1][col - 1];
    }
  }

  /**@
   * #Collision
   * @category 2D
   * Component to detect collision between any two convex polygons.
   */
  Crafty.c("Collision", {

    init: function() {
      this.requires("2D");
    },

    /**@
     * #.collision
     * @comp Collision
     * @sign public this .collision([Crafty.Polygon polygon])
     * @param polygon - Crafty.Polygon object that will act as the hit area
     * Constructor takes a polygon to use as the hit area. If left empty, 
     * will create a rectangle polygon based on the x, y, w, h dimensions.
     *
     * This must be called before any .hit() or .onhit() methods.
     *
     * The hit area (polygon) must be a convex shape and not concave 
     * for the collision detection to work.
     * @example
     * ~~~
     * Crafty.e("2D, Collision").collision(
     *     new Crafty.polygon([50,0], [100,100], [0,100])
     * );
     * ~~~
     * @see Crafty.Polygon
     */
    collision: function(poly) {
      var area = this._mbr || this;

      //if no polygon presented, create a square
      if (!poly) {
        poly = new Crafty.polygon([0, 0], [area._w, 0], [area._w, area._h], [0, area._h]);
      }
      this.map = poly;
      this.attach(this.map);
      this.map.shift(area._x, area._y);

      return this;
    },

    /**@
     * #.hit
     * @comp Collision
     * @sign public Boolean/Array hit(String component)
     * @param component - Check collision with entities that has this component
     * @return `false` if no collision. If a collision is detected, returns an Array of objects that are colliding.
     * Takes an argument for a component to test collision for. If a collision is found, an array of 
     * every object in collision along with the amount of overlap is passed.
     *
     * If no collision, will return false. The return collision data will be an Array of Objects with the 
     * type of collision used, the object collided and if the type used was SAT (a polygon was used as the hitbox) then an amount of overlap.
     * ~~~
     * [{
     *    obj: [entity],
     *    type "MBR" or "SAT",
     *    overlap: [number]
     * }]
     * ~~~
     * `MBR` is your standard axis aligned rectangle intersection (`.intersect` in the 2D component). 
     * `SAT` is collision between any convex polygon.
     * @see .onHit, 2D
     */
    hit: function(comp) {
      var area = this._mbr || this,
          results = Crafty.map.search(area, false),
          i = 0,
          l = results.length,
          dupes = {},
          id, obj, oarea, key, hasMap = ('map' in this && 'containsPoint' in this.map),
          finalresult = [];

      if (!l) {
        return false;
      }

      for (; i < l; ++i) {
        obj = results[i];
        oarea = obj._mbr || obj; //use the mbr
        if (!obj) continue;
        id = obj[0];

        //check if not added to hash and that actually intersects
        if (!dupes[id] && this[0] !== id && obj.__c[comp] && oarea._x < area._x + area._w && oarea._x + oarea._w > area._x && oarea._y < area._y + area._h && oarea._h + oarea._y > area._y) dupes[id] = obj;
      }

      for (key in dupes) {
        obj = dupes[key];

        if (hasMap && 'map' in obj) {
          var SAT = this._SAT(this.map, obj.map);
          SAT.obj = obj;
          SAT.type = "SAT";
          if (SAT) finalresult.push(SAT);
        } else {
          finalresult.push({
            obj: obj,
            type: "MBR"
          });
        }
      }

      if (!finalresult.length) {
        return false;
      }

      return finalresult;
    },

    /**@
     * #.onHit
     * @comp Collision
     * @sign public this .onHit(String component, Function hit[, Function noHit])
     * @param component - Component to check collisions for
     * @param hit - Callback method to execute when collided with component
     * @param noHit - Callback method executed once as soon as collision stops
     * Creates an enterframe event calling .hit() each time and if collision detected will invoke the callback.
     * @see .hit
     */
    onHit: function(comp, fn, fnOff) {
      var justHit = false;
      this.bind("EnterFrame", function() {
        var hitdata = this.hit(comp);
        if (hitdata) {
          justHit = true;
          fn.call(this, hitdata);
        } else if (justHit) {
          if (typeof fnOff == 'function') {
            fnOff.call(this);
          }
          justHit = false;
        }
      });
      return this;
    },

    _SAT: function(poly1, poly2) {
      var points1 = poly1.points,
          points2 = poly2.points,
          i = 0,
          l = points1.length,
          j, k = points2.length,
          normal = {
          x: 0,
          y: 0
          },
          length, min1, min2, max1, max2, interval, MTV = null,
          MTV2 = 0,
          MN = null,
          dot, nextPoint, currentPoint;

      //loop through the edges of Polygon 1
      for (; i < l; i++) {
        nextPoint = points1[(i == l - 1 ? 0 : i + 1)];
        currentPoint = points1[i];

        //generate the normal for the current edge
        normal.x = -(nextPoint[1] - currentPoint[1]);
        normal.y = (nextPoint[0] - currentPoint[0]);

        //normalize the vector
        length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
        normal.x /= length;
        normal.y /= length;

        //default min max
        min1 = min2 = -1;
        max1 = max2 = -1;

        //project all vertices from poly1 onto axis
        for (j = 0; j < l; ++j) {
          dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
          if (dot > max1 || max1 === -1) max1 = dot;
          if (dot < min1 || min1 === -1) min1 = dot;
        }

        //project all vertices from poly2 onto axis
        for (j = 0; j < k; ++j) {
          dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
          if (dot > max2 || max2 === -1) max2 = dot;
          if (dot < min2 || min2 === -1) min2 = dot;
        }

        //calculate the minimum translation vector should be negative
        interval = (min1 < min2) ? min2 - max1 : min1 - max2;

        //exit early if positive
        if (interval > 0) {
          return false;
        }
        if (interval > MTV || MTV === null) MTV = interval;
      }

      //loop through the edges of Polygon 1
      for (i = 0; i < k; i++) {
        nextPoint = points2[(i == k - 1 ? 0 : i + 1)];
        currentPoint = points2[i];

        //generate the normal for the current edge
        normal.x = -(nextPoint[1] - currentPoint[1]);
        normal.y = (nextPoint[0] - currentPoint[0]);

        //normalize the vector
        length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
        normal.x /= length;
        normal.y /= length;

        //default min max
        min1 = min2 = -1;
        max1 = max2 = -1;

        //project all vertices from poly1 onto axis
        for (j = 0; j < l; ++j) {
          dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
          if (dot > max1 || max1 === -1) max1 = dot;
          if (dot < min1 || min1 === -1) min1 = dot;
        }

        //project all vertices from poly2 onto axis
        for (j = 0; j < k; ++j) {
          dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
          if (dot > max2 || max2 === -1) max2 = dot;
          if (dot < min2 || min2 === -1) min2 = dot;
        }

        //calculate the minimum translation vector should be negative
        interval = (min1 < min2) ? min2 - max1 : min1 - max2;

        //exit early if positive
        if (interval > 0) {
          return false;
        }
        if (interval > MTV || MTV === null) MTV = interval;
        if (interval < MTV2) {
          MTV2 = interval;
          MN = {
            x: normal.x,
            y: normal.y
          };
        }
      }

      return {
        overlap: MTV,
        normal: MN
      };
    }
  });


  /**@
   * #DOM
   * @category Graphics
   * Draws entities as DOM nodes, specifically `<DIV>`s.
   */
  Crafty.c("DOM", {
    /**@
     * #._element
     * @comp DOM
     * The DOM element used to represent the entity.
     */
    _element: null,

    init: function() {
      this._element = document.createElement("div");
      Crafty.stage.inner.appendChild(this._element);
      this._element.style.position = "absolute";
      this._element.id = "ent" + this[0];

      this.bind("Change", function() {
        if (!this._changed) {
          this._changed = true;
          Crafty.DrawManager.add(this);
        }
      });

      function updateClass() {
        var i = 0,
            c = this.__c,
            str = "";
        for (i in c) {
          str += ' ' + i;
        }
        str = str.substr(1);
        this._element.className = str;
      }

      this.bind("NewComponent", updateClass).bind("RemoveComponent", updateClass);

      if (Crafty.support.prefix === "ms" && Crafty.support.version < 9) {
        this._filters = {};

        this.bind("Rotate", function(e) {
          var m = e.matrix,
              elem = this._element.style,
              M11 = m.M11.toFixed(8),
              M12 = m.M12.toFixed(8),
              M21 = m.M21.toFixed(8),
              M22 = m.M22.toFixed(8);

          this._filters.rotation = "progid:DXImageTransform.Microsoft.Matrix(M11=" + M11 + ", M12=" + M12 + ", M21=" + M21 + ", M22=" + M22 + ",sizingMethod='auto expand')";
        });
      }

      this.bind("Remove", this.undraw);
    },

    /**@
     * #.DOM
     * @comp DOM
     * @sign public this .DOM(HTMLElement elem)
     * @param elem - HTML element that will replace the dynamically created one
     * Pass a DOM element to use rather than one created. Will set `._element` to this value. Removes the old element.
     */
    DOM: function(elem) {
      if (elem && elem.nodeType) {
        this.undraw();
        this._element = elem;
        this._element.style.position = 'absolute';
      }
      return this;
    },

    /**@
     * #.draw
     * @comp DOM
     * @sign public this .draw(void)
     * @triggers Draw
     * Updates the CSS properties of the node to draw on the stage.
     */
    draw: function() {
      var style = this._element.style,
          coord = this.__coord || [0, 0, 0, 0],
          co = {
          x: coord[0],
          y: coord[1]
          },
          prefix = Crafty.support.prefix,
          trans = [];

      if (!this._visible) style.visibility = "hidden";
      else style.visibility = "visible";

/*<<<<<<< HEAD
        //utilize CSS3 if supported
        if(Crafty.support.css3dtransform) {
            trans.push("translate3d("+(~~this._x)+"px,"+(~~this._y)+"px,0)");
        } else {
            style.left = ~~(this._x) + "px";
            style.top = ~~(this._y) + "px";
        }
        
=======*/
      if (Crafty.support.css3dtransform) trans.push("translate3d(" + (~~this._x) + "px," + (~~this._y) + "px,0)");
      else {
        style.top = Number(this._y) + "px";
        style.left = Number(this._x) + "px";
        //trans.push("translate("+(~~this._x)+"px,"+(~~this._y)+"px,0)");
      }
      //>>>>>>> 48ba1ac29df667845aac2e829f6024c0603a4ea6
      style.width = ~~ (this._w) + "px";
      style.height = ~~ (this._h) + "px";
      style.zIndex = this._z;

      style.opacity = this._alpha;
      style[prefix + "Opacity"] = this._alpha;

      //if not version 9 of IE
      if (prefix === "ms" && Crafty.support.version < 9) {
        //for IE version 8, use ImageTransform filter
        if (Crafty.support.version === 8) {
          this._filters.alpha = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (this._alpha * 100) + ")"; // first!
          //all other versions use filter
        } else {
          this._filters.alpha = "alpha(opacity=" + (this._alpha * 100) + ")";
        }
      }

      if (this._mbr) {
        var origin = this._origin.x + "px " + this._origin.y + "px";
        style.transformOrigin = origin;
        style[prefix + "TransformOrigin"] = origin;
        if (Crafty.support.css3dtransform) trans.push("rotateZ(" + this._rotation + "deg)");
        else trans.push("rotate(" + this._rotation + "deg)");
      }

      if (this._flipX) {
        trans.push("scaleX(-1)");
        if (prefix === "ms" && Crafty.support.version < 9) {
          this._filters.flipX = "fliph";
        }
      }

      if (this._flipY) {
        trans.push("scaleY(-1)");
        if (prefix === "ms" && Crafty.support.version < 9) {
          this._filters.flipY = "flipv";
        }
      }

      //apply the filters if IE
      if (prefix === "ms" && Crafty.support.version < 9) {
        this.applyFilters();
      }

      style.transform = trans.join(" ");
      style[prefix + "Transform"] = trans.join(" ");

      this.trigger("Draw", {
        style: style,
        type: "DOM",
        co: co
      });

      return this;
    },

    applyFilters: function() {
      this._element.style.filter = "";
      var str = "";

      for (var filter in this._filters) {
        if (!this._filters.hasOwnProperty(filter)) continue;
        str += this._filters[filter] + " ";
      }

      this._element.style.filter = str;
    },

    /**@
     * #.undraw
     * @comp DOM
     * @sign public this .undraw(void)
     * Removes the element from the stage.
     */
    undraw: function() {
      Crafty.stage.inner.removeChild(this._element);
      return this;
    },

    /**@
     * #.css
     * @comp DOM
     * @sign public * css(String property, String value)
     * @param property - CSS property to modify
     * @param value - Value to give the CSS property
     * @sign public * css(Object map)
     * @param map - Object where the key is the CSS property and the value is CSS value
     * Apply CSS styles to the element. 
     *
     * Can pass an object where the key is the style property and the value is style value.
     *
     * For setting one style, simply pass the style as the first argument and the value as the second.
     *
     * The notation can be CSS or JS (e.g. `text-align` or `textAlign`).
     *
     * To return a value, pass the property.
     * @example
     * ~~~
     * this.css({'text-align', 'center', font: 'Arial'});
     * this.css("textAlign", "center");
     * this.css("text-align"); //returns center
     * ~~~
     */
    css: function(obj, value) {
      var key, elem = this._element,
          val, style = elem.style;

      //if an object passed
      if (typeof obj === "object") {
        for (key in obj) {
          if (!obj.hasOwnProperty(key)) continue;
          val = obj[key];
          if (typeof val === "number") val += 'px';

          style[Crafty.DOM.camelize(key)] = val;
        }
      } else {
        //if a value is passed, set the property
        if (value) {
          if (typeof value === "number") value += 'px';
          style[Crafty.DOM.camelize(obj)] = value;
        } else { //otherwise return the computed property
          return Crafty.DOM.getStyle(elem, obj);
        }
      }

      this.trigger("Change");

      return this;
    }
  });

  /**
   * Fix IE6 background flickering
   */
  try {
    document.execCommand("BackgroundImageCache", false, true);
  } catch (e) {}

  Crafty.extend({
    /**@
     * #Crafty.DOM
     * @category Graphics
     * Collection of utilities for using the DOM.
     */
    DOM: {
      /**@
       * #Crafty.DOM.window
       * @comp Crafty.DOM
       * Object with `width` and `height` values representing the width
       * and height of the `window`.
       */
      window: {
        init: function() {
          this.width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth);
          this.height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);
        },

        width: 0,
        height: 0
      },

      /**@
       * #Crafty.DOM.inner
       * @comp Crafty.DOM
       * @sign public Object Crafty.DOM.inner(HTMLElement obj)
       * @param obj - HTML element to calculate the position
       * @returns Object with `x` key being the `x` position, `y` being the `y` position
       * Find a DOM elements position including
       * padding and border.
       */
      inner: function(obj) {
        var rect = obj.getBoundingClientRect(),
            x = rect.left + (window.pageXOffset ? window.pageXOffset : document.body.scrollTop),
            y = rect.top + (window.pageYOffset ? window.pageYOffset : document.body.scrollLeft),
            borderX, borderY;

        //border left
        borderX = parseInt(this.getStyle(obj, 'border-left-width') || 0, 10);
        borderY = parseInt(this.getStyle(obj, 'border-top-width') || 0, 10);
        if (!borderX || !borderY) { //JS notation for IE
          borderX = parseInt(this.getStyle(obj, 'borderLeftWidth') || 0, 10);
          borderY = parseInt(this.getStyle(obj, 'borderTopWidth') || 0, 10);
        }

        x += borderX;
        y += borderY;

        return {
          x: x,
          y: y
        };
      },

      /**@
       * #Crafty.DOM.getStyle
       * @comp Crafty.DOM
       * @sign public Object Crafty.DOM.getStyle(HTMLElement obj, String property)
       * @param obj - HTML element to find the style
       * @param property - Style to return
       * Determine the value of a style on an HTML element. Notation can be
       * in either CSS or JS.
       */
      getStyle: function(obj, prop) {
        var result;
        if (obj.currentStyle) result = obj.currentStyle[this.camelize(prop)];
        else if (window.getComputedStyle) result = document.defaultView.getComputedStyle(obj, null).getPropertyValue(this.csselize(prop));
        return result;
      },

      /**
       * Used in the Zepto framework
       *
       * Converts CSS notation to JS notation
       */
      camelize: function(str) {
        return str.replace(/-+(.)?/g, function(match, chr) {
          return chr ? chr.toUpperCase() : ''
        });
      },

      /**
       * Converts JS notation to CSS notation
       */
      csselize: function(str) {
        return str.replace(/[A-Z]/g, function(chr) {
          return chr ? '-' + chr.toLowerCase() : ''
        });
      },

      /**@
       * #Crafty.DOM.translate
       * @comp Crafty.DOM
       * @sign public Object Crafty.DOM.translate(Number x, Number y)
       * @param x - x position to translate
       * @param y - y position to translate
       * @return Object with x and y as keys and translated values
       *
       * Method will translate x and y positions to positions on the
       * stage. Useful for mouse events with `e.clientX` and `e.clientY`.
       */
      translate: function(x, y) {
        return {
          x: x - Crafty.stage.x + document.body.scrollLeft + document.documentElement.scrollLeft - Crafty.viewport._x,
          y: y - Crafty.stage.y + document.body.scrollTop + document.documentElement.scrollTop - Crafty.viewport._y
        }
      }
    }
  });

  /**@
   * #HTML
   * @category Graphics
   * Component allow for insertion of arbitrary HTML into an entity
   */
  Crafty.c("HTML", {
    inner: '',

    init: function() {
      this.requires('2D, DOM');
    },

    /**@
     * #.replace
     * @comp HTML
     * @sign public this .replace(String html)
     * @param html - arbitrary html
     * This method will replace the content of this entity with the supplied html
     *
     * @example
     * Create a link
     * ~~~
     * Crafty.e("HTML")
     *    .attr({x:20, y:20, w:100, h:100})
     *    .replace("<a href='http://www.craftyjs.com'>Crafty.js</a>");
     * ~~~
     */
    replace: function(new_html) {
      this.inner = new_html;
      this._element.innerHTML = new_html;
    },

    /**@
     * #.replace
     * @comp HTML
     * @sign public this .append(String html)
     * @param html - arbitrary html
     * This method will add the supplied html in the beginning of the entity
     *
     * @example
     * Create a link
     * ~~~
     * Crafty.e("HTML")
     *    .attr({x:20, y:20, w:100, h:100})
     *    .append("<a href='http://www.craftyjs.com'>Crafty.js</a>");
     * ~~~
     */
    append: function(new_html) {
      this.inner += new_html;
      this._element.innerHTML += new_html;
    },

    /**@
     * #.replace
     * @comp HTML
     * @sign public this .prepend(String html)
     * @param html - arbitrary html
     * This method will add the supplied html in the end of the entity
     *
     * @example
     * Create a link
     * ~~~
     * Crafty.e("HTML")
     *    .attr({x:20, y:20, w:100, h:100})
     *    .prepend("<a href='http://www.craftyjs.com'>Crafty.js</a>");
     * ~~~
     */
    prepend: function(new_html) {
      this.inner = new_html + this.inner;
      this._element.innerHTML = new_html + this.inner;
    }
  });

  Crafty.extend({
    /**@
     * #Crafty.randRange
     * @category Misc
     * @sign public Number Crafty.randRange(Number from, Number to)
     * @param from - Lower bound of the range
     * @param to - Upper bound of the range
     * Returns a random number between (and including) the two numbers.
     */
    randRange: function(from, to) {
      return Math.floor(Math.random() * (to - from + 1) + from);
    },

    zeroFill: function(number, width) {
      width -= number.toString().length;
      if (width > 0) return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
      return number.toString();
    },

    /**@
     * #Crafty.sprite
     * @category Graphics
     * @sign public this Crafty.sprite([Number tile], String url, Object map[, Number paddingX[, Number paddingY]])
     * @param tile - Tile size of the sprite map, defaults to 1
     * @param url - URL of the sprite image
     * @param map - Object where the key is what becomes a new component and the value points to a position on the sprite map
     * @param paddingX - Horizontal space inbetween tiles. Defaults to 0.
     * @param paddingY - Vertical space inbetween tiles. Defaults to paddingX.
     * Generates components based on positions in a sprite image to be applied to entities.
     *
     * Accepts a tile size, URL and map for the name of the sprite and it's position. 
     *
     * The position must be an array containing the position of the sprite where index `0` 
     * is the `x` position, `1` is the `y` position and optionally `2` is the width and `3` 
     * is the height. If the sprite map has padding, pass the values for the `x` padding 
     * or `y` padding. If they are the same, just add one value.
     *
     * If the sprite image has no consistent tile size, `1` or no argument need be 
     * passed for tile size.
     *
     * Entities that add the generated components are also given a component called `Sprite`.
     * @see Sprite
     */
    sprite: function(tile, tileh, url, map, paddingX, paddingY) {
      var pos, temp, x, y, w, h, img;

      //if no tile value, default to 16
      if (typeof tile === "string") {
        map = url;
        url = tileh;
        tile = 1;
        tileh = 1;
      }

      if (typeof tileh == "string") {
        map = url;
        url = tileh;
        tileh = tile;
      }

      //if no paddingY, use paddingX
      if (!paddingY && paddingX) paddingY = paddingX;
      paddingX = parseInt(paddingX || 0, 10); //just incase
      paddingY = parseInt(paddingY || 0, 10);

      img = Crafty.assets[url];
      if (!img) {
        img = new Image();
        img.src = url;
        Crafty.assets[url] = img;
        img.onload = function() {
          //all components with this img are now ready
          for (var pos in map) {
            Crafty(pos).each(function() {
              this.ready = true;
              this.trigger("Change");
            });
          }
        };
      }

      for (pos in map) {
        if (!map.hasOwnProperty(pos)) continue;

        temp = map[pos];
        x = temp[0] * (tile + paddingX);
        y = temp[1] * (tileh + paddingY);
        w = temp[2] * tile || tile;
        h = temp[3] * tileh || tileh;

        /**@
         * #Sprite
         * @category Graphics
         * Component for using tiles in a sprite map.
         */
        Crafty.c(pos, {
          ready: false,
          __coord: [x, y, w, h],

          init: function() {
            this.requires("Sprite");
            this.__trim = [0, 0, 0, 0];
            this.__image = url;
            this.__coord = [this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3]];
            this.__tile = tile;
            this.__tileh = tileh;
            this.__padding = [paddingX, paddingY];
            this.img = img;

            //draw now
            if (this.img.complete && this.img.width > 0) {
              this.ready = true;
              this.trigger("Change");
            }

            //set the width and height to the sprite size
            this.w = this.__coord[2];
            this.h = this.__coord[3];
          }
        });
      }

      return this;
    },

    _events: {},

    /**@
     * #Crafty.addEvent
     * @category Events, Misc
     * @sign public this Crafty.addEvent(Object ctx, HTMLElement obj, String event, Function callback)
     * @param ctx - Context of the callback or the value of `this`
     * @param obj - Element to add the DOM event to
     * @param event - Event name to bind to
     * @param callback - Method to execute when triggered
     * Adds DOM level 3 events to elements. The arguments it accepts are the call 
     * context (the value of `this`), the DOM element to attach the event to, 
     * the event name (without `on` (`click` rather than `onclick`)) and 
     * finally the callback method. 
     *
     * If no element is passed, the default element will be `window.document`.
     * 
     * Callbacks are passed with event data.
     * @see Crafty.removeEvent
     */
    addEvent: function(ctx, obj, type, fn) {
      if (arguments.length === 3) {
        fn = type;
        type = obj;
        obj = window.document;
      }

      //save anonymous function to be able to remove
      var afn = function(e) {
        var e = e || window.event;
        fn.call(ctx, e)
      },
          id = ctx[0] || "";

      if (!this._events[id + obj + type + fn]) this._events[id + obj + type + fn] = afn;
      else
      return;

      if (obj.attachEvent) { //IE
        obj.attachEvent('on' + type, afn);
      } else { //Everyone else
        obj.addEventListener(type, afn, false);
      }
    },

    /**@
     * #Crafty.removeEvent
     * @category Events, Misc
     * @sign public this Crafty.removeEvent(Object ctx, HTMLElement obj, String event, Function callback)
     * @param ctx - Context of the callback or the value of `this`
     * @param obj - Element the event is on
     * @param event - Name of the event
     * @param callback - Method executed when triggered
     * Removes events attached by `Crafty.addEvent()`. All parameters must 
     * be the same that were used to attach the event including a reference 
     * to the callback method.
     * @see Crafty.addEvent
     */
    removeEvent: function(ctx, obj, type, fn) {
      if (arguments.length === 3) {
        fn = type;
        type = obj;
        obj = window.document;
      }

      //retrieve anonymouse function
      var id = ctx[0] || "",
          afn = this._events[id + obj + type + fn];

      if (afn) {
        if (obj.detachEvent) {
          obj.detachEvent('on' + type, afn);
        } else obj.removeEventListener(type, afn, false);
        delete this._events[id + obj + type + fn];
      }
    },

    /**@
     * #Crafty.background
     * @category Graphics, Stage
     * @sign public void Crafty.background(String value)
     * @param color - Modify the background with a color or image
     * This method is essentially a shortcut for adding a background
     * style to the stage element.
     */
    background: function(color) {
      Crafty.stage.elem.style.background = color;
    },

    /**@
     * #Crafty.viewport
     * @category Stage
     * Viewport is essentially a 2D camera looking at the stage. Can be moved which
     * in turn will react just like a camera moving in that direction.
     */
    viewport: {
      width: 0,
      height: 0,
      /**@
       * #Crafty.viewport.x
       * @comp Crafty.viewport
       * Will move the stage and therefore every visible entity along the `x` 
       * axis in the opposite direction.
       *
       * When this value is set, it will shift the entire stage. This means that entity 
       * positions are not exactly where they are on screen. To get the exact position, 
       * simply add `Crafty.viewport.x` onto the entities `x` position.
       */
      _x: 0,
      /**@
       * #Crafty.viewport.y
       * @comp Crafty.viewport
       * Will move the stage and therefore every visible entity along the `y` 
       * axis in the opposite direction.
       *
       * When this value is set, it will shift the entire stage. This means that entity 
       * positions are not exactly where they are on screen. To get the exact position, 
       * simply add `Crafty.viewport.y` onto the entities `y` position.
       */
      _y: 0,

      scroll: function(axis, v) {
        v = Math.floor(v);
        var change = (v - this[axis]),
             //change in direction
            context = Crafty.canvas.context,
            style = Crafty.stage.inner.style,
            canvas;

        //update viewport and DOM scroll
        this[axis] = v;
        if (axis == '_x') {
          if (context) context.translate(change, 0);
        } else {
          if (context) context.translate(0, change);
        }
        if (context) Crafty.DrawManager.drawAll();
        style[axis == '_x' ? "left" : "top"] = ~~v + "px";
      },

      rect: function() {
        return {
          _x: -this._x,
          _y: -this._y,
          _w: this.width,
          _h: this.height
        };
      },

      init: function(w, h) {
        Crafty.DOM.window.init();

        //fullscreen if mobile or not specified
        this.width = (!w || Crafty.mobile) ? Crafty.DOM.window.width : w;
        this.height = (!h || Crafty.mobile) ? Crafty.DOM.window.height : h;

        //check if stage exists
        var crstage = document.getElementById("cr-stage");

        //create stage div to contain everything
        Crafty.stage = {
          x: 0,
          y: 0,
          fullscreen: false,
          elem: (crstage ? crstage : document.createElement("div")),
          inner: document.createElement("div")
        };

        //fullscreen, stop scrollbars
        if ((!w && !h) || Crafty.mobile) {
          document.body.style.overflow = "hidden";
          Crafty.stage.fullscreen = true;
        }

        Crafty.addEvent(this, window, "resize", function() {
          Crafty.DOM.window.init();
          var w = Crafty.DOM.window.width,
              h = Crafty.DOM.window.height,
              offset;


          if (Crafty.stage.fullscreen) {
            this.width = w;
            this.height = h;
            Crafty.stage.elem.style.width = w + "px";
            Crafty.stage.elem.style.height = h + "px";

            if (Crafty._canvas) {
              Crafty._canvas.width = w + "px";
              Crafty._canvas.height = h + "px";
              Crafty.DrawManager.drawAll();
            }
          }

          offset = Crafty.DOM.inner(Crafty.stage.elem);
          Crafty.stage.x = offset.x;
          Crafty.stage.y = offset.y;
        });

        Crafty.addEvent(this, window, "blur", function() {
          if (Crafty.settings.get("autoPause")) {
            Crafty.pause();
          }
        });
        Crafty.addEvent(this, window, "focus", function() {
          if (Crafty._paused) {
            Crafty.pause();
          }
        });

        //make the stage unselectable
        Crafty.settings.register("stageSelectable", function(v) {
          Crafty.stage.elem.onselectstart = v ?
          function() {
            return true;
          } : function() {
            return false;
          };
        });
        Crafty.settings.modify("stageSelectable", false);

        //make the stage have no context menu
        Crafty.settings.register("stageContextMenu", function(v) {
          Crafty.stage.elem.oncontextmenu = v ?
          function() {
            return true;
          } : function() {
            return false;
          };
        });
        Crafty.settings.modify("stageContextMenu", false);

        Crafty.settings.register("autoPause", function() {});
        Crafty.settings.modify("autoPause", false);

        //add to the body and give it an ID if not exists
        if (!crstage) {
          document.body.appendChild(Crafty.stage.elem);
          Crafty.stage.elem.id = "cr-stage";
        }

        var elem = Crafty.stage.elem.style,
            offset;

        Crafty.stage.elem.appendChild(Crafty.stage.inner);
        Crafty.stage.inner.style.position = "absolute";
        Crafty.stage.inner.style.zIndex = "1";

        //css style
        elem.width = this.width + "px";
        elem.height = this.height + "px";
        elem.overflow = "hidden";

        if (Crafty.mobile) {
          elem.position = "absolute";
          elem.left = "0px";
          elem.top = "0px";

          var meta = document.createElement("meta"),
              head = document.getElementsByTagName("HEAD")[0];

          //stop mobile zooming and scrolling
          meta.setAttribute("name", "viewport");
          meta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no");
          head.appendChild(meta);

          //hide the address bar
          meta = document.createElement("meta");
          meta.setAttribute("name", "apple-mobile-web-app-capable");
          meta.setAttribute("content", "yes");
          head.appendChild(meta);
          setTimeout(function() {
            window.scrollTo(0, 1);
          }, 0);

          Crafty.addEvent(this, window, "touchmove", function(e) {
            e.preventDefault();
          });

          Crafty.stage.x = 0;
          Crafty.stage.y = 0;

        } else {
          elem.position = "relative";
          //find out the offset position of the stage
          offset = Crafty.DOM.inner(Crafty.stage.elem);
          Crafty.stage.x = offset.x;
          Crafty.stage.y = offset.y;
        }

        if (Crafty.support.setter) {
          //define getters and setters to scroll the viewport
          this.__defineSetter__('x', function(v) {
            this.scroll('_x', v);
          });
          this.__defineSetter__('y', function(v) {
            this.scroll('_y', v);
          });
          this.__defineGetter__('x', function() {
            return this._x;
          });
          this.__defineGetter__('y', function() {
            return this._y;
          });
          //IE9
        } else if (Crafty.support.defineProperty) {
          Object.defineProperty(this, 'x', {
            set: function(v) {
              this.scroll('_x', v);
            },
            get: function() {
              return this._x;
            }
          });
          Object.defineProperty(this, 'y', {
            set: function(v) {
              this.scroll('_y', v);
            },
            get: function() {
              return this._y;
            }
          });
        } else {
          //create empty entity waiting for enterframe
          this.x = this._x;
          this.y = this._y;
          Crafty.e("viewport");
        }
      }
    },

    support: {},

    /**@
     * #Crafty.keys
     * @category Input
     * Object of key names and the corresponding key code.
     * ~~~
     * BACKSPACE: 8,
     * TAB: 9,
     * ENTER: 13,
     * PAUSE: 19,
     * CAPS: 20,
     * ESC: 27,
     * SPACE: 32,
     * PAGE_UP: 33,
     * PAGE_DOWN: 34,
     * END: 35,
     * HOME: 36,
     * LEFT_ARROW: 37,
     * UP_ARROW: 38,
     * RIGHT_ARROW: 39,
     * DOWN_ARROW: 40,
     * INSERT: 45,
     * DELETE: 46,
     * 0: 48,
     * 1: 49,
     * 2: 50,
     * 3: 51,
     * 4: 52,
     * 5: 53,
     * 6: 54,
     * 7: 55,
     * 8: 56,
     * 9: 57,
     * A: 65,
     * B: 66,
     * C: 67,
     * D: 68,
     * E: 69,
     * F: 70,
     * G: 71,
     * H: 72,
     * I: 73,
     * J: 74,
     * K: 75,
     * L: 76,
     * M: 77,
     * N: 78,
     * O: 79,
     * P: 80,
     * Q: 81,
     * R: 82,
     * S: 83,
     * T: 84,
     * U: 85,
     * V: 86,
     * W: 87,
     * X: 88,
     * Y: 89,
     * Z: 90,
     * NUMPAD_0: 96,
     * NUMPAD_1: 97,
     * NUMPAD_2: 98,
     * NUMPAD_3: 99,
     * NUMPAD_4: 100,
     * NUMPAD_5: 101,
     * NUMPAD_6: 102,
     * NUMPAD_7: 103,
     * NUMPAD_8: 104,
     * NUMPAD_9: 105,
     * MULTIPLY: 106,
     * ADD: 107,
     * SUBSTRACT: 109,
     * DECIMAL: 110,
     * DIVIDE: 111,
     * F1: 112,
     * F2: 113,
     * F3: 114,
     * F4: 115,
     * F5: 116,
     * F6: 117,
     * F7: 118,
     * F8: 119,
     * F9: 120,
     * F10: 121,
     * F11: 122,
     * F12: 123,
     * SHIFT: 16,
     * CTRL: 17,
     * ALT: 18,
     * PLUS: 187,
     * COMMA: 188,
     * MINUS: 189,
     * PERIOD: 190 
     * ~~~
     */
    keys: {
      'BACKSPACE': 8,
      'TAB': 9,
      'ENTER': 13,
      'PAUSE': 19,
      'CAPS': 20,
      'ESC': 27,
      'SPACE': 32,
      'PAGE_UP': 33,
      'PAGE_DOWN': 34,
      'END': 35,
      'HOME': 36,
      'LEFT_ARROW': 37,
      'UP_ARROW': 38,
      'RIGHT_ARROW': 39,
      'DOWN_ARROW': 40,
      'INSERT': 45,
      'DELETE': 46,
      '0': 48,
      '1': 49,
      '2': 50,
      '3': 51,
      '4': 52,
      '5': 53,
      '6': 54,
      '7': 55,
      '8': 56,
      '9': 57,
      'A': 65,
      'B': 66,
      'C': 67,
      'D': 68,
      'E': 69,
      'F': 70,
      'G': 71,
      'H': 72,
      'I': 73,
      'J': 74,
      'K': 75,
      'L': 76,
      'M': 77,
      'N': 78,
      'O': 79,
      'P': 80,
      'Q': 81,
      'R': 82,
      'S': 83,
      'T': 84,
      'U': 85,
      'V': 86,
      'W': 87,
      'X': 88,
      'Y': 89,
      'Z': 90,
      'NUMPAD_0': 96,
      'NUMPAD_1': 97,
      'NUMPAD_2': 98,
      'NUMPAD_3': 99,
      'NUMPAD_4': 100,
      'NUMPAD_5': 101,
      'NUMPAD_6': 102,
      'NUMPAD_7': 103,
      'NUMPAD_8': 104,
      'NUMPAD_9': 105,
      'MULTIPLY': 106,
      'ADD': 107,
      'SUBSTRACT': 109,
      'DECIMAL': 110,
      'DIVIDE': 111,
      'F1': 112,
      'F2': 113,
      'F3': 114,
      'F4': 115,
      'F5': 116,
      'F6': 117,
      'F7': 118,
      'F8': 119,
      'F9': 120,
      'F10': 121,
      'F11': 122,
      'F12': 123,
      'SHIFT': 16,
      'CTRL': 17,
      'ALT': 18,
      'PLUS': 187,
      'COMMA': 188,
      'MINUS': 189,
      'PERIOD': 190
    }
  });

  /**@
   * #Crafty.support
   * @category Misc, Core
   * Determines feature support for what Crafty can do.
   */
  (function testSupport() {
    var support = Crafty.support,
        ua = navigator.userAgent.toLowerCase(),
        match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(o)pera(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(ms)ie ([\w.]+)/.exec(ua) || /(moz)illa(?:.*? rv:([\w.]+))?/.exec(ua) || [],
        mobile = /iPad|iPod|iPhone|Android|webOS/i.exec(ua);

    if (mobile) Crafty.mobile = mobile[0];

    /**@
     * #Crafty.support.setter
     * @comp Crafty.support
     * Is `__defineSetter__` supported?
     */
    support.setter = ('__defineSetter__' in this && '__defineGetter__' in this);

    /**@
     * #Crafty.support.defineProperty
     * @comp Crafty.support
     * Is `Object.defineProperty` supported?
     */
    support.defineProperty = (function() {
      if (!'defineProperty' in Object) return false;
      try {
        Object.defineProperty({}, 'x', {});
      } catch (e) {
        return false
      };
      return true;
    })();

    /**@
     * #Crafty.support.audio
     * @comp Crafty.support
     * Is HTML5 `Audio` supported?
     */
    support.audio = ('Audio' in window);

    /**@
     * #Crafty.support.prefix
     * @comp Crafty.support
     * Returns the browser specific prefix (`Moz`, `O`, `ms`, `webkit`).
     */
    support.prefix = (match[1] || match[0]);

    //browser specific quirks
    if (support.prefix === "moz") support.prefix = "Moz";
    if (support.prefix === "o") support.prefix = "O";

    if (match[2]) {
      /**@
       * #Crafty.support.versionName
       * @comp Crafty.support
       * Version of the browser
       */
      support.versionName = match[2];

      /**@
       * #Crafty.support.version
       * @comp Crafty.support
       * Version number of the browser as an Integer (first number)
       */
      support.version = +(match[2].split("."))[0];
    }

    /**@
     * #Crafty.support.canvas
     * @comp Crafty.support
     * Is the `canvas` element supported?
     */
    support.canvas = ('getContext' in document.createElement("canvas"));

    support.css3dtransform = (typeof document.createElement("div").style[support.prefix + "Perspective"] !== "undefined");
  })();

  /**
   * Entity fixes the lack of setter support
   */
  Crafty.c("viewport", {
    init: function() {
      this.bind("EnterFrame", function() {
        if (Crafty.viewport._x !== Crafty.viewport.x) {
          Crafty.viewport.scroll('_x', Crafty.viewport.x);
        }

        if (Crafty.viewport._y !== Crafty.viewport.y) {
          Crafty.viewport.scroll('_y', Crafty.viewport.y);
        }
      });
    }
  });


  /**@
   * #Sprite
   * @category Graphics
   * Component for using tiles in a sprite map.
   */
  Crafty.c("Sprite", {
    __image: '',
    __tile: 0,
    __tileh: 0,
    __padding: null,
    __trim: null,
    img: null,
    ready: false,

    init: function() {
      this.__trim = [0, 0, 0, 0];

      var draw = function(e) {
        var co = e.co,
            pos = e.pos,
            context = e.ctx;

        if (e.type === "canvas") {
          //draw the image on the canvas element
          context.drawImage(this.img, //image element
          co.x, //x position on sprite
          co.y, //y position on sprite
          co.w, //width on sprite
          co.h, //height on sprite
          pos._x, //x position on canvas
          pos._y, //y position on canvas
          pos._w, //width on canvas
          pos._h //height on canvas
          );
        } else if (e.type === "DOM") {
          this._element.style.background = "url('" + this.__image + "') no-repeat -" + co.x + "px -" + co.y + "px";
        }
      };

      this.bind("Draw", draw).bind("RemoveComponent", function(id) {
        if (id === "Sprite") this.unbind("Draw", draw);
      });
    },

    /**@
     * #.sprite
     * @comp Sprite
     * @sign public this .sprite(Number x, Number y, Number w, Number h)
     * @param x - X cell position 
     * @param y - Y cell position
     * @param w - Width in cells
     * @param h - Height in cells
     * Uses a new location on the sprite map as its sprite.
     *
     * Values should be in tiles or cells (not pixels).
     */
    sprite: function(x, y, w, h) {
      this.__coord = [x * this.__tile + this.__padding[0] + this.__trim[0], y * this.__tileh + this.__padding[1] + this.__trim[1], this.__trim[2] || w * this.__tile || this.__tile, this.__trim[3] || h * this.__tileh || this.__tileh];

      this.trigger("Change");
      return this;
    },

    /**@
     * #.crop
     * @comp Sprite
     * @sign public this .crop(Number x, Number y, Number w, Number h)
     * @param x - Offset x position
     * @param y - Offset y position
     * @param w - New width
     * @param h - New height
     * If the entity needs to be smaller than the tile size, use this method to crop it.
     *
     * The values should be in pixels rather than tiles.
     */
    crop: function(x, y, w, h) {
      var old = this._mbr || this.pos();
      this.__trim = [];
      this.__trim[0] = x;
      this.__trim[1] = y;
      this.__trim[2] = w;
      this.__trim[3] = h;

      this.__coord[0] += x;
      this.__coord[1] += y;
      this.__coord[2] = w;
      this.__coord[3] = h;
      this._w = w;
      this._h = h;

      this.trigger("Change", old);
      return this;
    }
  });

  /**@
   * #Canvas
   * @category Graphics
   * Draws itself onto a canvas. Crafty.canvas() must be called before hand to initialize
   * the canvas element.
   */
  Crafty.c("Canvas", {

    init: function() {
      if (!Crafty.canvas.context) {
        Crafty.canvas.init();
      }

      //increment the amount of canvas objs
      Crafty.DrawManager.total2D++;

      this.bind("Change", function(e) {
        //if within screen, add to list 
        if (this._changed === false) {
          this._changed = Crafty.DrawManager.add(e || this, this);
        } else {
          if (e) this._changed = Crafty.DrawManager.add(e, this);
        }
      });

      this.bind("Remove", function() {
        Crafty.DrawManager.total2D--;
        Crafty.DrawManager.add(this, this);
      });
    },

    /**@
     * #.draw
     * @comp Canvas
     * @sign public this .draw([[Context ctx, ]Number x, Number y, Number w, Number h])
     * @param ctx - Canvas 2D context if drawing on another canvas is required
     * @param x - X offset for drawing a segment
     * @param y - Y offset for drawing a segment
     * @param w - Width of the segement to draw
     * @param h - Height of the segment to draw
     * @triggers Draw
     * Method to draw the entity on the canvas element. Can pass rect values for redrawing a segment of the entity.
     */
    draw: function(ctx, x, y, w, h) {
      if (!this.ready) return;
      if (arguments.length === 4) {
        h = w;
        w = y;
        y = x;
        x = ctx;
        ctx = Crafty.canvas.context;
      }

      var pos = { //inlined pos() function, for speed
        _x: (this._x + (x || 0)),
        _y: (this._y + (y || 0)),
        _w: (w || this._w),
        _h: (h || this._h)
      },
          context = ctx || Crafty.canvas.context,
          coord = this.__coord || [0, 0, 0, 0],
          co = {
          x: coord[0] + (x || 0),
          y: coord[1] + (y || 0),
          w: w || coord[2],
          h: h || coord[3]
          };

      if (this._mbr) {
        context.save();

        context.translate(this._origin.x + this._x, this._origin.y + this._y);
        pos._x = -this._origin.x;
        pos._y = -this._origin.y;

        context.rotate((this._rotation % 360) * (Math.PI / 180));
      }

      //draw with alpha
      if (this._alpha < 1.0) {
        var globalpha = context.globalAlpha;
        context.globalAlpha = this._alpha;
      }

      this.trigger("Draw", {
        type: "canvas",
        pos: pos,
        co: co,
        ctx: context
      });

      if (this._mbr) {
        context.restore();
      }
      if (globalpha) {
        context.globalAlpha = globalpha;
      }
      return this;
    }
  });

  /**@
   * #Crafty.canvas
   * @category Graphics
   * Collection of methods to draw on canvas.
   */
  Crafty.extend({
    canvas: {
      /**@
       * #Crafty.canvas.context
       * @comp Crafty.canvas
       * This will return the 2D context of the main canvas element. 
       * The value returned from `Crafty.canvas.elem.getContext('2d')`.
       */
      context: null,
      /**@
       * #Crafty.canvas.elem
       * @comp Crafty.canvas
       * Main Canvas element
       */
      elem: null,

      /**@
       * #Crafty.canvas.init
       * @comp Crafty.canvas
       * @sign public void Crafty.canvas.init(void)
       * @triggers NoCanvas
       * Creates a `canvas` element inside the stage element. Must be called
       * before any entities with the Canvas component can be drawn.
       *
       * This method will automatically be called if no `Crafty.canvas.context` is
       * found.
       */
      init: function() {
        //check if canvas is supported
        if (!Crafty.support.canvas) {
          Crafty.trigger("NoCanvas");
          Crafty.stop();
          return;
        }

        //create 3 empty canvas elements
        var c;
        c = document.createElement("canvas");
        c.width = Crafty.viewport.width;
        c.height = Crafty.viewport.height;
        c.style.position = 'absolute';
        c.style.left = "0px";
        c.style.top = "0px";

        Crafty.stage.elem.appendChild(c);
        Crafty.canvas.context = c.getContext('2d');
        Crafty.canvas._canvas = c;
      }
    }
  });

  Crafty.extend({
    down: null,
    //object mousedown, waiting for up
    over: null,
    //object mouseover, waiting for out
    mouseObjs: 0,
    mousePos: {},
    lastEvent: null,
    keydown: {},

    mouseDispatch: function(e) {
      if (!Crafty.mouseObjs) return;
      Crafty.lastEvent = e;

      var maxz = -1,
          closest, q, i = 0,
          l, pos = Crafty.DOM.translate(e.clientX, e.clientY),
          x, y, dupes = {},
          tar = e.target ? e.target : e.srcElement,
          type = e.type;

      if (type === "touchstart") type = "mousedown";
      else if (type === "touchmove") type = "mousemove";
      else if (type === "touchend") type = "mouseup";

      e.realX = x = Crafty.mousePos.x = pos.x;
      e.realY = y = Crafty.mousePos.y = pos.y;

      if (tar.nodeName != "CANVAS") {
        // we clicked on a dom element
        while (typeof(tar.id) != 'string' && tar.id.indexOf('ent') == -1) {
          tar = tar.parentNode;
        }
        ent = Crafty(parseInt(tar.id.replace('ent', '')))
        if (ent.has('Mouse') && ent.isAt(x, y)) closest = ent;
      }

      if (!closest) {
        //search for all mouse entities
        q = Crafty.map.search({
          _x: x,
          _y: y,
          _w: 1,
          _h: 1
        }, false);

        for (l = q.length; i < l; ++i) {
          //check if has mouse component
          if (!q[i].__c.Mouse) continue;

          var current = q[i],
              flag = false;

          //weed out duplicates
          if (dupes[current[0]]) continue;
          else dupes[current[0]] = true;

          if (current.map) {
            if (current.map.containsPoint(x, y)) {
              flag = true;
            }
          } else if (current.isAt(x, y)) flag = true;

          if (flag && (current._z >= maxz || maxz === -1)) {
            //if the Z is the same, select the closest GUID
            if (current._z === maxz && current[0] < closest[0]) {
              continue;
            }
            maxz = current._z;
            closest = current;
          }
        }
      }

      //found closest object to mouse
      if (closest) {
        //click must mousedown and out on tile
        if (type === "mousedown") {
          this.down = closest;
          this.down.trigger("MouseDown", e);
        } else if (type === "mouseup") {
          closest.trigger("MouseUp", e);

          //check that down exists and this is down
          if (this.down && closest === this.down) {
            this.down.trigger("Click", e);
          }

          //reset down
          this.down = null;
        } else if (type === "mousemove") {
          if (this.over !== closest) { //if new mousemove, it is over
            if (this.over) {
              this.over.trigger("MouseOut", e); //if over wasn't null, send mouseout
              this.over = null;
            }
            this.over = closest;
            closest.trigger("MouseOver", e);
          }
        } else closest.trigger(type, e); //trigger whatever it is
      } else {
        if (type === "mousemove" && this.over) {
          this.over.trigger("MouseOut", e);
          this.over = null;
        }
      }

      if (type === "mousemove") {
        this.lastEvent = e;
      }
    },

    keyboardDispatch: function(e) {
      e.key = e.keyCode || e.which;
      if (e.type === "keydown") {
        if (Crafty.keydown[e.key] !== true) {
          Crafty.keydown[e.key] = true;
          Crafty.trigger("KeyDown", e);
        }
      } else if (e.type === "keyup") {
        delete Crafty.keydown[e.key];
        Crafty.trigger("KeyUp", e);
      }

      //prevent searchable keys
/*
        if((e.metaKey || e.altKey || e.ctrlKey) && !(e.key == 8 || e.key >= 112 && e.key <= 135)) {
            console.log(e);
            if(e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            return false;
        }*/
    }
  });

  //initialize the input events onload
  Crafty.bind("Load", function() {
    Crafty.addEvent(this, "keydown", Crafty.keyboardDispatch);
    Crafty.addEvent(this, "keyup", Crafty.keyboardDispatch);

    Crafty.addEvent(this, Crafty.stage.elem, "mousedown", Crafty.mouseDispatch);
    Crafty.addEvent(this, Crafty.stage.elem, "mouseup", Crafty.mouseDispatch);
    Crafty.addEvent(this, Crafty.stage.elem, "mousemove", Crafty.mouseDispatch);

    Crafty.addEvent(this, Crafty.stage.elem, "touchstart", Crafty.mouseDispatch);
    Crafty.addEvent(this, Crafty.stage.elem, "touchmove", Crafty.mouseDispatch);
    Crafty.addEvent(this, Crafty.stage.elem, "touchend", Crafty.mouseDispatch);
  });

  /**@
   * #Mouse
   * @category Input
   * Give entities mouse events such as
   * `mouseover`, `mousedown`, `mouseout`, `mouseup` and `click`.
   */
  Crafty.c("Mouse", {
    init: function() {
      Crafty.mouseObjs++;
      this.bind("Remove", function() {
        Crafty.mouseObjs--;
      });
    },

    /**@
     * #.areaMap
     * @comp Mouse
     * @sign public this .areaMap(Crafty.Polygon polygon)
     * @param polygon - Instance of Crafty.Polygon used to check if the mouse coordinates are inside this region
     * @sign public this .areaMap(Array point1, .., Array pointN)
     * @param point# - Array with an `x` and `y` position to generate a polygon
     * Assign a polygon to the entity so that mouse events will only be triggered if
     * the coordinates are inside the given polygon.
     * @see Crafty.Polygon
     */
    areaMap: function(poly) {
      //create polygon
      if (arguments.length > 1) {
        //convert args to array to create polygon
        var args = Array.prototype.slice.call(arguments, 0);
        poly = new Crafty.polygon(args);
      }

      poly.shift(this._x, this._y);
      this.map = poly;

      this.attach(this.map);
      return this;
    }
  });

  /**@
   * #Draggable
   * @category Input
   * Give the ability to drag and drop the entity.
   */
  Crafty.c("Draggable", {
    _startX: 0,
    _startY: 0,
    _dragging: false,

    _ondrag: null,
    _ondown: null,
    _onup: null,

    init: function() {
      this.requires("Mouse");
      this._ondrag = function(e) {
        var pos = Crafty.DOM.translate(e.clientX, e.clientY);
        this.x = pos.x - this._startX;
        this.y = pos.y - this._startY;

        this.trigger("Dragging", e);
      };

      this._ondown = function(e) {
        if (e.button !== 0) return;

        //start drag
        this._startX = e.realX - this._x;
        this._startY = e.realY - this._y;
        this._dragging = true;

        Crafty.addEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
        Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this._onup);
        this.trigger("StartDrag", e);
      };

      this._onup = function upper(e) {
        Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
        Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", this._onup);
        this._dragging = false;
        this.trigger("StopDrag", e);
      };

      this.enableDrag();
    },

    /**@
     * #.stopDrag
     * @comp Draggable
     * @sign public this .stopDrag(void)
     * Stop the entity from dragging. Essentially reproducing the drop.
     * @see .startDrag
     */
    stopDrag: function() {
      Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
      Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", this._onup);

      this._dragging = false;
      this.trigger("StopDrag");
      return this;
    },

    /**@
     * #.startDrag
     * @comp Draggable
     * @sign public this .startDrag(void)
     * Make the entity follow the mouse positions.
     * @see .stopDrag
     */
    startDrag: function() {
      if (!this._dragging) {
        this._dragging = true;
        Crafty.addEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
      }
    },

    /**@
     * #.enableDrag
     * @comp Draggable
     * @sign public this .enableDrag(void)
     * Rebind the mouse events. Use if `.disableDrag` has been called.
     * @see .disableDrag
     */
    enableDrag: function() {
      this.bind("MouseDown", this._ondown);

      Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this._onup);
      return this;
    },

    /**@
     * #.disableDrag
     * @comp Draggable
     * @sign public this .disableDrag(void)
     * Stops entity from being draggable. Reenable with `.enableDrag()`.
     * @see .enableDrag
     */
    disableDrag: function() {
      this.unbind("MouseDown", this._ondown);
      this.stopDrag();
      return this;
    }
  });

  /**@
   * #Keyboard
   * @category Input
   * Give entities keyboard events (`keydown` and `keyup`).
   */
  Crafty.c("Keyboard", {
    /**@
     * #.isDown
     * @comp Keyboard
     * @sign public Boolean isDown(String keyName)
     * @param keyName - Name of the key to check. See `Crafty.keys`.
     * @sign public Boolean isDown(Number keyCode)
     * @param keyCode - Key code in `Crafty.keys`.
     * Determine if a certain key is currently down.
     */
    isDown: function(key) {
      if (typeof key === "string") {
        key = Crafty.keys[key];
      }
      return !!Crafty.keydown[key];
    }
  });

  /**@
   * #Multiway
   * @category Input
   * Used to bind keys to directions and have the entity move acordingly
   */
  Crafty.c("Multiway", {
    _speed: 3,

    init: function() {
      this._keyDirection = {};
      this._keys = {};
      this._movement = {
        x: 0,
        y: 0
      };
    },

    /**@
     * #.multiway
     * @comp Multiway
     * @sign public this .multiway([Number speed,] Object keyBindings )
     * @param speed - Amount of pixels to move the entity whilst a key is down
     * @param keyBindings - What keys should make the entity go in which direction. Direction is specified in degrees
     * Constructor to initialize the speed and keyBindings. Component will listen for key events and move the entity appropriately. 
     *
     * When direction changes a NewDirection event is triggered with an object detailing the new direction: {x: x_movement, y: y_movement}
     * When entity has moved on either x- or y-axis a Moved event is triggered with an object specifying the old position {x: old_x, y: old_y}
     * @example
     * ~~~
     * this.multiway(3, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
     * this.multiway({W: -90, S: 90, D: 0, A: 180});
     * ~~~
     */
    multiway: function(speed, keys) {
      if (keys) {
        this._speed = speed;
      } else {
        keys = speed;
      }

      this._keyDirection = keys;
      this.speed(this._speed);

      this.bind("KeyDown", function(e) {
        if (this._keys[e.key]) {
          this._movement.x = Math.round((this._movement.x + this._keys[e.key].x) * 1000) / 1000;
          this._movement.y = Math.round((this._movement.y + this._keys[e.key].y) * 1000) / 1000;
          this.trigger('NewDirection', this._movement);
        }
      }).bind("KeyUp", function(e) {
        if (this._keys[e.key]) {
          this._movement.x = Math.round((this._movement.x - this._keys[e.key].x) * 1000) / 1000;
          this._movement.y = Math.round((this._movement.y - this._keys[e.key].y) * 1000) / 1000;
          this.trigger('NewDirection', this._movement);
        }
      }).bind("EnterFrame", function() {
        if (this.disableControls) return;

        if (this._movement.x !== 0) {
          this.x += this._movement.x;
          this.trigger('Moved', {
            x: this.x - this._movement.x,
            y: this.y
          });
        }
        if (this._movement.y !== 0) {
          this.y += this._movement.y;
          this.trigger('Moved', {
            x: this.x,
            y: this.y - this._movement.y
          });
        }
      });

      //Apply movement if key is down when created
      for (var k in keys) {
        if (Crafty.keydown[Crafty.keys[k]]) {
          this.trigger("KeyDown", {
            key: Crafty.keys[k]
          });
        }
      }

      return this;
    },

    speed: function(speed) {
      for (var k in this._keyDirection) {
        var keyCode = Crafty.keys[k] || k;
        this._keys[keyCode] = {
          x: Math.round(Math.cos(this._keyDirection[k] * (Math.PI / 180)) * 1000 * speed) / 1000,
          y: Math.round(Math.sin(this._keyDirection[k] * (Math.PI / 180)) * 1000 * speed) / 1000
        };
      }
      return this;
    }
  });

  /**@
   * #Fourway
   * @category Input
   * Move an entity in four directions by using the
   * arrow keys or `W`, `A`, `S`, `D`.
   */
  Crafty.c("Fourway", {

    init: function() {
      this.requires("Multiway");
    },

    /**@
     * #.fourway
     * @comp Fourway
     * @sign public this .fourway(Number speed)
     * @param speed - Amount of pixels to move the entity whilst a key is down
     * Constructor to initialize the speed. Component will listen for key events and move the entity appropriately. 
     * This includes `Up Arrow`, `Right Arrow`, `Down Arrow`, `Left Arrow` as well as `W`, `A`, `S`, `D`.
     *
     * The key presses will move the entity in that direction by the speed passed in the argument.
     */
    fourway: function(speed) {
      this.multiway(speed, {
        UP_ARROW: -90,
        DOWN_ARROW: 90,
        RIGHT_ARROW: 0,
        LEFT_ARROW: 180,
        W: -90,
        S: 90,
        D: 0,
        A: 180
      });

      return this;
    }
  });

  /**@
   * #Twoway
   * @category Input
   * Move an entity in two directions: left or right as well as
   * jump.
   */
  Crafty.c("Twoway", {
    _speed: 3,
    _up: false,

    init: function() {
      this.requires("Keyboard");
    },

    /**@
     * #.twoway
     * @comp Twoway
     * @sign public this .twoway(Number speed[, Number jumpSpeed])
     * @param speed - Amount of pixels to move left or right
     * @param jumpSpeed - How high the entity should jump
     * Constructor to initialize the speed and power of jump. Component will 
     * listen for key events and move the entity appropriately. This includes 
     * `Up Arrow`, `Right Arrow`, `Left Arrow` as well as W, A, D. Used with the 
     * `gravity` component to simulate jumping.
     *
     * The key presses will move the entity in that direction by the speed passed in 
     * the argument. Pressing the `Up Arrow` or `W` will cause the entiy to jump.
     * @see Gravity, Fourway
     */
    twoway: function(speed, jump) {
      if (speed) this._speed = speed;
      jump = jump || this._speed * 2;

      this.bind("EnterFrame", function() {
        if (this.disableControls) return;
        if (this.isDown("RIGHT_ARROW") || this.isDown("D")) {
          this.x += this._speed;
        }
        if (this.isDown("LEFT_ARROW") || this.isDown("A")) {
          this.x -= this._speed;
        }
        if (this._up) {
          this.y -= jump;
          this._falling = true;
        }
      }).bind("KeyDown", function() {
        if (this.isDown("UP_ARROW") || this.isDown("W")) this._up = true;
      });

      return this;
    }
  });


  Crafty.c("Animation", {
    _reel: null,

    init: function() {
      this._reel = {};
    },

    addAnimation: function(label, skeleton) {
      var key, lastKey = 0,
          i = 0,
          j, frame, prev, prop, diff = {},
          p, temp, frames = [];

      //loop over every frame
      for (key in skeleton) {

        frame = skeleton[key];
        prev = skeleton[lastKey] || this;
        diff = {};

        //find the difference
        for (prop in frame) {
          if (typeof frame[prop] !== "number") {
            diff[prop] = frame[prop];
            continue;
          }

          diff[prop] = (frame[prop] - prev[prop]) / (key - lastKey);
        }

        for (i = +lastKey + 1, j = 1; i <= +key; ++i, ++j) {
          temp = {};
          for (p in diff) {
            if (typeof diff[p] === "number") {
              temp[p] = prev[p] + diff[p] * j;
            } else {
              temp[p] = diff[p];
            }
          }

          frames[i] = temp;
        }
        lastKey = key;
      }

      this._reel[label] = frames;

      return this;
    },

    playAnimation: function(label) {
      var reel = this._reel[label],
          i = 0,
          l = reel.length,
          prop;

      this.bind("EnterFrame", function e() {
        for (prop in reel[i]) {
          this[prop] = reel[i][prop];
        }
        i++;

        if (i > l) {
          this.trigger("AnimationEnd");
          this.unbind("EnterFrame", e);
        }
      });
    }
  });

  /**@
   * #SpriteAnimation
   * @category Animation
   * Used to animate sprites by changing the sprites in the sprite map.
   */
  Crafty.c("SpriteAnimation", {
    _reels: null,
    _frame: null,
    _current: null,

    init: function() {
      this._reels = {};
    },

    /**@
     * #.animate
     * @comp SpriteAnimation
     * @sign public this .animate(String id, Number fromX, Number y, Number toX)
     * @param id - ID of the animation reel being created
     * @param fromX - Starting `x` position on the sprite map
     * @param y - `y` position on the sprite map. Will remain constant through the animation.
     * @param toX - End `x` position on the sprite map
     * @sign public this .animate(String id, Array frames)
     * @param frames - Array of containing an array with the `x` and `y` values
     * @sign public this .animate(String id, Number duration[, Number repeatCount])
     * @param duration - Play the animation with a duration (in frames)
     * Method to setup animation reels or play pre-made reels. Animation works by changing the sprites over 
     * a duration. Only works for sprites built with the Crafty.sprite methods. See the Tween component for animation of 2D properties.
     *
     * To setup an animation reel, pass the name of the reel (used to identify the reel and play it later), and either an 
     * array of absolute sprite positions or the start x on the sprite map, the y on the sprite map and then the end x on the sprite map.
     *
     * To play a reel, pass the name of the reel and the duration it should play for (in frames). If you need
     * to repeat the animation, simply pass in the amount of times the animation should repeat. To repeat
     * forever, pass in `-1`.
     *
     * @triggers AnimationEnd - When the animation finishes
     */
    animate: function(id, fromx, y, tox) {
      var reel, i, tile, tileh, duration, pos;

      //play a reel
      if (arguments.length < 4 && typeof fromx === "number") {
        //make sure not currently animating
        this._current = id;

        reel = this._reels[id];
        duration = fromx;

        this._frame = {
          reel: reel,
          //reel to play
          frameTime: Math.ceil(duration / reel.length),
          //number of frames inbetween slides
          frame: 0,
          //current slide/frame
          current: 0,
          repeat: 0
        };
        if (arguments.length === 3 && typeof y === "number") {
          //User provided repetition count
          if (y === -1) this._frame.repeatInfinitly = true;
          else this._frame.repeat = y;
        }

        pos = this._frame.reel[0];
        this.__coord[0] = pos[0];
        this.__coord[1] = pos[1];

        this.bind("EnterFrame", this.drawFrame);
        return this;
      }
      if (typeof fromx === "number") {
        i = fromx;
        reel = [];
        tile = this.__tile;
        tileh = this.__tileh;

        if (tox > fromx) {
          for (; i <= tox; i++) {
            reel.push([i * tile, y * tileh]);
          }
        } else {
          for (; i >= tox; i--) {
            reel.push([i * tile, y * tileh]);
          }
        }

        this._reels[id] = reel;
      } else if (typeof fromx === "object") {
        i = 0;
        reel = [];
        tox = fromx.length - 1;
        tile = this.__tile;
        tileh = this.__tileh;

        for (; i <= tox; i++) {
          pos = fromx[i];
          reel.push([pos[0] * tile, pos[1] * tileh]);
        }

        this._reels[id] = reel;
      }

      return this;
    },

    drawFrame: function(e) {
      var data = this._frame;

      if (this._frame.current++ === data.frameTime) {
        var pos = data.reel[data.frame++];

        this.__coord[0] = pos[0];
        this.__coord[1] = pos[1];
        this._frame.current = 0;
      }


      if (data.frame === data.reel.length && this._frame.current === data.frameTime) {
        data.frame = 0;
        if (this._frame.repeatInfinitly === true || this._frame.repeat > 0) {
          if (this._frame.repeat) this._frame.repeat--;
          this._frame.current = 0;
          this._frame.frame = 0;
        } else {
          this.trigger("AnimationEnd", {
            reel: data.reel
          });
          this.stop();
          return;
        }
      }

      this.trigger("Change");
    },

    /**@
     * #.stop
     * @comp SpriteAnimation
     * @sign public this .stop(void)
     * @triggers AnimationEnd - Animation is ended
     * Stop any animation currently playing.
     */
    stop: function() {
      this.unbind("EnterFrame", this.drawFrame);
      this.unbind("AnimationEnd");
      this._current = null;
      this._frame = null;

      return this;
    },

    /**@
     * #.reset
     * @comp SpriteAnimation
     * @sign public this .reset(void)
     * Method will reset the entities sprite to its original.
     */
    reset: function() {
      if (!this._frame) return this;

      var co = this._frame.reel[0];
      this.__coord[0] = co[0];
      this.__coord[1] = co[1];
      this.stop();

      return this;
    },

    /**@
     * #.isPlaying
     * @comp SpriteAnimation
     * @sign public Boolean .isPlaying([String reel])
     * @reel reel - Determine if this reel is playing
     * Determines if an animation is currently playing. If a reel is passed, it will determine
     * if the passed reel is playing.
     */
    isPlaying: function(id) {
      if (!id) return !!this._interval;
      return this._current === id;
    }
  });

  /**@
   * #Tween
   * @category Animation
   * Component to animate the change in 2D properties over time.
   */
  Crafty.c("Tween", {
    _step: null,
    _numProps: 0,

    /**@
     * #.tween
     * @comp Tween
     * @sign public this .tween(Object properties, Number duration)
     * @param properties - Object of 2D properties and what they should animate to
     * @param duration - Duration to animate the properties over (in frames)
     * This method will animate a 2D entities properties over the specified duration.
     * These include `x`, `y`, `w`, `h`, `alpha` and `rotation`.
     *
     * The object passed should have the properties as keys and the value should be the resulting
     * values of the properties.
     * @example
     * Move an object to 100,100 and fade out in 200 frames.
     * ~~~
     * Crafty.e("2D, Tween")
     *    .attr({alpha: 1.0, x: 0, y: 0})
     *    .tween({alpha: 0.0, x: 100, y: 100}, 200)
     * ~~~
     */
    tween: function(props, duration) {
      this.each(function() {
        if (this._step == null) {
          this._step = {};
          this.bind('EnterFrame', tweenEnterFrame);
          this.bind('RemoveComponent', function(c) {
            if (c == 'Tween') {
              this.unbind('EnterFrame', tweenEnterFrame);
            }
          });
        }

        for (var prop in props) {
          this._step[prop] = {
            val: (props[prop] - this[prop]) / duration,
            rem: duration
          };
          this._numProps++;
        }
      });
      return this;
    }
  });

  function tweenEnterFrame(e) {
    if (this._numProps <= 0) return;

    var prop, k;
    for (k in this._step) {
      prop = this._step[k];
      this[k] += prop.val;
      if (prop.rem-- == 0) {
        this.trigger("TweenEnd", k);
        delete prop;
        this._numProps--;
      }
    }

    if (this.has('Mouse')) {
      var over = Crafty.over,
          mouse = Crafty.mousePos;
      if (over && over[0] == this[0] && !this.isAt(mouse.x, mouse.y)) {
        this.trigger('MouseOut', Crafty.lastEvent);
        Crafty.over = null;
      } else if ((!over || over[0] != this[0]) && this.isAt(mouse.x, mouse.y)) {
        Crafty.over = this;
        this.trigger('MouseOver', Crafty.lastEvent);
      }
    }
  }



  /**@
   * #Color
   * @category Graphics
   * Draw a solid color for the entity
   */
  Crafty.c("Color", {
    _color: "",
    ready: true,

    init: function() {
      this.bind("Draw", function(e) {
        if (e.type === "DOM") {
          e.style.background = this._color;
          e.style.lineHeight = 0;
        } else if (e.type === "canvas") {
          if (this._color) e.ctx.fillStyle = this._color;
          e.ctx.fillRect(e.pos._x, e.pos._y, e.pos._w, e.pos._h);
        }
      });
    },

    /**@
     * #.color
     * @comp Color
     * @sign public this .color(String color)
     * @param color - Color of the rectangle
     * Will create a rectangle of solid color for the entity.
     *
     * The argument must be a color readable depending on how it's drawn. Canvas requires 
     * using `rgb(0 - 255, 0 - 255, 0 - 255)` or `rgba()` whereas DOM can be hex or any other css format.
     */
    color: function(color) {
      this._color = color;
      this.trigger("Change");
      return this;
    }
  });

  /**@
   * #Tint
   * @category Graphics
   * Similar to Color by adding an overlay of semi-transparent color.
   *
   * *Note: Currently only works for Canvas*
   */
  Crafty.c("Tint", {
    _color: null,
    _strength: 1.0,

    init: function() {
      var draw = function d(e) {
        var context = e.ctx || Crafty.canvas.context;

        context.fillStyle = this._color || "rgb(0,0,0)";
        context.fillRect(e.pos._x, e.pos._y, e.pos._w, e.pos._h);
      };

      this.bind("Draw", draw).bind("RemoveComponent", function(id) {
        if (id === "Tint") this.unbind("Draw", draw);
      });
    },

    /**@
     * #.tint
     * @comp Tint
     * @sign public this .tint(String color, Number strength)
     * @param color - The color in hexidecimal
     * @param strength - Level of opacity
     * Modify the color and level opacity to give a tint on the entity.
     */
    tint: function(color, strength) {
      this._strength = strength;
      this._color = Crafty.toRGB(color, this._strength);

      this.trigger("Change");
      return this;
    }
  });

  /**@
   * #Image
   * @category Graphics
   * Draw an image with or without repeating (tiling).
   */
  Crafty.c("Image", {
    _repeat: "repeat",
    ready: false,

    init: function() {
      var draw = function(e) {
        if (e.type === "canvas") {
          //skip if no image
          if (!this.ready || !this._pattern) return;

          var context = e.ctx;

          context.fillStyle = this._pattern;

          //context.save();
          //context.translate(e.pos._x, e.pos._y);
          context.fillRect(this._x, this._y, this._w, this._h);
          //context.restore();
        } else if (e.type === "DOM") {
          if (this.__image) e.style.background = "url(" + this.__image + ") " + this._repeat;
        }
      };

      this.bind("Draw", draw).bind("RemoveComponent", function(id) {
        if (id === "Image") this.unbind("Draw", draw);
      });
    },

    /**@
     * #.image
     * @comp Image
     * @sign public this .image(String url[, String repeat])
     * @param url - URL of the image
     * @param repeat - If the image should be repeated to fill the entity.
     * Draw specified image. Repeat follows CSS syntax (`"no-repeat", "repeat", "repeat-x", "repeat-y"`);
     *
     * *Note: Default repeat is `no-repeat` which is different to standard DOM (which is `repeat`)*
     *
     * If the width and height are `0` and repeat is set to `no-repeat` the width and 
     * height will automatically assume that of the image. This is an 
     * easy way to create an image without needing sprites.
     * @example
     * Will default to no-repeat. Entity width and height will be set to the images width and height
     * ~~~
     * var ent = Crafty.e("2D, DOM, Image").image("myimage.png");
     * ~~~
     * Create a repeating background.
     * ~~~
     * var bg = Crafty.e("2D, DOM, Image")
     *              .attr({w: Crafty.viewport.width, h: Crafty.viewport.height})
     *              .image("bg.png", "repeat");
     * ~~~
     * @see Crafty.sprite
     */
    image: function(url, repeat) {
      this.__image = url;
      this._repeat = repeat || "no-repeat";


      this.img = Crafty.assets[url];
      if (!this.img) {
        this.img = new Image();
        Crafty.assets[url] = this.img;
        this.img.src = url;
        var self = this;

        this.img.onload = function() {
          if (self.has("Canvas")) self._pattern = Crafty.canvas.context.createPattern(self.img, self._repeat);
          self.ready = true;

          if (self._repeat === "no-repeat") {
            self.w = self.img.width;
            self.h = self.img.height;
          }

          self.trigger("Change");
        };

        return this;
      } else {
        this.ready = true;
        if (this.has("Canvas")) this._pattern = Crafty.canvas.context.createPattern(this.img, this._repeat);
        if (this._repeat === "no-repeat") {
          this.w = this.img.width;
          this.h = this.img.height;
        }
      }


      this.trigger("Change");

      return this;
    }
  });

  Crafty.extend({
    _scenes: [],
    _current: null,

    /**@
     * #Crafty.scene
     * @category Scenes, Stage
     * @sign public void Crafty.scene(String sceneName, Function init)
     * @param sceneName - Name of the scene to add
     * @param init - Function execute when scene is played
     * @sign public void Crafty.scene(String sceneName)
     * @param sceneName - Name of scene to play
     * Method to create scenes on the stage. Pass an ID and function to register a scene. 
     *
     * To play a scene, just pass the ID. When a scene is played, all 
     * entities with the `2D` component on the stage are destroyed.
     *
     * If you want some entities to persist over scenes (as in not be destroyed) 
     * simply add the component `persist`.
     */
    scene: function(name, fn) {
      //play scene
      if (arguments.length === 1) {
        Crafty("2D").each(function() {
          if (!this.has("persist")) this.destroy();
        }); //clear screen of all 2D objects except persist
        this._scenes[name].call(this);
        this._current = name;
        return;
      }
      //add scene
      this._scenes[name] = fn;
      return;
    },

    rgbLookup: {},

    toRGB: function(hex, alpha) {
      var lookup = this.rgbLookup[hex];
      if (lookup) return lookup;

      var hex = (hex.charAt(0) === '#') ? hex.substr(1) : hex,
          c = [],
          result;

      c[0] = parseInt(hex.substr(0, 2), 16);
      c[1] = parseInt(hex.substr(2, 2), 16);
      c[2] = parseInt(hex.substr(4, 2), 16);

      result = alpha === undefined ? 'rgb(' + c.join(',') + ')' : 'rgba(' + c.join(',') + ',' + alpha + ')';
      lookup = result;

      return result;
    }
  });

  /**
   * Draw Manager will manage objects to be drawn and implement
   * the best method of drawing in both DOM and canvas
   */
  Crafty.DrawManager = (function() { /** array of dirty rects on screen */
    var register = [],
         /** array of DOMs needed updating */
        
        dom = [];

    return { /** Quick count of 2D objects */
      total2D: Crafty("2D").length,

      onScreen: function(rect) {
        return Crafty.viewport._x + rect._x + rect._w > 0 && Crafty.viewport._y + rect._y + rect._h > 0 && Crafty.viewport._x + rect._x < Crafty.viewport.width && Crafty.viewport._y + rect._y < Crafty.viewport.height;
      },

      merge: function(set) {
        do {
          var newset = [],
              didMerge = false,
              i = 0,
              l = set.length,
              current, next, merger;

          while (i < l) {
            current = set[i];
            next = set[i + 1];

            if (i < l - 1 && current._x < next._x + next._w && current._x + current._w > next._x && current._y < next._y + next._h && current._h + current._y > next._y) {

              merger = {
                _x: ~~Math.min(current._x, next._x),
                _y: ~~Math.min(current._y, next._y),
                _w: Math.max(current._x, next._x) + Math.max(current._w, next._w),
                _h: Math.max(current._y, next._y) + Math.max(current._h, next._h)
              };
              merger._w = merger._w - merger._x;
              merger._h = merger._h - merger._y;
              merger._w = (merger._w == ~~merger._w) ? merger._w : merger._w + 1 | 0;
              merger._h = (merger._h == ~~merger._h) ? merger._h : merger._h + 1 | 0;

              newset.push(merger);

              i++;
              didMerge = true;
            } else newset.push(current);
            i++;
          }

          set = newset.length ? Crafty.clone(newset) : set;

          if (didMerge) i = 0;
        } while (didMerge);

        return set;
      },

      /**
       * Calculate the bounding rect of dirty data
       * and add to the register
       */
      add: function add(old, current) {
        if (!current) {
          dom.push(old);
          return;
        }

        var rect, before = old._mbr || old,
            after = current._mbr || current;

        if (old === current) {
          rect = old.mbr() || old.pos();
        } else {
          rect = {
            _x: ~~Math.min(before._x, after._x),
            _y: ~~Math.min(before._y, after._y),
            _w: Math.max(before._w, after._w) + Math.max(before._x, after._x),
            _h: Math.max(before._h, after._h) + Math.max(before._y, after._y)
          };

          rect._w = (rect._w - rect._x);
          rect._h = (rect._h - rect._y);
        }

        if (rect._w === 0 || rect._h === 0 || !this.onScreen(rect)) {
          return false;
        }

        //floor/ceil
        rect._x = ~~rect._x;
        rect._y = ~~rect._y;
        rect._w = (rect._w === ~~rect._w) ? rect._w : rect._w + 1 | 0;
        rect._h = (rect._h === ~~rect._h) ? rect._h : rect._h + 1 | 0;

        //add to register, check for merging
        register.push(rect);

        //if it got merged
        return true;
      },

      debug: function() {
        console.log(register, dom);
      },

      drawAll: function(rect) {
        var rect = rect || Crafty.viewport.rect(),
            q, i = 0,
            l, ctx = Crafty.canvas.context,
            current;

        q = Crafty.map.search(rect);
        l = q.length;

        ctx.clearRect(rect._x, rect._y, rect._w, rect._h);

        q.sort(function(a, b) {
          return a._global - b._global;
        });
        for (; i < l; i++) {
          current = q[i];
          if (current._visible && current.__c.Canvas) {
            current.draw();
            current._changed = false;
          }
        }
      },

      /**
       * Calculate the common bounding rect of multiple canvas entities
       * Returns coords
       */
      boundingRect: function(set) {
        if (!set || !set.length) return;
        var newset = [],
            i = 1,
            l = set.length,
            current, master = set[0],
            tmp;
        master = [master._x, master._y, master._x + master._w, master._y + master._h];
        while (i < l) {
          current = set[i];
          tmp = [current._x, current._y, current._x + current._w, current._y + current._h];
          if (tmp[0] < master[0]) master[0] = tmp[0];
          if (tmp[1] < master[1]) master[1] = tmp[1];
          if (tmp[2] > master[2]) master[2] = tmp[2];
          if (tmp[3] > master[3]) master[3] = tmp[3];
          i++;
        }
        tmp = master;
        master = {
          _x: tmp[0],
          _y: tmp[1],
          _w: tmp[2] - tmp[0],
          _h: tmp[3] - tmp[1]
        };

        return master;
      },

      /**
       * Redraw all the dirty regions
       */
      draw: function draw() {
        //if nothing in register, stop
        if (!register.length && !dom.length) return;

        var i = 0,
            l = register.length,
            k = dom.length,
            rect, q, j, len, dupes, obj, ent, objs = [],
            ctx = Crafty.canvas.context;

        //loop over all DOM elements needing updating
        for (; i < k; ++i) {
          dom[i].draw()._changed = false;
        }
        //reset counter and DOM array
        dom.length = i = 0;

        //again, stop if nothing in register
        if (!l) {
          return;
        }

        //if the amount of rects is over 60% of the total objects
        //do the naive method redrawing
        if (l / this.total2D > 0.6) {
          this.drawAll();
          register.length = 0;
          return;
        }

        register = this.merge(register);
        for (; i < l; ++i) { //loop over every dirty rect
          rect = register[i];
          if (!rect) continue;
          q = Crafty.map.search(rect, false); //search for ents under dirty rect
          dupes = {};

          //loop over found objects removing dupes and adding to obj array
          for (j = 0, len = q.length; j < len; ++j) {
            obj = q[j];

            if (dupes[obj[0]] || !obj._visible || !obj.__c.Canvas) continue;
            dupes[obj[0]] = true;

            objs.push({
              obj: obj,
              rect: rect
            });
          }

          //clear the rect from the main canvas
          ctx.clearRect(rect._x, rect._y, rect._w, rect._h);

        }

        //sort the objects by the global Z
        objs.sort(function(a, b) {
          return a.obj._global - b.obj._global;
        });
        if (!objs.length) {
          return;
        }

        //loop over the objects
        for (i = 0, l = objs.length; i < l; ++i) {
          obj = objs[i];
          rect = obj.rect;
          ent = obj.obj;

          var area = ent._mbr || ent,
              x = (rect._x - area._x <= 0) ? 0 : ~~ (rect._x - area._x),
              y = (rect._y - area._y < 0) ? 0 : ~~ (rect._y - area._y),
              w = ~~Math.min(area._w - x, rect._w - (area._x - rect._x), rect._w, area._w),
              h = ~~Math.min(area._h - y, rect._h - (area._y - rect._y), rect._h, area._h);

          //no point drawing with no width or height
          if (h === 0 || w === 0) continue;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(rect._x, rect._y);
          ctx.lineTo(rect._x + rect._w, rect._y);
          ctx.lineTo(rect._x + rect._w, rect._h + rect._y);
          ctx.lineTo(rect._x, rect._h + rect._y);
          ctx.lineTo(rect._x, rect._y);

          ctx.clip();

          ent.draw();
          ctx.closePath();
          ctx.restore();

          //allow entity to re-register
          ent._changed = false;
        }

        //empty register
        register.length = 0;
        //all merged IDs are now invalid
        merged = {};
      }
    };
  })();

  Crafty.extend({
    /**@
     * #Crafty.isometric
     * @category 2D
     * Place entities in a 45deg isometric fashion.
     */
    isometric: {
      _tile: 0,
      _z: 0,

      /**@
       * #Crafty.isometric.size
       * @comp Crafty.isometric
       * @sign public this Crafty.isometric.size(Number tileSize)
       * @param tileSize - The size of the tiles to place.
       * Method used to initialize the size of the isometric placement.
       * Recommended to use a size alues in the power of `2` (128, 64 or 32). 
       * This makes it easy to calculate positions and implement zooming.
       * @see Crafty.isometric.place
       */
      size: function(tile) {
        this._tile = tile;
        return this;
      },

      /**@
       * #Crafty.isometric.place
       * @comp Crafty.isometric
       * @sign public this Crafty.isometric.size(Number x, Number y, Number z, Entity tile)
       * @param x - The `x` position to place the tile
       * @param y - The `y` position to place the tile
       * @param z - The `z` position or height to place the tile
       * @param tile - The entity that should be position in the isometric fashion
       * Use this method to place an entity in an isometric grid.
       * @see Crafty.isometric.size
       */
      place: function(x, y, z, obj) {
        var m = x * this._tile + (y & 1) * (this._tile / 2),
            n = y * this._tile / 4,
            n = n - z * (this._tile / 2);

        obj.attr({
          x: m + Crafty.viewport._x,
          y: n + Crafty.viewport._y
        }).z += z;
        return this;
      }
    }
  });

  Crafty.extend({
    /**@
     * #Crafty.audio
     * @category Audio
     * Add sound files and play them. Chooses best format for browser support.
     * Due to the nature of HTML5 audio, three types of audio files will be 
     * required for cross-browser capabilities. These formats are MP3, Ogg and WAV.
     */
    audio: {
      _elems: {},
      _muted: false,

      /**@
       * #Crafty.audio.MAX_CHANNELS
       * @comp Crafty.audio
       * Amount of Audio objects for a sound so overlapping of the 
       * same sound can occur. More channels means more of the same sound
       * playing at the same time.
       */
      MAX_CHANNELS: 5,

      type: {
        'mp3': 'audio/mpeg;',
        'ogg': 'audio/ogg; codecs="vorbis"',
        'wav': 'audio/wav; codecs="1"',
        'mp4': 'audio/mp4; codecs="mp4a.40.2"'
      },

      /**@
       * #Crafty.audio.add
       * @comp Crafty.audio
       * @sign public this Crafty.audio.add(String id, String url)
       * @param id - A string to reffer to sounds
       * @param url - A string pointing to the sound file
       * @sign public this Crafty.audio.add(String id, Array urls)
       * @param urls - Array of urls pointing to different format of the same sound, selecting the first that is playable
       * @sign public this Crafty.audio.add(Object map)
       * @param map - key-value pairs where the key is the `id` and the value is either a `url` or `urls`
       * 
       * Loads a sound to be played. Due to the nature of HTML5 audio, 
       * three types of audio files will be required for cross-browser capabilities. 
       * These formats are MP3, Ogg and WAV.
       *
       * Passing an array of URLs will determine which format the browser can play and select it over any other.
       *
       * Accepts an object where the key is the audio name and 
       * either a URL or an Array of URLs (to determine which type to use).
       *
       * The ID you use will be how you refer to that sound when using `Crafty.audio.play`.
       *
       * @example
       * ~~~
       * //adding audio from an object
       * Crafty.audio.add({
       *  shoot: ["sounds/shoot.wav",  
       *      "sounds/shoot.mp3", 
       *      "sounds/shoot.ogg"],
       * 
       *  coin: "sounds/coin.mp3"
       * });
       * 
       * //adding a single sound
       * Crafty.audio.add("walk", [
       *  "sounds/walk.mp3",
       *  "sounds/walk.ogg",
       *  "sounds/walk.wav"
       * ]);
       * 
       * //only one format
       * Crafty.audio.add("jump", "sounds/jump.mp3");
       * ~~~
       * @see Crafty.audio.play, Crafty.audio.settings
       */
      add: function(id, url) {
        if (!Crafty.support.audio) return this;

        var elem, key, audio = new Audio(),
            canplay, i = 0,
            sounds = [];

        //if an object is passed
        if (arguments.length === 1 && typeof id === "object") {
          for (key in id) {
            if (!id.hasOwnProperty(key)) continue;

            //if array passed, add fallback sources
            if (typeof id[key] !== "string") {
              var sources = id[key],
                  i = 0,
                  l = sources.length,
                  source;

              for (; i < l; ++i) {
                source = sources[i];
                //get the file extension
                ext = source.substr(source.lastIndexOf('.') + 1).toLowerCase();
                canplay = audio.canPlayType(this.type[ext]);

                //if browser can play this type, use it
                if (canplay !== "" && canplay !== "no") {
                  url = source;
                  break;
                }
              }
            } else {
              url = id[key];
            }

            for (; i < this.MAX_CHANNELS; i++) {
              audio = new Audio(url);
              audio.preload = "auto";
              audio.load();
              sounds.push(audio);
            }
            this._elems[key] = sounds;
            if (!Crafty.assets[url]) Crafty.assets[url] = this._elems[key][0];
          }

          return this;
        }
        //standard method
        if (typeof url !== "string") {
          var i = 0,
              l = url.length,
              source;

          for (; i < l; ++i) {
            source = url[i];
            //get the file extension
            ext = source.substr(source.lastIndexOf('.') + 1);
            canplay = audio.canPlayType(this.type[ext]);

            //if browser can play this type, use it
            if (canplay !== "" && canplay !== "no") {
              url = source;
              break;
            }
          }
        }

        //create a new Audio object and add it to assets
        for (; i < this.MAX_CHANNELS; i++) {
          audio = new Audio(url);
          audio.preload = "auto";
          audio.load();
          sounds.push(audio);
        }
        this._elems[id] = sounds;
        if (!Crafty.assets[url]) Crafty.assets[url] = this._elems[id][0];

        return this;
      },
      /**@
       * #Crafty.audio.play
       * @sign public this Crafty.audio.play(String id)
       * @sign public this Crafty.audio.play(String id, Number repeatCount)
       * @param id - A string to reffer to sounds
       * @param repeatCount - Repeat count for the file, where -1 stands for repeat forever.
       * 
       * Will play a sound previously added by using the ID that was used in `Crafty.audio.add`.
       * Has a default maximum of 5 channels so that the same sound can play simultaneously unless all of the channels are playing. 
       
       * *Note that the implementation of HTML5 Audio is buggy at best.*
       *
       * @example
       * ~~~
       * Crafty.audio.play("walk");
       *
       * //play and repeat forever
       * Crafty.audio.play("backgroundMusic", -1);
       * ~~~
       * @see Crafty.audio.add, Crafty.audio.settings
       */
      play: function(id, repeat) {
        if (!Crafty.support.audio) return;

        var sounds = this._elems[id],
            sound, i = 0,
            l = sounds.length;

        for (; i < l; i++) {
          sound = sounds[i];
          //go through the channels and play a sound that is stopped
          if (sound.ended || !sound.currentTime) {
            sound.play();
            break;
          } else if (i === l - 1) { //if all sounds playing, try stop the last one
            sound.currentTime = 0;
            sound.play();
          }
        }
        if (typeof repeat == "number") {
          var j = 0;
          //i is still set to the sound we played
          sounds[i].addEventListener('ended', function() {
            if (repeat == -1 || j <= repeat) {
              this.currentTime = 0;
              j++;
            }
          }, false);
        }
        return this;
      },

      /**@
       * #Crafty.audio.settings
       * @comp Crafty.audio
       * @sign public this Crafty.audio.settings(String id, Object settings)
       * @param id - The audio instance added by `Crafty.audio.add`
       * @param settings - An object where the key is the setting and the value is what to modify the setting with
       * Used to modify settings of the HTML5 `Audio` object. For a list of all the settings available,
       * see the [Mozilla Documentation](https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIDOMHTMLMediaElement).
       */
      settings: function(id, settings) {
        //apply to all
        if (!settings) {
          for (var key in this._elems) {
            this.settings(key, id);
          }
          return this;
        }

        var sounds = this._elems[id],
            sound, setting, i = 0,
            l = sounds.length;

        for (var setting in settings) {
          for (; i < l; i++) {
            sound = sounds[i];
            sound[setting] = settings[setting];
          }
        }

        return this;
      },

      /**@
       * #Crafty.audio.mute
       * @sign public this Crafty.audio.mute(void)
       * Mute or unmute every Audio instance that is playing. Toggles between
       * pausing or playing depending on the state.
       */
      mute: function() {
        var sounds, sound, i, l, elem;

        //loop over every sound
        for (sounds in this._elems) {
          elem = this._elems[sounds];

          //loop over every channel for a sound
          for (i = 0, l = elem.length; i < l; ++i) {
            sound = elem[i];

            //if playing, stop
            if (!sound.ended && sound.currentTime) {
              if (this._muted) sound.pause();
              else sound.play();
            }
          }
        }
        this._muted = !this._muted;
        return this;
      }
    }
  });

  //stop sounds on Pause
  Crafty.bind("Pause", function() {
    Crafty.audio.mute()
  });
  Crafty.bind("Unpause", function() {
    Crafty.audio.mute()
  });

  /**@
   * #Text
   * @category Graphics
   * @requires DOM
   * Component to draw text inside the body of an entity. Only works for DOM elements.
   */
  Crafty.c("Text", {
    _text: "",

    init: function() {
      this.bind("Draw", function(e) {
        if (e.type === "DOM") {
          var el = this._element,
              style = el.style;
          el.innerHTML = this._text;
        }
      });
    },

    /**@
     * #.text
     * @comp Text
     * @sign public this .text(String text)
     * @param text - String of text that will be inserted into the DOM element. Can use HTML.
     * This method will update the text inside the entity. To modify the font, use the `.css` method
     * inherited from the DOM component.
     */
    text: function(text) {
      if (!text) return this._text;
      this._text = text;
      this.trigger("Change");
      return this;
    }
  });

  Crafty.extend({
    /**@
     * #Crafty.assets
     * @category Assets
     * An object containing every asset used in the current Crafty game. 
     * The key is the URL and the value is the `Audio` or `Image` object.
     *
     * If loading an asset, check that it is in this object first to avoid loading twice.
     * @example
     * ~~~
     * var isLoaded = !!Crafty.assets["images/sprite.png"];
     * ~~~
     */
    assets: {},

    /**@
     * #Crafty.loader
     * @category Assets
     * @sign public void Crafty.load(Array assets, Function onLoad[, Function onProgress, Function onError])
     * @param assets - Array of assets to load (accepts sounds and images)
     * @param onLoad - Callback when the assets are loaded
     * @param onProgress - Callback when an asset is loaded. Contains information about assets loaded
     * @param onError - Callback when an asset fails to load
     * Preloader for all assets. Takes an array of URLs and 
     * adds them to the `Crafty.assets` object.
     * 
     * The `onProgress` function will be passed on object with information about 
     * the progress including how many assets loaded, total of all the assets to 
     * load and a percentage of the progress.
     *
     * `onError` will be passed with the asset that couldn't load.
     * 
     * @example
     * ~~~
     * Crafty.load(["images/sprite.png", "sounds/jump.mp3"], 
     *     function() {
     *         //when loaded
     *         Crafty.scene("main"); //go to main scene
     *     },
     *
     *     function(e) {
     *      //progress
     *     },
     *
     *     function(e) {
     *        //uh oh, error loading
     *     }
     * );
     * ~~~
     * @see Crafty.assets
     */
    load: function(data, oncomplete, onprogress, onerror) {
      var i = 0,
          l = data.length,
          current, obj, total = l,
          j = 0,
          ext;
      for (; i < l; ++i) {
        current = data[i];
        ext = current.substr(current.lastIndexOf('.') + 1).toLowerCase();

        if (Crafty.support.audio && (ext === "mp3" || ext === "wav" || ext === "ogg" || ext === "mp4")) {
          obj = new Audio(current);
          //Chrome doesn't trigger onload on audio, see http://code.google.com/p/chromium/issues/detail?id=77794
          if (navigator.userAgent.indexOf('Chrome') != -1) j++;
        } else if (ext === "jpg" || ext === "jpeg" || ext === "gif" || ext === "png") {
          obj = new Image();
          obj.src = current;
        } else {
          total--;
          continue; //skip if not applicable
        }

        //add to global asset collection
        this.assets[current] = obj;

        obj.onload = function() {
          ++j;

          //if progress callback, give information of assets loaded, total and percent
          if (onprogress) {
            onprogress.call(this, {
              loaded: j,
              total: total,
              percent: (j / total * 100)
            });
          }
          if (j === total) {
            if (oncomplete) oncomplete();
          }
        };

        //if there is an error, pass it in the callback (this will be the object that didn't load)
        obj.onerror = function() {
          if (onerror) {
            onerror.call(this, {
              loaded: j,
              total: total,
              percent: (j / total * 100)
            });
          } else {
            j++;
            if (j === total) {
              if (oncomplete) oncomplete();
            }
          }
        };
      }
    }
  });

})(Crafty, window, window.document);
var number_with_delimiter = function (number, delimiter, separator) {
  try {
    var delimiter = delimiter || ",";
    var separator = separator || ".";
    
    var parts = number.toString().split('.');
    parts[0] = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter);
    return parts.join(separator);
  } catch(e) {
    return number
  }
}
;
/*
 * Facebox (for jQuery)
 * version: 1.3
 * @requires jQuery v1.2 or later
 * @homepage https://github.com/defunkt/facebox
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright Forever Chris Wanstrath, Kyle Neath
 *
 * Usage:
 *
 *  jQuery(document).ready(function() {
 *    jQuery('a[rel*=facebox]').facebox()
 *  })
 *
 *  <a href="#terms" rel="facebox">Terms</a>
 *    Loads the #terms div in the box
 *
 *  <a href="terms.html" rel="facebox">Terms</a>
 *    Loads the terms.html page in the box
 *
 *  <a href="terms.png" rel="facebox">Terms</a>
 *    Loads the terms.png image in the box
 *
 *
 *  You can also use it programmatically:
 *
 *    jQuery.facebox('some html')
 *    jQuery.facebox('some html', 'my-groovy-style')
 *
 *  The above will open a facebox with "some html" as the content.
 *
 *    jQuery.facebox(function($) {
 *      $.get('blah.html', function(data) { $.facebox(data) })
 *    })
 *
 *  The above will show a loading screen before the passed function is called,
 *  allowing for a better ajaxy experience.
 *
 *  The facebox function can also display an ajax page, an image, or the contents of a div:
 *
 *    jQuery.facebox({ ajax: 'remote.html' })
 *    jQuery.facebox({ ajax: 'remote.html' }, 'my-groovy-style')
 *    jQuery.facebox({ image: 'stairs.jpg' })
 *    jQuery.facebox({ image: 'stairs.jpg' }, 'my-groovy-style')
 *    jQuery.facebox({ div: '#box' })
 *    jQuery.facebox({ div: '#box' }, 'my-groovy-style')
 *
 *  Want to close the facebox?  Trigger the 'close.facebox' document event:
 *
 *    jQuery(document).trigger('close.facebox')
 *
 *  Facebox also has a bunch of other hooks:
 *
 *    loading.facebox
 *    beforeReveal.facebox
 *    reveal.facebox (aliased as 'afterReveal.facebox')
 *    init.facebox
 *    afterClose.facebox
 *
 *  Simply bind a function to any of these hooks:
 *
 *   $(document).bind('reveal.facebox', function() { ...stuff to do after the facebox and contents are revealed... })
 *
 */

(function($) {
  $.facebox = function(data, klass) {
    $.facebox.loading()

    if (data.ajax) fillFaceboxFromAjax(data.ajax, klass)
    else if (data.image) fillFaceboxFromImage(data.image, klass)
    else if (data.div) fillFaceboxFromHref(data.div, klass)
    else if ($.isFunction(data)) data.call($)
    else $.facebox.reveal(data, klass)
  }

  /*
   * Public, $.facebox methods
   */

  $.extend($.facebox, {
    settings: {
      opacity      : 0.6,
      overlay      : true,
      loadingImage : '/assets/loading.gif',
      closeImage   : '/assets/closelabel.png',
      imageTypes   : [ 'png', 'jpg', 'jpeg', 'gif' ],
      faceboxHtml  : '\
    <div id="facebox" style="display:none;"> \
      <div class="popup"> \
        <div class="content"> \
        </div> \
        <a href="#" class="cancel btn danger">Close</a> \
      </div> \
    </div>'
    },

    loading: function() {
      init()
      if ($('#facebox .loading').length == 1) return true
      showOverlay()

      $('#facebox .content').empty().
        append('<div class="loading"><img src="'+$.facebox.settings.loadingImage+'"/></div>')

      $('#facebox').show().css({
        top:	getPageScroll()[1] + (getPageHeight() / 10),
        left:	$(window).width() / 2 - ($('#facebox .popup').outerWidth() / 2)
      })

      $(document).bind('keydown.facebox', function(e) {
        if (e.keyCode == 27) $.facebox.close()
        return true
      })
      $(document).trigger('loading.facebox')
    },

    reveal: function(data, klass) {
      $(document).trigger('beforeReveal.facebox')
      if (klass) $('#facebox .content').addClass(klass)
      $('#facebox .content').empty().append(data)
      $('#facebox .popup').children().fadeIn('normal')
      $('#facebox').css('left', $(window).width() / 2 - ($('#facebox .popup').outerWidth() / 2))
      $(document).trigger('reveal.facebox').trigger('afterReveal.facebox')
    },

    close: function() {
      $(document).trigger('close.facebox')
      return false
    }
  })

  /*
   * Public, $.fn methods
   */

  $.fn.facebox = function(settings) {
    if ($(this).length == 0) return

    init(settings)

    function clickHandler() {
      $.facebox.loading(true)

      // support for rel="facebox.inline_popup" syntax, to add a class
      // also supports deprecated "facebox[.inline_popup]" syntax
      var klass = this.rel.match(/facebox\[?\.(\w+)\]?/)
      if (klass) klass = klass[1]

      fillFaceboxFromHref(this.href, klass)
      return false
    }

    return this.bind('click.facebox', clickHandler)
  }

  /*
   * Private methods
   */

  // called one time to setup facebox on this page
  function init(settings) {
    if ($.facebox.settings.inited) return true
    else $.facebox.settings.inited = true

    $(document).trigger('init.facebox')
    makeCompatible()

    var imageTypes = $.facebox.settings.imageTypes.join('|')
    $.facebox.settings.imageTypesRegexp = new RegExp('\\.(' + imageTypes + ')(\\?.*)?$', 'i')

    if (settings) $.extend($.facebox.settings, settings)
    $('body').append($.facebox.settings.faceboxHtml)

    var preload = [ new Image(), new Image() ]
    preload[0].src = $.facebox.settings.closeImage
    preload[1].src = $.facebox.settings.loadingImage

    $('#facebox').find('.b:first, .bl').each(function() {
      preload.push(new Image())
      preload.slice(-1).src = $(this).css('background-image').replace(/url\((.+)\)/, '$1')
    })

    $('#facebox .cancel')
      .click($.facebox.close)
      // .append('<img src="'
      //         + $.facebox.settings.closeImage
      //         + '" class="close_image" title="close">')
  }

  // getPageScroll() by quirksmode.com
  function getPageScroll() {
    var xScroll, yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
      xScroll = self.pageXOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
      xScroll = document.documentElement.scrollLeft;
    } else if (document.body) {// all other Explorers
      yScroll = document.body.scrollTop;
      xScroll = document.body.scrollLeft;
    }
    return new Array(xScroll,yScroll)
  }

  // Adapted from getPageSize() by quirksmode.com
  function getPageHeight() {
    var windowHeight
    if (self.innerHeight) {	// all except Explorer
      windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
      windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
      windowHeight = document.body.clientHeight;
    }
    return windowHeight
  }

  // Backwards compatibility
  function makeCompatible() {
    var $s = $.facebox.settings

    $s.loadingImage = $s.loading_image || $s.loadingImage
    $s.closeImage = $s.close_image || $s.closeImage
    $s.imageTypes = $s.image_types || $s.imageTypes
    $s.faceboxHtml = $s.facebox_html || $s.faceboxHtml
  }

  // Figures out what you want to display and displays it
  // formats are:
  //     div: #id
  //   image: blah.extension
  //    ajax: anything else
  function fillFaceboxFromHref(href, klass) {
    // div
    if (href.match(/#/)) {
      var url    = window.location.href.split('#')[0]
      var target = href.replace(url,'')
      if (target == '#') return
      $.facebox.reveal($(target).html(), klass)

    // image
    } else if (href.match($.facebox.settings.imageTypesRegexp)) {
      fillFaceboxFromImage(href, klass)
    // ajax
    } else {
      fillFaceboxFromAjax(href, klass)
    }
  }

  function fillFaceboxFromImage(href, klass) {
    var image = new Image()
    image.onload = function() {
      $.facebox.reveal('<div class="image"><img src="' + image.src + '" /></div>', klass)
    }
    image.src = href
  }

  function fillFaceboxFromAjax(href, klass) {
    $.get(href, function(data) { $.facebox.reveal(data, klass) })
  }

  function skipOverlay() {
    return $.facebox.settings.overlay == false || $.facebox.settings.opacity === null
  }

  function showOverlay() {
    if (skipOverlay()) return

    if ($('#facebox_overlay').length == 0)
      $("body").append('<div id="facebox_overlay" class="facebox_hide"></div>')

    $('#facebox_overlay').hide().addClass("facebox_overlayBG")
      .css('opacity', $.facebox.settings.opacity)
      .click(function() { $(document).trigger('close.facebox') })
      .fadeIn(200)
    return false
  }

  function hideOverlay() {
    if (skipOverlay()) return

    $('#facebox_overlay').fadeOut(200, function(){
      $("#facebox_overlay").removeClass("facebox_overlayBG")
      $("#facebox_overlay").addClass("facebox_hide")
      $("#facebox_overlay").remove()
    })

    return false
  }

  /*
   * Bindings
   */

  $(document).bind('close.facebox', function() {
    $(document).unbind('keydown.facebox')
    $('#facebox').fadeOut(function() {
      $('#facebox .content').removeClass().addClass('content')
      $('#facebox .loading').remove()
      $(document).trigger('afterClose.facebox')
    })
    hideOverlay()
  })

})(jQuery);
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

(function($){
    $.defaultText = function(opts) {
        var selector = 'input:text[title],textarea[title]',
            ctx = opts && opts.context ? opts.context : 'body',
            css = opts && opts.css ? opts.css : 'default',
            form_clear = [{selector: 'form', type:'submit'}];
            clear_events = opts && opts.clearEvents ? form_clear.concat(opts.clearEvents) : form_clear;
        
        $(ctx).delegate(selector, 'focusin', function(e){
            e.stopPropagation();
            onFocus($(this));
        }).delegate(selector, 'focusout', function(e){
            e.stopPropagation();
            var ele = $(this),
                title = ele.attr('title'),
                val = ele.val();
            if ($.trim(val) === '' || val === title) ele.val(title).addClass(css); 
        });
        
        //$(selector).trigger('focusout');
        
        $.each(clear_events, function(i, event){
            
            var type = event.type,
                ele = $(event.selector),
                len = ele.length;
            
            if (ele.size()) {
                var ev_queue = $.data( ele.get(0), "events" );

                if (ev_queue) {
                    for (var x=0; x < len; x++) {
                        var events = $.data( ele.get(x), "events" );

                        if(typeof events != 'undefined') {
                            events[type].unshift({
                                type : type,
                                guid : null,
                                namespace : "",
                                data : undefined,
                                handler: function() {
                                    blink();
                                }
                            });    
                        }
                        
                    }
                } else {
                    ele.bind(type, function(){
                        blink();
                    });
                }
                
            } 
            
        });
        
        function onFocus(ele) {
            var title = ele.attr('title'),
                val = ele.val();
            ele.removeClass(css);
            if (title === val) ele.val('');
        }
        
        function blink(){
            $(selector).each(function(){
                onFocus($(this));
            });
            setTimeout(function(){
                $(selector).trigger('focusout'); 
            }, 1);
        }
    }
})(jQuery);
/*
 * jQuery UI Effects 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/
 */

;jQuery.effects || (function($, undefined) {

$.effects = {};



/******************************************************************************/
/****************************** COLOR ANIMATIONS ******************************/
/******************************************************************************/

// override the animation for color styles
$.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor',
	'borderRightColor', 'borderTopColor', 'borderColor', 'color', 'outlineColor'],
function(i, attr) {
	$.fx.step[attr] = function(fx) {
		if (!fx.colorInit) {
			fx.start = getColor(fx.elem, attr);
			fx.end = getRGB(fx.end);
			fx.colorInit = true;
		}

		fx.elem.style[attr] = 'rgb(' +
			Math.max(Math.min(parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2], 10), 255), 0) + ')';
	};
});

// Color Conversion functions from highlightFade
// By Blair Mitchelmore
// http://jquery.offput.ca/highlightFade/

// Parse strings looking for color tuples [255,255,255]
function getRGB(color) {
		var result;

		// Check if we're already dealing with an array of colors
		if ( color && color.constructor == Array && color.length == 3 )
				return color;

		// Look for rgb(num,num,num)
		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
				return [parseInt(result[1],10), parseInt(result[2],10), parseInt(result[3],10)];

		// Look for rgb(num%,num%,num%)
		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
				return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

		// Look for #a0b1c2
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
				return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		// Look for #fff
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
				return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

		// Look for rgba(0, 0, 0, 0) == transparent in Safari 3
		if (result = /rgba\(0, 0, 0, 0\)/.exec(color))
				return colors['transparent'];

		// Otherwise, we're most likely dealing with a named color
		return colors[$.trim(color).toLowerCase()];
}

function getColor(elem, attr) {
		var color;

		do {
				color = $.curCSS(elem, attr);

				// Keep going until we find an element that has color, or we hit the body
				if ( color != '' && color != 'transparent' || $.nodeName(elem, "body") )
						break;

				attr = "backgroundColor";
		} while ( elem = elem.parentNode );

		return getRGB(color);
};

// Some named colors to work with
// From Interface by Stefan Petre
// http://interface.eyecon.ro/

var colors = {
	aqua:[0,255,255],
	azure:[240,255,255],
	beige:[245,245,220],
	black:[0,0,0],
	blue:[0,0,255],
	brown:[165,42,42],
	cyan:[0,255,255],
	darkblue:[0,0,139],
	darkcyan:[0,139,139],
	darkgrey:[169,169,169],
	darkgreen:[0,100,0],
	darkkhaki:[189,183,107],
	darkmagenta:[139,0,139],
	darkolivegreen:[85,107,47],
	darkorange:[255,140,0],
	darkorchid:[153,50,204],
	darkred:[139,0,0],
	darksalmon:[233,150,122],
	darkviolet:[148,0,211],
	fuchsia:[255,0,255],
	gold:[255,215,0],
	green:[0,128,0],
	indigo:[75,0,130],
	khaki:[240,230,140],
	lightblue:[173,216,230],
	lightcyan:[224,255,255],
	lightgreen:[144,238,144],
	lightgrey:[211,211,211],
	lightpink:[255,182,193],
	lightyellow:[255,255,224],
	lime:[0,255,0],
	magenta:[255,0,255],
	maroon:[128,0,0],
	navy:[0,0,128],
	olive:[128,128,0],
	orange:[255,165,0],
	pink:[255,192,203],
	purple:[128,0,128],
	violet:[128,0,128],
	red:[255,0,0],
	silver:[192,192,192],
	white:[255,255,255],
	yellow:[255,255,0],
	transparent: [255,255,255]
};



/******************************************************************************/
/****************************** CLASS ANIMATIONS ******************************/
/******************************************************************************/

var classAnimationActions = ['add', 'remove', 'toggle'],
	shorthandStyles = {
		border: 1,
		borderBottom: 1,
		borderColor: 1,
		borderLeft: 1,
		borderRight: 1,
		borderTop: 1,
		borderWidth: 1,
		margin: 1,
		padding: 1
	};

function getElementStyles() {
	var style = document.defaultView
			? document.defaultView.getComputedStyle(this, null)
			: this.currentStyle,
		newStyle = {},
		key,
		camelCase;

	// webkit enumerates style porperties
	if (style && style.length && style[0] && style[style[0]]) {
		var len = style.length;
		while (len--) {
			key = style[len];
			if (typeof style[key] == 'string') {
				camelCase = key.replace(/\-(\w)/g, function(all, letter){
					return letter.toUpperCase();
				});
				newStyle[camelCase] = style[key];
			}
		}
	} else {
		for (key in style) {
			if (typeof style[key] === 'string') {
				newStyle[key] = style[key];
			}
		}
	}
	
	return newStyle;
}

function filterStyles(styles) {
	var name, value;
	for (name in styles) {
		value = styles[name];
		if (
			// ignore null and undefined values
			value == null ||
			// ignore functions (when does this occur?)
			$.isFunction(value) ||
			// shorthand styles that need to be expanded
			name in shorthandStyles ||
			// ignore scrollbars (break in IE)
			(/scrollbar/).test(name) ||

			// only colors or values that can be converted to numbers
			(!(/color/i).test(name) && isNaN(parseFloat(value)))
		) {
			delete styles[name];
		}
	}
	
	return styles;
}

function styleDifference(oldStyle, newStyle) {
	var diff = { _: 0 }, // http://dev.jquery.com/ticket/5459
		name;

	for (name in newStyle) {
		if (oldStyle[name] != newStyle[name]) {
			diff[name] = newStyle[name];
		}
	}

	return diff;
}

$.effects.animateClass = function(value, duration, easing, callback) {
	if ($.isFunction(easing)) {
		callback = easing;
		easing = null;
	}

	return this.queue(function() {
		var that = $(this),
			originalStyleAttr = that.attr('style') || ' ',
			originalStyle = filterStyles(getElementStyles.call(this)),
			newStyle,
			className = that.attr('class');

		$.each(classAnimationActions, function(i, action) {
			if (value[action]) {
				that[action + 'Class'](value[action]);
			}
		});
		newStyle = filterStyles(getElementStyles.call(this));
		that.attr('class', className);

		that.animate(styleDifference(originalStyle, newStyle), {
			queue: false,
			duration: duration,
			easing: easing,
			complete: function() {
				$.each(classAnimationActions, function(i, action) {
					if (value[action]) { that[action + 'Class'](value[action]); }
				});
				// work around bug in IE by clearing the cssText before setting it
				if (typeof that.attr('style') == 'object') {
					that.attr('style').cssText = '';
					that.attr('style').cssText = originalStyleAttr;
				} else {
					that.attr('style', originalStyleAttr);
				}
				if (callback) { callback.apply(this, arguments); }
				$.dequeue( this );
			}
		});
	});
};

$.fn.extend({
	_addClass: $.fn.addClass,
	addClass: function(classNames, speed, easing, callback) {
		return speed ? $.effects.animateClass.apply(this, [{ add: classNames },speed,easing,callback]) : this._addClass(classNames);
	},

	_removeClass: $.fn.removeClass,
	removeClass: function(classNames,speed,easing,callback) {
		return speed ? $.effects.animateClass.apply(this, [{ remove: classNames },speed,easing,callback]) : this._removeClass(classNames);
	},

	_toggleClass: $.fn.toggleClass,
	toggleClass: function(classNames, force, speed, easing, callback) {
		if ( typeof force == "boolean" || force === undefined ) {
			if ( !speed ) {
				// without speed parameter;
				return this._toggleClass(classNames, force);
			} else {
				return $.effects.animateClass.apply(this, [(force?{add:classNames}:{remove:classNames}),speed,easing,callback]);
			}
		} else {
			// without switch parameter;
			return $.effects.animateClass.apply(this, [{ toggle: classNames },force,speed,easing]);
		}
	},

	switchClass: function(remove,add,speed,easing,callback) {
		return $.effects.animateClass.apply(this, [{ add: add, remove: remove },speed,easing,callback]);
	}
});



/******************************************************************************/
/*********************************** EFFECTS **********************************/
/******************************************************************************/

$.extend($.effects, {
	version: "1.8.16",

	// Saves a set of properties in a data storage
	save: function(element, set) {
		for(var i=0; i < set.length; i++) {
			if(set[i] !== null) element.data("ec.storage."+set[i], element[0].style[set[i]]);
		}
	},

	// Restores a set of previously saved properties from a data storage
	restore: function(element, set) {
		for(var i=0; i < set.length; i++) {
			if(set[i] !== null) element.css(set[i], element.data("ec.storage."+set[i]));
		}
	},

	setMode: function(el, mode) {
		if (mode == 'toggle') mode = el.is(':hidden') ? 'show' : 'hide'; // Set for toggle
		return mode;
	},

	getBaseline: function(origin, original) { // Translates a [top,left] array into a baseline value
		// this should be a little more flexible in the future to handle a string & hash
		var y, x;
		switch (origin[0]) {
			case 'top': y = 0; break;
			case 'middle': y = 0.5; break;
			case 'bottom': y = 1; break;
			default: y = origin[0] / original.height;
		};
		switch (origin[1]) {
			case 'left': x = 0; break;
			case 'center': x = 0.5; break;
			case 'right': x = 1; break;
			default: x = origin[1] / original.width;
		};
		return {x: x, y: y};
	},

	// Wraps the element around a wrapper that copies position properties
	createWrapper: function(element) {

		// if the element is already wrapped, return it
		if (element.parent().is('.ui-effects-wrapper')) {
			return element.parent();
		}

		// wrap the element
		var props = {
				width: element.outerWidth(true),
				height: element.outerHeight(true),
				'float': element.css('float')
			},
			wrapper = $('<div></div>')
				.addClass('ui-effects-wrapper')
				.css({
					fontSize: '100%',
					background: 'transparent',
					border: 'none',
					margin: 0,
					padding: 0
				}),
			active = document.activeElement;

		element.wrap(wrapper);

		// Fixes #7595 - Elements lose focus when wrapped.
		if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
			$( active ).focus();
		}
		
		wrapper = element.parent(); //Hotfix for jQuery 1.4 since some change in wrap() seems to actually loose the reference to the wrapped element

		// transfer positioning properties to the wrapper
		if (element.css('position') == 'static') {
			wrapper.css({ position: 'relative' });
			element.css({ position: 'relative' });
		} else {
			$.extend(props, {
				position: element.css('position'),
				zIndex: element.css('z-index')
			});
			$.each(['top', 'left', 'bottom', 'right'], function(i, pos) {
				props[pos] = element.css(pos);
				if (isNaN(parseInt(props[pos], 10))) {
					props[pos] = 'auto';
				}
			});
			element.css({position: 'relative', top: 0, left: 0, right: 'auto', bottom: 'auto' });
		}

		return wrapper.css(props).show();
	},

	removeWrapper: function(element) {
		var parent,
			active = document.activeElement;
		
		if (element.parent().is('.ui-effects-wrapper')) {
			parent = element.parent().replaceWith(element);
			// Fixes #7595 - Elements lose focus when wrapped.
			if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
				$( active ).focus();
			}
			return parent;
		}
			
		return element;
	},

	setTransition: function(element, list, factor, value) {
		value = value || {};
		$.each(list, function(i, x){
			unit = element.cssUnit(x);
			if (unit[0] > 0) value[x] = unit[0] * factor + unit[1];
		});
		return value;
	}
});


function _normalizeArguments(effect, options, speed, callback) {
	// shift params for method overloading
	if (typeof effect == 'object') {
		callback = options;
		speed = null;
		options = effect;
		effect = options.effect;
	}
	if ($.isFunction(options)) {
		callback = options;
		speed = null;
		options = {};
	}
        if (typeof options == 'number' || $.fx.speeds[options]) {
		callback = speed;
		speed = options;
		options = {};
	}
	if ($.isFunction(speed)) {
		callback = speed;
		speed = null;
	}

	options = options || {};

	speed = speed || options.duration;
	speed = $.fx.off ? 0 : typeof speed == 'number'
		? speed : speed in $.fx.speeds ? $.fx.speeds[speed] : $.fx.speeds._default;

	callback = callback || options.complete;

	return [effect, options, speed, callback];
}

function standardSpeed( speed ) {
	// valid standard speeds
	if ( !speed || typeof speed === "number" || $.fx.speeds[ speed ] ) {
		return true;
	}
	
	// invalid strings - treat as "normal" speed
	if ( typeof speed === "string" && !$.effects[ speed ] ) {
		return true;
	}
	
	return false;
}

$.fn.extend({
	effect: function(effect, options, speed, callback) {
		var args = _normalizeArguments.apply(this, arguments),
			// TODO: make effects take actual parameters instead of a hash
			args2 = {
				options: args[1],
				duration: args[2],
				callback: args[3]
			},
			mode = args2.options.mode,
			effectMethod = $.effects[effect];
		
		if ( $.fx.off || !effectMethod ) {
			// delegate to the original method (e.g., .show()) if possible
			if ( mode ) {
				return this[ mode ]( args2.duration, args2.callback );
			} else {
				return this.each(function() {
					if ( args2.callback ) {
						args2.callback.call( this );
					}
				});
			}
		}
		
		return effectMethod.call(this, args2);
	},

	_show: $.fn.show,
	show: function(speed) {
		if ( standardSpeed( speed ) ) {
			return this._show.apply(this, arguments);
		} else {
			var args = _normalizeArguments.apply(this, arguments);
			args[1].mode = 'show';
			return this.effect.apply(this, args);
		}
	},

	_hide: $.fn.hide,
	hide: function(speed) {
		if ( standardSpeed( speed ) ) {
			return this._hide.apply(this, arguments);
		} else {
			var args = _normalizeArguments.apply(this, arguments);
			args[1].mode = 'hide';
			return this.effect.apply(this, args);
		}
	},

	// jQuery core overloads toggle and creates _toggle
	__toggle: $.fn.toggle,
	toggle: function(speed) {
		if ( standardSpeed( speed ) || typeof speed === "boolean" || $.isFunction( speed ) ) {
			return this.__toggle.apply(this, arguments);
		} else {
			var args = _normalizeArguments.apply(this, arguments);
			args[1].mode = 'toggle';
			return this.effect.apply(this, args);
		}
	},

	// helper functions
	cssUnit: function(key) {
		var style = this.css(key), val = [];
		$.each( ['em','px','%','pt'], function(i, unit){
			if(style.indexOf(unit) > 0)
				val = [parseFloat(style), unit];
		});
		return val;
	}
});



/******************************************************************************/
/*********************************** EASING ***********************************/
/******************************************************************************/

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
$.easing.jswing = $.easing.swing;

$.extend($.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert($.easing.default);
		return $.easing[$.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

})(jQuery);
/*
 * jQuery UI Effects Pulsate 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Pulsate
 *
 * Depends:
 *	jquery.effects.core.js
 */

(function( $, undefined ) {

$.effects.pulsate = function(o) {
	return this.queue(function() {
		var elem = $(this),
			mode = $.effects.setMode(elem, o.options.mode || 'show');
			times = ((o.options.times || 5) * 2) - 1;
			duration = o.duration ? o.duration / 2 : $.fx.speeds._default / 2,
			isVisible = elem.is(':visible'),
			animateTo = 0;

		if (!isVisible) {
			elem.css('opacity', 0).show();
			animateTo = 1;
		}

		if ((mode == 'hide' && isVisible) || (mode == 'show' && !isVisible)) {
			times--;
		}

		for (var i = 0; i < times; i++) {
			elem.animate({ opacity: animateTo }, duration, o.options.easing);
			animateTo = (animateTo + 1) % 2;
		}

		elem.animate({ opacity: animateTo }, duration, o.options.easing, function() {
			if (animateTo == 0) {
				elem.hide();
			}
			(o.callback && o.callback.apply(this, arguments));
		});

		elem
			.queue('fx', function() { elem.dequeue(); })
			.dequeue();
	});
};

})(jQuery);
/*
 * jQuery UI Effects Shake 1.8.16
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Shake
 *
 * Depends:
 *	jquery.effects.core.js
 */

(function( $, undefined ) {

$.effects.shake = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','bottom','left','right'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var direction = o.options.direction || 'left'; // Default direction
		var distance = o.options.distance || 20; // Default distance
		var times = o.options.times || 3; // Default # of times
		var speed = o.duration || o.options.duration || 140; // Default speed per shake

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';

		// Animation
		var animation = {}, animation1 = {}, animation2 = {};
		animation[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
		animation1[ref] = (motion == 'pos' ? '+=' : '-=')  + distance * 2;
		animation2[ref] = (motion == 'pos' ? '-=' : '+=')  + distance * 2;

		// Animate
		el.animate(animation, speed, o.options.easing);
		for (var i = 1; i < times; i++) { // Shakes
			el.animate(animation1, speed, o.options.easing).animate(animation2, speed, o.options.easing);
		};
		el.animate(animation1, speed, o.options.easing).
		animate(animation, speed / 2, o.options.easing, function(){ // Last shake
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(this, arguments); // Callback
		});
		el.queue('fx', function() { el.dequeue(); });
		el.dequeue();
	});

};

})(jQuery);
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


(function($) {

    $.fn.editable = function(target, options) {
            
        if ('disable' == target) {
            $(this).data('disabled.editable', true);
            return;
        }
        if ('enable' == target) {
            $(this).data('disabled.editable', false);
            return;
        }
        if ('destroy' == target) {
            $(this)
                .unbind($(this).data('event.editable'))
                .removeData('disabled.editable')
                .removeData('event.editable');
            return;
        }
        
        var settings = $.extend({}, $.fn.editable.defaults, {target:target}, options);
        
        /* setup some functions */
        var plugin   = $.editable.types[settings.type].plugin || function() { };
        var submit   = $.editable.types[settings.type].submit || function() { };
        var buttons  = $.editable.types[settings.type].buttons 
                    || $.editable.types['defaults'].buttons;
        var content  = $.editable.types[settings.type].content 
                    || $.editable.types['defaults'].content;
        var element  = $.editable.types[settings.type].element 
                    || $.editable.types['defaults'].element;
        var reset    = $.editable.types[settings.type].reset 
                    || $.editable.types['defaults'].reset;
        var callback = settings.callback || function() { };
        var onedit   = settings.onedit   || function() { }; 
        var onsubmit = settings.onsubmit || function() { };
        var onreset  = settings.onreset  || function() { };
        var onerror  = settings.onerror  || reset;
          
        /* show tooltip */
        if (settings.tooltip) {
            $(this).attr('title', settings.tooltip);
        }
        
        settings.autowidth  = 'auto' == settings.width;
        settings.autoheight = 'auto' == settings.height;
        
        return this.each(function() {
                        
            /* save this to self because this changes when scope changes */
            var self = this;  
                   
            /* inlined block elements lose their width and height after first edit */
            /* save them for later use as workaround */
            var savedwidth  = $(self).width();
            var savedheight = $(self).height();
            
            /* save so it can be later used by $.editable('destroy') */
            $(this).data('event.editable', settings.event);
            
            /* if element is empty add something clickable (if requested) */
            if (!$.trim($(this).html())) {
                $(this).html(settings.placeholder);
            }
            
            $(this).bind(settings.event, function(e) {
                
                /* abort if disabled for this element */
                if (true === $(this).data('disabled.editable')) {
                    return;
                }
                
                /* prevent throwing an exeption if edit field is clicked again */
                if (self.editing) {
                    return;
                }
                
                /* abort if onedit hook returns false */
                if (false === onedit.apply(this, [settings, self])) {
                   return;
                }
                
                /* prevent default action and bubbling */
                e.preventDefault();
                e.stopPropagation();
                
                /* remove tooltip */
                if (settings.tooltip) {
                    $(self).removeAttr('title');
                }
                
                /* figure out how wide and tall we are, saved width and height */
                /* are workaround for http://dev.jquery.com/ticket/2190 */
                if (0 == $(self).width()) {
                    //$(self).css('visibility', 'hidden');
                    settings.width  = savedwidth;
                    settings.height = savedheight;
                } else {
                    if (settings.width != 'none') {
                        settings.width = 
                            settings.autowidth ? $(self).width()  : settings.width;
                    }
                    if (settings.height != 'none') {
                        settings.height = 
                            settings.autoheight ? $(self).height() : settings.height;
                    }
                }
                //$(this).css('visibility', '');
                
                /* remove placeholder text, replace is here because of IE */
                if ($(this).html().toLowerCase().replace(/(;|")/g, '') == 
                    settings.placeholder.toLowerCase().replace(/(;|")/g, '')) {
                        $(this).html('');
                }
                                
                self.editing    = true;
                self.revert     = $(self).html();
                $(self).html('');

                /* create the form object */
                var form = $('<form />');
                
                /* apply css or style or both */
                if (settings.cssclass) {
                    if ('inherit' == settings.cssclass) {
                        form.attr('class', $(self).attr('class'));
                    } else {
                        form.attr('class', settings.cssclass);
                    }
                }

                if (settings.style) {
                    if ('inherit' == settings.style) {
                        form.attr('style', $(self).attr('style'));
                        /* IE needs the second line or display wont be inherited */
                        form.css('display', $(self).css('display'));                
                    } else {
                        form.attr('style', settings.style);
                    }
                }

                /* add main input element to form and store it in input */
                var input = element.apply(form, [settings, self]);

                /* set input content via POST, GET, given data or existing value */
                var input_content;
                
                if (settings.loadurl) {
                    var t = setTimeout(function() {
                        input.disabled = true;
                        content.apply(form, [settings.loadtext, settings, self]);
                    }, 100);

                    var loaddata = {};
                    loaddata[settings.id] = self.id;
                    if ($.isFunction(settings.loaddata)) {
                        $.extend(loaddata, settings.loaddata.apply(self, [self.revert, settings]));
                    } else {
                        $.extend(loaddata, settings.loaddata);
                    }
                    $.ajax({
                       type : settings.loadtype,
                       url  : settings.loadurl,
                       data : loaddata,
                       async : false,
                       success: function(result) {
                          window.clearTimeout(t);
                          input_content = result;
                          input.disabled = false;
                       }
                    });
                } else if (settings.data) {
                    input_content = settings.data;
                    if ($.isFunction(settings.data)) {
                        input_content = settings.data.apply(self, [self.revert, settings]);
                    }
                } else {
                    input_content = self.revert; 
                }
                content.apply(form, [input_content, settings, self]);

                input.attr('name', settings.name);
        
                /* add buttons to the form */
                buttons.apply(form, [settings, self]);
         
                /* add created form to self */
                $(self).append(form);
         
                /* attach 3rd party plugin if requested */
                plugin.apply(form, [settings, self]);

                /* focus to first visible form element */
                $(':input:visible:enabled:first', form).focus();

                /* highlight input contents when requested */
                if (settings.select) {
                    input.select();
                }
        
                /* discard changes if pressing esc */
                input.keydown(function(e) {
                    if (e.keyCode == 27) {
                        e.preventDefault();
                        //self.reset();
                        reset.apply(form, [settings, self]);
                    }
                });

                /* discard, submit or nothing with changes when clicking outside */
                /* do nothing is usable when navigating with tab */
                var t;
                if ('cancel' == settings.onblur) {
                    input.blur(function(e) {
                        /* prevent canceling if submit was clicked */
                        t = setTimeout(function() {
                            reset.apply(form, [settings, self]);
                        }, 500);
                    });
                } else if ('submit' == settings.onblur) {
                    input.blur(function(e) {
                        /* prevent double submit if submit was clicked */
                        t = setTimeout(function() {
                            form.submit();
                        }, 200);
                    });
                } else if ($.isFunction(settings.onblur)) {
                    input.blur(function(e) {
                        settings.onblur.apply(self, [input.val(), settings]);
                    });
                } else {
                    input.blur(function(e) {
                      /* TODO: maybe something here */
                    });
                }

                form.submit(function(e) {

                    if (t) { 
                        clearTimeout(t);
                    }

                    /* do no submit */
                    e.preventDefault(); 
            
                    /* call before submit hook. */
                    /* if it returns false abort submitting */                    
                    if (false !== onsubmit.apply(form, [settings, self])) { 
                        /* custom inputs call before submit hook. */
                        /* if it returns false abort submitting */
                        if (false !== submit.apply(form, [settings, self])) { 

                          /* check if given target is function */
                          if ($.isFunction(settings.target)) {
                              var str = settings.target.apply(self, [input.val(), settings]);
                              $(self).html(str);
                              self.editing = false;
                              callback.apply(self, [self.innerHTML, settings]);
                              /* TODO: this is not dry */                              
                              if (!$.trim($(self).html())) {
                                  $(self).html(settings.placeholder);
                              }
                          } else {
                              /* add edited content and id of edited element to POST */
                              var submitdata = {};
                              submitdata[settings.name] = input.val();
                              submitdata[settings.id] = self.id;
                              /* add extra data to be POST:ed */
                              if ($.isFunction(settings.submitdata)) {
                                  $.extend(submitdata, settings.submitdata.apply(self, [self.revert, settings]));
                              } else {
                                  $.extend(submitdata, settings.submitdata);
                              }

                              /* quick and dirty PUT support */
                              if ('PUT' == settings.method) {
                                  submitdata['_method'] = 'put';
                              }

                              /* show the saving indicator */
                              $(self).html(settings.indicator);
                              
                              /* defaults for ajaxoptions */
                              var ajaxoptions = {
                                  type    : 'POST',
                                  data    : submitdata,
                                  dataType: 'html',
                                  url     : settings.target,
                                  success : function(result, status) {
                                      if (ajaxoptions.dataType == 'html') {
                                        $(self).html(result);
                                      }
                                      self.editing = false;
                                      callback.apply(self, [result, settings]);
                                      if (!$.trim($(self).html())) {
                                          $(self).html(settings.placeholder);
                                      }
                                  },
                                  error   : function(xhr, status, error) {
                                      onerror.apply(form, [settings, self, xhr]);
                                  }
                              };
                              
                              /* override with what is given in settings.ajaxoptions */
                              $.extend(ajaxoptions, settings.ajaxoptions);   
                              $.ajax(ajaxoptions);          
                              
                            }
                        }
                    }
                    
                    /* show tooltip again */
                    $(self).attr('title', settings.tooltip);
                    
                    return false;
                });
            });
            
            /* privileged methods */
            this.reset = function(form) {
                /* prevent calling reset twice when blurring */
                if (this.editing) {
                    /* before reset hook, if it returns false abort reseting */
                    if (false !== onreset.apply(form, [settings, self])) { 
                        $(self).html(self.revert);
                        self.editing   = false;
                        if (!$.trim($(self).html())) {
                            $(self).html(settings.placeholder);
                        }
                        /* show tooltip again */
                        if (settings.tooltip) {
                            $(self).attr('title', settings.tooltip);                
                        }
                    }                    
                }
            };            
        });

    };


    $.editable = {
        types: {
            defaults: {
                element : function(settings, original) {
                    var input = $('<input type="hidden"></input>');                
                    $(this).append(input);
                    return(input);
                },
                content : function(string, settings, original) {
                    $(':input:first', this).val(string);
                },
                reset : function(settings, original) {
                  original.reset(this);
                },
                buttons : function(settings, original) {
                    var form = this;
                    if (settings.submit) {
                        /* if given html string use that */
                        if (settings.submit.match(/>$/)) {
                            var submit = $(settings.submit).click(function() {
                                if (submit.attr("type") != "submit") {
                                    form.submit();
                                }
                            });
                        /* otherwise use button with given string as text */
                        } else {
                            var submit = $('<button type="submit" />');
                            submit.html(settings.submit);                            
                        }
                        $(this).append(submit);
                    }
                    if (settings.cancel) {
                        /* if given html string use that */
                        if (settings.cancel.match(/>$/)) {
                            var cancel = $(settings.cancel);
                        /* otherwise use button with given string as text */
                        } else {
                            var cancel = $('<button type="cancel" />');
                            cancel.html(settings.cancel);
                        }
                        $(this).append(cancel);

                        $(cancel).click(function(event) {
                            //original.reset();
                            if ($.isFunction($.editable.types[settings.type].reset)) {
                                var reset = $.editable.types[settings.type].reset;                                                                
                            } else {
                                var reset = $.editable.types['defaults'].reset;                                
                            }
                            reset.apply(form, [settings, original]);
                            return false;
                        });
                    }
                }
            },
            text: {
                element : function(settings, original) {
                    var input = $('<input />');
                    if (settings.width  != 'none') { input.width(settings.width);  }
                    if (settings.height != 'none') { input.height(settings.height); }
                    /* https://bugzilla.mozilla.org/show_bug.cgi?id=236791 */
                    //input[0].setAttribute('autocomplete','off');
                    input.attr('autocomplete','off');
                    $(this).append(input);
                    return(input);
                }
            },
            textarea: {
                element : function(settings, original) {
                    var textarea = $('<textarea />');
                    if (settings.rows) {
                        textarea.attr('rows', settings.rows);
                    } else if (settings.height != "none") {
                        textarea.height(settings.height);
                    }
                    if (settings.cols) {
                        textarea.attr('cols', settings.cols);
                    } else if (settings.width != "none") {
                        textarea.width(settings.width);
                    }
                    $(this).append(textarea);
                    return(textarea);
                }
            },
            select: {
               element : function(settings, original) {
                    var select = $('<select />');
                    $(this).append(select);
                    return(select);
                },
                content : function(data, settings, original) {
                    /* If it is string assume it is json. */
                    if (String == data.constructor) {      
                        eval ('var json = ' + data);
                    } else {
                    /* Otherwise assume it is a hash already. */
                        var json = data;
                    }
                    for (var key in json) {
                        if (!json.hasOwnProperty(key)) {
                            continue;
                        }
                        if ('selected' == key) {
                            continue;
                        } 
                        var option = $('<option />').val(key).append(json[key]);
                        $('select', this).append(option);    
                    }                    
                    /* Loop option again to set selected. IE needed this... */ 
                    $('select', this).children().each(function() {
                        if ($(this).val() == json['selected'] || 
                            $(this).text() == $.trim(original.revert)) {
                                $(this).attr('selected', 'selected');
                        }
                    });
                }
            }
        },

        /* Add new input type */
        addInputType: function(name, input) {
            $.editable.types[name] = input;
        }
    };

    // publicly accessible defaults
    $.fn.editable.defaults = {
        name       : 'value',
        id         : 'id',
        type       : 'text',
        width      : 'auto',
        height     : 'auto',
        event      : 'click.editable',
        onblur     : 'cancel',
        loadtype   : 'GET',
        loadtext   : 'Loading...',
        placeholder: 'Click to edit',
        loaddata   : {},
        submitdata : {},
        ajaxoptions: {}
    };

})(jQuery);
/*
 * timeago: a jQuery plugin, version: 0.9.3 (2011-01-21)
 * @requires jQuery v1.2.3 or later
 *
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2008-2011, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */

(function($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        numbers: []
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
        distanceMillis = Math.abs(distanceMillis);
      }

      var seconds = distanceMillis / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 48 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.floor(days)) ||
        days < 60 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.floor(days / 30)) ||
        years < 2 && substitute($l.year, 1) ||
        substitute($l.years, Math.floor(years));

      return $.trim([prefix, words, suffix].join(" "));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      var isTime = $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
      var iso8601 = isTime ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    }
  });

  $.fn.timeago = function() {
    var self = this;
    self.each(refresh);

    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
    }
    return self;
  };

  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.datetime)) {
      $(this).text(inWords(data.datetime));
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if (text.length > 0) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}(jQuery));
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
var _target = null,
    _dragx = null,
    _dragy = null,
    _rotate = null,
    _resort = null;
var _dragging = false,
    _sizing = false,
    _animate = false;
var _rotating = 0,
    _width = 0,
    _height = 0,
    _left = 0,
    _top = 0,
    _xspeed = 0,
    _yspeed = 0;
var _zindex = 1000;

jQuery.fn.touch = function(settings) {

    // DEFINE DEFAULT TOUCH SETTINGS
    settings = jQuery.extend({
        animate: true,
        sticky: false,
        dragx: true,
        dragy: true,
        rotate: false,
        resort: true,
        scale: false
    }, settings);

    // BUILD SETTINGS OBJECT
    var opts = [];
    opts = $.extend({}, $.fn.touch.defaults, settings);

    // ADD METHODS TO OBJECT
    this.each(function() {
        this.opts = opts;
        this.ontouchstart = touchstart;
        this.ontouchend = touchend;
        this.ontouchmove = touchmove;
        this.ongesturestart = gesturestart;
        this.ongesturechange = gesturechange;
        this.ongestureend = gestureend;
    });
};

function touchstart(e) {
    _target = this.id;
    _dragx = this.opts.dragx;
    _dragy = this.opts.dragy;
    _resort = this.opts.resort;
    _animate = this.opts.animate;
    _xspeed = 0;
    _yspeed = 0;

    $(e.changedTouches).each(function() {

        var curLeft = ($('#' + _target).css("left") == 'auto') ? this.pageX : parseInt($('#' + _target).css("left"));
        var curTop = ($('#' + _target).css("top") == 'auto') ? this.pageY : parseInt($('#' + _target).css("top"));

        if (!_dragging && !_sizing) {
            _left = (e.pageX - curLeft);
            _top = (e.pageY - curTop);
            _dragging = [_left, _top];
            if (_resort) {
                _zindex = ($('#' + _target).css("z-index") == _zindex) ? _zindex : _zindex + 1;
                $('#' + _target).css({
                    zIndex: _zindex
                });
            }
        }
    });
};

function touchmove(e) {

    if (_dragging && !_sizing && _animate) {

        var _lastleft = (isNaN(parseInt($('#' + _target).css("left")))) ? 0 : parseInt($('#' + _target).css("left"));
        var _lasttop = (isNaN(parseInt($('#' + _target).css("top")))) ? 0 : parseInt($('#' + _target).css("top"));
    }

    $(e.changedTouches).each(function() {

        e.preventDefault();

        _left = (this.pageX - (parseInt($('#' + _target).css("width")) / 2));
        _top = (this.pageY - (parseInt($('#' + _target).css("height")) / 2));

        if (_dragging && !_sizing) {

            if (_animate) {
                _xspeed = Math.round((_xspeed + Math.round(_left - _lastleft)) / 1.5);
                _yspeed = Math.round((_yspeed + Math.round(_top - _lasttop)) / 1.5);
            }

            if (_dragx || _dragy) $('#' + _target).css({
                position: "absolute"
            });
            if (_dragx) $('#' + _target).css({
                left: _left + "px"
            });
            if (_dragy) $('#' + _target).css({
                top: _top + "px"
            });
        }
    });
};

function touchend(e) {
    $(e.changedTouches).each(function() {
        if (!e.targetTouches.length) {
            _dragging = false;
            if (_animate) {
                _left = ($('#' + _target).css("left") == 'auto') ? this.pageX : parseInt($('#' + _target).css("left"));
                _top = ($('#' + _target).css("top") == 'auto') ? this.pageY : parseInt($('#' + _target).css("top"));

                var animx = (_dragx) ? (_left + _xspeed) + "px" : _left + "px";
                var animy = (_dragy) ? (_top + _yspeed) + "px" : _top + "px";

                if (_dragx || _dragy) $('#' + _target).animate({
                    left: animx,
                    top: animy
                }, "fast");
            }
        }
    });
};

function gesturestart(e) {
    _sizing = [$('#' + this.id).css("width"), $('#' + this.id).css("height")];
};

function gesturechange(e) {
    if (_sizing) {
        _width = (this.opts.scale) ? Math.min(parseInt(_sizing[0]) * e.scale, 300) : _sizing[0];
        _height = (this.opts.scale) ? Math.min(parseInt(_sizing[1]) * e.scale, 300) : _sizing[1];
        _rotate = (this.opts.rotate) ? "rotate(" + ((_rotating + e.rotation) % 360) + "deg)" : "0deg";
        $('#' + this.id).css({
            width: _width + "px",
            height: _height + "px",
            webkitTransform: _rotate
        });
    }
};

function gestureend(e) {
    _sizing = false;
    _rotating = (_rotating + e.rotation) % 360;
};
/**
 * jQuery Validation Plugin @VERSION
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2011 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */


(function($) {

$.extend($.fn, {
  // http://docs.jquery.com/Plugins/Validation/validate
  validate: function( options ) {

    // if nothing is selected, return nothing; can't chain anyway
    if (!this.length) {
      options && options.debug && window.console && console.warn( "nothing selected, can't validate, returning nothing" );
      return;
    }

    // check if a validator for this form was already created
    var validator = $.data(this[0], 'validator');
    if ( validator ) {
      return validator;
    }

    // Add novalidate tag if HTML5.
    this.attr('novalidate', 'novalidate');

    validator = new $.validator( options, this[0] );
    $.data(this[0], 'validator', validator);

    if ( validator.settings.onsubmit ) {

      var inputsAndButtons = this.find("input, button");

      // allow suppresing validation by adding a cancel class to the submit button
      inputsAndButtons.filter(".cancel").click(function () {
        validator.cancelSubmit = true;
      });

      // when a submitHandler is used, capture the submitting button
      if (validator.settings.submitHandler) {
        inputsAndButtons.filter(":submit").click(function () {
          validator.submitButton = this;
        });
      }

      // validate the form on submit
      this.submit( function( event ) {
        if ( validator.settings.debug )
          // prevent form submit to be able to see console output
          event.preventDefault();

        function handle() {
          if ( validator.settings.submitHandler ) {
            if (validator.submitButton) {
              // insert a hidden input as a replacement for the missing submit button
              var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
            }
            validator.settings.submitHandler.call( validator, validator.currentForm );
            if (validator.submitButton) {
              // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
              hidden.remove();
            }
            return false;
          }
          return true;
        }

        // prevent submit for invalid forms or custom submit handlers
        if ( validator.cancelSubmit ) {
          validator.cancelSubmit = false;
          return handle();
        }
        if ( validator.form() ) {
          if ( validator.pendingRequest ) {
            validator.formSubmitted = true;
            return false;
          }
          return handle();
        } else {
          validator.focusInvalid();
          return false;
        }
      });
    }

    return validator;
  },
  // http://docs.jquery.com/Plugins/Validation/valid
  valid: function() {
        if ( $(this[0]).is('form')) {
            return this.validate().form();
        } else {
            var valid = true;
            var validator = $(this[0].form).validate();
            this.each(function() {
        valid &= validator.element(this);
            });
            return valid;
        }
    },
  // attributes: space seperated list of attributes to retrieve and remove
  removeAttrs: function(attributes) {
    var result = {},
      $element = this;
    $.each(attributes.split(/\s/), function(index, value) {
      result[value] = $element.attr(value);
      $element.removeAttr(value);
    });
    return result;
  },
  // http://docs.jquery.com/Plugins/Validation/rules
  rules: function(command, argument) {
    var element = this[0];

    if (command) {
      var settings = $.data(element.form, 'validator').settings;
      var staticRules = settings.rules;
      var existingRules = $.validator.staticRules(element);
      switch(command) {
      case "add":
        $.extend(existingRules, $.validator.normalizeRule(argument));
        staticRules[element.name] = existingRules;
        if (argument.messages)
          settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
        break;
      case "remove":
        if (!argument) {
          delete staticRules[element.name];
          return existingRules;
        }
        var filtered = {};
        $.each(argument.split(/\s/), function(index, method) {
          filtered[method] = existingRules[method];
          delete existingRules[method];
        });
        return filtered;
      }
    }

    var data = $.validator.normalizeRules(
    $.extend(
      {},
      $.validator.metadataRules(element),
      $.validator.classRules(element),
      $.validator.attributeRules(element),
      $.validator.staticRules(element)
    ), element);

    // make sure required is at front
    if (data.required) {
      var param = data.required;
      delete data.required;
      data = $.extend({required: param}, data);
    }

    return data;
  }
});

// Custom selectors
$.extend($.expr[":"], {
  // http://docs.jquery.com/Plugins/Validation/blank
  blank: function(a) {return !$.trim("" + a.value);},
  // http://docs.jquery.com/Plugins/Validation/filled
  filled: function(a) {return !!$.trim("" + a.value);},
  // http://docs.jquery.com/Plugins/Validation/unchecked
  unchecked: function(a) {return !a.checked;}
});

// constructor for validator
$.validator = function( options, form ) {
  this.settings = $.extend( true, {}, $.validator.defaults, options );
  this.currentForm = form;
  this.init();
};

$.validator.format = function(source, params) {
  if ( arguments.length == 1 )
    return function() {
      var args = $.makeArray(arguments);
      args.unshift(source);
      return $.validator.format.apply( this, args );
    };
  if ( arguments.length > 2 && params.constructor != Array  ) {
    params = $.makeArray(arguments).slice(1);
  }
  if ( params.constructor != Array ) {
    params = [ params ];
  }
  $.each(params, function(i, n) {
    source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
  });
  return source;
};

$.extend($.validator, {

  defaults: {
    messages: {},
    groups: {},
    rules: {},
    errorClass: "error",
    validClass: "valid",
    errorElement: "label",
    focusInvalid: true,
    errorContainer: $( [] ),
    errorLabelContainer: $( [] ),
    onsubmit: true,
    ignore: [],
    ignoreTitle: false,
    onfocusin: function(element) {
      this.lastActive = element;

      // hide error label and remove error class on focus if enabled
      if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
        this.settings.unhighlight && this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
        this.addWrapper(this.errorsFor(element)).hide();
      }
    },
    onfocusout: function(element) {
      if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
        this.element(element);
      }
    },
    onkeyup: function(element) {
      if ( element.name in this.submitted || element == this.lastElement ) {
        this.element(element);
      }
    },
    onclick: function(element) {
      // click on selects, radiobuttons and checkboxes
      if ( element.name in this.submitted )
        this.element(element);
      // or option elements, check parent select in that case
      else if (element.parentNode.name in this.submitted)
        this.element(element.parentNode);
    },
    highlight: function(element, errorClass, validClass) {
      if (element.type === 'radio') {
        this.findByName(element.name).addClass(errorClass).removeClass(validClass);
      } else {
        $(element).addClass(errorClass).removeClass(validClass);
      }
    },
    unhighlight: function(element, errorClass, validClass) {
      if (element.type === 'radio') {
        this.findByName(element.name).removeClass(errorClass).addClass(validClass);
      } else {
        $(element).removeClass(errorClass).addClass(validClass);
      }
    }
  },

  // http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
  setDefaults: function(settings) {
    $.extend( $.validator.defaults, settings );
  },

  messages: {
    required: "This field is required.",
    remote: "Please fix this field.",
    email: "Please enter a valid email address.",
    url: "Please enter a valid URL.",
    date: "Please enter a valid date.",
    dateISO: "Please enter a valid date (ISO).",
    number: "Please enter a valid number.",
    digits: "Please enter only digits.",
    creditcard: "Please enter a valid credit card number.",
    equalTo: "Please enter the same value again.",
    accept: "Please enter a value with a valid extension.",
    maxlength: $.validator.format("Please enter no more than {0} characters."),
    minlength: $.validator.format("Please enter at least {0} characters."),
    rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
    range: $.validator.format("Please enter a value between {0} and {1}."),
    max: $.validator.format("Please enter a value less than or equal to {0}."),
    min: $.validator.format("Please enter a value greater than or equal to {0}.")
  },

  autoCreateRanges: false,

  prototype: {

    init: function() {
      this.labelContainer = $(this.settings.errorLabelContainer);
      this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
      this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
      this.submitted = {};
      this.valueCache = {};
      this.pendingRequest = 0;
      this.pending = {};
      this.invalid = {};
      this.reset();

      var groups = (this.groups = {});
      $.each(this.settings.groups, function(key, value) {
        $.each(value.split(/\s/), function(index, name) {
          groups[name] = key;
        });
      });
      var rules = this.settings.rules;
      $.each(rules, function(key, value) {
        rules[key] = $.validator.normalizeRule(value);
      });

      function delegate(event) {
        var validator = $.data(this[0].form, "validator"),
          eventType = "on" + event.type.replace(/^validate/, "");
        validator.settings[eventType] && validator.settings[eventType].call(validator, this[0] );
      }
      $(this.currentForm)
             .validateDelegate("[type='text'], [type='password'], [type='file'], select, textarea, " +
            "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
            "[type='email'], [type='datetime'], [type='date'], [type='month'], " +
            "[type='week'], [type='time'], [type='datetime-local'], " +
            "[type='range'], [type='color'] ",
            "focusin focusout keyup", delegate)
        .validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

      if (this.settings.invalidHandler)
        $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
    },

    // http://docs.jquery.com/Plugins/Validation/Validator/form
    form: function() {
      this.checkForm();
      $.extend(this.submitted, this.errorMap);
      this.invalid = $.extend({}, this.errorMap);
      if (!this.valid())
        $(this.currentForm).triggerHandler("invalid-form", [this]);
      this.showErrors();
      return this.valid();
    },

    checkForm: function() {
      this.prepareForm();
      for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
        this.check( elements[i] );
      }
      return this.valid();
    },

    // http://docs.jquery.com/Plugins/Validation/Validator/element
    element: function( element ) {
      element = this.clean( element );
      this.lastElement = element;
      this.prepareElement( element );
      this.currentElements = $(element);
      var result = this.check( element );
      if ( result ) {
        delete this.invalid[element.name];
      } else {
        this.invalid[element.name] = true;
      }
      if ( !this.numberOfInvalids() ) {
        // Hide error containers on last error
        this.toHide = this.toHide.add( this.containers );
      }
      this.showErrors();
      return result;
    },

    // http://docs.jquery.com/Plugins/Validation/Validator/showErrors
    showErrors: function(errors) {
      if(errors) {
        // add items to error list and map
        $.extend( this.errorMap, errors );
        this.errorList = [];
        for ( var name in errors ) {
          this.errorList.push({
            message: errors[name],
            element: this.findByName(name)[0]
          });
        }
        // remove items from success list
        this.successList = $.grep( this.successList, function(element) {
          return !(element.name in errors);
        });
      }
      this.settings.showErrors
        ? this.settings.showErrors.call( this, this.errorMap, this.errorList )
        : this.defaultShowErrors();
    },

    // http://docs.jquery.com/Plugins/Validation/Validator/resetForm
    resetForm: function() {
      if ( $.fn.resetForm )
        $( this.currentForm ).resetForm();
      this.submitted = {};
      this.prepareForm();
      this.hideErrors();
      this.elements().removeClass( this.settings.errorClass );
    },

    numberOfInvalids: function() {
      return this.objectLength(this.invalid);
    },

    objectLength: function( obj ) {
      var count = 0;
      for ( var i in obj )
        count++;
      return count;
    },

    hideErrors: function() {
      this.addWrapper( this.toHide ).hide();
    },

    valid: function() {
      return this.size() == 0;
    },

    size: function() {
      return this.errorList.length;
    },

    focusInvalid: function() {
      if( this.settings.focusInvalid ) {
        try {
          $(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
          .filter(":visible")
          .focus()
          // manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
          .trigger("focusin");
        } catch(e) {
          // ignore IE throwing errors when focusing hidden elements
        }
      }
    },

    findLastActive: function() {
      var lastActive = this.lastActive;
      return lastActive && $.grep(this.errorList, function(n) {
        return n.element.name == lastActive.name;
      }).length == 1 && lastActive;
    },

    elements: function() {
      var validator = this,
        rulesCache = {};

      // select all valid inputs inside the form (no submit or reset buttons)
      return $(this.currentForm)
      .find("input, select, textarea")
      .not(":submit, :reset, :image, [disabled]")
      .not( this.settings.ignore )
      .filter(function() {
        !this.name && validator.settings.debug && window.console && console.error( "%o has no name assigned", this);

        // select only the first element for each name, and only those with rules specified
        if ( this.name in rulesCache || !validator.objectLength($(this).rules()) )
          return false;

        rulesCache[this.name] = true;
        return true;
      });
    },

    clean: function( selector ) {
      return $( selector )[0];
    },

    errors: function() {
      return $( this.settings.errorElement + "." + this.settings.errorClass, this.errorContext );
    },

    reset: function() {
      this.successList = [];
      this.errorList = [];
      this.errorMap = {};
      this.toShow = $([]);
      this.toHide = $([]);
      this.currentElements = $([]);
    },

    prepareForm: function() {
      this.reset();
      this.toHide = this.errors().add( this.containers );
    },

    prepareElement: function( element ) {
      this.reset();
      this.toHide = this.errorsFor(element);
    },

    check: function( element ) {
      element = this.clean( element );

      // if radio/checkbox, validate first element in group instead
      if (this.checkable(element)) {
        element = this.findByName( element.name ).not(this.settings.ignore)[0];
      }

      var rules = $(element).rules();
      var dependencyMismatch = false;
      for (var method in rules ) {
        var rule = { method: method, parameters: rules[method] };
        try {
          var result = $.validator.methods[method].call( this, element.value.replace(/\r/g, ""), element, rule.parameters );

          // if a method indicates that the field is optional and therefore valid,
          // don't mark it as valid when there are no other rules
          if ( result == "dependency-mismatch" ) {
            dependencyMismatch = true;
            continue;
          }
          dependencyMismatch = false;

          if ( result == "pending" ) {
            this.toHide = this.toHide.not( this.errorsFor(element) );
            return;
          }

          if( !result ) {
            this.formatAndAdd( element, rule );
            return false;
          }
        } catch(e) {
          this.settings.debug && window.console && console.log("exception occured when checking element " + element.id
             + ", check the '" + rule.method + "' method", e);
          throw e;
        }
      }
      if (dependencyMismatch)
        return;
      if ( this.objectLength(rules) )
        this.successList.push(element);
      return true;
    },

    // return the custom message for the given element and validation method
    // specified in the element's "messages" metadata
    customMetaMessage: function(element, method) {
      if (!$.metadata)
        return;

      var meta = this.settings.meta
        ? $(element).metadata()[this.settings.meta]
        : $(element).metadata();

      return meta && meta.messages && meta.messages[method];
    },

    // return the custom message for the given element name and validation method
    customMessage: function( name, method ) {
      var m = this.settings.messages[name];
      return m && (m.constructor == String
        ? m
        : m[method]);
    },

    // return the first defined argument, allowing empty strings
    findDefined: function() {
      for(var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined)
          return arguments[i];
      }
      return undefined;
    },

    defaultMessage: function( element, method) {
      return this.findDefined(
        this.customMessage( element.name, method ),
        this.customMetaMessage( element, method ),
        // title is never undefined, so handle empty string as undefined
        !this.settings.ignoreTitle && element.title || undefined,
        $.validator.messages[method],
        "<strong>Warning: No message defined for " + element.name + "</strong>"
      );
    },

    formatAndAdd: function( element, rule ) {
      var message = this.defaultMessage( element, rule.method ),
        theregex = /\$?\{(\d+)\}/g;
      if ( typeof message == "function" ) {
        message = message.call(this, rule.parameters, element);
      } else if (theregex.test(message)) {
        message = jQuery.format(message.replace(theregex, '{$1}'), rule.parameters);
      }
      this.errorList.push({
        message: message,
        element: element
      });

      this.errorMap[element.name] = message;
      this.submitted[element.name] = message;
    },

    addWrapper: function(toToggle) {
      if ( this.settings.wrapper )
        toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
      return toToggle;
    },

    defaultShowErrors: function() {
      for ( var i = 0; this.errorList[i]; i++ ) {
        var error = this.errorList[i];
        this.settings.highlight && this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
        this.showLabel( error.element, error.message );
      }
      if( this.errorList.length ) {
        this.toShow = this.toShow.add( this.containers );
      }
      if (this.settings.success) {
        for ( var i = 0; this.successList[i]; i++ ) {
          this.showLabel( this.successList[i] );
        }
      }
      if (this.settings.unhighlight) {
        for ( var i = 0, elements = this.validElements(); elements[i]; i++ ) {
          this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
        }
      }
      this.toHide = this.toHide.not( this.toShow );
      this.hideErrors();
      this.addWrapper( this.toShow ).show();
    },

    validElements: function() {
      return this.currentElements.not(this.invalidElements());
    },

    invalidElements: function() {
      return $(this.errorList).map(function() {
        return this.element;
      });
    },

    showLabel: function(element, message) {
      var label = this.errorsFor( element );
      if ( label.length ) {
        // refresh error/success class
        label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );

        // check if we have a generated label, replace the message then
        label.attr("generated") && label.html(message);
      } else {
        // create label
        label = $("<" + this.settings.errorElement + "/>")
          .attr({"for":  this.idOrName(element), generated: true})
          .addClass(this.settings.errorClass)
          .html(message || "");
        if ( this.settings.wrapper ) {
          // make sure the element is visible, even in IE
          // actually showing the wrapped element is handled elsewhere
          label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
        }
        if ( !this.labelContainer.append(label).length )
          this.settings.errorPlacement
            ? this.settings.errorPlacement(label, $(element) )
            : label.insertAfter(element);
      }
      if ( !message && this.settings.success ) {
        label.text("");
        typeof this.settings.success == "string"
          ? label.addClass( this.settings.success )
          : this.settings.success( label );
      }
      this.toShow = this.toShow.add(label);
    },

    errorsFor: function(element) {
      var name = this.idOrName(element);
        return this.errors().filter(function() {
        return $(this).attr('for') == name;
      });
    },

    idOrName: function(element) {
      return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
    },

    checkable: function( element ) {
      return /radio|checkbox/i.test(element.type);
    },

    findByName: function( name ) {
      // select by name and filter by form for performance over form.find("[name=...]")
      var form = this.currentForm;
      return $(document.getElementsByName(name)).map(function(index, element) {
        return element.form == form && element.name == name && element  || null;
      });
    },

    getLength: function(value, element) {
      switch( element.nodeName.toLowerCase() ) {
      case 'select':
        return $("option:selected", element).length;
      case 'input':
        if( this.checkable( element) )
          return this.findByName(element.name).filter(':checked').length;
      }
      return value.length;
    },

    depend: function(param, element) {
      return this.dependTypes[typeof param]
        ? this.dependTypes[typeof param](param, element)
        : true;
    },

    dependTypes: {
      "boolean": function(param, element) {
        return param;
      },
      "string": function(param, element) {
        return !!$(param, element.form).length;
      },
      "function": function(param, element) {
        return param(element);
      }
    },

    optional: function(element) {
      return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
    },

    startRequest: function(element) {
      if (!this.pending[element.name]) {
        this.pendingRequest++;
        this.pending[element.name] = true;
      }
    },

    stopRequest: function(element, valid) {
      this.pendingRequest--;
      // sometimes synchronization fails, make sure pendingRequest is never < 0
      if (this.pendingRequest < 0)
        this.pendingRequest = 0;
      delete this.pending[element.name];
      if ( valid && this.pendingRequest == 0 && this.formSubmitted && this.form() ) {
        $(this.currentForm).submit();
        this.formSubmitted = false;
      } else if (!valid && this.pendingRequest == 0 && this.formSubmitted) {
        $(this.currentForm).triggerHandler("invalid-form", [this]);
        this.formSubmitted = false;
      }
    },

    previousValue: function(element) {
      return $.data(element, "previousValue") || $.data(element, "previousValue", {
        old: null,
        valid: true,
        message: this.defaultMessage( element, "remote" )
      });
    }

  },

  classRuleSettings: {
    required: {required: true},
    email: {email: true},
    url: {url: true},
    date: {date: true},
    dateISO: {dateISO: true},
    dateDE: {dateDE: true},
    number: {number: true},
    numberDE: {numberDE: true},
    digits: {digits: true},
    creditcard: {creditcard: true}
  },

  addClassRules: function(className, rules) {
    className.constructor == String ?
      this.classRuleSettings[className] = rules :
      $.extend(this.classRuleSettings, className);
  },

  classRules: function(element) {
    var rules = {};
    var classes = $(element).attr('class');
    classes && $.each(classes.split(' '), function() {
      if (this in $.validator.classRuleSettings) {
        $.extend(rules, $.validator.classRuleSettings[this]);
      }
    });
    return rules;
  },

  attributeRules: function(element) {
    var rules = {};
    var $element = $(element);

    for (var method in $.validator.methods) {
      var value = $element.attr(method);
      if (value) {
        rules[method] = value;
      } else if ($element[0].getAttribute("type") === method) {
        rules[method] = true;
      }
    }

    // maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
    if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
      delete rules.maxlength;
    }

    return rules;
  },

  metadataRules: function(element) {
    if (!$.metadata) return {};

    var meta = $.data(element.form, 'validator').settings.meta;
    return meta ?
      $(element).metadata()[meta] :
      $(element).metadata();
  },

  staticRules: function(element) {
    var rules = {};
    var validator = $.data(element.form, 'validator');
    if (validator.settings.rules) {
      rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
    }
    return rules;
  },

  normalizeRules: function(rules, element) {
    // handle dependency check
    $.each(rules, function(prop, val) {
      // ignore rule when param is explicitly false, eg. required:false
      if (val === false) {
        delete rules[prop];
        return;
      }
      if (val.param || val.depends) {
        var keepRule = true;
        switch (typeof val.depends) {
          case "string":
            keepRule = !!$(val.depends, element.form).length;
            break;
          case "function":
            keepRule = val.depends.call(element, element);
            break;
        }
        if (keepRule) {
          rules[prop] = val.param !== undefined ? val.param : true;
        } else {
          delete rules[prop];
        }
      }
    });

    // evaluate parameters
    $.each(rules, function(rule, parameter) {
      rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
    });

    // clean number parameters
    $.each(['minlength', 'maxlength', 'min', 'max'], function() {
      if (rules[this]) {
        rules[this] = Number(rules[this]);
      }
    });
    $.each(['rangelength', 'range'], function() {
      if (rules[this]) {
        rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
      }
    });

    if ($.validator.autoCreateRanges) {
      // auto-create ranges
      if (rules.min && rules.max) {
        rules.range = [rules.min, rules.max];
        delete rules.min;
        delete rules.max;
      }
      if (rules.minlength && rules.maxlength) {
        rules.rangelength = [rules.minlength, rules.maxlength];
        delete rules.minlength;
        delete rules.maxlength;
      }
    }

    // To support custom messages in metadata ignore rule methods titled "messages"
    if (rules.messages) {
      delete rules.messages;
    }

    return rules;
  },

  // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
  normalizeRule: function(data) {
    if( typeof data == "string" ) {
      var transformed = {};
      $.each(data.split(/\s/), function() {
        transformed[this] = true;
      });
      data = transformed;
    }
    return data;
  },

  // http://docs.jquery.com/Plugins/Validation/Validator/addMethod
  addMethod: function(name, method, message) {
    $.validator.methods[name] = method;
    $.validator.messages[name] = message != undefined ? message : $.validator.messages[name];
    if (method.length < 3) {
      $.validator.addClassRules(name, $.validator.normalizeRule(name));
    }
  },

  methods: {

    // http://docs.jquery.com/Plugins/Validation/Methods/required
    required: function(value, element, param) {
      // check if dependency is met
      if ( !this.depend(param, element) )
        return "dependency-mismatch";
      switch( element.nodeName.toLowerCase() ) {
      case 'select':
        // could be an array for select-multiple or a string, both are fine this way
        var val = $(element).val();
        return val && val.length > 0;
      case 'input':
        if ( this.checkable(element) )
          return this.getLength(value, element) > 0;
      default:
        return $.trim(value).length > 0;
      }
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/remote
    remote: function(value, element, param) {
      if ( this.optional(element) )
        return "dependency-mismatch";

      var previous = this.previousValue(element);
      if (!this.settings.messages[element.name] )
        this.settings.messages[element.name] = {};
      previous.originalMessage = this.settings.messages[element.name].remote;
      this.settings.messages[element.name].remote = previous.message;

      param = typeof param == "string" && {url:param} || param;

      if ( this.pending[element.name] ) {
        return "pending";
      }
      if ( previous.old === value ) {
        return previous.valid;
      }

      previous.old = value;
      var validator = this;
      this.startRequest(element);
      var data = {};
      data[element.name] = value;
      $.ajax($.extend(true, {
        url: param,
        mode: "abort",
        port: "validate" + element.name,
        dataType: "json",
        data: data,
        success: function(response) {
          validator.settings.messages[element.name].remote = previous.originalMessage;
          var valid = response === true;
          if ( valid ) {
            var submitted = validator.formSubmitted;
            validator.prepareElement(element);
            validator.formSubmitted = submitted;
            validator.successList.push(element);
            validator.showErrors();
          } else {
            var errors = {};
            var message = response || validator.defaultMessage( element, "remote" );
            errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
            validator.showErrors(errors);
          }
          previous.valid = valid;
          validator.stopRequest(element, valid);
        }
      }, param));
      return "pending";
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/minlength
    minlength: function(value, element, param) {
      return this.optional(element) || this.getLength($.trim(value), element) >= param;
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/maxlength
    maxlength: function(value, element, param) {
      return this.optional(element) || this.getLength($.trim(value), element) <= param;
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/rangelength
    rangelength: function(value, element, param) {
      var length = this.getLength($.trim(value), element);
      return this.optional(element) || ( length >= param[0] && length <= param[1] );
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/min
    min: function( value, element, param ) {
      return this.optional(element) || value >= param;
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/max
    max: function( value, element, param ) {
      return this.optional(element) || value <= param;
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/range
    range: function( value, element, param ) {
      return this.optional(element) || ( value >= param[0] && value <= param[1] );
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/email
    email: function(value, element) {
      // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
      return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/url
    url: function(value, element) {
      // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
      return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/date
    date: function(value, element) {
      return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/dateISO
    dateISO: function(value, element) {
      return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/number
    number: function(value, element) {
      return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/digits
    digits: function(value, element) {
      return this.optional(element) || /^\d+$/.test(value);
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/creditcard
    // based on http://en.wikipedia.org/wiki/Luhn
    creditcard: function(value, element) {
      if ( this.optional(element) )
        return "dependency-mismatch";
      // accept only digits and dashes
      if (/[^0-9-]+/.test(value))
        return false;
      var nCheck = 0,
        nDigit = 0,
        bEven = false;

      value = value.replace(/\D/g, "");

      for (var n = value.length - 1; n >= 0; n--) {
        var cDigit = value.charAt(n);
        var nDigit = parseInt(cDigit, 10);
        if (bEven) {
          if ((nDigit *= 2) > 9)
            nDigit -= 9;
        }
        nCheck += nDigit;
        bEven = !bEven;
      }

      return (nCheck % 10) == 0;
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/accept
    accept: function(value, element, param) {
      param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
      return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/equalTo
    equalTo: function(value, element, param) {
      // bind to the blur event of the target in order to revalidate whenever the target field is updated
      // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
      var target = $(param).unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
        $(element).valid();
      });
      return value == target.val();
    }

  }

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

})(jQuery);

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
;(function($) {
  var pendingRequests = {};
  // Use a prefilter if available (1.5+)
  if ( $.ajaxPrefilter ) {
    $.ajaxPrefilter(function(settings, _, xhr) {
      var port = settings.port;
      if (settings.mode == "abort") {
        if ( pendingRequests[port] ) {
          pendingRequests[port].abort();
        }
        pendingRequests[port] = xhr;
      }
    });
  } else {
    // Proxy ajax
    var ajax = $.ajax;
    $.ajax = function(settings) {
      var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
        port = ( "port" in settings ? settings : $.ajaxSettings ).port;
      if (mode == "abort") {
        if ( pendingRequests[port] ) {
          pendingRequests[port].abort();
        }
        return (pendingRequests[port] = ajax.apply(this, arguments));
      }
      return ajax.apply(this, arguments);
    };
  }
})(jQuery);

// provides cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
;(function($) {
  // only implement if not provided by jQuery core (since 1.4)
  // TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
  if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
    $.each({
      focus: 'focusin',
      blur: 'focusout'
    }, function( original, fix ){
      $.event.special[fix] = {
        setup:function() {
          this.addEventListener( original, handler, true );
        },
        teardown:function() {
          this.removeEventListener( original, handler, true );
        },
        handler: function(e) {
          arguments[0] = $.event.fix(e);
          arguments[0].type = fix;
          return $.event.handle.apply(this, arguments);
        }
      };
      function handler(e) {
        e = $.event.fix(e);
        e.type = fix;
        return $.event.handle.call(this, e);
      }
    });
  };
  $.extend($.fn, {
    validateDelegate: function(delegate, type, handler) {
      return this.bind(type, function(event) {
        var target = $(event.target);
        if (target.is(delegate)) {
          return handler.apply(target, arguments);
        }
      });
    }
  });
})(jQuery);
/*!
 * Modernizr v2.0.6
 * http://www.modernizr.com
 *
 * Copyright (c) 2009-2011 Faruk Ates, Paul Irish, Alex Sexton
 * Dual-licensed under the BSD or MIT licenses: www.modernizr.com/license/
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in
 * the current UA and makes the results available to you in two ways:
 * as properties on a global Modernizr object, and as classes on the
 * <html> element. This information allows you to progressively enhance
 * your pages with a granular level of control over the experience.
 *
 * Modernizr has an optional (not included) conditional resource loader
 * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
 * To get a build that includes Modernizr.load(), as well as choosing
 * which tests to include, go to www.modernizr.com/download/
 *
 * Authors        Faruk Ates, Paul Irish, Alex Sexton, 
 * Contributors   Ryan Seddon, Ben Alman
 */


window.Modernizr = (function( window, document, undefined ) {

    var version = '2.0.6',

    Modernizr = {},
    
    // option for enabling the HTML classes to be added
    enableClasses = true,

    docElement = document.documentElement,
    docHead = document.head || document.getElementsByTagName('head')[0],

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    /**
     * Create the input element for various Web Forms feature tests.
     */
    inputElem = document.createElement('input'),

    smile = ':)',

    toString = Object.prototype.toString,

    // List of property values to set for css tests. See ticket #21
    prefixes = ' -webkit- -moz- -o- -ms- -khtml- '.split(' '),

    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius

    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft foregoes prefixes entirely <= IE8, but appears to
    //   use a lowercase `ms` instead of the correct `Ms` in IE9

    // More here: http://github.com/Modernizr/Modernizr/issues/issue/21
    domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),

    ns = {'svg': 'http://www.w3.org/2000/svg'},

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    featureName, // used in testing loop


    // Inject element with style element and some CSS rules
    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node,
          div = document.createElement('div');

      if ( parseInt(nodes, 10) ) {
          // In order not to give false positives we create a node for each test
          // This also allows the method to scale for unspecified uses
          while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

      // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
      // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
      // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
      // http://msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
      style = ['&shy;', '<style>', rule, '</style>'].join('');
      div.id = mod;
      div.innerHTML += style;
      docElement.appendChild(div);

      ret = callback(div, rule);
      div.parentNode.removeChild(div);

      return !!ret;

    },


    // adapted from matchMedia polyfill
    // by Scott Jehl and Paul Irish
    // gist.github.com/786768
    testMediaQuery = function( mq ) {

      if ( window.matchMedia ) {
        return matchMedia(mq).matches;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },


    /**
      * isEventSupported determines if a given element supports the given event
      * function from http://yura.thinkweb2.com/isEventSupported/
      */
    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = eventName in element;

        if ( !isSupported ) {
          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

            // If property was created, "remove it" (by setting value to `undefined`)
            if ( !is(element[eventName], undefined) ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })();

    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    var _hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;
    if ( !is(_hasOwnProperty, undefined) && !is(_hasOwnProperty.call, undefined) ) {
      hasOwnProperty = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProperty = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], undefined));
      };
    }

    /**
     * setCss applies given styles to the Modernizr DOM node.
     */
    function setCss( str ) {
        mStyle.cssText = str;
    }

    /**
     * setCssAll extrapolates all vendor-specific css strings.
     */
    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function is( obj, type ) {
        return typeof obj === type;
    }

    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    /**
     * testProps is a generic CSS / DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     *   A supported CSS property returns empty string when its not yet set.
     */
    function testProps( props, prefixed ) {
        for ( var i in props ) {
            if ( mStyle[ props[i] ] !== undefined ) {
                return prefixed == 'pfx' ? props[i] : true;
            }
        }
        return false;
    }

    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function testPropsAll( prop, prefixed ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
            props   = (prop + ' ' + domPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        return testProps(props, prefixed);
    }

    /**
     * testBundle tests a list of CSS features that require element and style injection.
     *   By bundling them together we can reduce the need to touch the DOM multiple times.
     */
    /*>>testBundle*/
    var testBundle = (function( styles, tests ) {
        var style = styles.join(''),
            len = tests.length;

        injectElementWithStyles(style, function( node, rule ) {
            var style = document.styleSheets[document.styleSheets.length - 1],
                // IE8 will bork if you create a custom build that excludes both fontface and generatedcontent tests.
                // So we check for cssRules and that there is a rule available
                // More here: https://github.com/Modernizr/Modernizr/issues/288 & https://github.com/Modernizr/Modernizr/issues/293
                cssText = style.cssRules && style.cssRules[0] ? style.cssRules[0].cssText : style.cssText || "",
                children = node.childNodes, hash = {};

            while ( len-- ) {
                hash[children[len].id] = children[len];
            }

            /*>>touch*/           Modernizr['touch'] = ('ontouchstart' in window) || hash['touch'].offsetTop === 9; /*>>touch*/
            /*>>csstransforms3d*/ Modernizr['csstransforms3d'] = hash['csstransforms3d'].offsetLeft === 9;          /*>>csstransforms3d*/
            /*>>generatedcontent*/Modernizr['generatedcontent'] = hash['generatedcontent'].offsetHeight >= 1;       /*>>generatedcontent*/
            /*>>fontface*/        Modernizr['fontface'] = /src/i.test(cssText) &&
                                                                  cssText.indexOf(rule.split(' ')[0]) === 0;        /*>>fontface*/
        }, len, tests);

    })([
        // Pass in styles to be injected into document
        /*>>fontface*/        '@font-face {font-family:"font";src:url("https://")}'         /*>>fontface*/
        
        /*>>touch*/           ,['@media (',prefixes.join('touch-enabled),('),mod,')',
                                '{#touch{top:9px;position:absolute}}'].join('')           /*>>touch*/
                                
        /*>>csstransforms3d*/ ,['@media (',prefixes.join('transform-3d),('),mod,')',
                                '{#csstransforms3d{left:9px;position:absolute}}'].join('')/*>>csstransforms3d*/
                                
        /*>>generatedcontent*/,['#generatedcontent:after{content:"',smile,'";visibility:hidden}'].join('')  /*>>generatedcontent*/
    ],
      [
        /*>>fontface*/        'fontface'          /*>>fontface*/
        /*>>touch*/           ,'touch'            /*>>touch*/
        /*>>csstransforms3d*/ ,'csstransforms3d'  /*>>csstransforms3d*/
        /*>>generatedcontent*/,'generatedcontent' /*>>generatedcontent*/
        
    ]);/*>>testBundle*/


    /**
     * Tests
     * -----
     */

    tests['flexbox'] = function() {
        /**
         * setPrefixedValueCSS sets the property of a specified element
         * adding vendor prefixes to the VALUE of the property.
         * @param {Element} element
         * @param {string} property The property name. This will not be prefixed.
         * @param {string} value The value of the property. This WILL be prefixed.
         * @param {string=} extra Additional CSS to append unmodified to the end of
         * the CSS string.
         */
        function setPrefixedValueCSS( element, property, value, extra ) {
            property += ':';
            element.style.cssText = (property + prefixes.join(value + ';' + property)).slice(0, -property.length) + (extra || '');
        }

        /**
         * setPrefixedPropertyCSS sets the property of a specified element
         * adding vendor prefixes to the NAME of the property.
         * @param {Element} element
         * @param {string} property The property name. This WILL be prefixed.
         * @param {string} value The value of the property. This will not be prefixed.
         * @param {string=} extra Additional CSS to append unmodified to the end of
         * the CSS string.
         */
        function setPrefixedPropertyCSS( element, property, value, extra ) {
            element.style.cssText = prefixes.join(property + ':' + value + ';') + (extra || '');
        }

        var c = document.createElement('div'),
            elem = document.createElement('div');

        setPrefixedValueCSS(c, 'display', 'box', 'width:42px;padding:0;');
        setPrefixedPropertyCSS(elem, 'box-flex', '1', 'width:10px;');

        c.appendChild(elem);
        docElement.appendChild(c);

        var ret = elem.offsetWidth === 42;

        c.removeChild(elem);
        docElement.removeChild(c);

        return ret;
    };

    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // http://github.com/Modernizr/Modernizr/issues/issue/97/

    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };

    // This WebGL test may false positive. 
    // But really it's quite impossible to know whether webgl will succeed until after you create the context. 
    // You might have hardware that can support a 100x100 webgl canvas, but will not support a 1000x1000 webgl 
    // canvas. So this feature inference is weak, but intentionally so.
    
    // It is known to false positive in FF4 with certain hardware and the iPad 2.
    
    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };

    /*
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     *
     * Additionally, Chrome (desktop) used to lie about its support on this,
     *    but that has since been rectified: http://crbug.com/36415
     *
     * We also test for Firefox 4 Multitouch Support.
     *
     * For more info, see: http://modernizr.github.com/Modernizr/touch.html
     */

    tests['touch'] = function() {
        return Modernizr['touch'];
    };

    /**
     * geolocation tests for the new Geolocation API specification.
     *   This test is a standards compliant-only test; for more complete
     *   testing, including a Google Gears fallback, please see:
     *   http://code.google.com/p/geo-location-javascript/
     * or view a fallback solution using google's geo API:
     *   http://gist.github.com/366184
     */
    tests['geolocation'] = function() {
        return !!navigator.geolocation;
    };

    // Per 1.6:
    // This used to be Modernizr.crosswindowmessaging but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests['postmessage'] = function() {
      return !!window.postMessage;
    };

    // Web SQL database detection is tricky:

    // In chrome incognito mode, openDatabase is truthy, but using it will
    //   throw an exception: http://crbug.com/42380
    // We can create a dummy database, but there is no way to delete it afterwards.

    // Meanwhile, Safari users can get prompted on any database creation.
    //   If they do, any page with Modernizr will give them a prompt:
    //   http://github.com/Modernizr/Modernizr/issues/closed#issue/113

    // We have chosen to allow the Chrome incognito false positive, so that Modernizr
    //   doesn't litter the web with these test databases. As a developer, you'll have
    //   to account for this gotcha yourself.
    tests['websqldatabase'] = function() {
      var result = !!window.openDatabase;
      /*  if (result){
            try {
              result = !!openDatabase( mod + "testdb", "1.0", mod + "testdb", 2e4);
            } catch(e) {
            }
          }  */
      return result;
    };

    // Vendors had inconsistent prefixing with the experimental Indexed DB:
    // - Webkit's implementation is accessible through webkitIndexedDB
    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
    // For speed, we don't test the legacy (and beta-only) indexedDB
    tests['indexedDB'] = function() {
      for ( var i = -1, len = domPrefixes.length; ++i < len; ){
        if ( window[domPrefixes[i].toLowerCase() + 'IndexedDB'] ){
          return true;
        }
      }
      return !!window.indexedDB;
    };

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    // Per 1.6:
    // This used to be Modernizr.historymanagement but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        return isEventSupported('dragstart') && isEventSupported('drop');
    };

    // Mozilla is targeting to land MozWebSocket for FF6
    // bugzil.la/659324
    tests['websockets'] = function() {
        for ( var i = -1, len = domPrefixes.length; ++i < len; ){
          if ( window[domPrefixes[i] + 'WebSocket'] ){
            return true;
          }
        }
        return 'WebSocket' in window;
    };


    // http://css-tricks.com/rgba-browser-support/
    tests['rgba'] = function() {
        // Set an rgba() color and check the returned value

        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
        //   except IE9 who retains it as hsla

        setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

        setCss('background:url(https://),url(https://),red url(https://)');

        // If the UA supports multiple backgrounds, there should be three occurrences
        //   of the string "url(" in the return value for elemStyle.background

        return /(url\s*\(.*?){3}/.test(mStyle.background);
    };


    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.

    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.


    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };


    // Super comprehensive table about all the unique implementations of
    // border-radius: http://muddledramblings.com/table-of-css3-border-radius-compliance

    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    // WebOS unfortunately false positives on this test.
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    // FF3.0 will false positive on this test
    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.

        setCssAll('opacity:.55');

        // The non-literal . in this regex is intentional:
        //   German Chrome returns this value as 0,55
        // https://github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return /^0.55$/.test(mStyle.opacity);
    };


    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * http://webkit.org/blog/175/introducing-css-gradients/
         * https://developer.mozilla.org/en/CSS/-moz-linear-gradient
         * https://developer.mozilla.org/en/CSS/-moz-radial-gradient
         * http://dev.w3.org/csswg/css3-images/#gradients-
         */

        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
            (str1 + prefixes.join(str2 + str1) + prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
        return !!testProps(['transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform']);
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testProps(['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']);

        // Webkit’s 3D transforms are passed off to the browser's own graphics renderer.
        //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
        //   some conditions. As a result, Webkit typically recognizes the syntax but
        //   will sometimes throw a false positive, thus we must do a more thorough check:
        if ( ret && 'webkitPerspective' in docElement.style ) {

          // Webkit allows this media query to succeed only if the feature is enabled.
          // `@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d),(modernizr){ ... }`
          ret = Modernizr['csstransforms3d'];
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transitionProperty');
    };


    /*>>fontface*/
    // @font-face detection routine by Diego Perini
    // http://javascript.nwbox.com/CSSSupport/
    tests['fontface'] = function() {
        return Modernizr['fontface'];
    };
    /*>>fontface*/

    // CSS generated content detection
    tests['generatedcontent'] = function() {
        return Modernizr['generatedcontent'];
    };



    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // We're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // Codec values from : http://github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan

    // Note: in FF 3.5.1 and 3.5.0, "no" was a return value instead of empty string.
    //   Modernizr does not normalize for that.

    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;
            
        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"');

                // Workaround required for IE9, which doesn't report video support without audio codec specified.
                //   bug 599718 @ msft connect
                var h264 = 'video/mp4; codecs="avc1.42E01E';
                bool.h264 = elem.canPlayType(h264 + '"') || elem.canPlayType(h264 + ', mp4a.40.2"');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"');
            }
            
        } catch(e) { }
        
        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try { 
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"');
                bool.mp3  = elem.canPlayType('audio/mpeg;');

                // Mimetypes accepted:
                //   https://developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                //   http://bit.ly/iphoneoscodecs
                bool.wav  = elem.canPlayType('audio/wav; codecs="1"');
                bool.m4a  = elem.canPlayType('audio/x-m4a;') || elem.canPlayType('audio/aac;');
            }
        } catch(e) { }
        
        return bool;
    };


    // Firefox has made these tests rather unfun.

    // In FF4, if disabled, window.localStorage should === null.

    // Normally, we could not test that directly and need to do a
    //   `('localStorage' in window) && ` test first because otherwise Firefox will
    //   throw http://bugzil.la/365772 if cookies are disabled

    // However, in Firefox 4 betas, if dom.storage.enabled == false, just mentioning
    //   the property will throw an exception. http://bugzil.la/599479
    // This looks to be fixed for FF4 Final.

    // Because we are forced to try/catch this, we'll go aggressive.

    // FWIW: IE8 Compat mode supports these features completely:
    //   http://www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files

    tests['localstorage'] = function() {
        try {
            return !!localStorage.getItem;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            return !!sessionStorage.getItem;
        } catch(e){
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    // Thanks to Erik Dahlstrom
    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    // specifically for SVG inline in HTML, not within XHTML
    // test page: paulirish.com/demo/inline-svg
    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    // Thanks to F1lt3r and lucideer, ticket #35
    tests['smil'] = function() {
        return !!document.createElementNS && /SVG/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };

    tests['svgclippaths'] = function() {
        // Possibly returns a false positive in Safari 3.2?
        return !!document.createElementNS && /SVG/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // Hold this guy to execute in a moment.
    function webforms() {
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types:
        //   http://miketaylr.com/code/input-type-attr.html
        // spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
        
        // Only input placeholder is tested while textarea's placeholder is not. 
        // Currently Safari 4 and Opera 11 have support only for the input placeholder
        // Both tests are available in feature-detects/forms-placeholder.js
        Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));

        // Run through HTML5's new input types to see if the UA understands any.
        //   This is put behind the tests runloop because it doesn't return a
        //   true/false like all the other tests; instead, it returns an object
        //   containing each input type with its corresponding true/false value

        // Big thanks to @miketaylr for the html5 forms expertise. http://miketaylr.com/
        Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                // We first check to see if the type we give it sticks..
                // If the type does, we feed it a textual value, which shouldn't be valid.
                // If the value doesn't stick, we know there's input sanitization which infers a custom UI
                if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                      // Safari 2-4 allows the smiley as a value, despite making a slider
                      bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                              // Mobile android web browser has false positive, so must
                              // check the height to see if the widget is actually there.
                              (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                      // Spec doesnt define any special parsing or detectable UI
                      //   behaviors so we pass these through as true

                      // Interestingly, opera fails the earlier test, so it doesn't
                      //  even make it here.

                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                      // Real url and email support comes with prebaked validation.
                      bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else if ( /^color$/.test(inputElemType) ) {
                        // chuck into DOM and force reflow for Opera bug in 11.00
                        // github.com/Modernizr/Modernizr/issues#issue/159
                        docElement.appendChild(inputElem);
                        docElement.offsetWidth;
                        bool = inputElem.value != smile;
                        docElement.removeChild(inputElem);

                    } else {
                      // If the upgraded input compontent rejects the :) text, we got a winner
                      bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
    }


    // End of test definitions
    // -----------------------



    // Run through all tests and detect their support in the current UA.
    // todo: hypothetically we could be doing an array of tests and use a basic loop here.
    for ( var feature in tests ) {
        if ( hasOwnProperty(tests, feature) ) {
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    // input tests need to run.
    Modernizr.input || webforms();


    /**
     * addTest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     *
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == "object" ) {
         for ( var key in feature ) {
           if ( hasOwnProperty( feature, key ) ) { 
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
           // we're going to quit if you're trying to overwrite an existing test
           // if we were to allow it, we'd do this:
           //   var re = new RegExp("\\b(no-)?" + feature + "\\b");  
           //   docElement.className = docElement.className.replace( re, '' );
           // but, no rly, stuff 'em.
           return; 
         }

         test = typeof test == "boolean" ? test : !!test();

         docElement.className += ' ' + (test ? '' : 'no-') + feature;
         Modernizr[feature] = test;

       }

       return Modernizr; // allow chaining.
     };
    

    // Reset modElem.cssText to nothing to reduce memory footprint.
    setCss('');
    modElem = inputElem = null;

    //>>BEGIN IEPP
    // Enable HTML 5 elements for styling (and printing) in IE.
    if ( window.attachEvent && (function(){ var elem = document.createElement('div');
                                            elem.innerHTML = '<elem></elem>';
                                            return elem.childNodes.length !== 1; })() ) {
                                              
        // iepp v2 by @jon_neal & afarkas : github.com/aFarkas/iepp/
        (function(win, doc) {
          win.iepp = win.iepp || {};
          var iepp = win.iepp,
            elems = iepp.html5elements || 'abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video',
            elemsArr = elems.split('|'),
            elemsArrLen = elemsArr.length,
            elemRegExp = new RegExp('(^|\\s)('+elems+')', 'gi'),
            tagRegExp = new RegExp('<(\/*)('+elems+')', 'gi'),
            filterReg = /^\s*[\{\}]\s*$/,
            ruleRegExp = new RegExp('(^|[^\\n]*?\\s)('+elems+')([^\\n]*)({[\\n\\w\\W]*?})', 'gi'),
            docFrag = doc.createDocumentFragment(),
            html = doc.documentElement,
            head = html.firstChild,
            bodyElem = doc.createElement('body'),
            styleElem = doc.createElement('style'),
            printMedias = /print|all/,
            body;
          function shim(doc) {
            var a = -1;
            while (++a < elemsArrLen)
              // Use createElement so IE allows HTML5-named elements in a document
              doc.createElement(elemsArr[a]);
          }

          iepp.getCSS = function(styleSheetList, mediaType) {
            if(styleSheetList+'' === undefined){return '';}
            var a = -1,
              len = styleSheetList.length,
              styleSheet,
              cssTextArr = [];
            while (++a < len) {
              styleSheet = styleSheetList[a];
              //currently no test for disabled/alternate stylesheets
              if(styleSheet.disabled){continue;}
              mediaType = styleSheet.media || mediaType;
              // Get css from all non-screen stylesheets and their imports
              if (printMedias.test(mediaType)) cssTextArr.push(iepp.getCSS(styleSheet.imports, mediaType), styleSheet.cssText);
              //reset mediaType to all with every new *not imported* stylesheet
              mediaType = 'all';
            }
            return cssTextArr.join('');
          };

          iepp.parseCSS = function(cssText) {
            var cssTextArr = [],
              rule;
            while ((rule = ruleRegExp.exec(cssText)) != null){
              // Replace all html5 element references with iepp substitute classnames
              cssTextArr.push(( (filterReg.exec(rule[1]) ? '\n' : rule[1]) +rule[2]+rule[3]).replace(elemRegExp, '$1.iepp_$2')+rule[4]);
            }
            return cssTextArr.join('\n');
          };

          iepp.writeHTML = function() {
            var a = -1;
            body = body || doc.body;
            while (++a < elemsArrLen) {
              var nodeList = doc.getElementsByTagName(elemsArr[a]),
                nodeListLen = nodeList.length,
                b = -1;
              while (++b < nodeListLen)
                if (nodeList[b].className.indexOf('iepp_') < 0)
                  // Append iepp substitute classnames to all html5 elements
                  nodeList[b].className += ' iepp_'+elemsArr[a];
            }
            docFrag.appendChild(body);
            html.appendChild(bodyElem);
            // Write iepp substitute print-safe document
            bodyElem.className = body.className;
            bodyElem.id = body.id;
            // Replace HTML5 elements with <font> which is print-safe and shouldn't conflict since it isn't part of html5
            bodyElem.innerHTML = body.innerHTML.replace(tagRegExp, '<$1font');
          };


          iepp._beforePrint = function() {
            // Write iepp custom print CSS
            styleElem.styleSheet.cssText = iepp.parseCSS(iepp.getCSS(doc.styleSheets, 'all'));
            iepp.writeHTML();
          };

          iepp.restoreHTML = function(){
            // Undo everything done in onbeforeprint
            bodyElem.innerHTML = '';
            html.removeChild(bodyElem);
            html.appendChild(body);
          };

          iepp._afterPrint = function(){
            // Undo everything done in onbeforeprint
            iepp.restoreHTML();
            styleElem.styleSheet.cssText = '';
          };



          // Shim the document and iepp fragment
          shim(doc);
          shim(docFrag);

          //
          if(iepp.disablePP){return;}

          // Add iepp custom print style element
          head.insertBefore(styleElem, head.firstChild);
          styleElem.media = 'print';
          styleElem.className = 'iepp-printshim';
          win.attachEvent(
            'onbeforeprint',
            iepp._beforePrint
          );
          win.attachEvent(
            'onafterprint',
            iepp._afterPrint
          );
        })(window, document);
    }
    //>>END IEPP

    // Assign private properties to the return object with prefix
    Modernizr._version      = version;

    // expose these for the plugin API. Look in the source for how to join() them against your input
    Modernizr._prefixes     = prefixes;
    Modernizr._domPrefixes  = domPrefixes;
    
    // Modernizr.mq tests a given media query, live against the current state of the window
    // A few important notes:
    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
    //   * A max-width or orientation query will be evaluated against the current state, which may change later.
    //   * You must specify values. Eg. If you are testing support for the min-width media query use: 
    //       Modernizr.mq('(min-width:0)')
    // usage:
    // Modernizr.mq('only screen and (max-width:768)')
    Modernizr.mq            = testMediaQuery;   
    
    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
    // Modernizr.hasEvent('gesturestart', elem)
    Modernizr.hasEvent      = isEventSupported; 

    // Modernizr.testProp() investigates whether a given style property is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testProp('pointerEvents')
    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };        

    // Modernizr.testAllProps() investigates whether a given style property,
    //   or any of its vendor-prefixed variants, is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')    
    Modernizr.testAllProps  = testPropsAll;     


    
    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
    Modernizr.testStyles    = injectElementWithStyles; 


    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'
    
    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
    //
    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
    
    // If you're trying to ascertain which transition end event to bind to, you might do something like...
    // 
    //     var transEndEventNames = {
    //       'WebkitTransition' : 'webkitTransitionEnd',
    //       'MozTransition'    : 'transitionend',
    //       'OTransition'      : 'oTransitionEnd',
    //       'msTransition'     : 'msTransitionEnd', // maybe?
    //       'transition'       : 'transitionEnd'
    //     },
    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];
    
    Modernizr.prefixed      = function(prop){
      return testPropsAll(prop, 'pfx');
    };



    // Remove "no-js" class from <html> element, if it exists:
    docElement.className = docElement.className.replace(/\bno-js\b/, '')
                            
                            // Add the new classes to the <html> element.
                            + (enableClasses ? ' js ' + classes.join(' ') : '');

    return Modernizr;

})(this, this.document);
function isScrolledIntoView(elem)
{
    if($(elem).length < 1) {
      return false;
    }
    
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
}
;
(function() {
  window.ForgeCraft = {
    Models: {},
    Collections: {},
    Routers: {},
    Views: {},
    Config: {
      oreDim: 64,
      moveThreshold: 12,
      dropInTimeout: 500,
      highlightTimeout: 1000,
      sound: {
        music: true,
        effects: true
      },
      splash: {
        embiggenDelay: 100,
        stickDelay: 1000,
        queueDelay: 1400
      }
    },
    Audio: {}
  };
}).call(this);
(function() {
  Crafty.audio.MAX_CHANNELS = 1;
  Crafty.audio.add("swap", "/sounds/swap_stone.mp3");
  Crafty.audio.add("forge", ["/sounds/forge.mp3", "/sounds/forge.wav", "/sounds/forge.ogg"]);
  Crafty.audio.add("slash", ["/sounds/slash.mp3", "/sounds/slash.wav", "/sounds/slash.ogg"]);
  Crafty.audio.add("forge_bg", "/sounds/forge_bg.mp3");
  ForgeCraft.Audio.play = function(id, repeat) {
    console.log("Sound settings are", ForgeCraft.Config.sound);
    if (repeat === -1) {
      if (!ForgeCraft.Config.sound.music) {
        return;
      }
    } else {
      if (!ForgeCraft.Config.sound.effects) {
        return;
      }
    }
    return Crafty.audio.play(id, repeat);
  };
  ForgeCraft.Audio.playMusic = function() {
    return ForgeCraft.Audio.play('forge_bg', -1);
  };
  ForgeCraft.Audio.update = function() {
    if (!ForgeCraft.Config.sound.music) {
      return ForgeCraft.Audio.stop('forge_bg');
    } else {
      return ForgeCraft.Audio.playMusic();
    }
  };
  ForgeCraft.Audio.stop = function(id) {
    var el, elem, l, _i, _len, _results;
    elem = Crafty.audio._elems[id];
    l = elem.length;
    _results = [];
    for (_i = 0, _len = elem.length; _i < _len; _i++) {
      el = elem[_i];
      _results.push(el.pause());
    }
    return _results;
  };
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Models.Action = (function() {
    __extends(Action, Backbone.Model);
    function Action() {
      Action.__super__.constructor.apply(this, arguments);
    }
    return Action;
  })();
  ForgeCraft.Collections.Actions = (function() {
    __extends(Actions, Backbone.Collection);
    function Actions() {
      Actions.__super__.constructor.apply(this, arguments);
    }
    Actions.prototype.model = ForgeCraft.Models.Action;
    Actions.prototype.url = function() {
      return battle.get("_id") + "/actions";
    };
    Actions.prototype.commitActions = function() {
      var params, uri;
      params = {
        actions: []
      };
      this.each(function(model) {
        return params.actions.push(model.toJSON());
      });
      uri = this.url() + '/commit';
      loadingView.show();
      $.post(uri, params, function(response) {
        $.each(response, function(i, actionData) {
          var action;
          action = new ForgeCraft.Models.Action(actionData);
          return battle.queuedActions.add(action);
        });
        return loadingView.hide();
      });
      return this.reset();
    };
    return Actions;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Models.Battle = (function() {
    __extends(Battle, Backbone.Model);
    function Battle() {
      Battle.__super__.constructor.apply(this, arguments);
    }
    Battle.prototype.defaults = {
      mode: "singleplayer",
      controllableWarrior: null,
      controllableThief: null,
      controllableRanger: null,
      enemyWarrior: null,
      enemyThief: null,
      enemyRanger: null,
      currentPlay: null,
      finished: false
    };
    Battle.prototype.initialize = function() {
      this.actions = new ForgeCraft.Collections.Actions(this.get("actions"));
      this.pendingActions = new ForgeCraft.Collections.Actions;
      this.queuedActions = new ForgeCraft.Collections.Actions;
      this.queuedActions.bind("add", this.processQueue, this);
      this.initializeHeroes();
      this.bind("ForgeCraft::PlayComplete", this["continue"], this);
      return this.actions.bind("add", this.setCurrentPlayFromAction, this);
    };
    Battle.prototype.log_action = function(params) {
      return this.actions.add(params);
    };
    Battle.prototype.initializeHeroes = function() {
      this.heroes = new ForgeCraft.Collections.Heroes();
      this.set({
        controllableWarrior: new ForgeCraft.Models.Hero(this.get("first_warrior")),
        controllableThief: new ForgeCraft.Models.Hero(this.get("first_thief")),
        controllableRanger: new ForgeCraft.Models.Hero(this.get("first_ranger")),
        enemyWarrior: new ForgeCraft.Models.Hero(this.get("second_warrior")),
        enemyThief: new ForgeCraft.Models.Hero(this.get("second_thief")),
        enemyRanger: new ForgeCraft.Models.Hero(this.get("second_ranger"))
      });
      return this.heroes.add([this.get("controllableWarrior"), this.get("controllableThief"), this.get("controllableRanger"), this.get("enemyWarrior"), this.get("enemyThief"), this.get("enemyRanger")]);
    };
    Battle.prototype["continue"] = function() {
      var lastAction, nextPlay;
      if (this.get("finished") === true) {
        return;
      }
      if (this.get("currentPlay") != null) {
        nextPlay = this.get("currentPlay") + 1;
      } else {
        lastAction = this.getLastAction();
        nextPlay = 0;
        if (lastAction != null) {
          nextPlay = lastAction.get("play") + 1;
        }
      }
      if (nextPlay > (this.get("plays").length - 1)) {
        nextPlay = 0;
      }
      console.log("Continuing with next play: ", nextPlay);
      return this.runPlay(nextPlay);
    };
    Battle.prototype.setCurrentPlayFromAction = function() {
      return this.set({
        currentPlay: this.getLastAction().get("play")
      });
    };
    Battle.prototype.getLastAction = function() {
      var num_actions;
      num_actions = this.actions.length;
      if (num_actions > 0) {
        return this.actions.at(num_actions - 1);
      }
      return null;
    };
    Battle.prototype.runPlay = function(play_index) {
      var play;
      play = this.get("plays")[play_index];
      console.log("Running play", play);
      this.set({
        currentPlay: play_index
      });
      if (play.player === 1) {
        if (play.hero === "warrior") {
          return this.get("controllableWarrior").runPlay(play.action);
        } else if (play.hero === "thief") {
          return this.get("controllableThief").runPlay(play.action);
        } else if (play.hero === "ranger") {
          return this.get("controllableRanger").runPlay(play.action);
        }
      } else if (play.player === 0) {
        return this.fastForward();
      }
    };
    Battle.prototype.fastForward = function() {
      console.log("Synching pending actions and fast forwarding", this.pendingActions);
      return this.pendingActions.commitActions();
    };
    Battle.prototype.processQueue = function() {
      if (battle.queuedActions.length < 1) {
        this["continue"]();
        return;
      }
      clearTimeout(this.queueTimeout);
      return this.queueTimeout = setTimeout(function() {
        var action;
        console.log("Processing Queue!");
        action = battle.queuedActions.at(0);
        battle.queuedActions.remove(action);
        battle.processAction(action);
        return battle.processQueue();
      }, 1000);
    };
    Battle.prototype.stopQueue = function() {
      return clearTimeout(this.queueTimeout);
    };
    Battle.prototype.clearQueue = function() {
      return this.queuedActions.reset();
    };
    Battle.prototype.processAction = function(action) {
      var hero;
      console.log("Processing action:", action);
      battle.actions.add(action);
      if (action.get("hero") != null) {
        console.log("Updating hero conditions");
        hero = battle.heroes.get(action.get("hero_id"));
        hero.set(action.get("hero_conditions"));
        hero.set({
          last_action: action.get("id")
        });
      }
      if (action.get("targetted") != null) {
        console.log("Updating target conditions", action.get("target_id"), action.get("target_conditions"));
        hero = battle.heroes.get(action.get("target_id"));
        hero.set(action.get("target_conditions"));
      }
      if (action.get("conditions") != null) {
        console.log("Updating battle condiitons", action.get("conditions"));
        return battle.set(action.get("conditions"));
      }
    };
    Battle.prototype.forfeit = function(callback) {
      return $.post("/battles/" + this.get("id"), {
        "_method": "DELETE"
      }, function() {
        if (callback != null) {
          return callback.apply();
        }
      });
    };
    return Battle;
  })();
  ForgeCraft.Collections.Battles = (function() {
    __extends(Battles, Backbone.Collection);
    function Battles() {
      Battles.__super__.constructor.apply(this, arguments);
    }
    Battles.prototype.model = ForgeCraft.Models.Battle;
    Battles.prototype.url = '/battles';
    return Battles;
  })();
}).call(this);
(function() {
  var priority;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Models.Classification = (function() {
    __extends(Classification, Backbone.Model);
    function Classification() {
      Classification.__super__.constructor.apply(this, arguments);
    }
    Classification.prototype.defaults = {
      name: "",
      priority: 0,
      patterns: []
    };
    return Classification;
  })();
  priority = 100;
  ForgeCraft.Collections.ClassTemplates = (function() {
    __extends(ClassTemplates, Backbone.Collection);
    function ClassTemplates() {
      ClassTemplates.__super__.constructor.apply(this, arguments);
    }
    return ClassTemplates;
  })();
  /*
    Tunic
  */
  this.tunic = new ForgeCraft.Models.Classification({
    name: "Tunic",
    priority: priority--,
    patterns: [[[1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], [[1, 0], [0, 1], [1, 1], [0, 2], [1, 2]]]
  });
  /*
    Leggings
  */
  this.leggings = new ForgeCraft.Models.Classification({
    name: "Legging",
    priority: priority--,
    patterns: [[[1, 0], [0, 1], [0, 2], [1, 2]], [[0, 1], [1, 1], [2, 1], [2, 0]], [[1, 0], [1, 1], [1, 2], [0, 2]], [[0, 1], [1, 0], [2, 0], [2, 1]]]
  });
  /*
    Crossbow
  */
  this.crossbow = new ForgeCraft.Models.Classification({
    name: "Crossbow",
    priority: priority--,
    patterns: [[[-1, 1], [0, 1], [1, 1], [0, 2], [0, 3]], [[-1, 1], [0, 1], [1, 1], [0, 2], [-2, 1]], [[-1, 1], [0, 1], [1, 1], [0, 2], [2, 1]], [[-1, 2], [0, 1], [1, 2], [0, 2], [0, 3]]]
  });
  /*
    Sword
  */
  this.longsword = new ForgeCraft.Models.Classification({
    name: "Sword",
    priority: priority--,
    patterns: [[[1, 0], [2, 0], [3, 0]], [[0, 1], [0, 2], [0, 3]]]
  });
  /*
    Axe
  */
  this.axe = new ForgeCraft.Models.Classification({
    name: "Axe",
    priority: priority--,
    patterns: [[[1, 0], [2, 0], [1, 1], [1, 2]], [[1, 0], [2, 0], [2, -1], [2, 1]], [[0, 1], [0, 2], [1, 1], [2, 1]], [[0, 1], [0, 2], [-1, 2], [1, 2]]]
  });
  /*
    Shield
  */
  this.shield = new ForgeCraft.Models.Classification({
    name: "Shield",
    priority: priority--,
    patterns: [[[1, 0], [0, 1], [1, 1]]]
  });
  /*
    Sword
  */
  this.sword = new ForgeCraft.Models.Classification({
    name: "Sword",
    priority: priority--,
    patterns: [[[1, 0], [2, 0]], [[0, 1], [0, 2]]]
  });
  ForgeCraft.ClassTemplates = new ForgeCraft.Collections.ClassTemplates([this.tunic, this.leggings, this.crossbow, this.longsword, this.axe, this.shield]);
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Models.Enemy = (function() {
    __extends(Enemy, Backbone.Model);
    function Enemy() {
      Enemy.__super__.constructor.apply(this, arguments);
    }
    Enemy.prototype.defaults = {
      name: "Enemy",
      attack: 10,
      defense: 20
    };
    Enemy.prototype.initialize = function() {
      console.log("Initializing enemy!", this);
      return this.originalDefense = this.get("defense");
    };
    Enemy.prototype.start = function() {
      return forgeView.startFight();
    };
    Enemy.prototype.calculateDamage = function() {
      var attack, diff, dmg, max, min;
      attack = parseInt(this.get('attack'));
      min = attack * 0.7;
      max = attack * 1.3;
      diff = max - min;
      dmg = Math.round(Math.random() * diff + min);
      return dmg;
    };
    Enemy.prototype.hit = function(guard) {
      return guard.takeDamage(this.calculateDamage());
    };
    Enemy.prototype.takeDamage = function(amount) {
      var curr_defense, new_defense;
      console.log("Enemy took damage:", amount);
      curr_defense = this.get("defense");
      new_defense = curr_defense - amount;
      if (new_defense <= 0) {
        new_defense = 0;
        this.die();
      }
      return this.set({
        defense: new_defense
      });
    };
    Enemy.prototype.defensePercent = function() {
      return Math.round((this.get("defense") / this.originalDefense) * 100);
    };
    Enemy.prototype.die = function() {
      var params;
      params = {
        _method: "put",
        winner: "player"
      };
      $.post("/forges/" + forge.get("id") + "/enemies/" + this.get("id"), params, function(response) {
        forge.processEventResponse(response);
        return forgeView.endFight('win');
      });
      return false;
    };
    Enemy.prototype.win = function() {
      var params;
      params = {
        _method: "put",
        winner: "enemy"
      };
      $.post("/forges/" + forge.get("id") + "/enemies/" + this.get("id"), params, function(response) {
        forge.processEventResponse(response);
        return forgeView.endFight('loss');
      });
      return false;
    };
    return Enemy;
  })();
  ForgeCraft.Collections.Enemies = (function() {
    __extends(Enemies, Backbone.Collection);
    function Enemies() {
      Enemies.__super__.constructor.apply(this, arguments);
    }
    Enemies.prototype.model = ForgeCraft.Models.Enemy;
    Enemies.prototype.url = function() {
      return "/forges/" + forge.get("id") + "/enemies";
    };
    return Enemies;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Models.Event = (function() {
    __extends(Event, Backbone.Model);
    function Event() {
      Event.__super__.constructor.apply(this, arguments);
    }
    Event.prototype.defaults = {
      message: ""
    };
    Event.prototype.initialize = function() {
      return this.bind("add", this.process, this);
    };
    Event.prototype.process = function() {
      if (this.get("enemy") != null) {
        return this.processBattle();
      }
    };
    Event.prototype.processBattle = function() {
      forge.enemy = new ForgeCraft.Models.Enemy(this.get("enemy"));
      return forge.enemy.start();
    };
    return Event;
  })();
  ForgeCraft.Collections.Events = (function() {
    __extends(Events, Backbone.Collection);
    function Events() {
      Events.__super__.constructor.apply(this, arguments);
    }
    Events.prototype.model = ForgeCraft.Models.Event;
    Events.prototype.url = function() {
      return "/forges/" + forge.get("id") + "/events";
    };
    Events.prototype.lastEvent = function() {
      return this.at(this.length - 1);
    };
    Events.prototype.processLastEvent = function() {
      var ev;
      ev = this.lastEvent();
      console.log("Processing event", ev);
      return ev.process();
    };
    return Events;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ForgeCraft.Models.Forge = (function() {
    __extends(Forge, Backbone.Model);
    function Forge() {
      Forge.__super__.constructor.apply(this, arguments);
    }
    Forge.prototype.initialize = function() {
      return this.events = new ForgeCraft.Collections.Events(ForgeCraft.Config.latest_event);
    };
    Forge.prototype.hasEnoughFunds = function(amount) {
      if (!this.get("requires_funding")) {
        return true;
      }
      return this.get("funds") > amount;
    };
    Forge.prototype.processEventResponse = function(params) {
      var loot;
      if (params.player != null) {
        player.set(params.player);
      }
      if (params.loot != null) {
        loot = new ForgeCraft.Models.Loot(params.loot);
        Loot.add(loot);
      }
      forge.events.add(params.new_events.reverse());
      return eventsView.addEventsHTML(params.new_events_html);
    };
    return Forge;
  })();
  ForgeCraft.Models.Forgeable = (function() {
    __extends(Forgeable, Backbone.Model);
    function Forgeable() {
      Forgeable.__super__.constructor.apply(this, arguments);
    }
    Forgeable.prototype.defaults = {
      classification: "",
      ore: "",
      ores: []
    };
    Forgeable.prototype.initialize = function() {
      this.bind("change:ores", this.updateTileForgeables);
      return this.trigger("change:ores", this, this.get("ores"));
    };
    Forgeable.prototype.updateTileForgeables = function(model, ores) {
      var prevTiles, self;
      self = this;
      prevTiles = this.previous("ores");
      $.each(prevTiles, function(i, ore) {
        return ore.set({
          forgeable: !_.include(ores, ore) ? void 0 : void 0
        });
      });
      return $.each(ores, function(i, ore) {
        ore.set({
          forgeable: self
        });
        return self.setNeighbors(ore);
      });
    };
    Forgeable.prototype.setNeighbors = function(ore) {
      var n, x, y;
      x = ore.get("x");
      y = ore.get("y");
      n = [];
      if (this.hasOreAt(x, y - 1)) {
        n.push("top");
      }
      if (this.hasOreAt(x + 1, y)) {
        n.push("right");
      }
      if (this.hasOreAt(x, y + 1)) {
        n.push("bottom");
      }
      if (this.hasOreAt(x - 1, y)) {
        n.push("left");
      }
      return ore.set({
        neighbors: n
      });
    };
    Forgeable.prototype.hasOreAt = function(x, y) {
      var hasOre;
      hasOre = false;
      $.each(this.get("ores"), function(i, ore) {
        hasOre = ore.get("x") === x && ore.get("y") === y;
        if (hasOre) {
          return false;
        }
      });
      return hasOre;
    };
    Forgeable.prototype.toJSON = function() {
      return {
        forging: {
          classification: this.get("classification"),
          ore: this.get("ore"),
          ore_count: this.get("ores").length,
          accuracy: this.get("accuracy")
        }
      };
    };
    Forgeable.prototype.forge = function(accuracy) {
      if (this.forging) {
        return;
      }
      this.forging = true;
      this.set({
        accuracy: accuracy
      });
      Ores.clearForgeables();
      this.markOres();
      console.log("Forging with accuracy", this.get("accuracy"));
      this.save(this.toJSON, {
        success: this.convertToLootIfPurchased
      });
      return ForgeCraft.Audio.play("forge");
    };
    Forgeable.prototype.markOres = function() {
      return $.each(this.get("ores"), function(i, ore) {
        return ore.set({
          marked: true
        });
      });
    };
    Forgeable.prototype.unmarkOres = function() {
      return $.each(this.get("ores"), function(i, ore) {
        return ore.set({
          marked: false
        });
      });
    };
    Forgeable.prototype.convertToLootIfPurchased = function(forgeable, params) {
      console.log("Response from server is:", params);
      if (params.purchased) {
        return forgeable.processEventResponse(params);
      } else {
        return forgeable.unableToPurchase(params);
      }
    };
    Forgeable.prototype.processEventResponse = function(params) {
      var loot;
      Forgings.remove(this);
      player.set(params.player);
      this.consumeOres();
      Ores.addReplacements(params.replacements);
      setTimeout(function() {
        return $('.ore').removeClass("unmarked");
      }, 500);
      loot = new ForgeCraft.Models.Loot(params.loot);
      Loot.add(loot);
      forge.events.add(params.new_events.reverse());
      return eventsView.addEventsHTML(params.new_events_html);
    };
    Forgeable.prototype.unableToPurchase = function(params) {
      this.unmarkOres();
      forge.trigger("ForgeCraft:NeedMoreCoins");
      player.set(params.player);
      return Ores.refresh();
    };
    Forgeable.prototype.consumeOres = function() {
      $.each(this.get("ores"), function(i, ore) {
        ore.clearForgeable();
        return ore.destroy();
      });
      return setTimeout(__bind(function() {
        return Ores.refresh();
      }, this), 200);
    };
    return Forgeable;
  })();
  ForgeCraft.Collections.Forgings = (function() {
    __extends(Forgings, Backbone.Collection);
    function Forgings() {
      Forgings.__super__.constructor.apply(this, arguments);
    }
    Forgings.prototype.model = ForgeCraft.Models.Forgeable;
    Forgings.prototype.url = function() {
      return "/forges/" + window.forge.get("id") + "/loot";
    };
    Forgings.prototype.onRender = function() {
      return this.reset();
    };
    Forgings.prototype.forge = function(forgeable) {
      console.log("Forging", forgeable);
      return forgeable.forge();
    };
    return Forgings;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Models.Guard = (function() {
    __extends(Guard, Backbone.Model);
    function Guard() {
      Guard.__super__.constructor.apply(this, arguments);
    }
    Guard.prototype.defaults = {
      attack: 10,
      defense: 20,
      alive: true
    };
    Guard.prototype.calculateDamage = function() {
      var attack, diff, dmg, max, min;
      attack = parseInt(this.get('attack'));
      min = attack * 0.7;
      max = attack * 1.3;
      diff = max - min;
      dmg = Math.round(Math.random() * diff + min);
      return dmg;
    };
    Guard.prototype.hit = function() {
      return forge.enemy.takeDamage(this.calculateDamage());
    };
    Guard.prototype.takeDamage = function(amount) {
      var curr_defense, new_defense;
      console.log("Guard took damage:", amount);
      curr_defense = this.get("defense");
      new_defense = curr_defense - amount;
      if (new_defense <= 0) {
        new_defense = 0;
        this.die();
      }
      return this.set({
        defense: new_defense
      });
    };
    Guard.prototype.die = function() {
      return this.set({
        alive: false
      });
    };
    return Guard;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Models.Hero = (function() {
    __extends(Hero, Backbone.Model);
    function Hero() {
      Hero.__super__.constructor.apply(this, arguments);
    }
    Hero.prototype.defaults = {
      name: "Hero",
      attack: 0,
      defense: 0,
      active: false
    };
    Hero.prototype.runPlay = function(playName) {
      if (this.get("alive") === false) {
        console.log("I'm dead! Moving on");
        battle.trigger("ForgeCraft::PlayComplete");
        return;
      }
      console.log("Hero running play", playName);
      if (playName === 'choose_action') {
        return this.chooseAction();
      }
    };
    Hero.prototype.chooseAction = function() {
      return this.activate();
    };
    Hero.prototype.activate = function() {
      console.log("Activating hero");
      return this.set({
        active: true
      });
    };
    Hero.prototype.deactivate = function() {
      console.log("Deactivating hero");
      return this.set({
        active: false
      });
    };
    Hero.prototype.chooseAttackTarget = function(enemy) {
      var action;
      this.deactivate();
      action = new ForgeCraft.Models.Action({
        type: "attack",
        play: battle.get("currentPlay"),
        target_id: enemy.get("_id"),
        target_type: enemy.get("job_name"),
        hero_id: this.get("_id"),
        hero_type: this.get("job_name")
      });
      battle.pendingActions.add(action);
      return battle.trigger("ForgeCraft::PlayComplete");
    };
    return Hero;
  })();
  ForgeCraft.Collections.Heroes = (function() {
    __extends(Heroes, Backbone.Collection);
    function Heroes() {
      Heroes.__super__.constructor.apply(this, arguments);
    }
    Heroes.prototype.model = ForgeCraft.Models.Hero;
    return Heroes;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Models.Loot = (function() {
    __extends(Loot, Backbone.Model);
    function Loot() {
      Loot.__super__.constructor.apply(this, arguments);
    }
    Loot.prototype.defaults = {
      name: "",
      rarity: "",
      ore: ""
    };
    Loot.prototype.sell = function() {
      var self;
      self = this;
      return this.destroy({
        success: function(model, response) {
          player.set(response.player);
          return loadingView.hide();
        }
      });
    };
    return Loot;
  })();
  ForgeCraft.Collections.Loot = (function() {
    __extends(Loot, Backbone.Collection);
    function Loot() {
      Loot.__super__.constructor.apply(this, arguments);
    }
    Loot.prototype.model = ForgeCraft.Models.Loot;
    Loot.prototype.url = "/loot";
    Loot.prototype.fetchLootLock = false;
    Loot.prototype.comparator = function(loot) {
      return -parseInt(loot.get("id"));
    };
    Loot.prototype.fetchMore = function(count) {
      var last;
      if (count == null) {
        count = 1;
      }
      console.log("Attempting to fetch more loot", this.fetchLootLock);
      if (this.fetchLootLock === true) {
        return;
      }
      this.activateFetchLootLock();
      last = this.at(this.length - 1);
      return this.fetch({
        data: {
          last: last.get("id"),
          forge_id: forge.get("id"),
          limit: count
        },
        add: true,
        success: this.releaseFetchLootLock
      });
    };
    Loot.prototype.activateFetchLootLock = function() {
      console.log("Activating fetch loot lock");
      return Loot.fetchLootLock = true;
    };
    Loot.prototype.releaseFetchLootLock = function(collection, response) {
      console.log("Releasing fetch loot lock");
      if (response.length < 1) {
        forgeView.reflectBottomOfLootList();
      }
      return Loot.fetchLootLock = false;
    };
    Loot.prototype.sell = function(loot_id) {
      var loot;
      loadingView.show();
      loot = this.get(loot_id);
      if (loot == null) {
        loot = new ForgeCraft.Models.Loot({
          id: loot_id
        });
        window.Loot.add(loot);
      }
      return loot.sell();
    };
    return Loot;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Models.Map = (function() {
    __extends(Map, Backbone.Model);
    function Map() {
      Map.__super__.constructor.apply(this, arguments);
    }
    return Map;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Models.Ore = (function() {
    __extends(Ore, Backbone.Model);
    function Ore() {
      Ore.__super__.constructor.apply(this, arguments);
    }
    Ore.prototype.paramRoot = 'ore';
    Ore.prototype.defaults = {
      rank: 1,
      x: -1,
      y: -1,
      moveable: true,
      neighbors: []
    };
    Ore.prototype.initialize = function() {
      return this.bind("change", this.cache, this);
    };
    Ore.prototype.cache = function() {
      return Ores.cache(this);
    };
    Ore.prototype.clearForgeable = function() {
      this.set({
        forgeable: void 0
      });
      return this.set({
        neighbors: []
      });
    };
    Ore.prototype.dropTo = function(y) {
      Ores.consume(this);
      return this.set({
        y: y
      });
    };
    Ore.prototype.forLog = function() {
      return this.get("name") + " (" + this.get("x") + ", " + this.get("y") + ")" + " in forgeable " + this.get("forgeable");
    };
    Ore.prototype.useMovement = function() {
      return this.set({
        moveable: false
      });
    };
    return Ore;
  })();
  ForgeCraft.Collections.OresCollection = (function() {
    __extends(OresCollection, Backbone.Collection);
    function OresCollection() {
      OresCollection.__super__.constructor.apply(this, arguments);
    }
    OresCollection.prototype.model = ForgeCraft.Models.Ore;
    OresCollection.prototype.url = function() {
      return '/forges/' + forge.get("id") + '/ores';
    };
    OresCollection.prototype.numCols = 0;
    OresCollection.prototype.numRows = 0;
    OresCollection.prototype.oreCache = [[]];
    OresCollection.prototype.holes = [];
    OresCollection.prototype.replacements = [];
    OresCollection.prototype.oresInForgeables = [];
    OresCollection.prototype.workingForgeables = [];
    OresCollection.prototype.initialize = function() {
      this.bind("destroy", this.consume, this);
      return this.bind("reset", this.flush, this);
    };
    OresCollection.prototype.flush = function() {
      console.log("Flushing Ores...");
      this.oreCache = [[]];
      this.holes = [];
      this.replacements = [];
      this.oresInForgeables = [];
      return this.workingForgeables = [];
    };
    OresCollection.prototype.initialFill = function(count) {
      this.reset();
      return this.fetch({
        data: {
          count: count
        },
        success: this.onInitialFill
      });
    };
    OresCollection.prototype.onInitialFill = function(collection, response) {
      var col, row;
      console.log("On initial fill: ", collection);
      col = 0;
      row = 0;
      Ores.forEach(function(ore) {
        ore.set({
          x: col,
          y: row
        });
        col++;
        if (col >= Ores.numCols) {
          col = 0;
          return row++;
        }
      });
      Ores.trigger("reveal");
      return Ores.refresh();
    };
    OresCollection.prototype.cache = function(ore) {
      var x, y;
      x = ore.get('x');
      y = ore.get('y');
      if (this.oreCache[x] == null) {
        this.oreCache[x] = [];
      }
      return this.oreCache[x][y] = ore;
    };
    OresCollection.prototype.uncache = function(ore) {
      var x, y;
      x = ore.get('x');
      y = ore.get('y');
      if (this.oreCache[x] == null) {
        this.oreCache[x] = [];
      }
      return this.oreCache[x][y] = void 0;
    };
    OresCollection.prototype.consume = function(ore) {
      var col;
      this.uncache(ore);
      col = ore.get('x');
      if (!_.include(this.holes, col)) {
        return this.holes.push(col);
      }
    };
    OresCollection.prototype.oreAt = function(x, y) {
      if (this.oreCache[x] == null) {
        return;
      }
      return this.oreCache[x][y];
    };
    OresCollection.prototype.oreInForgeable = function(ore) {
      return _.include(this.oresInForgeables, ore);
    };
    OresCollection.prototype.swapOres = function(oreOne, oreTwo) {
      var oreOneX, oreOneY, oreTwoX, oreTwoY;
      console.log("Swapping ore models", oreOne, oreTwo);
      oreOneX = oreOne.get('x');
      oreOneY = oreOne.get('y');
      oreTwoX = oreTwo.get('x');
      oreTwoY = oreTwo.get('y');
      oreOne.set({
        x: oreTwoX,
        y: oreTwoY
      });
      oreTwo.set({
        x: oreOneX,
        y: oreOneY
      });
      return ForgeCraft.Audio.play("swap");
    };
    OresCollection.prototype.swapOresAndValidate = function(oreOne, oreTwo) {
      if (!(oreOne.get("moveable") && oreTwo.get("moveable"))) {
        if (!oreOne.get("moveable")) {
          oreOne.trigger("ForgeCraft:MoveBlock");
        }
        if (!oreTwo.get("moveable")) {
          oreTwo.trigger("ForgeCraft:MoveBlock");
        }
        return;
      }
      if (!forge.hasEnoughFunds(0)) {
        forge.trigger("ForgeCraft:NeedMoreCoins");
        return;
      }
      this.swapOres(oreOne, oreTwo);
      oreOne.useMovement();
      oreTwo.useMovement();
      return Ores.refresh();
    };
    OresCollection.prototype.refresh = function() {
      console.log("Refreshing board");
      this.clearForgeables();
      this.fillHoles();
      return this.detectForgeables();
    };
    OresCollection.prototype.fillHoles = function() {
      var x, y, _i, _len, _ref, _ref2, _ref3, _results;
      if (!(this.holes.length > 0)) {
        return;
      }
      _ref = this.holes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        for (y = _ref2 = this.numRows - 2; _ref2 <= 0 ? y <= 0 : y >= 0; _ref2 <= 0 ? y++ : y--) {
          this.applyGravityAt(x, y);
        }
        for (y = _ref3 = this.numRows - 2; _ref3 <= 0 ? y <= 0 : y >= 0; _ref3 <= 0 ? y++ : y--) {
          this.backFillAt(x, y);
        }
        _results.push(_.reject(this.holes, function(col) {
          return col === x;
        }));
      }
      return _results;
    };
    OresCollection.prototype.applyGravityAt = function(x, y) {
      var blocked, dy, ore;
      if (!(ore = this.oreAt(x, y))) {
        return;
      }
      blocked = false;
      dy = y;
      while (!blocked) {
        blocked = this.blockage(x, ++dy);
      }
      if (blocked && (dy - 1) !== y) {
        return ore.dropTo(dy - 1);
      }
    };
    OresCollection.prototype.backFillAt = function(x, y) {
      var filler;
      if (this.oreAt(x, y)) {
        return;
      }
      filler = new ForgeCraft.Models.Ore(this.replacements.shift());
      this.add(filler);
      return filler.set({
        x: x,
        y: y
      });
    };
    OresCollection.prototype.blockage = function(x, y) {
      return (this.oreAt(x, y) != null) || y >= this.numRows;
    };
    OresCollection.prototype.clearForgeables = function() {
      var ore, _i, _len, _ref, _results;
      this.oresInForgeables = [];
      _ref = this.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ore = _ref[_i];
        _results.push(ore.clearForgeable());
      }
      return _results;
    };
    OresCollection.prototype.detectForgeables = function() {
      var x, y, _ref, _ref2;
      window.Forgings = new ForgeCraft.Collections.Forgings;
      for (y = 0, _ref = this.numRows - 1; 0 <= _ref ? y <= _ref : y >= _ref; 0 <= _ref ? y++ : y--) {
        for (x = 0, _ref2 = this.numCols - 1; 0 <= _ref2 ? x <= _ref2 : x >= _ref2; 0 <= _ref2 ? x++ : x--) {
          this.detectForgeable(this.oreAt(x, y));
        }
      }
      return this;
    };
    OresCollection.prototype.detectForgeable = function(ore) {
      var i, match, matchingTemplate, self, template, _ref, _results;
      if (this.oreInForgeable(ore)) {
        return;
      }
      self = this;
      this.workingOre = ore;
      match = false;
      matchingTemplate = 0;
      _results = [];
      for (i = 0, _ref = ForgeCraft.ClassTemplates.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        template = ForgeCraft.ClassTemplates.at(i);
        match = self.testTemplate(template);
        if (match) {
          matchingTemplate = template;
        }
        if (match) {
          this.createForgeable(matchingTemplate, this.workingForgeable);
        }
        _results.push(!match);
      }
      return _results;
    };
    OresCollection.prototype.testTemplate = function(template) {
      var patterns, self, templateMatch;
      self = this;
      patterns = template.get("patterns");
      templateMatch = false;
      $.each(patterns, function(i, pattern) {
        templateMatch = self.testPattern(pattern);
        return !templateMatch;
      });
      return templateMatch;
    };
    OresCollection.prototype.testPattern = function(pattern) {
      var patternMatch, self;
      self = this;
      patternMatch = true;
      this.workingForgeable = [this.workingOre];
      $.each(pattern, function(i, point) {
        patternMatch = self.testOreAt(point);
        return patternMatch;
      });
      return patternMatch;
    };
    OresCollection.prototype.testOreAt = function(point) {
      var dX, dY, oreToTest;
      dX = this.workingOre.get('x') + point[0];
      dY = this.workingOre.get('y') + point[1];
      oreToTest = this.oreAt(dX, dY);
      if (oreToTest == null) {
        return false;
      }
      if (this.oreInForgeable(oreToTest)) {
        return false;
      }
      if (oreToTest.get("name") !== this.workingOre.get("name")) {
        return false;
      }
      this.workingForgeable.push(oreToTest);
      return true;
    };
    OresCollection.prototype.createForgeable = function(classification, ores) {
      var forgeable;
      forgeable = new ForgeCraft.Models.Forgeable({
        ores: ores,
        classification: classification.get("name"),
        ore: ores[0].get("name")
      });
      Forgings.add(forgeable);
      return this.oresInForgeables = _.union(this.oresInForgeables, ores);
    };
    OresCollection.prototype.addReplacements = function(ores) {
      this.replacements || (this.replacements = []);
      return this.replacements = _.union(this.replacements, ores);
    };
    OresCollection.prototype.unlockAllOres = function() {
      var ore, _i, _len, _ref, _results;
      _ref = this.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ore = _ref[_i];
        _results.push(ore.set({
          moveable: true
        }));
      }
      return _results;
    };
    return OresCollection;
  })();
}).call(this);
(function() {

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Models.Player = (function() {
    __extends(Player, Backbone.Model);
    function Player() {
      Player.__super__.constructor.apply(this, arguments);
    }
    Player.prototype.paramRoot = 'player';
    Player.prototype.defaults = {
      level: 0,
      coins: 0,
      setting: {}
    };
    Player.prototype.initialize = function() {
      this.bind("change:forge", this.updateForge, this);
      return this.bind("change:setting", this.updateSetting, this);
    };
    Player.prototype.equip = function(hero_id, slot, loot_id) {
      var data;
      console.log("Equipping loot", loot_id);
      data = {
        _method: "put",
        slot: slot,
        loot_id: loot_id
      };
      loadingView.show();
      return $.post("/heroes/" + hero_id, data, function(response) {
        console.log("Response from equpping loot", response);
        loadingView.hide();
        if ($('#facebox').length > 0) {
          return $('#facebox').find('.content').html(response);
        }
      });
    };
    Player.prototype.updateForge = function() {
      return forge.set(this.get("forge"));
    };
    Player.prototype.updateSetting = function() {
      ForgeCraft.Config.sound.music = this.get("setting").music;
      ForgeCraft.Config.sound.effects = this.get("setting").effects;
      return ForgeCraft.Audio.update();
    };
    Player.prototype.fleeBattle = function() {
      forge.enemy.win();
      return false;
    };
    return Player;
  })();
  ForgeCraft.Collections.PlayersCollection = (function() {
    __extends(PlayersCollection, Backbone.Collection);
    function PlayersCollection() {
      PlayersCollection.__super__.constructor.apply(this, arguments);
    }
    PlayersCollection.prototype.model = ForgeCraft.Models.Player;
    PlayersCollection.prototype.url = '/players';
    return PlayersCollection;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.AppView = (function() {
    __extends(AppView, Backbone.View);
    function AppView() {
      AppView.__super__.constructor.apply(this, arguments);
    }
    AppView.prototype.initialize = function() {
      this.startHistory();
      this.bindInternalLinks();
      this.bindAlerts();
      this.bind("ForgeCraft::ViewLoaded", this.startAppContext, this);
      return this.startAppContext(window.location.pathname);
    };
    AppView.prototype.load = function(path, callback) {
      var self;
      self = this;
      flashView.hide();
      loadingView.show();
      this.hideAllPopovers();
      $(window).unbind('resize');
      return $('#content').load(path, function() {
        loadingView.hide();
        self.trigger("ForgeCraft::ViewLoaded", path);
        if (callback != null) {
          return callback.apply();
        }
      });
    };
    AppView.prototype.startHistory = function() {
      return Backbone.history.start({
        pushState: true,
        silent: true
      });
    };
    AppView.prototype.startAppContext = function(path) {
      console.log("Starting app context with", path);
      if (typeof enemyView !== "undefined" && enemyView !== null) {
        enemyView.unbindKeys();
      }
      $('body').scrollTop(0);
      ForgeCraft.Audio.stop('forge_bg');
      if (path.match('/logout')) {
        return;
      }
      if (path.match('/forges/')) {
        this.startForge();
      }
      if (path.match('/battles/')) {
        this.startBattle();
      }
      if (path.match('/map')) {
        this.startMap();
      }
      this.bindPopovers();
      tooltipView.bindTooltips();
      return $('abbr.timeago').timeago();
    };
    AppView.prototype.startForge = function() {
      window.forge = new ForgeCraft.Models.Forge(ForgeCraft.Config.forge);
      window.forgeView = new ForgeCraft.Views.ForgeView({
        el: $('#forge').get(0),
        model: window.forge
      });
      window.forge.events.processLastEvent();
      return ForgeCraft.Audio.play('forge_bg', -1);
    };
    AppView.prototype.startBattle = function() {
      window.battle = new ForgeCraft.Models.Battle(ForgeCraft.Config.battle);
      window.battleView = new ForgeCraft.Views.BattleView({
        el: $('#battle').get(0),
        model: window.battle
      });
      return window.battle["continue"]();
    };
    AppView.prototype.startMap = function() {
      mapView.bindTravelActions();
      return mapView.refresh();
    };
    AppView.prototype.bindInternalLinks = function() {
      return $('a').live('click', function() {
        var r;
        if (!$(this).attr('data-external')) {
          r = $(this).attr('href').slice(1);
          Backbone.history.navigate(r, true);
          return false;
        }
      });
    };
    AppView.prototype.bindAlerts = function() {
      return $('.notice').alert();
    };
    AppView.prototype.bindPopovers = function() {};
    AppView.prototype.hideAllPopovers = function() {
      return $('.popover').remove();
    };
    return AppView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.ArmoryView = (function() {
    __extends(ArmoryView, Backbone.View);
    function ArmoryView() {
      ArmoryView.__super__.constructor.apply(this, arguments);
    }
    ArmoryView.prototype.initialize = function() {
      this.bindItemDelete();
      this.bindFilterChange();
      this.bindItemCreateLink();
      this.bindItemEditLink();
      this.bindItemFormCallbacks();
      return this.bindItemSold();
    };
    ArmoryView.prototype.bindItemDelete = function() {
      return $('.delete-item').live("ajax:complete", function(e) {
        var item_id;
        item_id = $(e.target).attr("data-item-id");
        return $('#row_item_' + item_id).remove();
      });
    };
    ArmoryView.prototype.bindFilterChange = function() {
      return $('input[rel=filter]').live('change', this.applyFilter);
    };
    ArmoryView.prototype.applyFilter = function() {
      var classification, ores, ores_uri, rarities, rarities_uri, uri;
      uri = 'armory?';
      classification = $('input[name=classification]:checked').val();
      uri += '&classification=' + classification;
      ores = [];
      ores_uri = '';
      $('input[name="ores[]"]:checked').each(function(i, input) {
        var id;
        id = $(input).val();
        ores.push(id);
        return ores_uri += '&ores[]=' + id;
      });
      if (!(ores.length === $('input[name="ores[]"]').length || ores.length === 0)) {
        uri += ores_uri;
      }
      rarities = [];
      rarities_uri = '';
      $('input[name="rarities[]"]:checked').each(function(i, input) {
        var id;
        id = $(input).val();
        rarities.push(id);
        return rarities_uri += '&rarities[]=' + id;
      });
      if (!(rarities.length === $('input[name="rarities[]"]').length || rarities.length === 0)) {
        uri += rarities_uri;
      }
      Backbone.history.navigate(uri, false);
      uri = '/' + uri + '&filter=1';
      loadingView.show();
      return $('#item-table-wrap').load(uri, function() {
        return loadingView.hide();
      });
    };
    ArmoryView.prototype.bindItemCreateLink = function() {
      return $('.create-item').live('click', function() {
        $.facebox({
          ajax: "/items/new"
        });
        return false;
      });
    };
    ArmoryView.prototype.bindItemEditLink = function() {
      return $('.edit-item').live('click', function() {
        var item_id;
        item_id = $(this).attr("rel");
        $.facebox({
          ajax: "/items/" + item_id + "/edit"
        });
        return false;
      });
    };
    ArmoryView.prototype.bindItemFormCallbacks = function() {
      $('#new_item, .edit_item').live('ajax:beforeSend', function() {
        return loadingView.show();
      });
      return $('#new_item, .edit_item').live('ajax:complete', function() {
        loadingView.hide();
        $(document).trigger('close.facebox');
        return window.armoryView.applyFilter();
      });
    };
    ArmoryView.prototype.bindItemSold = function() {
      return window.Loot.bind("destroy", this.removeItem, this);
    };
    ArmoryView.prototype.removeItem = function(model) {
      return $('.loot[data-id=' + model.get("id") + ']').fadeOut(function() {
        return $(this).remove();
      });
    };
    return ArmoryView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.ActionView = (function() {
    __extends(ActionView, Backbone.View);
    function ActionView() {
      ActionView.__super__.constructor.apply(this, arguments);
    }
    ActionView.prototype.tagName = 'li';
    ActionView.prototype.className = 'log-action';
    ActionView.prototype.template = function() {
      return $('#log-templates').find("." + this.model.get("type"));
    };
    ActionView.prototype.render = function() {
      console.log("Rendering log action of type", this.model.get("type"));
      $(this.el).html(this.template().clone());
      if (this.model.get("type") === 'message') {
        this.buildMessage();
      }
      if (this.model.get("type") === 'attack') {
        this.buildAttack();
      }
      if (this.model.get("type") === 'notification') {
        this.buildNotification();
      }
      $(this.el).hide();
      $('.action-list').prepend($(this.el));
      return $(this.el).fadeIn();
    };
    ActionView.prototype.playerName = function() {
      return this.model.get("player").name;
    };
    ActionView.prototype.heroName = function() {
      return this.model.get("hero").name;
    };
    ActionView.prototype.heroJobName = function() {
      return this.model.get("hero").job_name;
    };
    ActionView.prototype.targettedName = function() {
      return this.model.get("targetted").name;
    };
    ActionView.prototype.targettedJobName = function() {
      return this.model.get("targetted").job_name;
    };
    ActionView.prototype.damageDealt = function() {
      return this.model.get("damage_dealt");
    };
    ActionView.prototype.buildMessage = function() {
      $(this.el).find('.actor').html(this.model.get("player_name"));
      return $(this.el).find('.content').html(this.model.get("message"));
    };
    ActionView.prototype.buildAttack = function() {
      console.log("Building attack", this.model);
      $(this.el).find('.player').html(this.playerName());
      $(this.el).find('.hero').html(this.heroName()).addClass(this.heroJobName());
      $(this.el).find('.target').html(this.targettedName()).addClass(this.targettedJobName());
      return $(this.el).find('.damage').html(this.damageDealt());
    };
    ActionView.prototype.buildNotification = function() {
      return $(this.el).find('.content').html(this.model.get("message"));
    };
    return ActionView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.BattleStubView = (function() {
    __extends(BattleStubView, Backbone.View);
    function BattleStubView() {
      BattleStubView.__super__.constructor.apply(this, arguments);
    }
    BattleStubView.prototype.tagName = 'div';
    BattleStubView.prototype.className = 'battle-stub';
    BattleStubView.prototype.initialize = function() {
      return $(this.el).find('.forfeit-link').bind('ajax:complete', this.onForfeitComplete);
    };
    BattleStubView.prototype.onForfeitComplete = function() {
      console.log("Forfeit complete!");
      return appView.load("/battles");
    };
    return BattleStubView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ForgeCraft.Views.BattleView = (function() {
    __extends(BattleView, Backbone.View);
    function BattleView() {
      BattleView.__super__.constructor.apply(this, arguments);
    }
    BattleView.prototype.controllableWarriorView = null;
    BattleView.prototype.controllableThiefView = null;
    BattleView.prototype.controllableRangerView = null;
    BattleView.prototype.enemyWarriorView = null;
    BattleView.prototype.enemyThiefView = null;
    BattleView.prototype.enemyRangerView = null;
    BattleView.prototype.initialize = function() {
      this.render();
      this.bindActionResponse();
      this.bindWindowResize();
      this.bindFleeButton();
      this.initializeHeroViews();
      return this.model.bind("change", this.checkConditions, this);
    };
    BattleView.prototype.render = function() {
      var battleHeight, logHeight;
      battleHeight = $(window).height() - $('.topbar').height();
      $('#battle').css({
        height: battleHeight
      });
      $('.squad-wrap').css({
        height: battleHeight
      });
      logHeight = $('.log').height();
      if (logHeight < battleHeight) {
        return $('.log').css({
          minHeight: battleHeight
        });
      }
    };
    BattleView.prototype.bindWindowResize = function() {
      var self;
      self = this;
      if (!Modernizr.touch) {
        return $(window).unbind('resize').resize(function() {
          return self.render();
        });
      }
    };
    BattleView.prototype.bindActionResponse = function() {
      var self;
      self = this;
      $('#new_action').bind('ajax:complete', function(event, response) {
        var action_params;
        action_params = JSON.parse(response.responseText);
        console.log("New action created!", action_params);
        return self.model.log_action(action_params);
      });
      return this.model.actions.bind("add", this.displayNewAction, this);
    };
    BattleView.prototype.displayNewAction = function(action) {
      var actionView;
      actionView = new ForgeCraft.Views.ActionView({
        model: action
      });
      actionView.render();
      return $('#battle_action_message').val('');
    };
    BattleView.prototype.initializeHeroViews = function() {
      this.controllableWarriorView = new ForgeCraft.Views.HeroView({
        el: $('.hero.warrior.controllable').get(0),
        model: this.model.get("controllableWarrior")
      });
      this.controllableThiefView = new ForgeCraft.Views.HeroView({
        el: $('.hero.thief.controllable').get(0),
        model: this.model.get("controllableThief")
      });
      this.controllableRangerView = new ForgeCraft.Views.HeroView({
        el: $('.hero.ranger.controllable').get(0),
        model: this.model.get("controllableRanger")
      });
      this.enemyWarriorView = new ForgeCraft.Views.HeroView({
        el: $('.hero.warrior.enemy').get(0),
        model: this.model.get("enemyWarrior")
      });
      this.enemyThiefView = new ForgeCraft.Views.HeroView({
        el: $('.hero.thief.enemy').get(0),
        model: this.model.get("enemyThief")
      });
      return this.enemyRangerView = new ForgeCraft.Views.HeroView({
        el: $('.hero.ranger.enemy').get(0),
        model: this.model.get("enemyRanger")
      });
    };
    BattleView.prototype.enableActionTargets = function(callback) {
      this.enemyWarriorView.enableActionTarget(callback);
      this.enemyThiefView.enableActionTarget(callback);
      return this.enemyRangerView.enableActionTarget(callback);
    };
    BattleView.prototype.disableActionTargets = function() {
      this.enemyWarriorView.disableActionTarget();
      this.enemyThiefView.disableActionTarget();
      return this.enemyRangerView.disableActionTarget();
    };
    BattleView.prototype.checkConditions = function() {
      if (this.model.get("finished") === true) {
        return this.finish();
      }
    };
    BattleView.prototype.finish = function() {
      var msg;
      this.model.stopQueue();
      this.model.clearQueue();
      if (this.model.get("winner_id") === window.player.id) {
        msg = "(Placeholder) You won!";
      }
      if (this.model.get("loser_id") === window.player.id) {
        msg = "(Placeholder) You lost...";
      }
      return setTimeout(__bind(function() {
        alert(msg);
        return Backbone.history.navigate('forges/' + this.model.get("forge_id"), true);
      }, this), 500);
    };
    BattleView.prototype.bindFleeButton = function() {
      return $(this.el).find('.forfeit-link').bind('ajax:complete', this.onForfeitComplete);
    };
    BattleView.prototype.onForfeitComplete = function() {
      return Backbone.history.navigate("forges/" + window.battle.get("forge_id"), true);
    };
    return BattleView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ForgeCraft.Views.HeroView = (function() {
    __extends(HeroView, Backbone.View);
    function HeroView() {
      HeroView.__super__.constructor.apply(this, arguments);
    }
    HeroView.prototype.tagName = 'div';
    HeroView.prototype.className = '.hero';
    HeroView.prototype.initialize = function() {
      console.log("Initializing hero view", this.model);
      this.model.bind("change:active", this.reflectActiveState, this);
      this.model.bind("change:alive", this.reflectAliveState, this);
      this.model.bind("change:defense", this.reflectDamage, this);
      return this.model.bind("change:last_action", this.reflectPerformedAction, this);
    };
    HeroView.prototype.reflectActiveState = function() {
      console.log("Reflecting active state", this.model);
      if (this.model.get("active")) {
        return this.activate();
      } else {
        return this.deactivate();
      }
    };
    HeroView.prototype.activate = function() {
      $(this.el).addClass("active");
      return this.bindActions();
    };
    HeroView.prototype.deactivate = function() {
      $(this.el).removeClass("active");
      return this.unbindActions();
    };
    HeroView.prototype.bindActions = function() {
      var self;
      self = this;
      return $(this.el).find('.action').bind('click', function(event) {
        var actionName;
        console.log("On action choice", event);
        actionName = $(event.target).attr("data-action");
        self.beginAction(actionName);
        return false;
      });
    };
    HeroView.prototype.unbindActions = function() {
      return $(this.el).find('.action').unbind('click');
    };
    HeroView.prototype.beginAction = function(actionName) {
      console.log("Beginning action", actionName);
      if (actionName === 'attack') {
        return this.beginAttack();
      }
    };
    HeroView.prototype.beginAttack = function() {
      var self;
      self = this;
      $(this.el).addClass('choosing');
      this.showExplanation('attack');
      return battleView.enableActionTargets(function() {
        return self.chooseAttackTarget.apply(self, arguments);
      });
    };
    HeroView.prototype.chooseAttackTarget = function(enemyView) {
      var enemy;
      console.log("Choosing attack target", enemyView);
      enemy = enemyView.model;
      this.model.chooseAttackTarget(enemy);
      $(this.el).removeClass('choosing');
      return this.showExplanation('target', "Attacking " + enemy.get("name"));
    };
    HeroView.prototype.beginDefend = function() {};
    HeroView.prototype.beginSteal = function() {};
    HeroView.prototype.doMultishot = function() {};
    HeroView.prototype.showExplanation = function(className, content) {
      this.hideExplanation();
      return $(this.el).find('.explanation.' + className).show().find('.content').html(content);
    };
    HeroView.prototype.hideExplanation = function() {
      return $(this.el).find('.explanation').hide();
    };
    HeroView.prototype.enableActionTarget = function(callback) {
      var self;
      self = this;
      $(this.el).addClass('action-target');
      $(this.el).css({
        cursor: "pointer"
      });
      return $(this.el).click(function() {
        battleView.disableActionTargets();
        if (callback != null) {
          return callback.apply(this, [self]);
        }
      });
    };
    HeroView.prototype.disableActionTarget = function() {
      $(this.el).removeClass('action-target');
      $(this.el).css({
        cursor: "inherit"
      });
      return $(this.el).unbind('click');
    };
    HeroView.prototype.reflectAliveState = function() {
      if (this.model.get("alive") === false) {
        return setTimeout(__bind(function() {
          return $(this.el).fadeOut();
        }, this), 500);
      }
    };
    HeroView.prototype.reflectDamage = function() {
      $(this.el).effect("shake", {
        times: 3,
        distance: 10
      }, 50);
      return $(this.el).find('.stat.defense').find('.val').html(this.model.get("defense"));
    };
    HeroView.prototype.reflectPerformedAction = function() {
      this.hideExplanation();
      return $(this.el).effect("pulsate", {
        times: 2
      }, 50);
    };
    return HeroView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ForgeCraft.Views.EnemyView = (function() {
    __extends(EnemyView, Backbone.View);
    function EnemyView() {
      EnemyView.__super__.constructor.apply(this, arguments);
    }
    EnemyView.prototype.mousedown = "cancelScroll";
    EnemyView.prototype.touchdown = "cancelScroll";
    EnemyView.prototype.mousemove = "cancelScroll";
    EnemyView.prototype.touchmove = "cancelScroll";
    EnemyView.prototype.initialize = function() {
      this.model = forge.enemy;
      this.targets = ['warrior', 'thief', 'ranger'];
      this.reveal();
      this.model.bind("change:defense", this.takeDamage, this);
      return this.bindKeys();
    };
    EnemyView.prototype.bindKeys = function() {
      return $(window).bind('keydown', this.activateGuard);
    };
    EnemyView.prototype.unbindKeys = function() {
      return $(window).unbind('keydown', this.activateGuard);
    };
    EnemyView.prototype.activateGuard = function(e) {
      console.log(e.which, e.keyCode);
      if (e.which === 49 || e.keyCode === 49) {
        enemyView.guards[0].attack();
      }
      if (e.which === 50 || e.keyCode === 50) {
        enemyView.guards[1].attack();
      }
      if (e.which === 51 || e.keyCode === 51) {
        enemyView.guards[2].attack();
      }
    };
    EnemyView.prototype.reveal = function() {
      var self;
      self = this;
      loadingView.show();
      return $(self.el).load("/forges/" + forge.get("id") + "/enemies/" + self.model.get("id"), function() {
        loadingView.hide();
        self.createGuards();
        self.createTargets();
        self.bindFleeButton();
        return $(self.el).fadeIn(function() {
          return self.start();
        });
      });
    };
    EnemyView.prototype.bindFleeButton = function() {
      return $('.flee').click(function() {
        forge.enemy.win();
        return false;
      });
    };
    EnemyView.prototype.createGuards = function() {
      var ranger_attack, ranger_defense, thief_attack, thief_defense, warrior_attack, warrior_defense;
      warrior_attack = parseInt($('#warrior').attr("data-attack"));
      warrior_defense = parseInt($('#warrior').attr("data-defense"));
      this.warrior = new ForgeCraft.Models.Guard({
        attack: warrior_attack,
        defense: warrior_defense
      });
      this.warriorView = new ForgeCraft.Views.GuardView({
        el: $('#warrior').get(0),
        model: this.warrior
      });
      this.warriorView.guard = "warrior";
      thief_attack = parseInt($('#thief').attr("data-attack"));
      thief_defense = parseInt($('#thief').attr("data-defense"));
      this.thief = new ForgeCraft.Models.Guard({
        attack: thief_attack,
        defense: thief_defense
      });
      this.thiefView = new ForgeCraft.Views.GuardView({
        el: $('#thief').get(0),
        model: this.thief
      });
      this.thiefView.guard = "thief";
      ranger_attack = parseInt($('#ranger').attr("data-attack"));
      ranger_defense = parseInt($('#ranger').attr("data-defense"));
      this.ranger = new ForgeCraft.Models.Guard({
        attack: ranger_attack,
        defense: ranger_defense
      });
      this.rangerView = new ForgeCraft.Views.GuardView({
        el: $('#ranger').get(0),
        model: this.ranger
      });
      this.rangerView.guard = "ranger";
      this.guards = [];
      return $('.lane').each(__bind(function(i, lane) {
        var which;
        which = $(lane).find('.hero').attr("id");
        if (which === "warrior") {
          return this.guards.push(this.warriorView);
        } else if (which === "thief") {
          return this.guards.push(this.thiefView);
        } else if (which === "ranger") {
          return this.guards.push(this.rangerView);
        }
      }, this));
    };
    EnemyView.prototype.createTargets = function() {
      this.warriorLane = new ForgeCraft.Views.LaneView('warrior');
      this.warriorLane.model = this.warrior;
      this.thiefLane = new ForgeCraft.Views.LaneView('thief');
      this.thiefLane.model = this.thief;
      this.rangerLane = new ForgeCraft.Views.LaneView('ranger');
      return this.rangerLane.model = this.ranger;
    };
    EnemyView.prototype.start = function() {
      console.log("Starting battle!");
      return setTimeout(__bind(function() {
        splashView.queueMessage("Battle!");
        return this.loop();
      }, this), 1000);
    };
    EnemyView.prototype.loop = function() {
      var wait;
      wait = 500 + Math.random() * 2000;
      return this.loopTimeout = setTimeout(__bind(function() {
        this.attack();
        return this.loop();
      }, this), wait);
    };
    EnemyView.prototype.attack = function() {
      var lane;
      lane = this.chooseLane();
      return lane.attack();
    };
    EnemyView.prototype.chooseLane = function() {
      var t;
      t = this.targets[Math.floor(Math.random() * this.targets.length)];
      return this[t + "Lane"];
    };
    EnemyView.prototype.end = function() {
      clearTimeout(this.loopTimeout);
      return $(this.el).fadeOut(function() {
        $('#ores').fadeIn();
        return $(this.el).html('');
      });
    };
    EnemyView.prototype.takeDamage = function(damage) {
      var per;
      per = this.model.defensePercent() + "%";
      $(this.el).find('.bar-wrap').effect("shake", {
        times: 3,
        distance: 4
      }, 50);
      $(this.el).find('.bar').css({
        width: per
      });
      return $(this.el).find('.enemy').find('.val.defense').html(this.model.get("defense"));
    };
    EnemyView.prototype.removeTarget = function(guard) {
      var i;
      i = this.targets.indexOf(guard);
      if (i >= 0) {
        this.targets.splice(i, 1);
      }
      if (this.targets.length < 1) {
        return setTimeout(__bind(function() {
          return this.model.win();
        }, this), 1000);
      }
    };
    EnemyView.prototype.cancelScroll = function() {
      return false;
    };
    return EnemyView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ForgeCraft.Views.GuardView = (function() {
    __extends(GuardView, Backbone.View);
    function GuardView() {
      GuardView.__super__.constructor.apply(this, arguments);
    }
    GuardView.prototype.events = {
      mousedown: "attack",
      touchstart: "attack",
      mousemove: "cancelScroll",
      touchmove: "cancelScroll"
    };
    GuardView.prototype.initialize = function() {
      this.model.bind("change:defense", this.takeDamage, this);
      return this.model.bind("change:alive", this.die, this);
    };
    GuardView.prototype.lane = function() {
      return enemyView[this.guard + "Lane"];
    };
    GuardView.prototype.zone = function() {
      return $('.zone.' + this.guard);
    };
    GuardView.prototype.targets = function() {
      return $('.target.' + this.guard + ':visible');
    };
    GuardView.prototype.attack = function() {
      var target, _i, _len, _ref;
      _ref = this.targets();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        this.determineHit(target);
      }
      this.activateZone();
      this.activateIcon();
      return false;
    };
    GuardView.prototype.determineHit = function(target) {
      if (this.inZone(target)) {
        this.lane().destroyTarget(target.id);
        ForgeCraft.Audio.play('slash');
        return this.model.hit();
      }
    };
    GuardView.prototype.inZone = function(target) {
      var $actual, leftIn, rightIn, targetLeft, targetRight, zoneLeft, zoneRight;
      $actual = $('#' + target.id);
      targetLeft = $actual.position().left;
      targetRight = targetLeft + $actual.width();
      zoneLeft = this.zone().position().left;
      zoneRight = zoneLeft + this.zone().width();
      leftIn = (targetLeft >= zoneLeft) && (targetLeft <= zoneRight);
      rightIn = (targetRight >= zoneLeft) && (targetRight <= zoneRight);
      return leftIn || rightIn;
    };
    GuardView.prototype.activateIcon = function() {
      return $(this.el).effect("pulsate", {
        times: 3
      }, 50);
    };
    GuardView.prototype.activateZone = function() {
      return this.zone().effect("pulsate", {
        times: 3
      }, 50);
    };
    GuardView.prototype.takeDamage = function(damage) {
      $(this.el).find('.val.defense').html(this.model.get("defense"));
      return $(this.el).effect("shake", {
        times: 3,
        distance: 2
      }, 50);
    };
    GuardView.prototype.die = function() {
      enemyView.removeTarget(this.guard);
      return setTimeout(__bind(function() {
        return this.lane().removeFromPlay();
      }, this), 1000);
    };
    GuardView.prototype.cancelScroll = function() {
      return false;
    };
    return GuardView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ForgeCraft.Views.LaneView = (function() {
    __extends(LaneView, Backbone.View);
    function LaneView() {
      LaneView.__super__.constructor.apply(this, arguments);
    }
    LaneView.prototype.initialize = function(lane) {
      this.speeds = ["fast", "slow"];
      this.lane = lane;
      return this.el = $('.lane.' + this.lane).get(0);
    };
    LaneView.prototype.createNewTarget = function() {
      var id;
      id = Math.round(Math.random() * 10000);
      return $('.target.' + this.lane + ':hidden').clone().attr("id", id);
    };
    LaneView.prototype.attack = function() {
      var $actual, t;
      t = this.createNewTarget();
      $(this.el).append(t);
      $actual = $('#' + t.attr("id"));
      $actual.addClass(this.chooseSpeed());
      return $actual.fadeIn(__bind(function() {
        $actual.addClass("activated");
        $actual.bind('webkitTransitionEnd', __bind(function() {
          return this.targetAttacked($actual.attr("id"));
        }, this));
        return $actual.bind('transitionend', __bind(function() {
          return this.targetAttacked($actual.attr("id"));
        }, this));
      }, this));
    };
    LaneView.prototype.chooseSpeed = function() {
      return this.speeds[Math.floor(Math.random() * 2)];
    };
    LaneView.prototype.targetAttacked = function(id) {
      console.log("Target made it through! Do damage");
      forge.enemy.hit(this.model);
      return this.destroyTarget(id);
    };
    LaneView.prototype.targetKilled = function(id) {
      this.destroyTarget(id);
      return enemyView.attack();
    };
    LaneView.prototype.destroyTarget = function(id) {
      var t;
      t = $('#' + id);
      if (t == null) {
        return;
      }
      t.css({
        left: t.css("left")
      });
      return t.fadeOut(function() {
        return t.remove();
      });
    };
    LaneView.prototype.removeFromPlay = function() {
      return $(this.el).effect("pulsate", {
        times: 3
      }, 50).fadeOut();
    };
    return LaneView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.EquipperView = (function() {
    __extends(EquipperView, Backbone.View);
    function EquipperView() {
      EquipperView.__super__.constructor.apply(this, arguments);
    }
    EquipperView.prototype.initialize = function() {
      this.bindLootClicks();
      this.bindSellClicks();
      return this.bindEquipClicks();
    };
    EquipperView.prototype.bindLootClicks = function() {
      var self;
      self = this;
      return $('.launch-equipper').live('click', function() {
        var id;
        id = $(this).attr("data-id");
        self.activateEquipper(id);
        return false;
      });
    };
    EquipperView.prototype.bindSellClicks = function() {
      var self;
      self = this;
      return $('.loot').find('.sell-action').live('click', function(e) {
        var loot_id;
        loot_id = $(this).parent().attr("data-id");
        Loot.sell(loot_id);
        $(document).trigger("close.facebox");
        e.preventDefault();
        return false;
      });
    };
    EquipperView.prototype.bindEquipClicks = function() {
      var self;
      self = this;
      return $('.slot.enabled').live('click', function(e) {
        var hero_id, loot_id, slot;
        loot_id = $('#equipper').find('.loot').attr("data-id");
        slot = $(this).attr('rel');
        hero_id = $(this).attr("data-hero-id");
        player.equip(hero_id, slot, loot_id);
        return false;
      });
    };
    EquipperView.prototype.activateEquipper = function(loot_id) {
      return $.facebox({
        ajax: "/loot/" + loot_id
      });
    };
    return EquipperView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.FlashView = (function() {
    __extends(FlashView, Backbone.View);
    function FlashView() {
      FlashView.__super__.constructor.apply(this, arguments);
    }
    FlashView.prototype.tagName = 'div';
    FlashView.prototype.id = 'flash-wrap';
    FlashView.prototype.initialize = function() {};
    FlashView.prototype.show = function() {
      return $(this.el).fadeIn();
    };
    FlashView.prototype.hide = function() {
      return $(this.el).fadeOut();
    };
    return FlashView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ForgeCraft.Views.ActiveForgeView = (function() {
    __extends(ActiveForgeView, Backbone.View);
    function ActiveForgeView() {
      ActiveForgeView.__super__.constructor.apply(this, arguments);
    }
    ActiveForgeView.prototype.tagName = 'div';
    ActiveForgeView.prototype.className = 'active-forge';
    ActiveForgeView.prototype.id = '#active-forge';
    ActiveForgeView.prototype.initialize = function() {
      var self;
      self = this;
      this.bind("ForgeCraft:checkpointActivated", this.checkpointActivated, this);
      return this.reset();
    };
    ActiveForgeView.prototype.shouldTrigger = function() {
      return Math.floor(Math.random() * 6) === 1;
    };
    ActiveForgeView.prototype.bar = function() {
      return $('#bar');
    };
    ActiveForgeView.prototype.bindKeyDown = function() {
      var self;
      self = this;
      return $(window).bind('keydown', this.activateCheckpoint);
    };
    ActiveForgeView.prototype.activateCheckpoint = function(e) {
      console.log("Triggering key down");
      if (!activeForgeView.active) {
        return;
      }
      if (!(e.which === 32 || e.keyCode === 32)) {
        return;
      }
      activeForgeView.checkpointViews[0].activateCheckpoint();
      e.preventDefault();
      return false;
    };
    ActiveForgeView.prototype.unbindKeyDown = function() {
      return $(window).unbind('keydown', this.activateCheckpoint);
    };
    ActiveForgeView.prototype.reset = function() {
      this.clearTimeouts();
      this.bar().remove();
      $(this.el).find('#bar-container').html('<div id="bar" />');
      $(this.el).find('.checkpoint img').show();
      $(this.el).find('.marker').removeClass("activated");
      return $(this.el).find('.message').css({
        fontSize: "100%"
      }).hide();
    };
    ActiveForgeView.prototype.start = function() {
      this.active = true;
      this.positionCheckpoints();
      $(this.el).show();
      this.bindKeyDown();
      return this.activateBarTimeout = setTimeout(__bind(function() {
        return this.activateBar();
      }, this), 1000);
    };
    ActiveForgeView.prototype.accuracy = function() {
      var barPos, markerPos;
      markerPos = $(this.el).find('.marker').offset().left;
      barPos = this.bar().offset().left + this.bar().width();
      console.log("marker position: ", markerPos, "bar position:", barPos);
      return 100 - Math.abs(markerPos - barPos);
    };
    ActiveForgeView.prototype.activateBar = function() {
      this.bar().removeClass("new").addClass("activated");
      return this.finishTimeout = setTimeout(__bind(function() {
        if (this.active) {
          return this.finish();
        }
      }, this), 1500);
    };
    ActiveForgeView.prototype.calculateCheckpoints = function() {
      this.checkpoints = [];
      return this.checkpoints.push(40 + Math.random() * 20);
    };
    ActiveForgeView.prototype.positionCheckpoints = function() {
      var i, _base, _ref, _results;
      this.calculateCheckpoints();
      this.checkpointViews || (this.checkpointViews = []);
      _results = [];
      for (i = 0, _ref = this.checkpoints.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        (_base = this.checkpointViews)[i] || (_base[i] = new ForgeCraft.Views.CheckPointView({
          el: $('#checkpoint-' + i).get(0)
        }));
        _results.push(this.checkpointViews[i].setPosition(this.checkpoints[i]));
      }
      return _results;
    };
    ActiveForgeView.prototype.checkpointActivated = function() {
      console.log("Checkpoint activated");
      return this.finish();
    };
    ActiveForgeView.prototype.stop = function() {
      this.clearTimeouts();
      this.bar().css({
        left: this.bar().css("left")
      });
      return this.unbindKeyDown();
    };
    ActiveForgeView.prototype.clearTimeouts = function() {
      clearTimeout(this.activateBarTimeout);
      return clearTimeout(this.finishTimeout);
    };
    ActiveForgeView.prototype.finish = function() {
      var accuracy;
      this.clearTimeouts();
      if (!this.active) {
        return;
      }
      accuracy = this.accuracy();
      this.active = false;
      this.stop();
      setTimeout(__bind(function() {
        return $(this.el).fadeOut(__bind(function() {
          this.reset();
          return this.trigger("ForgeCraft:activeForgeComplete", accuracy);
        }, this));
      }, this), 500);
      if (accuracy >= ForgeCraft.Config.perfect_accuracy) {
        splashView.queueMessage("Perfect!");
      }
      if (accuracy >= ForgeCraft.Config.unlock_accuracy) {
        Ores.unlockAllOres();
        return splashView.queueMessage("Ores Unlocked!");
      }
    };
    return ActiveForgeView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.CheckPointView = (function() {
    __extends(CheckPointView, Backbone.View);
    function CheckPointView() {
      CheckPointView.__super__.constructor.apply(this, arguments);
    }
    CheckPointView.prototype.tagName = 'div';
    CheckPointView.prototype.className = 'checkpoint';
    CheckPointView.prototype.events = {
      "mousedown a": "activateCheckpoint",
      "touchstart a": "activateCheckpoint"
    };
    CheckPointView.prototype.setPosition = function(pos) {
      return $(this.el).css({
        left: pos + "%"
      });
    };
    CheckPointView.prototype.activateCheckpoint = function(e) {
      activeForgeView.trigger("ForgeCraft:checkpointActivated");
      $(this.el).find('.marker').addClass("activated");
      if (e) {
        e.preventDefault();
      }
      return false;
    };
    return CheckPointView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.EventsView = (function() {
    __extends(EventsView, Backbone.View);
    function EventsView() {
      EventsView.__super__.constructor.apply(this, arguments);
    }
    EventsView.prototype.initialize = function() {
      return this.el = $('#event-list').get(0);
    };
    EventsView.prototype.addEventsHTML = function(eventsHTML) {
      var $h;
      $h = $(eventsHTML).hide();
      $(this.el).prepend($h);
      return $h.fadeIn();
    };
    return EventsView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ForgeCraft.Views.ForgeView = (function() {
    __extends(ForgeView, Backbone.View);
    function ForgeView() {
      ForgeView.__super__.constructor.apply(this, arguments);
    }
    ForgeView.prototype.tagName = 'div';
    ForgeView.prototype.id = 'forge';
    ForgeView.prototype.events = {
      mousedown: "beginWatchingMovement",
      touchstart: "beginWatchingMovement",
      mousemove: "watchMovement",
      touchmove: "watchMovement",
      mouseup: "attemptForge",
      touchend: "attemptForge",
      mouseout: "stopWatchingMovement",
      touchcancel: "stopWatchingMovement"
    };
    ForgeView.prototype.initialize = function() {
      this.model.bind("change:funds", this.updateFunds, this);
      this.model.bind("change:progress_percent", this.updateProgressPercent, this);
      this.model.bind("change:complete", this.complete, this);
      this.model.bind("ForgeCraft:NeedMoreCoins", this.shakeFunds, this);
      window.Ores = new ForgeCraft.Collections.OresCollection;
      Ores.bind("add", this.displayOre, this);
      Ores.bind("reveal", this.displayAllOres, this);
      Ores.bind("reset", this.clearOres, this);
      this.initializeActiveForge();
      this.renderForge();
      this.renderEvents();
      if (!Modernizr.touch) {
        $(window).unbind('resize').resize(__bind(function() {
          return this.renderForge();
        }, this));
      }
      return $(document).unbind('orientationchange').bind('orientationchange', __bind(function() {
        return this.renderForge();
      }, this));
    };
    ForgeView.prototype.initializeActiveForge = function() {
      window.activeForgeView = new ForgeCraft.Views.ActiveForgeView({
        el: $('#active-forge').get(0)
      });
      return activeForgeView.bind("ForgeCraft:activeForgeComplete", this.forgeWithAccuracy, this);
    };
    ForgeView.prototype.renderForge = function() {
      if (this.renderHold) {
        return;
      }
      this.clearOres();
      loadingView.show();
      this.correctSidebarHeight();
      clearTimeout(this.redrawTimeout);
      return this.redrawTimeout = setTimeout(__bind(function() {
        this.calculateDimensions();
        this.initializeOres();
        return loadingView.hide();
      }, this), 500);
    };
    ForgeView.prototype.correctSidebarHeight = function() {
      this.topBarHeight = $('.topbar').height();
      this.htmlHeight = $('html').height();
      return $('#sidebar').css({
        minHeight: this.htmlHeight - this.topBarHeight
      });
    };
    ForgeView.prototype.renderEvents = function() {
      return window.eventsView = new ForgeCraft.Views.EventsView;
    };
    ForgeView.prototype.clearOres = function() {
      return $('#ores').html('');
    };
    ForgeView.prototype.calculateDimensions = function() {
      this.topBarHeight = $('.topbar').height();
      this.htmlHeight = $('html').height();
      this.forgeHeight = this.htmlHeight - this.topBarHeight;
      $('#forge').css({
        height: this.forgeHeight
      });
      this.forgeWidth = $('#forge').width();
      this.sidebarWidth = $('#sidebar').width();
      $('#ores').css({
        width: this.forgeWidth - this.sidebarWidth - 20,
        height: this.forgeHeight
      });
      $('#enemy').css({
        width: this.forgeWidth - this.sidebarWidth - 20,
        height: this.forgeHeight
      });
      this.topOffset = parseInt($('#ores').css('paddingTop'));
      this.oresHeight = $('#forge').height() - this.topOffset + 10;
      this.oresWidth = $('#ores').width();
      this.hMargin = (this.oresWidth % ForgeCraft.Config.oreDim) / 2;
      this.cols = Math.floor(this.oresWidth / ForgeCraft.Config.oreDim);
      this.rows = Math.floor(this.oresHeight / ForgeCraft.Config.oreDim);
      this.numOres = this.cols * this.rows;
      Ores.numCols = this.cols;
      return Ores.numRows = this.rows;
    };
    ForgeView.prototype.initializeOres = function() {
      if (!$('#ores').is(":visible")) {
        return;
      }
      console.log("Initializing Ores for", this.numOres, "ores");
      return Ores.initialFill(this.numOres);
    };
    ForgeView.prototype.displayOre = function(ore) {
      var view;
      view = new ForgeCraft.Views.OreView({
        model: ore
      });
      return view.renderAndPosition();
    };
    ForgeView.prototype.displayAllOres = function() {
      this.clearOres();
      return Ores.forEach(__bind(function(ore) {
        return this.displayOre(ore);
      }, this));
    };
    ForgeView.prototype.beginWatchingMovement = function(e) {
      var touchedView, x, y;
      if (this.oreLock) {
        return;
      }
      this.watching = true;
      this.ref = {
        x: e.pageX,
        y: e.pageY
      };
      if (!($(e.target).hasClass("ore") && (touchedView = $(e.target).data('view')))) {
        this.watching = false;
        return;
      }
      x = touchedView.model.get('x');
      y = touchedView.model.get('y');
      this.refOre = Ores.oreAt(x, y);
      console.log("Clicked ore is ", this.refOre.forLog());
      e.preventDefault();
      return false;
    };
    ForgeView.prototype.watchMovement = function(e) {
      if (this.oreLock) {
        return;
      }
      if (!this.watching) {
        return;
      }
      this.delta = {
        x: e.pageX - this.ref.x,
        y: e.pageY - this.ref.y
      };
      if (this.delta.x >= ForgeCraft.Config.moveThreshold && this.refOre.get("x") < Ores.numCols - 1) {
        this.swapOre = Ores.oreAt(this.refOre.get('x') + 1, this.refOre.get('y'));
      }
      if (this.delta.x <= -ForgeCraft.Config.moveThreshold && this.refOre.get("x") > 0) {
        this.swapOre = Ores.oreAt(this.refOre.get('x') - 1, this.refOre.get('y'));
      }
      if (this.delta.y >= ForgeCraft.Config.moveThreshold && this.refOre.get("y") < Ores.numRows - 1) {
        this.swapOre = Ores.oreAt(this.refOre.get('x'), this.refOre.get('y') + 1);
      }
      if (this.delta.y <= -ForgeCraft.Config.moveThreshold && this.refOre.get("y") > 0) {
        this.swapOre = Ores.oreAt(this.refOre.get('x'), this.refOre.get('y') - 1);
      }
      if (this.swapOre != null) {
        Ores.swapOresAndValidate(this.refOre, this.swapOre);
        this.stopWatchingMovement();
      }
      e.preventDefault();
      return false;
    };
    ForgeView.prototype.attemptForge = function() {
      if (this.oreLock) {
        return;
      }
      if (!forge.hasEnoughFunds(2)) {
        forge.trigger("ForgeCraft:NeedMoreCoins");
        return;
      }
      if (this.refOre && !this.swapOre) {
        if (this.forgeable = this.refOre.get("forgeable")) {
          $('.ore').addClass("unmarked");
          if (activeForgeView.shouldTrigger()) {
            activeForgeView.start();
          } else {
            this.forgeable.forge();
          }
        }
      }
      return this.stopWatchingMovement();
    };
    ForgeView.prototype.forgeWithAccuracy = function(accuracy) {
      if (this.forgeable != null) {
        return this.forgeable.forge(accuracy);
      }
    };
    ForgeView.prototype.stopWatchingMovement = function() {
      if (!this.watching) {
        return;
      }
      this.ref = void 0;
      this.refOre = void 0;
      this.swapOre = void 0;
      return this.watching = false;
    };
    ForgeView.prototype.updateFunds = function() {
      if (!this.model.get("requires_funding")) {
        return;
      }
      console.log("Updating funds to", this.model.get("funds"));
      return $('.funds').find('.amount').html(number_with_delimiter(this.model.get("funds")));
    };
    ForgeView.prototype.updateProgressPercent = function() {
      var progresses;
      console.log("Updating progress percent to", this.model.get("progress_percent"));
      $('.percent').find('.amount').html(this.model.get("progress_percent"));
      $('.progress').find('.bar').css({
        width: this.model.get("progress_percent") + "%"
      });
      progresses = this.model.get("progresses");
      return _.each(progresses, function(progress) {
        var complete, id, q;
        id = progress["_id"];
        q = progress["quantity"];
        complete = progress["complete"];
        $('#quantity_progress_' + id).html(q);
        if (complete) {
          return $('#progress_' + id).addClass("complete");
        } else {
          return $('#progress_' + id).removeClass("complete");
        }
      });
    };
    ForgeView.prototype.startBattle = function(ident) {
      return Backbone.history.navigate("battles/" + ident, true);
    };
    ForgeView.prototype.complete = function() {
      return $('#ores').fadeOut(function() {
        splashView.queueMessage("Forge Complete!");
        return $.get("/forges/" + forge.get("id") + "/complete", function(response) {
          return $('#ores').html(response).fadeIn();
        });
      });
    };
    ForgeView.prototype.startFight = function() {
      $('#ores').fadeOut();
      return window.enemyView = new ForgeCraft.Views.EnemyView({
        el: $('#enemy').get(0)
      });
    };
    ForgeView.prototype.endFight = function(result) {
      window.enemyView.end();
      if ($('.ore').length < 1) {
        this.renderForge();
      }
      if (result === "win") {
        splashView.queueMessage("Battle won!");
      }
      if (result === "loss") {
        return splashView.queueMessage("Battle lost!");
      }
    };
    return ForgeView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ForgeCraft.Views.LootView = (function() {
    __extends(LootView, Backbone.View);
    function LootView() {
      LootView.__super__.constructor.apply(this, arguments);
    }
    LootView.prototype.tagName = 'div';
    LootView.prototype.className = 'loot';
    LootView.prototype.initialize = function() {
      return this.model.bind("destroy", this.destroy, this);
    };
    LootView.prototype.render = function() {
      var level;
      $(this.el).addClass(this.model.get("item_attributes").type).attr("id", "loot-" + this.model.get("id"));
      $(this.el).attr("data-id", this.model.get('id'));
      $(this.el).find('.icon').attr('src', this.model.get("item_attributes").icon_url);
      $(this.el).find('.name').addClass(this.model.get("item_attributes").type);
      $(this.el).find('.name').html(this.model.get("item_attributes").name);
      $(this.el).data("view", this);
      level = this.model.get("level");
      $(this.el).find('.level').find('.val').html(level);
      if (player.get("level") < level) {
        $(this.el).find('.level').addClass('toohigh');
      }
      if (this.model.get("attack") > 0) {
        $(this.el).find('.attack').find('.val').html(this.model.get("attack"));
      } else {
        $(this.el).find('.attack').remove();
      }
      if (this.model.get("defense") > 0) {
        $(this.el).find('.defense').find('.val').html(this.model.get("defense"));
      } else {
        $(this.el).find('.defense').remove();
      }
      if (this.model.get("equipped?")) {
        $(this.el).find('.equipped-indicator').removeClass('hidden');
        return $(this.el).find('.sell-action').addClass('hidden');
      } else {
        $(this.el).find('.equipped-indicator').addClass('hidden');
        return $(this.el).find('.sell-action').removeClass('hidden');
      }
    };
    LootView.prototype.addToLootList = function() {
      var first_loot_id, this_id;
      $(this.el).hide();
      if (Loot.length > 0 && (Loot.at(1) != null)) {
        first_loot_id = Loot.at(1).get("id");
      } else {
        first_loot_id = 0;
      }
      this_id = this.model.get("id");
      if (this_id > first_loot_id) {
        $('#loot-list').prepend($(this.el));
      } else {
        $('#loot-list').append($(this.el));
      }
      $(this.el).fadeIn();
      if (this.model.get("battle_required?")) {
        return this.startBattle(this.model.get("battle_id"));
      }
    };
    LootView.prototype.startBattle = function(ident) {
      var battle, self;
      self = this;
      $(this.el).effect("shake", {
        times: 3,
        distance: 10
      }, 50);
      battle = new ForgeCraft.Models.Battle({
        id: ident
      });
      return setTimeout(function() {
        battle.forfeit();
        return alert("(Placeholder) You've been attacked! This is where a battle would start, if battles were in the game! Just make some clanging and slashing noises for now...");
      }, 1000);
    };
    LootView.prototype.fleeBattle = function() {};
    LootView.prototype.makeDraggable = function() {
      $(this.el).draggable({
        revert: 'invalid'
      });
      return $(this.el).touch({
        animate: false,
        sticky: false,
        dragx: true,
        dragy: true,
        rotate: false,
        resort: true,
        scale: false
      });
    };
    LootView.prototype.destroy = function() {
      $(this.el).find('.sell-action').twipsy('hide');
      return $(this.el).fadeOut(__bind(function() {
        return $(this.el).remove();
      }, this));
    };
    return LootView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.OreView = (function() {
    __extends(OreView, Backbone.View);
    function OreView() {
      OreView.__super__.constructor.apply(this, arguments);
    }
    OreView.prototype.tagName = 'div';
    OreView.prototype.className = 'ore';
    OreView.prototype.initialize = function() {
      this.model.bind("change:forgeable", this.updateHighlight, this);
      this.model.bind("change:x", this.updateCoordinates, this);
      this.model.bind("change:y", this.updateCoordinates, this);
      this.model.bind("change:neighbors", this.updateNeighbors, this);
      this.model.bind("destroy", this.consume, this);
      this.model.bind("change:marked", this.mark, this);
      this.model.bind("change:moveable", this.updateMoveability, this);
      return this.model.bind("ForgeCraft:MoveBlock", this.moveBlocked, this);
    };
    OreView.prototype.render = function() {
      this.el = $('<div class="ore" />').get(0);
      $(this.el).addClass(this.model.get('to_class'));
      $(this.el).data({
        view: this
      });
      this.addSides();
      return this;
    };
    OreView.prototype.addSides = function() {
      return $(this.el).append('<div class="side top" />').append('<div class="side right" />').append('<div class="side bottom" />').append('<div class="side left" />');
    };
    OreView.prototype.oreUrl = function() {
      return ForgeCraft.Config.ores[this.model.get("rank")];
    };
    OreView.prototype.renderAndPosition = function() {
      this.render();
      $('#ores').append(this.el);
      return this.jumpToPosition();
    };
    OreView.prototype.leftPos = function() {
      var boardLeft;
      boardLeft = $('#ores').position().left + forgeView.hMargin;
      return boardLeft + ForgeCraft.Config.oreDim * this.model.get("x");
    };
    OreView.prototype.topPos = function() {
      var boardTop, topPos, topPost, y;
      y = this.model.get("y");
      if (y === -1) {
        return topPost = -2 * ForgeCraft.Config.oreDim;
      } else {
        boardTop = forgeView.topOffset;
        return topPos = boardTop + ForgeCraft.Config.oreDim * this.model.get("y");
      }
    };
    OreView.prototype.updateCoordinates = function() {
      return this.animateToPosition(false);
    };
    OreView.prototype.jumpToPosition = function() {
      return $(this.el).css({
        left: this.leftPos(),
        top: this.topPos()
      });
    };
    OreView.prototype.animateToPosition = function(dropDelay) {
      var dropDown, self, timeout;
      if (dropDelay == null) {
        dropDelay = false;
      }
      self = this;
      timeout = parseInt(Math.random() * ForgeCraft.Config.dropInTimeout);
      $(this.el).animate({
        left: this.leftPos()
      }, "fast");
      dropDown = function() {
        return $(self.el).animate({
          top: self.topPos()
        }, "fast");
      };
      if (dropDelay) {
        return setTimeout(dropDown, timeout);
      } else {
        return dropDown();
      }
    };
    OreView.prototype.updateHighlight = function() {
      var forgeable;
      if (forgeable = this.model.get("forgeable") != null) {
        return $(this.el).addClass("forgeable");
      } else {
        return $(this.el).removeClass("forgeable");
      }
    };
    OreView.prototype.updateNeighbors = function() {
      var d, n;
      n = this.model.get("neighbors");
      d = ["top", "right", "bottom", "left"];
      $(this.el).removeClass(d.join(" "));
      return $(this.el).addClass(n.join(" "));
    };
    OreView.prototype.mark = function() {
      if (this.model.get("marked")) {
        return $(this.el).addClass("marked");
      } else {
        return $(this.el).removeClass("marked");
      }
    };
    OreView.prototype.consume = function() {
      return $(this.el).fadeOut("slow", function() {
        return $(this).remove();
      });
    };
    OreView.prototype.updateMoveability = function() {
      console.log("Updating moveability");
      if (this.model.get("moveable")) {
        return $(this.el).removeClass('immoveable');
      } else {
        return $(this.el).addClass('immoveable');
      }
    };
    OreView.prototype.moveBlocked = function() {
      return $(this.el).effect("shake", {
        times: 3,
        distance: 10
      }, 50);
    };
    return OreView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.LoadingView = (function() {
    __extends(LoadingView, Backbone.View);
    function LoadingView() {
      LoadingView.__super__.constructor.apply(this, arguments);
    }
    LoadingView.prototype.tagName = 'div';
    LoadingView.prototype.id = 'loading';
    LoadingView.prototype.show = function() {
      return $(this.el).fadeIn();
    };
    LoadingView.prototype.hide = function() {
      return $(this.el).fadeOut();
    };
    return LoadingView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.MapView = (function() {
    __extends(MapView, Backbone.View);
    function MapView() {
      MapView.__super__.constructor.apply(this, arguments);
    }
    MapView.prototype.tagName = 'div';
    MapView.prototype.className = 'map';
    MapView.prototype.initialize = function() {};
    MapView.prototype.refresh = function() {
      this.topBarHeight = $('.topbar').height();
      this.htmlHeight = $('html').height();
      $('.sidebar').css({
        minHeight: this.htmlHeight - this.topBarHeight
      });
      return $('#map').find('.map').css({
        minHeight: this.htmlHeight - this.topBarHeight
      });
    };
    MapView.prototype.showMine = function() {
      return $('#map.details').load;
    };
    MapView.prototype.bindTravelActions = function() {
      var self;
      self = this;
      return $('.travel').click(function() {
        var mine_id;
        mine_id = $(this).attr("data-mine-id");
        self.changeMine(mine_id);
        return false;
      });
    };
    MapView.prototype.changeMine = function(mine_id) {
      console.log("Starting travel with mine id", mine_id);
      loadingView.show();
      return $.post('/players/' + player.get("name") + '/mine', {
        _method: "PUT",
        player: {
          mine_id: mine_id
        }
      }, this.onMineChange);
    };
    MapView.prototype.onMineChange = function(response) {
      var forge_id;
      console.log("Travelling!", response);
      loadingView.hide();
      forge_id = response.forge.id;
      return mapView.travelTo(forge_id);
    };
    MapView.prototype.travelTo = function(forge_id) {
      return Backbone.history.navigate("forges/" + forge_id, true);
    };
    return MapView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.MenuView = (function() {
    __extends(MenuView, Backbone.View);
    function MenuView() {
      MenuView.__super__.constructor.apply(this, arguments);
    }
    MenuView.prototype.tagName = 'div';
    MenuView.prototype.initialize = function() {
      return this.bindMenu();
    };
    MenuView.prototype.bindMenu = function() {
      var self;
      self = this;
      return $('.menu').click(function() {
        return self.activateMenu();
      });
    };
    MenuView.prototype.selectNav = function(item) {
      $('#navigation').find('a').removeClass('selected');
      return $('#navigation').find('a.' + item).addClass('selected');
    };
    MenuView.prototype.activateMenu = function() {
      console.log("Activating Menu");
      $.facebox({
        ajax: "/menu"
      });
      return false;
    };
    return MenuView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.PlayerView = (function() {
    __extends(PlayerView, Backbone.View);
    function PlayerView() {
      PlayerView.__super__.constructor.apply(this, arguments);
    }
    PlayerView.prototype.tagName = 'div';
    PlayerView.prototype.initialize = function() {
      this.model.bind("change:coins", this.onCoinChange, this);
      return this.model.bind("ForgeCraft:NeedMoreCoins", this.shakeMoney, this);
    };
    PlayerView.prototype.onCoinChange = function() {
      var coins;
      coins = this.model.get("coins");
      console.log("Updating coins to", coins);
      return this.updateCoinage(coins);
    };
    PlayerView.prototype.updateCoinage = function(coins) {
      return $('#player-bar').find('.coins').html(coins);
    };
    PlayerView.prototype.shakeMoney = function() {
      return $('#player-bar').find('.coins').effect("shake", {
        times: 3,
        distance: 10
      }, 50);
    };
    PlayerView.prototype.createLootDropZones = function() {};
    PlayerView.prototype.cashInLoot = function(loot_id) {};
    return PlayerView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ForgeCraft.Views.SplashView = (function() {
    __extends(SplashView, Backbone.View);
    function SplashView() {
      SplashView.__super__.constructor.apply(this, arguments);
    }
    SplashView.prototype.initialize = function() {
      this.queue = [];
      return this.running = false;
    };
    SplashView.prototype.queueMessage = function(message) {
      this.queue.push(message);
      return this.startQueue();
    };
    SplashView.prototype.startQueue = function() {
      if (this.running) {
        return;
      }
      return this.showMessages();
    };
    SplashView.prototype.showMessages = function() {
      var nextMsg;
      this.running = this.queue.length > 0;
      if (!this.running) {
        return;
      }
      nextMsg = this.queue.shift();
      this.showMessage(nextMsg);
      return setTimeout(__bind(function() {
        return this.showMessages();
      }, this), ForgeCraft.Config.splash.queueDelay);
    };
    SplashView.prototype.showMessage = function(message) {
      $(this.el).html(message).show();
      setTimeout(__bind(function() {
        return $(this.el).css({
          fontSize: "800%"
        });
      }, this), ForgeCraft.Config.splash.embiggenDelay);
      return setTimeout(__bind(function() {
        return $(this.el).fadeOut("fast", __bind(function() {
          return $(this.el).css({
            fontSize: "10px"
          });
        }, this));
      }, this), ForgeCraft.Config.splash.stickDelay);
    };
    return SplashView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Views.TooltipView = (function() {
    __extends(TooltipView, Backbone.View);
    function TooltipView() {
      TooltipView.__super__.constructor.apply(this, arguments);
    }
    TooltipView.prototype.initialize = function() {
      return this.bindTooltips();
    };
    TooltipView.prototype.bindTooltips = function() {
      return $('*[rel=tooltip]').facebox();
    };
    return TooltipView;
  })();
}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ForgeCraft.Routers.Router = (function() {
    __extends(Router, Backbone.Router);
    function Router() {
      Router.__super__.constructor.apply(this, arguments);
    }
    Router.prototype.initialize = function(options) {};
    Router.prototype.load = function(path, callback) {
      return appView.load(path, callback);
    };
    Router.prototype.routes = {
      "": "home",
      "login": "login",
      "register": "register",
      "forges/:ident": "forge",
      "armory": "armory",
      "armory/:class": "class",
      "battles": "battles",
      "battles/:id": "battle",
      "ladder": "ladder",
      "loot/:id": "loot",
      "items/:ident": "item",
      "map": "map",
      "map/:ident": "mapShow",
      "logout": "logout",
      ":player": "player"
    };
    Router.prototype.home = function() {
      menuView.selectNav('profile');
      return this.load('/');
    };
    Router.prototype.login = function() {
      return this.load('/login');
    };
    Router.prototype.register = function() {
      return this.load('/register');
    };
    Router.prototype.player = function(player) {
      menuView.selectNav('profile');
      return this.load("/" + player);
    };
    Router.prototype.forge = function(ident) {
      menuView.selectNav('forge');
      return this.load('/forges/' + ident);
    };
    Router.prototype.armory = function() {
      menuView.selectNav('armory');
      return this.load('/armory');
    };
    Router.prototype["class"] = function(classification) {
      menuView.selectNav('armory');
      return this.load('/armory/' + classification);
    };
    Router.prototype.item = function(ident) {
      menuView.selectNav('armory');
      return this.load('/items/' + ident);
    };
    Router.prototype.map = function() {
      menuView.selectNav('map');
      return this.load('/map');
    };
    Router.prototype.mapShow = function(ident) {
      menuView.selectNav('map');
      return this.load('/map/' + ident);
    };
    Router.prototype.ladder = function() {
      menuView.selectNav('ladder');
      return this.load("/ladder");
    };
    Router.prototype.battles = function() {
      menuView.selectNav('battle');
      return this.load('/battles');
    };
    Router.prototype.battle = function(id) {
      menuView.selectNav('battle');
      return this.load('/battles/' + id);
    };
    Router.prototype.logout = function() {
      return this.load("/logout", function() {
        $(document).trigger("close.facebox");
        return Backbone.history.navigate("/");
      });
    };
    return Router;
  })();
}).call(this);
(function() {
  $(function() {
    window.router = new ForgeCraft.Routers.Router;
    window.Loot = new ForgeCraft.Collections.Loot;
    window.player = new ForgeCraft.Models.Player(ForgeCraft.Config.player);
    window.map = new ForgeCraft.Models.Map;
    window.flashView = new ForgeCraft.Views.FlashView({
      el: $('#flash-wrap').get(0)
    });
    window.loadingView = new ForgeCraft.Views.LoadingView({
      el: $('#loading').get(0)
    });
    window.playerView = new ForgeCraft.Views.PlayerView({
      el: $('#profile').get(0),
      model: player
    });
    window.menuView = new ForgeCraft.Views.MenuView;
    window.equipperView = new ForgeCraft.Views.EquipperView;
    window.armoryView = new ForgeCraft.Views.ArmoryView;
    window.mapView = new ForgeCraft.Views.MapView;
    window.tooltipView = new ForgeCraft.Views.TooltipView;
    window.splashView = new ForgeCraft.Views.SplashView({
      el: $('#splash-message').get(0)
    });
    return window.appView = new ForgeCraft.Views.AppView;
  });
}).call(this);
