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
	return{
		'site_loaded': site_loaded,
		'actual_section': actual_section,
		'actual_estado': actual_estado,
		'actual_municipio': actual_municipio,
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
			$('#container').animate({'top':'55px'}, 1000 , 'expo');
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
			SITE.actual_municipio = estado;
			
			var municipios_list = [];
			$('#stage .table-content, #stage .content_table').rollbar();
			$('#stage .masterTooltip').each(function(){
				var getTitle  = $(this).attr('title');
				municipios_list.push( getTitle );
			});
			var ul = '';
			$.each(municipios_list, function (index, value) {
				if ( index === 0 )  {
					$('.table_aguascalientes').append(ul);
					ul = $('.items-table');
				}
				var li = $('.item-row p').append(value);
				ul.append(li);
			});
			$('#table_estate').append(ul);
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
			SITE.rotate_circle('estado');
			SITE.actual_section = 'calificacion';
		}
	});
};

var show_section_home = function(){
	
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
Backbone.history.start({ pushState: true });

/**** ON CLICK EVENTS  ***/
$('#stage').on('click', '#mexico_map path', function(){
	SITE.actual_estado = $(this).data('estado');
	var map_paths = document.querySelectorAll( '#mexico_map path' );
	_.each( map_paths, function( path ){
		path.style.fill = '#84b13c';
	});
	this.style.fill = '#4d6d0c';
});

$('#stage').on('click', '#Entidad .masterTooltip', function(){
	SITE.actual_municipio = $('.masterTooltip').attr('title');
	var map_municipio = document.querySelectorAll('#Entidad path') ;
	_.each( map_municipio, function(path){
		path.style.fill = '#84b13c';
	});
	this.style.fill = '#4d6d0c';
});

$('#next').on('click', function(e){
	e.preventDefault();
	console.log( SITE.actual_section );

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
	if( SITE.actual_section === 'estado/'+SITE.actual_estado){
		if(SITE.actual_municipio == null){
			alert('seleciona un municipio');
			return 0;
		}
		Backbone.history.navigate( 'calificacion');
		//console.log('im in this condition');
	} 
	if(SITE.actual_section === 'calificacion'){
		Backbone.history.navigate('calificacion', true);
	}
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
	console.log('click');
    $('.modal_tip').fadeOut(500);
});
$('#link_tips').on('click', function(){
	$('.modal_tip').fadeIn(500, function(){
		$('.content_modal').fadeIn(1000);
	});
});

$('.masterTooltip').tooltips();

/*var sizeAdjust = function(){
	var width = $(window).outerWidth();
	var height = $(window).outerHeight();

	if(height <= 730){
		$('.container_modal').css({'margin':'70px auto'});
		$('#header-logo').css({

		});
	} else {

	}
	if(width <= 980){

	} else {

	}
};

$(window).resize(function(){
	sizeAdjust();
});

sizeAdjust();*/