// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function noop() {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

// Place any jQuery/helper plugins in here.
//==============================================================
/**
 * DD_belatedPNG: Adds IE6 support: PNG images for CSS background-image and HTML <IMG/>.
 * Author: Drew Diller
 * Email: drew.diller@gmail.com
 * URL: http://www.dillerdesign.com/experiment/DD_belatedPNG/
 * Version: 0.0.8a
 * Licensed under the MIT License: http://dillerdesign.com/experiment/DD_belatedPNG/#license
 *
 * Example usage:
 * DD_belatedPNG.fix('.png_bg'); // argument is a CSS selector
 * DD_belatedPNG.fixPng( someNode ); // argument is an HTMLDomElement
 **/
//==============================================================
try {
  var DD_belatedPNG = {
    ns: "DD_belatedPNG",
    imgSize: {},
    delay: 10,
    nodesFixed: 0,
    createVmlNameSpace: function() {
      if (document.namespaces && !document.namespaces[this.ns]) {
        document.namespaces.add(this.ns, "urn:schemas-microsoft-com:vml")
      }
    },
    createVmlStyleSheet: function() {
      var b, a;
      b = document.createElement("style");
      b.setAttribute("media", "screen");
      document.documentElement.firstChild.insertBefore(b, document.documentElement.firstChild.firstChild);
      if (b.styleSheet) {
        b = b.styleSheet;
        b.addRule(this.ns + "\\:*", "{behavior:url(#default#VML)}");
        b.addRule(this.ns + "\\:shape", "position:absolute;");
        b.addRule("img." + this.ns + "_sizeFinder", "behavior:none; border:none; position:absolute; z-index:-1; top:-10000px; visibility:hidden;");
        this.screenStyleSheet = b;
        a = document.createElement("style");
        a.setAttribute("media", "print");
        document.documentElement.firstChild.insertBefore(a, document.documentElement.firstChild.firstChild);
        a = a.styleSheet;
        a.addRule(this.ns + "\\:*", "{display: none !important;}");
        a.addRule("img." + this.ns + "_sizeFinder", "{display: none !important;}")
      }
    },
    readPropertyChange: function() {
      var b, c, a;
      b = event.srcElement;
      if (!b.vmlInitiated) {
        return
      }
      if (event.propertyName.search("background") != -1 || event.propertyName.search("border") != -1) {
        DD_belatedPNG.applyVML(b)
      }
      if (event.propertyName == "style.display") {
        c = (b.currentStyle.display == "none") ? "none" : "block";
        for (a in b.vml) {
          if (b.vml.hasOwnProperty(a)) {
            b.vml[a].shape.style.display = c
          }
        }
      }
      if (event.propertyName.search("filter") != -1) {
        DD_belatedPNG.vmlOpacity(b)
      }
    },
    vmlOpacity: function(b) {
      if (b.currentStyle.filter.search("lpha") != -1) {
        var a = b.currentStyle.filter;
        a = parseInt(a.substring(a.lastIndexOf("=") + 1, a.lastIndexOf(")")), 10) / 100;
        b.vml.color.shape.style.filter = b.currentStyle.filter;
        b.vml.image.fill.opacity = a
      }
    },
    handlePseudoHover: function(a) {
      setTimeout(function() {
        DD_belatedPNG.applyVML(a)
      }, 1)
    },
    fix: function(a) {
      if (this.screenStyleSheet) {
        var c, b;
        c = a.split(",");
        for (b = 0; b < c.length; b++) {
          this.screenStyleSheet.addRule(c[b], "behavior:expression(DD_belatedPNG.fixPng(this))")
        }
      }
    },
    applyVML: function(a) {
      a.runtimeStyle.cssText = "";
      this.vmlFill(a);
      this.vmlOffsets(a);
      this.vmlOpacity(a);
      if (a.isImg) {
        this.copyImageBorders(a)
      }
    },
    attachHandlers: function(i) {
      var d, c, g, e, b, f;
      d = this;
      c = {
        resize: "vmlOffsets",
        move: "vmlOffsets"
      };
      if (i.nodeName == "A") {
        e = {
          mouseleave: "handlePseudoHover",
          mouseenter: "handlePseudoHover",
          focus: "handlePseudoHover",
          blur: "handlePseudoHover"
        };
        for (b in e) {
          if (e.hasOwnProperty(b)) {
            c[b] = e[b]
          }
        }
      }
      for (f in c) {
        if (c.hasOwnProperty(f)) {
          g = function() {
            d[c[f]](i)
          };
          i.attachEvent("on" + f, g)
        }
      }
      i.attachEvent("onpropertychange", this.readPropertyChange)
    },
    giveLayout: function(a) {
      a.style.zoom = 1;
      if (a.currentStyle.position == "static") {
        a.style.position = "relative"
      }
    },
    copyImageBorders: function(b) {
      var c, a;
      c = {
        borderStyle: true,
        borderWidth: true,
        borderColor: true
      };
      for (a in c) {
        if (c.hasOwnProperty(a)) {
          b.vml.color.shape.style[a] = b.currentStyle[a]
        }
      }
    },
    vmlFill: function(e) {
      if (!e.currentStyle) {
        return
      } else {
        var d, f, g, b, a, c;
        d = e.currentStyle
      }
      for (b in e.vml) {
        if (e.vml.hasOwnProperty(b)) {
          e.vml[b].shape.style.zIndex = d.zIndex
        }
      }
      e.runtimeStyle.backgroundColor = "";
      e.runtimeStyle.backgroundImage = "";
      f = true;
      if (d.backgroundImage != "none" || e.isImg) {
        if (!e.isImg) {
          e.vmlBg = d.backgroundImage;
          e.vmlBg = e.vmlBg.substr(5, e.vmlBg.lastIndexOf('")') - 5)
        } else {
          e.vmlBg = e.src
        }
        g = this;
        if (!g.imgSize[e.vmlBg]) {
          a = document.createElement("img");
          g.imgSize[e.vmlBg] = a;
          a.className = g.ns + "_sizeFinder";
          a.runtimeStyle.cssText = "behavior:none; position:absolute; left:-10000px; top:-10000px; border:none; margin:0; padding:0;";
          c = function() {
            this.width = this.offsetWidth;
            this.height = this.offsetHeight;
            g.vmlOffsets(e)
          };
          a.attachEvent("onload", c);
          a.src = e.vmlBg;
          a.removeAttribute("width");
          a.removeAttribute("height");
          document.body.insertBefore(a, document.body.firstChild)
        }
        e.vml.image.fill.src = e.vmlBg;
        f = false
      }
      e.vml.image.fill.on = !f;
      e.vml.image.fill.color = "none";
      e.vml.color.shape.style.backgroundColor = d.backgroundColor;
      e.runtimeStyle.backgroundImage = "none";
      e.runtimeStyle.backgroundColor = "transparent"
    },
    vmlOffsets: function(d) {
      var h, n, a, e, g, m, f, l, j, i, k;
      h = d.currentStyle;
      n = {
        W: d.clientWidth + 1,
        H: d.clientHeight + 1,
        w: this.imgSize[d.vmlBg].width,
        h: this.imgSize[d.vmlBg].height,
        L: d.offsetLeft,
        T: d.offsetTop,
        bLW: d.clientLeft,
        bTW: d.clientTop
      };
      a = (n.L + n.bLW == 1) ? 1 : 0;
      e = function(b, p, q, c, s, u) {
        b.coordsize = c + "," + s;
        b.coordorigin = u + "," + u;
        b.path = "m0,0l" + c + ",0l" + c + "," + s + "l0," + s + " xe";
        b.style.width = c + "px";
        b.style.height = s + "px";
        b.style.left = p + "px";
        b.style.top = q + "px"
      };
      e(d.vml.color.shape, (n.L + (d.isImg ? 0 : n.bLW)), (n.T + (d.isImg ? 0 : n.bTW)), (n.W - 1), (n.H - 1), 0);
      e(d.vml.image.shape, (n.L + n.bLW), (n.T + n.bTW), (n.W), (n.H), 1);
      g = {
        X: 0,
        Y: 0
      };
      if (d.isImg) {
        g.X = parseInt(h.paddingLeft, 10) + 1;
        g.Y = parseInt(h.paddingTop, 10) + 1
      } else {
        for (j in g) {
          if (g.hasOwnProperty(j)) {
            this.figurePercentage(g, n, j, h["backgroundPosition" + j])
          }
        }
      }
      d.vml.image.fill.position = (g.X / n.W) + "," + (g.Y / n.H);
      m = h.backgroundRepeat;
      f = {
        T: 1,
        R: n.W + a,
        B: n.H,
        L: 1 + a
      };
      l = {
        X: {
          b1: "L",
          b2: "R",
          d: "W"
        },
        Y: {
          b1: "T",
          b2: "B",
          d: "H"
        }
      };
      if (m != "repeat" || d.isImg) {
        i = {
          T: (g.Y),
          R: (g.X + n.w),
          B: (g.Y + n.h),
          L: (g.X)
        };
        if (m.search("repeat-") != -1) {
          k = m.split("repeat-")[1].toUpperCase();
          i[l[k].b1] = 1;
          i[l[k].b2] = n[l[k].d]
        }
        if (i.B > n.H) {
          i.B = n.H
        }
        d.vml.image.shape.style.clip = "rect(" + i.T + "px " + (i.R + a) + "px " + i.B + "px " + (i.L + a) + "px)"
      } else {
        d.vml.image.shape.style.clip = "rect(" + f.T + "px " + f.R + "px " + f.B + "px " + f.L + "px)"
      }
    },
    figurePercentage: function(d, c, f, a) {
      var b, e;
      e = true;
      b = (f == "X");
      switch (a) {
        case "left":
        case "top":
          d[f] = 0;
          break;
        case "center":
          d[f] = 0.5;
          break;
        case "right":
        case "bottom":
          d[f] = 1;
          break;
        default:
          if (a.search("%") != -1) {
            d[f] = parseInt(a, 10) / 100
          } else {
            e = false
          }
      }
      d[f] = Math.ceil(e ? ((c[b ? "W" : "H"] * d[f]) - (c[b ? "w" : "h"] * d[f])) : parseInt(a, 10));
      if (d[f] % 2 === 0) {
        d[f]++
      }
      return d[f]
    },
    fixPng: function(c) {
      c.style.behavior = "none";
      var g, b, f, a, d;
      if (c.nodeName == "BODY" || c.nodeName == "TD" || c.nodeName == "TR") {
        return
      }
      c.isImg = false;
      if (c.nodeName == "IMG") {
        if (c.src.toLowerCase().search(/\.png$/) != -1) {
          c.isImg = true;
          c.style.visibility = "hidden"
        } else {
          return
        }
      } else {
        if (c.currentStyle.backgroundImage.toLowerCase().search(".png") == -1) {
          return
        }
      }
      g = DD_belatedPNG;
      c.vml = {
        color: {},
        image: {}
      };
      b = {
        shape: {},
        fill: {}
      };
      for (a in c.vml) {
        if (c.vml.hasOwnProperty(a)) {
          for (d in b) {
            if (b.hasOwnProperty(d)) {
              f = g.ns + ":" + d;
              c.vml[a][d] = document.createElement(f)
            }
          }
          c.vml[a].shape.stroked = false;
          c.vml[a].shape.appendChild(c.vml[a].fill);
          c.parentNode.insertBefore(c.vml[a].shape, c)
        }
      }
      c.vml.image.shape.fillcolor = "none";
      c.vml.image.fill.type = "tile";
      c.vml.color.fill.on = false;
      g.attachHandlers(c);
      g.giveLayout(c);
      g.giveLayout(c.offsetParent);
      c.vmlInitiated = true;
      g.applyVML(c)
    }
  };
  try {
    document.execCommand("BackgroundImageCache", false, true)
  } catch (r) {}
  DD_belatedPNG.createVmlNameSpace();
  DD_belatedPNG.createVmlStyleSheet();
} catch (err) {}

