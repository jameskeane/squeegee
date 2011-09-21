func = function() {
	(new Squeegee.Viewer(Squeegee.Utils.getElement('viewport')));
};

if (window.addEventListener) 
	window.addEventListener('load', func,false); 
else if (elem.attachEvent) 
	window.attachEvent('onload', func);
