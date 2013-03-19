$(document).ready(function(){ 
	// console.log(str);
	var $regions = $('#regions');
	var $departements = $('#departements');

	// chargement des régions
	$.getJSON('js/region_dept.json', function(data) {
		$.each(data.regions, function(index, value) {
            // on ajoute l option dans la liste
            $regions.append('<option value="'+ value.id_region +'">'+ value.name_region +'</option>');
        });
	});
});
function listeRegions(id)
{	
	console.log(id);
	console.log("passage en fonction");
	$(document).ready(function(){ 
		var $regions = $('#regions');
		var $departements = $('#departements');
		if(id != '') {
			$departements.empty(); // on vide la liste des départements
			$.getJSON('js/region_dept.json', function(data) {
				//selection de la region via str

				region = $.grep(data.regions, function(element, index){
					return element.id_region == id;
				});
				//liste des departements
				$.each(region, function(i, region){
					for (var i = 0; i < region.departements.length; i++) {
						// on ajoute l option dans la liste des départements
						$departements.append('<option value="'+region.departements[i].code_dep+'">'+region.departements[i].nom_dep+' ('+region.departements[i].code_dep+') </option>');
					}
					$('#refClient h3').empty();
					$('#refClient h3').append(region.name_region);

				});
			});
			/*var code = $departements.val(); // on récupère la valeur de la région
    		alert(code);
    		listeClients(code);*/
    	}	
	});
}
$(document).ready(function(){ 
	var $regions = $('#regions');
	var $departements = $('#departements');
	function listeClients(code)
	{
		$.getJSON("js/clients.json", function(data) {
            //selection du departement
            dept = $.grep(data.departements, function(element, index){
            	return element.code == code;
        });
        var nbclients;
        $('#refClient ul').empty();
        $('#refClient .dept').empty();
        //liste des Clients
        $.each(dept, function(i, dept){
        	nbclients = dept.clients.length;
        	$('#refClient .dept').append(dept.region+" ("+dept.code+")");
        	for (var i = 0; i < dept.clients.length; i++) {
				// on ajoute l option dans la liste des départements
				$('#refClient ul').append('<li><p class="nomClient">'+dept.clients[i].nom+' :</p><p class="contactClient">'+dept.clients[i].contact+'</p><p class="villeClient">'+dept.clients[i].ville+'</p></li>');
			}
		});
            if (!nbclients) {
            	console.log("aucun client");
            } else if (nbclients == 1) {
            	console.log("1 client");
            } else {
            	console.log(nbclients+" clients")
            }
        });
	}
	// à la sélection d une région dans la liste
	$regions.on('change', function() {
    	var str = $(this).val(); // on récupère la valeur de la région
    	listeRegions(str);
    });	
	// à la sélection d un département dans la liste
	$departements.on('change', function() {
    	var code = $(this).val(); // on récupère la valeur de la région
    	listeClients(code);
    });	
});