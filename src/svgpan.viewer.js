var SVGPanViewer;

(function() {
    // Viewer
    SVGPanViewer = SVGPan.Viewer = function(container) {
        
        // Fields
        var self = this;
        var parent = SVGPanUtils.getElement(container);
		var root = document.documentElement;
		
		var panning = false;
		var zooming = false;
        var animating = false;
		
		var stateTarget, stateOrigin;
		stateTf = parent.getCTM().inverse();
		
		var centerSpringX = new SVGPanSpring(0);
		var centerSpringY = new SVGPanSpring(0);
		var zoomSpring = new SVGPanSpring(SVGPanConfig.logarithmicZoom ? 0 : 1);
		var zoomPoint;
		
		var LN2 = Math.LN2;
	
		function initialize() {
			SVGPanUtils.addEvent(root, 'mouseup', onMouseUp, false);
			SVGPanUtils.addEvent(root, 'mousedown', onMouseDown, false);
			SVGPanUtils.addEvent(root, 'mousemove', onMouseMove, false);
			SVGPanUtils.addEvent(root, 'mousewheel', onMouseScroll, false);
			
			update();
		}    
		
		
		function log2(x) {
			return Math.log(x) / LN2;
		}
		
		function pow2(x) {
			return Math.pow(2, x);
		}
    
		
		function getZoom(current) {
			var zoom;
			if (current) {
				zoom = zoomSpring.getCurrent();
				return SVGPanConfig.logarithmicZoom ? pow2(zoom) : zoom;
			} else {
				zoom = zoomSpring.getTarget();
				return SVGPanConfig.logarithmicZoom ? pow2(zoom) : zoom;
			}
		};
	
		function scheduleUpdate(updateFunc, prevUpdateTime) {
            // if we're animating, update as fast as possible to stay smooth
            if (animating) {
                return window.setTimeout(updateFunc, 1);
            }
            
            // if no previous update, consider this an update
            var currentTime = new Date().getTime();
            var prevUpdateTime = prevUpdateTime ? prevUpdateTime : currentTime;
            var targetTime = prevUpdateTime + 1000 / 60;    // 60 fps ideal
            
            // calculate delta time to be a positive number
            var deltaTime = Math.max(1, targetTime - currentTime);
            return window.setTimeout(updateFunc, deltaTime);
        }
		
		function update() {
            var beginTime = new Date().getTime();
			var oldZoom = zoomSpring.getCurrent();
			var oldCenterX = centerSpringX.getCurrent(),
				oldCenterY = centerSpringY.getCurrent();
				
			// now update zoom only, don't update pan yet
			zoomSpring.update();
			if (zoomSpring.getCurrent() != oldZoom) {
				var p = zoomPoint.matrixTransform(parent.getCTM().inverse());
				var change = zoomSpring.getCurrent() - oldZoom;
				var z = 1 + change; // Zoom factor
				
				// Compute new scale matrix in current mouse position
				var k = root.createSVGMatrix().translate(p.x, p.y).scale(z).translate(-p.x, -p.y);
				SVGPanUtils.setCTM(parent, parent.getCTM().multiply(k));
					
				stateTf = stateTf.multiply(k.inverse());
			}
			
			centerSpringX.update();
			centerSpringY.update();
			
			if(centerSpringX.getCurrent() != oldCenterX | centerSpringY.getCurrent() != oldCenterY) {					
				SVGPanUtils.setCTM(parent, stateTf.inverse().translate(centerSpringX.getCurrent(), centerSpringY.getCurrent()));
			}
			
			if(zoomSpring.getCurrent() == oldZoom & centerSpringX.getCurrent() == oldCenterX & centerSpringY.getCurrent() == oldCenterY)
				animating = false;
			
            scheduleUpdate(arguments.callee, beginTime);
		}
		
		
		function zoomBy(factor, refPoint, immediately) {
			zoomTo(getZoom() * factor, refPoint, immediately);
		}
		
		function zoomTo(zoom, refPoint, immediately) {
			animating = true;
			if (immediately) {
				zoomSpring.resetTo(SVGPanConfig.logarithmicZoom ? log2(zoom) : zoom);
			} else {
				zoomSpring.springTo(SVGPanConfig.logarithmicZoom ? log2(zoom) : zoom);
			}

			zoomPoint = refPoint;
		}
		
		
		// Event Handlers
		function onMouseUp(evt) {
			// Stop panning
			panning = false;
		}
		
		function onMouseDown(evt) {
			// Start panning
			
			if(!panning) {
				stateTf = parent.getCTM().inverse();
				stateOrigin = SVGPanUtils.getEventPoint(evt).matrixTransform(stateTf);
				centerSpringX.resetTo(0);
				centerSpringY.resetTo(0);
			}
			
			panning = true;
			animating = true;
		}
		
		function onMouseMove(evt) {
			if(panning == true) {
				var p = SVGPanUtils.getEventPoint(evt).matrixTransform(stateTf);
				centerSpringX.springTo(p.x-stateOrigin.x);
				centerSpringY.springTo(p.y-stateOrigin.y);
			}
		}
		
		function onMouseScroll(evt) {
			var delta = SVGPanUtils.getMouseScroll(evt);
			var p = SVGPanUtils.getEventPoint(evt);
			
			var factor = Math.pow(SVGPanConfig.zoomPerScroll, delta);
			zoomBy(factor, p, false);
			
			
			SVGPanUtils.cancelEvent(evt);
		}
		
		
		// Constructor
		initialize();
    };

})();
