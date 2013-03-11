$(document).ready(function(){	
function bgVisible(){
	$('.link_windows').removeClass('link_windows_focus');
	$('.link_mac').removeClass('link_mac_focus');
	$('.link_dddd').removeClass('link_dddd_focus');
}

	$('#mac').hide();
	$('#dddd').hide();
	$('.link_windows').addClass('link_windows_focus');

	$('#telechargement > header > a').click(function(){
		var_id = $(this).attr("href")
		if($(var_id).css('display') != 'block'){
			bgVisible();
			$(this).addClass('link_'+var_id.substr(1,8)+'_focus');
			$("#telechargement > section:visible").slideUp("",function(){
				$(var_id).slideDown();
			});
		}
	}); 
});