$(document).ready(function(){
	$('#windows').slideDown();
	$('#mac').hide();
	$('#dddd').hide();
function bgVisible(){
	if ($('#windows').is(':visible')) {
		$('.link_pc').css('background-image', 'url(images/picto-telechargements/pc_focus.png)');
	} else {
		$('.link_pc').css('background-image', 'url(images/picto-telechargements/pc_blur.png)');
	}
	if ($('#mac').is(':visible')) {
		$('.link_mac').css('background-image', 'url(images/picto-telechargements/mac_focus.png)');		
	} else {
		$('.link_mac').css('background-image', 'url(images/picto-telechargements/mac_blur.png)');
	}
	if ($('#dddd').is(':visible')) {
		$('.link_dddd').css('background-image', 'url(images/picto-telechargements/4d_focus.png)');		
	} else {
		$('.link_dddd').css('background-image', 'url(images/picto-telechargements/4d_blur.png)');
	}
}

	bgVisible();
	
	$('#telechargement > header > a').click(function(){
		if($(this).attr('class')=="link_pc"){
			$('#windows').slideDown();
			$('#mac').hide();
			$('#dddd').hide();
		} else if($(this).attr('class')=="link_mac"){
			$('#windows').hide();
			$('#mac').slideDown();
			$('#dddd').hide();
		} else if($(this).attr('class')=="link_dddd"){
			$('#windows').hide();
			$('#mac').hide();
			$('#dddd').slideDown();
		}
		bgVisible();
	}); 
});