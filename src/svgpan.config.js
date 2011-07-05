var SVGPanConfig = SVGPan.Config;

(function() {
    if (SVGPanConfig) {
        return;
    }

    SVGPanConfig = SVGPan.Config = {
		debugMode: false,
		
        animationTime: 1.5,
        logarithmicZoom: true,
        
        springStiffness: 5.0,
        
        zoomPerClick: 2.0,
        zoomPerScroll: Math.pow(2, 1/3),
        zoomPerSecond: 2.0
    };

})();
