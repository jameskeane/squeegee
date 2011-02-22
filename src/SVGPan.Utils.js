var SVGPanUtils = function() {
    
    // Fields
    var self = this;
	
    // Constructor
    (function() {
    })();
    
    // Methods
    this.getElement = function(elmt) {
        if (typeof(elmt) == "string") {
            elmt = document.getElementById(elmt);
        }
        
        return elmt;
    };
	
	this.getEvent = function(event) {
        return event ? event : window.event;
    };
	
	/**
	 * Instance an SVGPoint object with given event coordinates.
	 */
	this.getEventPoint = function(evt) {
		var p = document.documentElement.createSVGPoint();

		p.x = evt.clientX;
		p.y = evt.clientY;

		return p;
	};
    
	/**
	 * Sets the current transform matrix of an element.
	 */
	this.setCTM = function(elmt, matrix) {
		var s = "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.e + "," + matrix.f + ")";

		elmt.setAttribute("transform", s);
	};

	/**
	 * Dumps a matrix to a string (useful for debug).
	 */
	this.dumpMatrix = function(matrix) {
		var s = "[ " + matrix.a + ", " + matrix.c + ", " + matrix.e + "\n  " + matrix.b + ", " + matrix.d + ", " + matrix.f + "\n  0, 0, 1 ]";

		return s;
	};
	
	/**
	 * Sets attributes of an element.
	 */
	this.setAttributes = function(elmt, attributes){
		for (i in attributes)
			elmt.setAttributeNS(null, i, attributes[i]);
	};
	
    this.getMouseScroll = function(event) {
        var event = self.getEvent(event);
        var delta = 0; // default value
        
        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/10/31/javascript-tutorial-the-scroll-wheel/
        if (typeof(event.wheelDelta) == "number") {
            delta = event.wheelDelta;
        } else if (typeof(event.detail) == "number") {
            delta = event.detail * -1;
        } else {
            // TODO: Failure
        }
        
        // normalize value to [-1, 1]
        return delta ? delta / Math.abs(delta) : 0;
    };
	
	this.addEvent = function(elmt, eventName, handler, useCapture) {
        var elmt = self.getElement(elmt);
        
        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/
        
        if (elmt.addEventListener) {
            if (eventName == "mousewheel") {
                elmt.addEventListener("DOMMouseScroll", handler, useCapture);
            }
            // we are still going to add the mousewheel -- not a mistake!
            // this is for opera, since it uses onmousewheel but needs addEventListener.
            elmt.addEventListener(eventName, handler, useCapture);
        } else if (elmt.attachEvent) {
            elmt.attachEvent("on" + eventName, handler);
            if (useCapture && elmt.setCapture) {
                elmt.setCapture();
            }
        } else {
            // TODO: failure
        }
    };
    
    this.removeEvent = function(elmt, eventName, handler, useCapture) {
        var elmt = self.getElement(elmt);
        
        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/
        
        if (elmt.removeEventListener) {
            if (eventName == "mousewheel") {
                elmt.removeEventListener("DOMMouseScroll", handler, useCapture);
            }
            // we are still going to remove the mousewheel -- not a mistake!
            // this is for opera, since it uses onmousewheel but needs removeEventListener.
            elmt.removeEventListener(eventName, handler, useCapture);
        } else if (elmt.detachEvent) {
            elmt.detachEvent("on" + eventName, handler);
            if (useCapture && elmt.releaseCapture) {
                elmt.releaseCapture();
            }
        } else {
            // TODO: failure
        }
    };
    
    this.cancelEvent = function(event) {
        var event = self.getEvent(event);
        
        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/
        
        if (event.preventDefault) {
            event.preventDefault();     // W3C for preventing default
        }
        
        event.cancel = true;            // legacy for preventing default
        event.returnValue = false;      // IE for preventing default
    };
    
    this.stopEvent = function(event) {
        var event = self.getEvent(event);
        
        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/
        
        if (event.stopPropagation) {
            event.stopPropagation();    // W3C for stopping propagation
        }
        
        event.cancelBubble = true;      // IE for stopping propagation
    };
};

// Seadragon.Utils is a static class, so make it singleton instance
SVGPanUtils = SVGPan.Utils = new SVGPanUtils();