//==============================================================
/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (MIT_LICENSE.txt)
 * and GPL Version 2 (GPL_LICENSE.txt) licenses.
 *
 * Version: 1.1.1
 * Requires jQuery 1.3+
 * Docs: http://docs.jquery.com/Plugins/livequery
 */
//==============================================================
(function($) {

  $.extend($.fn, {
    livequery: function(type, fn, fn2) {
      var self = this,
        q;

      // Handle different call patterns
      if ($.isFunction(type))
        fn2 = fn, fn = type, type = undefined;

      // See if Live Query already exists
      $.each($.livequery.queries, function(i, query) {
        if (self.selector == query.selector && self.context == query.context &&
          type == query.type && (!fn || fn.$lqguid == query.fn.$lqguid) && (!fn2 || fn2.$lqguid == query.fn2.$lqguid))
        // Found the query, exit the each loop
          return (q = query) && false;
      });

      // Create new Live Query if it wasn't found
      q = q || new $.livequery(this.selector, this.context, type, fn, fn2);

      // Make sure it is running
      q.stopped = false;

      // Run it immediately for the first time
      q.run();

      // Contnue the chain
      return this;
    },

    expire: function(type, fn, fn2) {
      var self = this;

      // Handle different call patterns
      if ($.isFunction(type))
        fn2 = fn, fn = type, type = undefined;

      // Find the Live Query based on arguments and stop it
      $.each($.livequery.queries, function(i, query) {
        if (self.selector == query.selector && self.context == query.context &&
          (!type || type == query.type) && (!fn || fn.$lqguid == query.fn.$lqguid) && (!fn2 || fn2.$lqguid == query.fn2.$lqguid) && !this.stopped)
          $.livequery.stop(query.id);
      });

      // Continue the chain
      return this;
    }
  });

  $.livequery = function(selector, context, type, fn, fn2) {
    this.selector = selector;
    this.context = context;
    this.type = type;
    this.fn = fn;
    this.fn2 = fn2;
    this.elements = [];
    this.stopped = false;

    // The id is the index of the Live Query in $.livequery.queries
    this.id = $.livequery.queries.push(this) - 1;

    // Mark the functions for matching later on
    fn.$lqguid = fn.$lqguid || $.livequery.guid++;
    if (fn2) fn2.$lqguid = fn2.$lqguid || $.livequery.guid++;

    // Return the Live Query
    return this;
  };

  $.livequery.prototype = {
    stop: function() {
      var query = this;

      if (this.type)
      // Unbind all bound events
        this.elements.unbind(this.type, this.fn);
      else if (this.fn2)
      // Call the second function for all matched elements
        this.elements.each(function(i, el) {
        query.fn2.apply(el);
      });

      // Clear out matched elements
      this.elements = [];

      // Stop the Live Query from running until restarted
      this.stopped = true;
    },

    run: function() {
      // Short-circuit if stopped
      if (this.stopped) return;
      var query = this;

      var oEls = this.elements,
        els = $(this.selector, this.context),
        nEls = els.not(oEls);

      // Set elements to the latest set of matched elements
      this.elements = els;

      if (this.type) {
        // Bind events to newly matched elements
        nEls.bind(this.type, this.fn);

        // Unbind events to elements no longer matched
        if (oEls.length > 0)
          $.each(oEls, function(i, el) {
            if ($.inArray(el, els) < 0)
              $.event.remove(el, query.type, query.fn);
          });
      } else {
        // Call the first function for newly matched elements
        nEls.each(function() {
          query.fn.apply(this);
        });

        // Call the second function for elements no longer matched
        if (this.fn2 && oEls.length > 0)
          $.each(oEls, function(i, el) {
            if ($.inArray(el, els) < 0)
              query.fn2.apply(el);
          });
      }
    }
  };

  $.extend($.livequery, {
    guid: 0,
    queries: [],
    queue: [],
    running: false,
    timeout: null,

    checkQueue: function() {
      if ($.livequery.running && $.livequery.queue.length) {
        var length = $.livequery.queue.length;
        // Run each Live Query currently in the queue
        while (length--)
          $.livequery.queries[$.livequery.queue.shift()].run();
      }
    },

    pause: function() {
      // Don't run anymore Live Queries until restarted
      $.livequery.running = false;
    },

    play: function() {
      // Restart Live Queries
      $.livequery.running = true;
      // Request a run of the Live Queries
      $.livequery.run();
    },

    registerPlugin: function() {
      $.each(arguments, function(i, n) {
        // Short-circuit if the method doesn't exist
        if (!$.fn[n]) return;

        // Save a reference to the original method
        var old = $.fn[n];

        // Create a new method
        $.fn[n] = function() {
          // Call the original method
          var r = old.apply(this, arguments);

          // Request a run of the Live Queries
          $.livequery.run();

          // Return the original methods result
          return r;
        }
      });
    },

    run: function(id) {
      if (id != undefined) {
        // Put the particular Live Query in the queue if it doesn't already exist
        if ($.inArray(id, $.livequery.queue) < 0)
          $.livequery.queue.push(id);
      } else
      // Put each Live Query in the queue if it doesn't already exist
        $.each($.livequery.queries, function(id) {
        if ($.inArray(id, $.livequery.queue) < 0)
          $.livequery.queue.push(id);
      });

      // Clear timeout if it already exists
      if ($.livequery.timeout) clearTimeout($.livequery.timeout);
      // Create a timeout to check the queue and actually run the Live Queries
      $.livequery.timeout = setTimeout($.livequery.checkQueue, 20);
    },

    stop: function(id) {
      if (id != undefined)
      // Stop are particular Live Query
        $.livequery.queries[id].stop();
      else
      // Stop all Live Queries
        $.each($.livequery.queries, function(id) {
        $.livequery.queries[id].stop();
      });
    }
  });

  // Register core DOM manipulation methods
  $.livequery.registerPlugin('append', 'prepend', 'after', 'before', 'wrap', 'attr', 'removeAttr', 'addClass', 'removeClass', 'toggleClass', 'empty', 'remove', 'html');

  // Run Live Queries when the Document is ready
  $(function() {
    $.livequery.play();
  });

})(jQuery);


