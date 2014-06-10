'use strict';
/* jshint camelcase: false */
/* global Backbone, _, alert */
var width = $(window).outerWidth();
var height = $(window).outerHeight();
var SITE = (function(){
	var site_loaded = false;
	var actual_section = 'home';
	var actual_estado = null;
	var actual_municipio = null;
	var actual_calif = null;
	var actual_vivienda = null;
	var actual_rango = null;

	return{
		'site_loaded': site_loaded,
		'actual_section': actual_section,
		'actual_estado': actual_estado,
		'actual_municipio': actual_municipio,
		'actual_calif': actual_calif,
		'actual_vivienda': actual_vivienda,
		'actual_rango': actual_rango,

		global_sections: function(){
			$('#header-logo').show();
		},
		rotate_circle: function( section ){
			//console.log( 'imsection'+section );
			//console.log('marygoroundwegoupandaroundwego');
			$('.grass').rotate({animateTo: 180}, 3000, 'expo');
			$('.title_section').rotate({animateTo: 360}, 3000, 'expo');
			$('#add_title').removeClass().addClass(section);
			$('#button_'+section).fadeIn();
			$('#container').animate({'top':'83px'}, 1000 , 'expo');
		}
	};
}());

var resetAnimation = function(){
	$('#container').css({'top':'-730px'});
	/*	-webkit-transform: rotate(0deg);
	-webkit-transform-origin: 50% 50%;*/
	$('.grass').rotate({animateTo:0});
	$('.title_section').rotate({animateTo: 0});
};

/***** AJAX REQUEST ***/
var get_mapa_mexico = function(){
	$.ajax({
		type: 'GET',
		url: '/templates/template_mapa.html',
		beforeSend: function(){
			// console.log( 'Cargando' );
			resetAnimation();
		},
		success: function( response ) {
			$('#home').hide();
			$('#stage').html( response ).fadeIn();
			SITE.rotate_circle('mapa');
			SITE.actual_section	= 'estados';

			tooltips( '#stage #mexico_map path' );

		}
	});
};

var get_mapa_estado = function( estado ){
	$.ajax({
		type: 'GET',
		url: '/templates/maps/template_'+estado+'.html',
		beforeSend: function(){
			//console.log( 'Cargando' );
			resetAnimation();
		},
		success: function( response ) {
			//console.log( response );
			console.log(estado);
			$('#home').hide();
			
			
			$('#stage').html( response ).fadeIn();
			SITE.rotate_circle('estado');
			SITE.actual_section = estado;
			SITE.actual_estado = estado;

			$.ajax({
				type: 'GET',
				contentType : 'application/json',
				url: '/api/'+estado+'.json',
				beforeSend: function(){
					//console.log( '/api/'+estado+'.json' );
				},
				success: function(response){
					var localidad_save = '' ;	
					$('#menudos').data('menu','aaa');								
					var html_table = '';
					var localidad = '';
					var aproved_class = '';
					_.each( response, function( value, key ){
						aproved_class = ( value === 1 ) ? 'aproved' : '';
						//console.log(key);
						var spaceout = key.split(' ').join('_');
						//console.log(spaceout);
						html_table += '<div class="item-localidad" data-municipio="'+spaceout+'"><p>'+key+'</p><div class='+aproved_class+'></div></div>';
					});

					$('#stage #table_estate ').html( html_table );
					$('.table-content').rollbar();
					$('.aproved').on('click', function(){
						$('.item-localidad').removeClass('select_item');
						var allitem = $(this).parent();
						$(allitem).addClass('select_item');
						

						localidad = $(allitem).data('municipio');
						//console.log(localidad);
					});	

					localidad_save =  localidad;
					SITE.actual_municipio = localidad_save;
				}
			});
		}
	});
};

var get_calificacion = function(){
	$.ajax({
		type: 'GET',
		url: '/templates/template_calificacion.html',
		beforeSend: function(){
			resetAnimation();
		},
		success: function(response){
			
			//console.log(response);
			$('#home').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('calificacion');
			SITE.actual_section = 'calificacion';
			SITE.actual_calif = null;
			var calif = null;
			$('.selected_calf').on('click', function(){
				$('.selected').removeClass('on');
				$(this).find('.selected').addClass('on');
				calif = $(this).data('calif');
				//console.log(calif);
				SITE.actual_calif = calif;				
			});
		}
	});
};

