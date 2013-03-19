$(document).ready(function(){ 
	// console.log(str);
	var $regionDefault = "rhones_alpes";
	var $regions = $('#regions');
	var $departements = $('#departements');

	// chargement des régions
	$.getJSON('js/region_dept.json', function(data) {
		$.each(data.regions, function(index, value) {
            // on ajoute l option dans la liste
            $regions.append('<option value="'+ value.id_region +'">'+ value.name_region +'</option>');
        	//on met le champs région par défault en select
        	if (value.id_region == $regionDefault) {
        		$("#regions option[value='"+value.id_region+"']").attr("selected","selected");
        	};
        });
	});
	//on met tout à jour avec la région par défault
	listeRegions($regionDefault);

	function listeRegions(id)
	{	
		//avec id de la région on liste les departements dans region_dept.json
		if(id != '') {
			$departements.empty(); // on vide la liste des départements
			$.getJSON('js/region_dept.json', function(data) {
				//selection de la region via id
				region = $.grep(data.regions, function(element, index){
					return element.id_region == id;
				});
				//liste des departements on met a jour le select
				$.each(region, function(i, region){
					for (var i = 0; i < region.departements.length; i++) {
						// on ajoute l option dans la liste des départements
						$departements.append('<option value="'+region.departements[i].code_dep+'">'+region.departements[i].nom_dep+' ('+region.departements[i].code_dep+') </option>');
					}
					// on modifie le h3 région
					$('#refClient h3').empty();
					$('#refClient h3').append(region.name_region);
					//on met a jour la liste des clients
					listeClients(region.departements[0].code_dep);
				});
			});
		}	
	}
	function listeClients(code)
	{
		//met à jour la liste des clients
		var nbclients;
		var newcontent = '';
		$.getJSON("js/clients.json", function(data) {
            //selection du departement
            dept = $.grep(data.departements, function(element, index){
            	return element.code == code;
            });
	        //liste des Clients
	        $.each(dept, function(i, dept){
	        	nbclients = dept.clients.length;
	        	if (nbclients>0) {
	        		newcontent += '<ul class="listClients">';
	        	// on ajoute met à jour la liste
	        	for (var i = 0; i < dept.clients.length; i++) {
	        		newcontent += '<li><p class="nomClient">'+dept.clients[i].nom+' :</p>';
	        		newcontent += '<p class="contactClient">'+dept.clients[i].contact+'</p>';
	        		newcontent += '<p class="villeClient">'+dept.clients[i].ville+'</p></li>';
	        	}
	        	newcontent += '</ul>';
	        	$('#listclients').html(newcontent);
	        	$('.listClients').flexipage({
					perpage:3,
					// pager : false,
					// navigation : true,
					next_txt: "Continue »",
   					prev_txt: "« Back"
				});
	        	// $('#refClient .dept').append(dept.region+" ("+dept.code+")");
	        } else{
	        	newcontent += '<p class="ClientNull">Il n\'a pas encore de client référencié dans ce département</p>';
	       		$('#listclients').html(newcontent);
	        };
	    });
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
