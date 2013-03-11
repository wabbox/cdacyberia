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

	//Lorsque vous cliquez sur un lien de la classe poplight et que le href commence par #
	$('a.poplight[href^=#]').click(function() {
	var popID = $(this).attr('rel'); //Trouver la pop-up correspondante
	var popURL = $(this).attr('href'); //Retrouver la largeur dans le href

	//récupération les variables depuis le lien
	var query= popURL.split('?');
	var dim= query[1].split('&');
	var popWidth = dim[0].split('=')[1]; //La première valeur du lien

	//Faire apparaitre la pop-up et ajouter le bouton de fermeture
	$('#' + popID).fadeIn().css({
		'width': Number(popWidth)
	})
	.prepend('<a href"#" class="close"><img src="images/close_pop.png" class="btn_close" tilte="Fermer" alt="Fermer" /></a>');

	//Récupération du margin, qui permettra de centrer la fenêtre - on ajuste de 80px en conformité avec le CSS
	var popMargTop = ($('#' + popID).height() + 80) / 2;
	var popMargLeft = ($('#' + popID).width() + 80) / 2;

	//On affecte le margin
	$('#' + popID).css({
		'margin-top' : -popMargTop,
		'margin-left' : -popMargLeft
	});

	//Effet fade-in du fond opaque
	$('body').append('<div id="fade"></div>'); //Ajout du fond opaque noir
	//Apparition du fond - .css({'filter' : 'alpha(opacity=80)'}) pour corriger les bogues de IE
	$('#fade').css({'filter' : 'alpha(opacity=90)'}).fadeIn();

	return false;
});

//Fermeture de la pop-up et du fond
$('a.close, #fade').live('click', function() { //Au clic sur le bouton ou sur le calque...
	$('#fade , .popup_block').fadeOut(function() {
		$('#fade, a.close').remove();  //...ils disparaissent ensemble
	});
	return false;
});
});