var get_tipo_vivienda = function(){
	$.ajax({
		type: 'GET',
		url:'/templates/template_vivienda.html',
		beforeSend:function(){
			console.log('loading');
			resetAnimation();
		} ,
		success: function(response){
			$('#home').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('vivienda');
			SITE.actual_section = 'vivienda';

			$('.item-tipovivienda').on('click', function(a){
				$(this).addClass('on');
				a.preventDefault();
				var tipo = $(this).attr('id');
				//console.log(tipo);
				SITE.actual_vivienda = tipo;
			});
		}
	});
};

var get_rango_precio = function(){
	$.ajax({
		type:'GET',
		url:'/templates/template_precio.html',
		beforeSend:function(){
			//console.log('loading');
			resetAnimation();
		}, 
		success: function(response){
			$('#home').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('precio');
			SITE.actual_section = 'precio';
			SITE.actual_rango = null;
			$('.price_item').on('click', function(a){
				a.preventDefault();
				$('.price_item').removeClass('on');
				var rango_select = $(this).data('precio');
				console.log(rango_select);
				$(this).addClass('on');
				SITE.actual_rango = rango_select;
			});
		}
	});
};

var get_busqueda = function(){
	$.ajax({
		type:'GET',
		url:'/templates/template_busqueda.html',
		beforeSend: function(){
			//console.log('loading');
			resetAnimation();
		}, 
		success: function(response){
			$('#home').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('resultados');
			SITE.actual_section = 'resultados';
			$('.content_table').rollbar();
		}
	});
};	

var get_grafica_resultados = function(){
	$.ajax({
		type:'GET',
		url: '/templates/template_grafica.html',
		beforeSend: function(){
			//console.log('loading');
			resetAnimation();
		}, 
		success: function(response){
			$('#home').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('grafica');
			SITE.actual_section = 'grafica';
			var colors = [['#e9ebbf', '#cccc33'], ['#f4d9ae', '#ff9900'], ['#cce2e8', '#66cccc'], ['#e0e0e0', '#8ba3a6'], ['#eee0b1', '#cc9900']];
            
		    $('.round_graphic').each(function(){ 		    	
		    	var num = $(this).find('.circle').data('percent');
		    	$(this).find('.number').html(num+'<span>%</span>');
		    });

		    for (var i = 1; i <= 5; i++) {
		        var child = document.getElementById('circles-' + i),
		        	percentage = child.dataset.percent;
		                    //$(child).find('.number').html(percentage);

		                Circles.create({
		                    id:         child.id,
		                    percentage: percentage,
		                    radius:     55,
		                    width:      10,
		                    number:     percentage ,
		                    text:       '%',
		                    colors:     colors[i - 1]
		                });
		            }

		    if ($.browser.msie  && parseInt($.browser.version, 10) === 8) {
		  		alert('IE8'); 
			} else {
		  		alert('Non IE8');
			}
		}
	});
};
var show_section_home = function(){
	$('#container').animate({'top':'250px'}, 1000 , 'expo');			
	if(height<=800){
		$('#container').animate({'top':'85px'}, 1000 , 'expo');			
	}
	$('#stage').hide();
	$('#home').fadeIn();
	$('#header-logo').hide();
	$('.line_home').animate({'height':'280px'}, 1000, function(){
		$('.item_left').animate({
			'left': '0px',
			'opacity': 1
		}, 800, 'expo', function(){
			$('.item_right').animate({
				'left': '0px',
				'opacity': 1
			}, 800, 'expo', function(){
				$('#go_init').animate({
					'opacity': 1
				}, 500);
			});
		});
	});
};

/***** BACKBONE ROUTER ***/

var AppRouter = Backbone.Router.extend({
	routes: {
		'': 'home',
		'estados': 'ver_pais',
		'estados/:estado': 'ver_estado',
		'calificacion': 'ver_calificacion',
		'vivienda': 'ver_vivienda',
		'precio': 'ver_precio',
		'busqueda': 'ver_busqueda',
		'grafica': 'ver_grafica',

	}
});

var app_router = new AppRouter();
app_router.on('route:home', function() {
	show_section_home();
});
app_router.on('route:ver_pais', function() {
	get_mapa_mexico();
	SITE.global_sections();
});
app_router.on('route:ver_estado', function( estado ) {
	get_mapa_estado( estado );
});
app_router.on('route:ver_calificacion', function( calificacion ){
	get_calificacion(calificacion);

});
app_router.on('route:ver_vivienda', function(vivienda){
	get_tipo_vivienda(vivienda);
});
app_router.on('route:ver_precio', function(precio){
	get_rango_precio(precio);
});
app_router.on('route:ver_busqueda', function(busqueda){
	get_busqueda(busqueda);
});
app_router.on('route:ver_grafica', function(grafica){
	get_grafica_resultados(grafica);
});
Backbone.history.start({ pushState: true });
$('#stage').on('click', '.home_link', function(a){
	a.preventDefault();

});
/**** ON CLICK EVENTS  ***/
$('#stage').on('click', '#mexico_map path', function(){
	SITE.actual_estado = $(this).data('estado');

	var map_paths = document.querySelectorAll( '#mexico_map path' );
	_.each( map_paths, function( path ){
		path.style.fill = '#84b13c';
	});
	this.style.fill = '#4d6d0c';
});

