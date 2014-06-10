
var sizeAdjust = function(){
	var width = $(window).outerWidth();
	var height = $(window).outerHeight();

	if(height <= 750){
		
		$('.container_modal').css({'margin':'70px auto'});
		$('#container').animate({'top':'85px'}, 1000 , 'expo');		
		$('.header_background a img').css({'width':'150px'});
		$('#header').css({'top':'0px'});
		$('.header_background').css({'background-position':'0px -50px'});
		$('#header-logo a').css({'width':'190px'});
		$('.header_background').css({'height':'120px'});
	} else {
/*$('#container').animate({'top':'0px'}, 1000 , 'expo');		
	if(height <= 750){
		$('#container').animate({'top':'-55px'}, 1000, 'expo');
	}*/
	}
	if( height <= 980){

	} else {

	}
}

$(window).resize(function(){
	sizeAdjust();
});

sizeAdjust();
