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
	]};
	var regexList={"regex_list":[
	{
		"Name":"message",
		"regex": /^[\s\S]{2,1500}$/
	},
	{
		"Name":"tel",
		"regex": /^(0[1-68-9-7])(?:[ _.-]?(\d{2})){4}$/
	},
	{
		"Name":"email",
		"regex": /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
	},
	{
		"Name":"nom",
		"regex": /^[a-zA-Z0-9_ÁÀÂÄÉÈÊËÍÌÎÏÓÒÔÖÚÙÛÜáàâäéèêëíìîïóòôöúùûüÇç -]{2,24}$/
	},
	{
		"Name":"cp",
		"regex": /^((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}$/
	}
	]};

	$('.tooltip').hide();

	$(':input').keyup(function() {
		var idInput = $(this).attr("id");
		var $idTooltip = $(this).next('.tooltip');
		var $nextp = $(this).parent().next('p');
		
		for (var i in data.input_test) {
			$.each(regexList.regex_list, function(j, regex_list){
				regex = regex_list.regex;
				return (regex_list.Name != data.input_test[i].regex);
			});
			NameJson = data.input_test[i].Name;
			if (NameJson == idInput) {
				if (!regex.test($(this).val())){
					$(this).css('color','#E51A2E');
				} else {
					$(this).css('color','green');
					$(this).removeClass();
					$idTooltip.fadeOut();
					$nextp.css('margin-top', '20px');
					$(this).addClass('correct');
				}
			} 
		};
	});	
$("form").submit(function(){
	$("span").remove(".alert-box");
	$("span").remove(".success-box");
	$('.tooltip').hide();
	$('form p').css('margin-top', '20px');
	valid = true;

	for (var i in data.input_test) {
		var $idInput = $(data.input_test[i].id);
		var $idTooltip = $idInput.next('.tooltip');
		var $nextp = $idInput.parent().next('p');

		$.each(regexList.regex_list, function(j, regex_list){
			regex = regex_list.regex;
			return (regex_list.Name != data.input_test[i].regex);
		});
		if (data.input_test[i].required){
				// pour différencier les champs vides et les champs mal rempli séparer la condition
				if ($idInput.val() == "" && !regex.test($idInput.val())){
					$idTooltip.fadeIn();
					$nextp.css('margin-top', '10px');
					$idInput.addClass('incorrect');
					valid = false;
				} else {
					$idInput.removeClass();
					$idTooltip.fadeOut();
					$nextp.css('margin-top', '20px');
					$idInput.addClass('correct');
				}
			} else {
				if ($idInput.val() != "" && !regex.test($idInput.val())){
					$idTooltip.fadeIn();
					$nextp.css('margin-top', '10px');
					$idInput.addClass('incorrect');
					valid = false;
				} else if ($idInput.val() == "") {
					$idInput.removeClass();
				} else {
					$idInput.removeClass();
					$idTooltip.fadeOut();
					$nextp.css('margin-top', '20px');
					$idInput.addClass('correct');
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
						$('<span class="alert-box">Votre message n\'a pas pu être envoyé. Vérifier vos informations</span>').prependTo($('.block-button'));
					}else {
						$('<span class="alert-box">Votre message n\'a pas pu être envoyé</span>').prependTo($('.block-button'));
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