$('#stage').on('click', '#Entidad path', function(){

	SITE.actual_localidad = $(this).data('municipio');

	var map_municipio = document.querySelectorAll('#Entidad path');
	_.each( map_municipio, function(path){
		path.style.fill = '#84b13c';
	});
	this.style.fill = '#4d6d0c';
});


$('.link-menu').on('click',  function(e){
	e.preventDefault();
	var menu_link = $(this).data('menu');
	console.log(menu_link);
	Backbone.history.navigate(menu_link, true);
});


$('#stage').on('click', '.more_button', function(){
	Backbone.history.navigate('grafica', true);
});	

$('#next').on('click', function(e){
	e.preventDefault();
	
	if( SITE.actual_section === 'home'){	
		Backbone.history.navigate( 'estados' , true );
	}
	if( SITE.actual_section === 'estados'){
		if(SITE.actual_estado === null){
			alert('Selecciona un estado');
			return 0;
		}
		Backbone.history.navigate( 'estados/'+SITE.actual_estado, true );
	}
	if( SITE.actual_section === SITE.actual_estado){
		console.log('im localidad', SITE.actual_municipio);	
		if(SITE.actual_municipio === null){
			alert('seleciona una localidad');
			return 0;
		}
		Backbone.history.navigate( 'calificacion', true);
	} 
	if(SITE.actual_section === 'calificacion'){
		console.log(SITE.actual_calif);
		if(SITE.actual_calif === null){
			alert('Selecciona una calificacion');
			return 0;
		}
		Backbone.history.navigate('vivienda', true);
	}
	if(SITE.actual_section === 'vivienda'){
		console.log(SITE.actual_vivienda);
		if(SITE.actual_vivienda === null){
			alert('Selecciona un tipo de vivienda');
			return 0;
		}
		Backbone.history.navigate('precio', true);
	}
	if(SITE.actual_section === 'precio'){
		if(SITE.actual_rango === null){
			alert('selecciona un rango de precio');
			return 0;
		}
		Backbone.history.navigate('busqueda', true);
	}
	if(SITE.actual_section === 'resultados'){
		console.log('im in ');
		Backbone.history.navigate('grafica', true);
	}

});

$('#go_init').on('click', function(a){
	a.preventDefault();
	Backbone.history.navigate( 'estados' , true );	
});
$('#prev').on('click',  function(e){
	e.preventDefault();
	//navigate.prev_section();
});
$('.selected_calf').on('click', function(){
	$('.selected').removeClass('on');
	$(this).find('.selected').addClass('on');
});

$('.table-content, .content_table, .tip_content').rollbar();


$('.grass').rotate({animateTo: 180}, 100, 'expo');
$('.title_section').rotate({animateTo:360}, 300, 'expo');
$('.modal_button').on('click', function(){
	$('.modal_button').removeClass('active');
	$(this).addClass('active');
});
$('.close_modal').on('click', function(){
	//console.log('click');
    $('.modal_tip').fadeOut(500);
});
$('#link_tips').on('click', function(){
	$('.modal_tip').fadeIn(500, function(){
		$('.content_modal').fadeIn(1000);
	});
});

$('.masterTooltip').tooltips();

var sizeAdjust = function(){
	if(height <= 750){		
		$('#container').animate({'top':'110px'}, 1000, 'expo');
		$('.container_modal').css({'margin':'70px auto'});
		//$('#container').animate({'top':'85px'}, 1000 , 'expo');		
		$('.header_background a img').css({'width':'150px'});
		$('#header').css({'top':'0px'});
		$('.header_background').css({'background-position':'0px -70px'});
		$('#header-logo a').css({'width':'155px'});
		$('.header_background').css({'height':'100px'});
		$('#footer').css({'bottom':'-152px'});
		$('.grass').css({'bottom':'-690px'});
		$('.title_section').css({'bottom':'-790px'});
	} else {
		$('#footer').css({'bottom':'-10px'});
		$('.grass').css({'bottom':'-540px'});
		$('.title_section').css({'bottom':'-625px'});
	}

};

$(window).resize(function(){
	width = $(window).outerWidth();
	height = $(window).outerHeight();

	sizeAdjust();
	console.log(height);
});

sizeAdjust();