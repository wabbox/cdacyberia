$(document).ready(function() {
	function  verifInput(idInput){	
		var regex;
		if (idInput == 'telephone'){
			regex = /^(0[1-68-9-7])(?:[ _.-]?(\d{2})){4}$/;
		}
		else if (idInput == 'email'){
			regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
		}
		else if (idInput == 'nom' || idInput == 'prenom'){
			regex = /^[a-zA-Z0-9_âäàéèùêëîïô öçñ-]{2,24}$/;
		}
		else if (idInput == 'codePostal'){
			regex = /^((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}$/
		}
		else{
			regex = /^.{2,1500}$/;
		}
		$('#'+idInput).removeClass();
		var verif;
		if(regex.test($('#'+idInput).val())) {
			$('#'+idInput).addClass('correct');
			$('#'+idInput+' + .tooltip').hide();
			return true;
		} else {
			$('#'+idInput).addClass('incorrect');
			$('#'+idInput+' + .tooltip').show();
			return false;
		}
	}
	$('.tooltip').hide();
	$("form").submit(function(){
		$("span").remove(".alert-box");
		$("span").remove(".success-box");
		var temp;

		$(":input").each(function(){
			if ($(this).attr('class') == "obligatoire") {
				console.log($(this).attr('id'));
			};
			if(verifInput($(this).attr('id'))){
				
				temp = true;
			}
			else
			{
				temp = false;
				return false;
			}
		});
		
		if (temp) {
			$.ajax({
				url: $(this).attr('action'),
				type: $(this).attr('method'),
				data: $(this).serialize(),
				dataType: 'json',
				beforeSend: function () { $('<span class="alertChargement">Envoi en cours</span>').prependTo($('.block-button')); },
				complete: function () { $("span").remove(".alertChargement"); },
				success: function(json) {
					if(json.reponse == 'mailTrue') {
						$('<span class="success-box">Votre message a bien été envoyé</span>').prependTo($('.block-button'));
					}else if(json.reponse == 'noRequired') {
						$('<span class="alert-box">Les informations ont mal été informées</span>').prependTo($('.block-button'));
					}else {
						$('<span class="alert-box">Votre message n\'a pu être envoyé</span>').prependTo($('.block-button'));
					}
				},
			/*error: function(jqXHR, exception) {
				if (jqXHR.status === 0) {
					alert('Not connect.\n Verify Network.');
				} else if (jqXHR.status == 404) {
					alert('Requested page not found. [404]');
				} else if (jqXHR.status == 500) {
					alert('Internal Server Error [500].');
				} else if (exception === 'parsererror') {
					alert('Requested JSON parse failed.');
				} else if (exception === 'timeout') {
					alert('Time out error.');
				} else if (exception === 'abort') {
					alert('Ajax request aborted.');
				} else {
					alert('Uncaught Error.\n' + jqXHR.responseText);
				}
			}*/
		});
};
return false;
});
});