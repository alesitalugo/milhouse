'use strict';
/* jshint camelcase: false */
/* global Backbone, _, alert, Circles */
var height = $(window).outerHeight();
var sizeAdjust = function(){
	$('.price_list').height(height-300);
	$('.content_table').height(height-320);
	if(height <= 801){
		$('#footer').css({'bottom':'-243px'});
		$('.grass').css({'bottom':'-70px'});
		$('.title_section').css({'bottom':'-71px'});
		$('.nav_menu .arrow').css({'top':'-55px'});
		$('#patrocinadores').css({'position': 'relative','top': '-160px'});
		$('#wrap').css({'top':'13%'});
		$('#add_title').css({'top':'16px'});
		$('#nav').css({'top':'3%'});
		$('#section_six').css({'top': '30px'});
	} else {
		$('#wrap').css({'top':'16%'});
		$('#nav').css({'top':'15%'});
		$('#footer').css({'bottom':'-180px'});
		$('.grass').css({'bottom':'-10px'});
		$('.title_section').css({'bottom':'-10px'});
		$('.content_table').height(height-470);
		$('#section_six').css({'top': '0px'});
	}
};
$(window).resize(function(){
	height = $(window).outerHeight();
	$('.price_list').height(height-300);
	$('.content_table').height(height-320);
	sizeAdjust();
});
$(window).load(function(){
	$('.price_list').height(height-300);
	$('.content_table').height(height-320);
	sizeAdjust();
});
sizeAdjust();

var resetAnimation = function(){
	$('#wrap').css({'top':'-100%'});
	$('.print_button').hide();
};

var SITE = (function(){
	var site_loaded = false;
	var actual_section = 'home';
	var actual_estado = null;
	var actual_municipio = null;
	var actual_calif = null;
	var actual_vivienda = null;
	var actual_rango = null;
	var actual_resultado = null;
	return{
		'site_loaded': site_loaded,
		'actual_section': actual_section,
		'actual_estado': actual_estado,
		'actual_municipio': actual_municipio,
		'actual_calif': actual_calif,
		'actual_vivienda': actual_vivienda,
		'actual_rango': actual_rango,
		'actual_resultado': actual_resultado,

		global_sections: function(){
			$('#header-logo').animate({'top':'0px'}, 500, 'expo');
		},
		take_pills: function( section, option ){
			var pills = $('#take_pills .menu-item');
			var show_pills = true;
			if( option === 'show' ){
				_.each( pills, function( pill ){
					if( show_pills ){
						$(pill).fadeIn();
					} else{
						$(pill).fadeOut();
					}
					if ( pill.firstElementChild.getAttribute('data-menu') === section ){
						show_pills = false;
					}
				});
			}
			if( option === 'hide' ){
				show_pills = false;
				_.each( pills.get().reverse(), function( pill ){
					if( !show_pills ){
						$(pill).fadeOut();
					}
					if( section !== 'home' ){
						if ( pill.firstElementChild.getAttribute('data-menu') === section ){
							show_pills = false;
						}
					}
				});
			}
		},
		rotate_circle: function( section ){
			$('#add_title').removeClass().addClass(section);
			$('#button_'+section).fadeIn();
			if(height <= 801){
				$('#wrap').animate({'top':'12%'}, 1000, 'expo');
			} else {
				$('#wrap').animate({'top':'20%'}, 1000, 'expo');
			}
		}
	};
}());

