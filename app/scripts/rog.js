'use strict';
/* jshint camelcase: false */
/* global _ */
var tooltips = function( svg ){
	var paths = document.querySelectorAll( svg );
	var tooltip_svg = document.querySelector('.tooltip_svg');
	var contorno = document.querySelector( '#stage #map_contorno' );
	_.each( paths, function( path ){
		path.onmouseover = function(){
			tooltip_svg.innerHTML = path.dataset.estado;
			tooltip_svg.style.display = 'inline-block';
		};
		path.onmouseout = function(){
			tooltip_svg.style.display = 'none';
		};
		path.onmousemove = function (e) {
			var x = e.clientX, y = e.clientY;
			tooltip_svg.style.top = (y + 5) + 'px';
			tooltip_svg.style.left = (x + 5) + 'px';
		};
	});
};