//==============================================================
//Polyfill to remove click delays on browsers with touch UIs
//https://github.com/ftlabs/fastclick
//==============================================================
/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 1.0.0
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 */
function FastClick(layer) {
  'use strict';
  var oldOnClick;


  /**
   * Whether a click is currently being tracked.
   *
   * @type boolean
   */
  this.trackingClick = false;


  /**
   * Timestamp for when when click tracking started.
   *
   * @type number
   */
  this.trackingClickStart = 0;


  /**
   * The element being tracked for a click.
   *
   * @type EventTarget
   */
  this.targetElement = null;


  /**
   * X-coordinate of touch start event.
   *
   * @type number
   */
  this.touchStartX = 0;


  /**
   * Y-coordinate of touch start event.
   *
   * @type number
   */
  this.touchStartY = 0;


  /**
   * ID of the last touch, retrieved from Touch.identifier.
   *
   * @type number
   */
  this.lastTouchIdentifier = 0;


  /**
   * Touchmove boundary, beyond which a click will be cancelled.
   *
   * @type number
   */
  this.touchBoundary = 10;


  /**
   * The FastClick layer.
   *
   * @type Element
   */
  this.layer = layer;

  if (FastClick.notNeeded(layer)) {
    return;
  }

  // Some old versions of Android don't have Function.prototype.bind
  function bind(method, context) {
    return function() {
      return method.apply(context, arguments);
    };
  }

  // Set up event handlers as required
  if (deviceIsAndroid) {
    layer.addEventListener('mouseover', bind(this.onMouse, this), true);
    layer.addEventListener('mousedown', bind(this.onMouse, this), true);
    layer.addEventListener('mouseup', bind(this.onMouse, this), true);
  }

  layer.addEventListener('click', bind(this.onClick, this), true);
  layer.addEventListener('touchstart', bind(this.onTouchStart, this), false);
  layer.addEventListener('touchmove', bind(this.onTouchMove, this), false);
  layer.addEventListener('touchend', bind(this.onTouchEnd, this), false);
  layer.addEventListener('touchcancel', bind(this.onTouchCancel, this), false);

  // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
  // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
  // layer when they are cancelled.
  if (!Event.prototype.stopImmediatePropagation) {
    layer.removeEventListener = function(type, callback, capture) {
      var rmv = Node.prototype.removeEventListener;
      if (type === 'click') {
        rmv.call(layer, type, callback.hijacked || callback, capture);
      } else {
        rmv.call(layer, type, callback, capture);
      }
    };

    layer.addEventListener = function(type, callback, capture) {
      var adv = Node.prototype.addEventListener;
      if (type === 'click') {
        adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
          if (!event.propagationStopped) {
            callback(event);
          }
        }), capture);
      } else {
        adv.call(layer, type, callback, capture);
      }
    };
  }

  // If a handler is already declared in the element's onclick attribute, it will be fired before
  // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
  // adding it as listener.
  if (typeof layer.onclick === 'function') {

    // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
    // - the old one won't work if passed to addEventListener directly.
    oldOnClick = layer.onclick;
    layer.addEventListener('click', function(event) {
      oldOnClick(event);
    }, false);
    layer.onclick = null;
  }
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
  'use strict';
  switch (target.nodeName.toLowerCase()) {

    // Don't send a synthetic click to disabled inputs (issue #62)
    case 'button':
    case 'select':
    case 'textarea':
      if (target.disabled) {
        return true;
      }

      break;
    case 'input':

      // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
      if ((deviceIsIOS && target.type === 'file') || target.disabled) {
        return true;
      }

      break;
    case 'label':
    case 'video':
      return true;
  }

  return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
  'use strict';
  switch (target.nodeName.toLowerCase()) {
    case 'textarea':
      return true;
    case 'select':
      return !deviceIsAndroid;
    case 'input':
      switch (target.type) {
        case 'button':
        case 'checkbox':
        case 'file':
        case 'image':
        case 'radio':
        case 'submit':
          return false;
      }

      // No point in attempting to focus disabled inputs
      return !target.disabled && !target.readOnly;
    default:
      return (/\bneedsfocus\b/).test(target.className);
  }
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
  'use strict';
  var clickEvent, touch;

  // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
  if (document.activeElement && document.activeElement !== targetElement) {
    document.activeElement.blur();
  }

  touch = event.changedTouches[0];

  // Synthesise a click event, with an extra attribute so it can be tracked
  clickEvent = document.createEvent('MouseEvents');
  clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
  clickEvent.forwardedTouchEvent = true;
  targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
  'use strict';

  //Issue #159: Android Chrome Select Box does not open with a synthetic click event
  if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
    return 'mousedown';
  }

  return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
  'use strict';
  var length;

  // Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
  if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
    length = targetElement.value.length;
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
  'use strict';
  var scrollParent, parentElement;

  scrollParent = targetElement.fastClickScrollParent;

  // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
  // target element was moved to another parent.
  if (!scrollParent || !scrollParent.contains(targetElement)) {
    parentElement = targetElement;
    do {
      if (parentElement.scrollHeight > parentElement.offsetHeight) {
        scrollParent = parentElement;
        targetElement.fastClickScrollParent = parentElement;
        break;
      }

      parentElement = parentElement.parentElement;
    } while (parentElement);
  }

  // Always update the scroll top tracker if possible.
  if (scrollParent) {
    scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
  }
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
  'use strict';

  // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
  if (eventTarget.nodeType === Node.TEXT_NODE) {
    return eventTarget.parentNode;
  }

  return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
  'use strict';
  var targetElement, touch, selection;

  // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
  if (event.targetTouches.length > 1) {
    return true;
  }

  targetElement = this.getTargetElementFromEventTarget(event.target);
  touch = event.targetTouches[0];

  if (deviceIsIOS) {

    // Only trusted events will deselect text on iOS (issue #49)
    selection = window.getSelection();
    if (selection.rangeCount && !selection.isCollapsed) {
      return true;
    }

    if (!deviceIsIOS4) {

      // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
      // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
      // with the same identifier as the touch event that previously triggered the click that triggered the alert.
      // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
      // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
      if (touch.identifier === this.lastTouchIdentifier) {
        event.preventDefault();
        return false;
      }

      this.lastTouchIdentifier = touch.identifier;

      // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
      // 1) the user does a fling scroll on the scrollable layer
      // 2) the user stops the fling scroll with another tap
      // then the event.target of the last 'touchend' event will be the element that was under the user's finger
      // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
      // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
      this.updateScrollParent(targetElement);
    }
  }

  this.trackingClick = true;
  this.trackingClickStart = event.timeStamp;
  this.targetElement = targetElement;

  this.touchStartX = touch.pageX;
  this.touchStartY = touch.pageY;

  // Prevent phantom clicks on fast double-tap (issue #36)
  if ((event.timeStamp - this.lastClickTime) < 200) {
    event.preventDefault();
  }

  return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
  'use strict';
  var touch = event.changedTouches[0],
    boundary = this.touchBoundary;

  if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
    return true;
  }

  return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
  'use strict';
  if (!this.trackingClick) {
    return true;
  }

  // If the touch has moved, cancel the click tracking
  if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
    this.trackingClick = false;
    this.targetElement = null;
  }

  return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
  'use strict';

  // Fast path for newer browsers supporting the HTML5 control attribute
  if (labelElement.control !== undefined) {
    return labelElement.control;
  }

  // All browsers under test that support touch events also support the HTML5 htmlFor attribute
  if (labelElement.htmlFor) {
    return document.getElementById(labelElement.htmlFor);
  }

  // If no for attribute exists, attempt to retrieve the first labellable descendant element
  // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
  return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
  'use strict';
  var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

  if (!this.trackingClick) {
    return true;
  }

  // Prevent phantom clicks on fast double-tap (issue #36)
  if ((event.timeStamp - this.lastClickTime) < 200) {
    this.cancelNextClick = true;
    return true;
  }

  // Reset to prevent wrong click cancel on input (issue #156).
  this.cancelNextClick = false;

  this.lastClickTime = event.timeStamp;

  trackingClickStart = this.trackingClickStart;
  this.trackingClick = false;
  this.trackingClickStart = 0;

  // On some iOS devices, the targetElement supplied with the event is invalid if the layer
  // is performing a transition or scroll, and has to be re-detected manually. Note that
  // for this to function correctly, it must be called *after* the event target is checked!
  // See issue #57; also filed as rdar://13048589 .
  if (deviceIsIOSWithBadTarget) {
    touch = event.changedTouches[0];

    // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
    targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
    targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
  }

  targetTagName = targetElement.tagName.toLowerCase();
  if (targetTagName === 'label') {
    forElement = this.findControl(targetElement);
    if (forElement) {
      this.focus(targetElement);
      if (deviceIsAndroid) {
        return false;
      }

      targetElement = forElement;
    }
  } else if (this.needsFocus(targetElement)) {

    // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
    // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
    if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
      this.targetElement = null;
      return false;
    }

    this.focus(targetElement);
    this.sendClick(targetElement, event);

    // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
    if (!deviceIsIOS4 || targetTagName !== 'select') {
      this.targetElement = null;
      event.preventDefault();
    }

    return false;
  }

  if (deviceIsIOS && !deviceIsIOS4) {

    // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
    // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
    scrollParent = targetElement.fastClickScrollParent;
    if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
      return true;
    }
  }

  // Prevent the actual click from going though - unless the target node is marked as requiring
  // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
  if (!this.needsClick(targetElement)) {
    event.preventDefault();
    this.sendClick(targetElement, event);
  }

  return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
  'use strict';
  this.trackingClick = false;
  this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
  'use strict';

  // If a target element was never set (because a touch event was never fired) allow the event
  if (!this.targetElement) {
    return true;
  }

  if (event.forwardedTouchEvent) {
    return true;
  }

  // Programmatically generated events targeting a specific element should be permitted
  if (!event.cancelable) {
    return true;
  }

  // Derive and check the target element to see whether the mouse event needs to be permitted;
  // unless explicitly enabled, prevent non-touch click events from triggering actions,
  // to prevent ghost/doubleclicks.
  if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

    // Prevent any user-added listeners declared on FastClick element from being fired.
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    } else {

      // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
      event.propagationStopped = true;
    }

    // Cancel the event
    event.stopPropagation();
    event.preventDefault();

    return false;
  }

  // If the mouse event is permitted, return true for the action to go through.
  return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
  'use strict';
  var permitted;

  // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
  if (this.trackingClick) {
    this.targetElement = null;
    this.trackingClick = false;
    return true;
  }

  // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
  if (event.target.type === 'submit' && event.detail === 0) {
    return true;
  }

  permitted = this.onMouse(event);

  // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
  if (!permitted) {
    this.targetElement = null;
  }

  // If clicks are permitted, return true for the action to go through.
  return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
  'use strict';
  var layer = this.layer;

  if (deviceIsAndroid) {
    layer.removeEventListener('mouseover', this.onMouse, true);
    layer.removeEventListener('mousedown', this.onMouse, true);
    layer.removeEventListener('mouseup', this.onMouse, true);
  }

  layer.removeEventListener('click', this.onClick, true);
  layer.removeEventListener('touchstart', this.onTouchStart, false);
  layer.removeEventListener('touchmove', this.onTouchMove, false);
  layer.removeEventListener('touchend', this.onTouchEnd, false);
  layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
  'use strict';
  var metaViewport;
  var chromeVersion;

  // Devices that don't support touch don't need FastClick
  if (typeof window.ontouchstart === 'undefined') {
    return true;
  }

  // Chrome version - zero for other browsers
  chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

  if (chromeVersion) {

    if (deviceIsAndroid) {
      metaViewport = document.querySelector('meta[name=viewport]');

      if (metaViewport) {
        // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
        if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
          return true;
        }
        // Chrome 32 and above with width=device-width or less don't need FastClick
        if (chromeVersion > 31 && window.innerWidth <= window.screen.width) {
          return true;
        }
      }

      // Chrome desktop doesn't need FastClick (issue #15)
    } else {
      return true;
    }
  }

  // IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
  if (layer.style.msTouchAction === 'none') {
    return true;
  }

  return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.attach = function(layer) {
  'use strict';
  return new FastClick(layer);
};


if (typeof define !== 'undefined' && define.amd) {

  // AMD. Register as an anonymous module.
  define(function() {
    'use strict';
    return FastClick;
  });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = FastClick.attach;
  module.exports.FastClick = FastClick;
} else {
  window.FastClick = FastClick;
}