var tooltips = function( svg, tipo ){
	var paths = document.querySelectorAll( svg );
	var tooltip_svg = document.querySelector('.tooltip_svg');
	_.each( paths, function( path ){
		path.onmouseover = function(){
			var tooltip_text = ( tipo === 'estados') ? path.getAttribute('data-estado') : path.getAttribute('data-municipio');
			tooltip_svg.innerHTML = tooltip_text;
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

var wonder_cities_power_activate = function( municipios ){
	var paths = document.querySelectorAll( '#stage #Entidad path' );
	_.each( municipios, function( municipio ){
		_.each( paths, function( path ){
			if ( path.getAttribute('data-municipio') === municipio ){
				path.setAttribute('class', 'path_active');
			}
		});
	});
};

/***** AJAX REQUEST ***/
var get_mapa_mexico = function(){
	$.ajax({
		type: 'GET',
		url: '/templates/template_mapa.html',
		beforeSend: function(){
			resetAnimation();
		},
		success: function( response ) {
			$('#home').hide();
			$('#branches-top').hide();
			$('#stage').html( response ).fadeIn();
			SITE.rotate_circle('mapa');
			SITE.actual_section	= 'estados';

			tooltips( '#stage #mexico_map path', 'estados' );
			$('#prev').fadeIn(500);
		}
	});
};

//RECORDAR PONER EL PARSE JSON 

var get_mapa_estado = function( estado ){
	$.ajax({
		type: 'GET',
		url: '/templates/maps/template_'+estado+'.html',
		beforeSend: function(){
			resetAnimation();
		},
		success: function( response ) {
			$('#home').hide();
			$('#branches-top').hide();
			$('#stage').html( response ).fadeIn();
			SITE.rotate_circle('estado');
			SITE.actual_section = 'municipios';
			SITE.actual_estado = estado;

			tooltips( '#stage #Entidad path', 'municipios' );

			$.ajax({
				type: 'GET',
				contentType : 'application/json',
				url: '/api/'+estado+'.json',
				beforeSend: function(){
				},
				success: function(response){
					var html_table = '';
					var localidad = '';
					var aproved_class = '';
					var municipios_calidad = [];
					_.each( response, function( value, key ){
						var spaceout = key.split(' ').join('_');
						if( value === 1 ){
							aproved_class = 'aproved';
							municipios_calidad.push( spaceout.toLowerCase() );
						} else {
							aproved_class = '';
						}
						html_table += '<div class="item-localidad" data-municipio="'+spaceout+'"><p>'+key+'</p><div class='+aproved_class+'></div></div>';
					});

					wonder_cities_power_activate( municipios_calidad );
					$('#stage #table_estate ').html( html_table );
					$('.table-content').rollbar();
					$('.aproved').on('click', function(){
						$('.item-localidad').removeClass('select_item');
						var allitem = $(this).parent();
						var paths = document.querySelectorAll( '#stage #Entidad path' );
						$(allitem).addClass('select_item');
						localidad = $(allitem).data('municipio');
						localidad = localidad.split(' ').join('_').toLowerCase();
						var selected = _.find( paths , function( path ){ return path.getAttribute('data-municipio') === localidad; });
						if( selected ){
							selected.style.fill = '#4d6d0c';
						}
						SITE.actual_municipio = localidad;
					});
					
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
			$('#home').hide();
			$('#branches-top').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('calificacion');
			SITE.actual_section = 'calificacion';
			SITE.actual_calif = null;
			var calif = null;
			$('.selected_calf').on('click', function(){
				$('.selected').removeClass('on');
				$(this).find('.selected').addClass('on');
				calif = $(this).data('calif');
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
			resetAnimation();
		},
		success: function(response){
			$('#home').hide();
			$('#branches-top').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('vivienda');
			SITE.actual_section = 'vivienda';

			$('.item-tipovivienda').on('click', function(a){
				$(this).addClass('on');
				a.preventDefault();
				var tipo = $(this).attr('id');
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
			resetAnimation();
		},
		success: function(response){
			$('#home').hide();
			$('#branches-top').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('precio');
			SITE.actual_section = 'precio';
			SITE.actual_rango = null;
			$('.price_item').on('click', function(a){
				a.preventDefault();
				$('.price_item').removeClass('on');
				var rango_select = $(this).data('precio');
				$(this).addClass('on');
				SITE.actual_rango = rango_select;
			});
			$('.price_list').height(height-300);
			$('.price_list').rollbar();
		}
	});
};

var get_busqueda = function(){
	$.ajax({
		type:'GET',
		url:'/templates/template_busqueda.html',
		beforeSend: function(){
			resetAnimation();
		},
		success: function(response){
			$('#home').hide();
			$('#branches-top').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('busqueda');
			SITE.actual_section = 'busqueda';
			
			$('.content_table').height(height-470);

			$('.content_table').rollbar();
			$('.more_button').on('click', function(){
				$('.precio_column .more_button').removeClass('active');
				$(this).addClass('active');
			});
			var findResultado = $('.body_table').find('active');
		}
	});
};

var get_grafica_resultados = function(){
	$.ajax({
		type:'GET',
		url: '/templates/template_grafica.html',
		beforeSend: function(){
			resetAnimation();
		},
		success: function(response){
			$('#next').fadeIn(500);
			$('#home').hide();
			$('#branches-top').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('resultados');
			SITE.actual_section = 'resultados';
			var colors = [['#e9ebbf', '#cccc33'], ['#f4d9ae', '#ff9900'], ['#cce2e8', '#66cccc'], ['#e0e0e0', '#8ba3a6'], ['#eee0b1', '#cc9900']];
            
		    $('.round_graphic').each(function(){
				var num = $(this).find('.circle').data('percent');
				$(this).find('.number').html(num+'<span>%</span>');
		    });

		    for(var i = 1; i <= 3; i++){
		        var child = document.getElementById('circles-'+i);
		        var percentage = child.getAttribute('data-percent');
		        Circles.create({
					id: child.getAttribute('id'),
					percentage: percentage,
					radius: 55,
					width: 10,
					number: percentage,
					text: '%',
					colors: colors[i - 1],
		        });
		    }
		}
	});
};
var get_caracteristicas = function(){
	$.ajax({
		type:'GET',
		url:'templates/template_caracteristicas.html',
		beforeSend:function(){
			resetAnimation();
		},
		success: function(response){
			$('#home').hide();
			$('#branches-top').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('caracteristicas');
			SITE.actual_section  = 'caracteristicas';
			$('.menu-item').addClass('menuon');
		}
	});
};

var get_materiales = function(){
	$.ajax({
		type:'GET',
		url:'templates/template_materiales.html',
		beforeSend: function(){
			resetAnimation();
		},
		success: function(response){
			$('#branches-top').hide();
			$('#home').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('materiales');
			SITE.actual_section = 'materiales';
			$('.contenido_de_la_tabla').rollbar();
			$('.menu-item').addClass('menuon');
			$('#close_modal').on('click', function(){
				$('#modal_box').fadeOut(500);
			});
			$('.print_button').fadeOut();
			$('#next').show();
		}
	});
};
var get_ecotecnologias = function(){
	$.ajax({
		type:'GET',
		url:'templates/template_ecotecnologias.html',
		beforeSend: function(){
			resetAnimation();
		},
		success: function(response){
			$('#next').hide();
			$('#branches-top').hide();
			$('#home').hide();
			$('#stage').html(response).fadeIn();
			SITE.rotate_circle('ecotecnologias');
			SITE.actual_section = 'ecotecnologias';
			$('.contenido_de_la_tabla').rollbar();
			$('.menu-item').addClass('menuon');
			$('#close_modal').on('click', function(){
				$('#modal_box').fadeOut(500);
			});
			$('.print_button').fadeIn(500, function(){});
		}
	});
};

var animateHome = function(){
	$('#branches-top').show();
	$('.item_left').animate({
		'left':'0px',
		'opacity':1
	}, 2000, 'expo', function(){
		$('.item_right').animate({
			'left':'0px',
			'opacity':1
		},1000, 'expo', function(){
			$('#patrocinadores').fadeIn(1000);
			$('#go_init').animate({
				'opacity':1
			}, 600, 'expo');
		});
	});
};

var show_section_home = function(){
	SITE.take_pills( 'home', 'hide' );
	SITE.actual_section = 'home';
	SITE.rotate_circle('home');
	$('#prev').hide();
	animateHome(2000);
	$('#stage').hide();
	$('#home').fadeIn();
	$('#header-logo').css({'top':'-200px'});
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
		'resultados': 'ver_resultados',
		'materiales':'ver_materiales',
		'caracteristicas': 'ver_caracteristicas',
		'ecotecnologias': 'ver_ecotecnologias',
	}
});

var app_router = new AppRouter();
app_router.on('route:home', function() {
	show_section_home();
});
app_router.on('route:ver_pais', function() {
	get_mapa_mexico();
	SITE.take_pills('estados', 'show');
	SITE.global_sections();
});
app_router.on('route:ver_estado', function( estado ) {
	SITE.take_pills('municipio', 'show');
	get_mapa_estado( estado );
});
app_router.on('route:ver_calificacion', function( calificacion ){
	get_calificacion(calificacion);
	SITE.take_pills('calificacion', 'show');
	SITE.global_sections();
});
app_router.on('route:ver_vivienda', function(vivienda){
	SITE.take_pills('vivienda', 'show');
	get_tipo_vivienda(vivienda);
});
app_router.on('route:ver_precio', function(precio){
	SITE.take_pills('precio', 'show');
	get_rango_precio(precio);
});
app_router.on('route:ver_busqueda', function(busqueda){
	SITE.take_pills('busqueda', 'show');
	get_busqueda(busqueda);
});
app_router.on('route:ver_resultados', function(resultados){
	SITE.take_pills('resultados', 'show');
	get_grafica_resultados(resultados);
});
app_router.on('route:ver_materiales', function(materiales){
	get_materiales(materiales);
});
app_router.on('route:ver_caracteristicas', function(caracteristicas){
	get_caracteristicas(caracteristicas);
});
app_router.on('route:ver_ecotecnologias', function(ecotecnologias){
	get_ecotecnologias(ecotecnologias);
});
Backbone.history.start({ pushState: true });

$('#header-logo').on('click', '.home_link', function(a){
	a.preventDefault();
	SITE.take_pills( 'home', 'hide' );
	SITE.actual_section = 'home';
	SITE.rotate_circle('home');
	$('#next').fadeIn(500);
	$('#prev').fadeOut(500);
	Backbone.history.navigate('', true);
	resetAnimation();
	return false;
});
$('#link_home').on('click', function(e){
	e.preventDefault();
	SITE.take_pills( 'home', 'hide' );
	SITE.actual_section = 'home';
	$('#next').fadeIn(500);
	SITE.rotate_circle('home');
	$('#prev').fadeOut(500);
	Backbone.history.navigate('', true);
	return false;
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
	SITE.actual_municipio = $(this).data('municipio');
	var map_municipio = document.querySelectorAll('#Entidad path.path_active');
	_.each( map_municipio, function(path){
		path.style.fill = '#84b13c';
	});
	if( this.hasAttribute('class') ){
		var table_items = $('#stage #table_estate .item-localidad');
		table_items.removeClass('select_item');
		var municipio = this.getAttribute(municipio);
		this.style.fill = '#4d6d0c';
		_.each( table_items, function( table_item ){
			if( table_item.dataset.municipio.toLowerCase() === municipio ){
				$(table_item).addClass('select_item');
			}
		});
	}
});

$('.link-menu').on('click',  function(e){
	e.preventDefault();
	resetAnimation();
	$('#next').show();
	$('#prev').show();
	var menu_link = $(this).data('menu');
	SITE.take_pills( menu_link, 'hide');
	if( menu_link === 'municipio' ){
		Backbone.history.navigate('estados/'+SITE.actual_estado, true);
	} else {
		Backbone.history.navigate(menu_link, true);
	}
});

$('#go_init').on('click', function(a){
	a.preventDefault();
	Backbone.history.navigate( 'estados' , true );
});

$('#next').on('click', function(e){
	e.preventDefault();
	//SITE.rotate_circle_next();
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
	if( SITE.actual_section === 'municipios'){
		if(SITE.actual_municipio === null){
			alert('seleciona una localidad');
			return 0;
		}
		Backbone.history.navigate( 'calificacion', true);
	}
	if(SITE.actual_section === 'calificacion'){
		if(SITE.actual_calif === null){
			alert('Selecciona una calificacion');
			return 0;
		}
		Backbone.history.navigate('precio', true);
	}
	if(SITE.actual_section === 'precio'){
		
		Backbone.history.navigate('vivienda', true);
	}
	if(SITE.actual_section === 'vivienda'){
		if(SITE.actual_vivienda === null){
			alert('Selecciona un tipo de vivienda');
			return 0;
		}
		Backbone.history.navigate('busqueda', true);
	}
	if(SITE.actual_section === 'busqueda'){
		var active = $('.precio_column .more_button').hasClass('active');

		if(active === false){
			alert('Selecciona un resultado');

			return 0;
		}
		Backbone.history.navigate('resultados', true);
	}
	if(SITE.actual_section === 'resultados'){
		Backbone.history.navigate('caracteristicas', true);
	}
	if(SITE.actual_section === 'caracteristicas'){
		Backbone.history.navigate('materiales', true);
	}
	if(SITE.actual_section === 'materiales'){
		Backbone.history.navigate('ecotecnologias', true);
	}
});
$('#prev').on('click', function(e){
	e.preventDefault();
	//SITE.rotate_circle_prev();
	if(SITE.actual_section === 'ecotecnologias'){
		Backbone.history.navigate('materiales', true);
	}
	if(SITE.actual_section === 'materiales'){
		Backbone.history.navigate('caracteristicas', true);
	}
	if(SITE.actual_section === 'caracteristicas'){
		Backbone.history.navigate('resultados', true);
	}
	if(SITE.actual_section === 'resultados'){
		Backbone.history.navigate('busqueda', true);
	}
	if(SITE.actual_section === 'busqueda'){
		Backbone.history.navigate('vivienda', true);
	}
	if(SITE.actual_section === 'vivienda'){
		Backbone.history.navigate('precio', true);
	}
	if(SITE.actual_section === 'precio'){
		Backbone.history.navigate('calificacion', true);
	}
	if(SITE.actual_section === 'calificacion'){
		Backbone.history.navigate('estados/'+SITE.actual_estado, true);
	}
	if(SITE.actual_section === 'municipios'){
		Backbone.history.navigate('estados', true);
	}
	if(SITE.actual_section === 'estados'){
		Backbone.history.navigate('', true);
	}
});
//funcion de flechas de teclado para anterior y siguiente 

$(window).keydown(function(e){
	
	if(e.keyCode === 39){
		e.preventDefault();
		//SITE.rotate_circle_next();
		if(SITE.actual_section === 'home'){
			Backbone.history.navigate('estados', true);
		}
		if(SITE.actual_section === 'estados'){
			if(SITE.actual_estado === null){
				alert('Selecciona un estado');
				return 0;
			}
			Backbone.history.navigate('estados/'+SITE.actual_estado, true);
		}
		if (SITE.actual_section === 'municipios') {
			if(SITE.actual_municipio === null){
				alert('selecciona un municipio');
				return 0;
			}
			Backbone.history.navigate('calificacion', true);
		}
		if(SITE.actual_section === 'calificacion'){
			if(SITE.actual_calif === null){
				alert('Selecciona una calificación');
				return 0;
			}
			Backbone.history.navigate('precio', true);
		}
		if(SITE.actual_section === 'precio'){
			Backbone.history.navigate('vivienda', true);
		}
		if(SITE.actual_section === 'vivienda'){
			if(SITE.actual_vivienda === null){
				alert('selecciona un tipo de vivienda');
				return 0;
			}
			Backbone.history.navigate('busqueda', true);
		}
		if(SITE.actual_section === 'busqueda'){
			var active = $('.precio_column .more_button').hasClass('active');
			if(active === false){
				alert('Selecciona un resultado');
				return 0;
			}
			Backbone.history.navigate('resultados', true);
		}
		if(SITE.actual_section === 'resultados'){
			Backbone.history.navigate('caracteristicas', true);
		}
		if(SITE.actual_section === 'caracteristicas'){
			Backbone.history.navigate('materiales', true);
		}
		if(SITE.actual_section === 'materiales'){
			Backbone.history.navigate('ecotecnologias', true);
		}
	}
	if(e.keyCode === 37 ){
		e.preventDefault();
		//SITE.rotate_circle_prev();
		if(SITE.actual_section === 'ecotecnologias'){
			Backbone.history.navigate('materiales', true);
		}
		if(SITE.actual_section === 'materiales'){
			Backbone.history.navigate('caracteristicas', true);
		}
		if(SITE.actual_section === 'caracteristicas'){
			Backbone.history.navigate('resultados', true);
		}
		if(SITE.actual_section === 'resultados'){
			Backbone.history.navigate('busqueda', true);
		}
		if(SITE.actual_section === 'busqueda'){
			Backbone.history.navigate('vivienda', true);
		}
		if(SITE.actual_section === 'vivienda'){
			Backbone.history.navigate('precio', true);
		}
		if(SITE.actual_section === 'precio'){
			Backbone.history.navigate('calificacion', true);
		}
		if(SITE.actual_section === 'calificacion'){
			Backbone.history.navigate('estados/'+SITE.actual_estado, true);
		}
		if(SITE.actual_section === 'municipios'){
			Backbone.history.navigate('estados', true);
		}
		if(SITE.actual_section === 'estados'){
			Backbone.history.navigate('', true);
		}
	}
});


$('.selected_calf').on('click', function(){
	$('.selected').removeClass('on');
	$(this).find('.selected').addClass('on');
});

$('#stage').on('click', '.buttons_item', function(a){
	a.preventDefault();
	$('.modal_caracteristicas').fadeIn(500);
});

$('.modal_button').on('click', function(){
	$('.modal_button').removeClass('active');
	$(this).addClass('active');
	$('.tip_content').rollbar();
	$('.tip_modal').removeClass('active_modal');
	var is_modal = $(this).data('show-modal');
	$('#tips_'+is_modal).addClass('active_modal');
});

$('.close_modal_tips').on('click', function(){
	$('.modal_tip').fadeOut(500);
});

$('#link_tips').on('click', function(){
	$('.modal_tip').fadeIn(500, function(){
		$('.content_modal').fadeIn(1000);
	});
	$('.tip_content').rollbar();
});