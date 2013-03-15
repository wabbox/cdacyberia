$(document).ready(function() {
	var data={"input_test":[
	{
		"Name":"nom",
		"id":"#nom",
		"required": true,
		"regex": "nom"
	},
	{
		"Name":"prenom",
		"id":"#prenom",
		"required": true,
		"regex": "nom"
	},
	{
		"Name":"email",
		"id":"#email",
		"required": true,
		"regex": "email"
	},
	{
		"Name":"message",
		"id":"#message",
		"required": true,
		"regex": "message"
	},
	{
		"Name":"codePostal",
		"id":"#codePostal",
		"regex": "cp"
	},
	{
		"Name":"telephone",
		"id":"#telephone",
		"regex": "tel"
	}
	]}
	function styleErreur (id){
		
	};
	$('.tooltip').hide();
	$("form").submit(function(){
		$("span").remove(".alert-box");
		$("span").remove(".success-box");

		valid = true;

		for (var i in data.input_test) {
			id = data.input_test[i].id;
			regex = data.input_test[i].regex;
			if (regex == 'tel'){
				regex = /^(0[1-68-9-7])(?:[ _.-]?(\d{2})){4}$/;
			}
			else if (regex == 'email'){
				regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
			}
			else if (regex == 'nom'){
				regex = /^[a-zA-Z0-9_âäàéèùêëîïô öçñ-]{2,24}$/;
			}
			else if (regex == 'cp'){
				regex = /^((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}$/
			}
			else{
				regex = /^.{2,1500}$/;
			};

			if (data.input_test[i].required){
				// pour différencier les champs vides et les champs mal rempli séparer la condition
				if ($(id).val() == "" && !regex.test($(id).val())){
					$(id).next('.tooltip').fadeIn();
					$(id).addClass('incorrect');
					valid = false;
				} else {
					$(id).removeClass();
					$(id).next('.tooltip').fadeOut();
					$(id).addClass('correct');
				}
			} else {
				if ($(id).val() != "" && !regex.test($(id).val())){
					$(id).next('.tooltip').fadeIn();
					$(id).addClass('incorrect');
					valid = false;
				} else if ($(id).val() == "") {
					$(id).removeClass();
				} else {
					$(id).removeClass();
					$(id).next('.tooltip').fadeOut();
					$(id).addClass('correct');
				}
			}
		};		
		if (valid) {
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