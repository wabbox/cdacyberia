$(document).ready(function(){ 
	var $regionDefault = "69";
	var $regions = $('#regions');
	var $departements = $('#departements');
	var map
	map = new jvm.WorldMap({
		container: $('#vmap'),
		map: 'fr_merc_en',
    backgroundColor: 'transparent',
    regionsSelectableOne: true,
    regionStyle: {
      initial: {
        "fill-opacity": 1,
        stroke: '#FFFFFF',
        "stroke-width": 0.1,
        "stroke-opacity": 1
      },
      hover: {
        fill: '#5097CD'
      },
      selected: {
        fill: '#5097CD'
      },
      selectedHover: {
        "fill-opacity": 0.9
      }
    },
    series: {
      regions: [{
        attribute: 'fill'
      }]
    },
    onRegionLabelShow: function(e, el, code){
      el.html(el.html()+' ('+code+')');
    },
    onRegionClick: function(element, code, region)
    {
      listeSelect(code);
      listeClients(code);
    },
    onRegionSelected: function(code){
      if (window.localStorage) {
        window.localStorage.setItem(
         'jvectormap-selected-regions',
         JSON.stringify(map.getSelectedRegions(code))
         );
      }
    }
  });
  map.series.regions[0].setValues(couleurs);
  if (window.localStorage) {
    map.setSelectedRegions( JSON.parse( window.localStorage.getItem('jvectormap-selected-regions') || '[]' ) );
  } 
  if (map.getSelectedRegions()!='') {
    listeSelect(map.getSelectedRegions());
    listeClients(map.getSelectedRegions());
  } else{
    listeSelect($regionDefault);
    listeClients($regionDefault);
  };


  function listeSelect(code) {
    var idRegion;
    var idDept;
    $regions.empty();
    $departements.empty();
    $.getJSON('js/region_dept.json', function(data) {
      $.each(data.regions, function(key, val)
      {
        $regions.append('<option value="'+ val.id_region +'">'+ val.name_region +'</option>');
        $.each(val, function(key2, val2)   
        {
          for (var i in val2) {
            if (val2[i].code_dep==code) {
              $("#regions option[value='"+val.id_region+"']").attr("selected","selected");
              idRegion = val.id_region;
            };
          };
        });
        region = $.grep(data.regions, function(element, index){
          return element.id_region == idRegion;
        });
      });
        //liste des departements on met a jour le select
        $.each(region, function(i, region){
          for (var i = 0; i < region.departements.length; i++) {
            // on ajoute l option dans la liste des départements
            $departements.append('<option value="'+region.departements[i].code_dep+'">'+region.departements[i].nom_dep+' ('+region.departements[i].code_dep+') </option>');
            if (region.departements[i].code_dep == code) {
              $("#departements option[value='"+region.departements[i].code_dep+"']").attr("selected","selected");
            };
          }
          // on modifie le h3 région
          $('#refClient h3').empty();
          $('#refClient h3').append(region.name_region);

        });

      });
}
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
					//onretourne le code du premier dept de la liste
					listeClients(region.departements[0].code_dep);
				});
			});
		}	
	}
	function listeClients(code)
	{
    map.clearSelectedRegions();
    map.setSelectedRegions(code);
		//met à jour la liste des clients
		var nbclients;
		var newcontent = '';
		var perpage = 5;
		$.getJSON("js/clients.json", function(data) {
            //selection du departement
            dept = $.grep(data.departements, function(element, index){
            	return element.code == code;
            });
	        //liste des Clients
	        $.each(dept, function(i, dept){
	        	nbclients = dept.clients.length;
	        	//on met a jour l'affichage du département
	        	$('.dept').text(dept.region+" ("+dept.code+")");
	        	if (nbclients>0) {
	        		newcontent += '<ul class="listClients">';
		        	// on ajoute met à jour la liste
		        	for (var i = 0; i < dept.clients.length; i++) {
		        		newcontent += '<li><p class="nomClient">'+dept.clients[i].nom+' :</p>';
		        		newcontent += '<p class="contactClient">'+dept.clients[i].contact+'</p>';
		        		newcontent += '<p class="villeClient">'+dept.clients[i].ville+'</p></li>';
		        	}
		        	newcontent += '</ul>';
		        	$('#listClients').html(newcontent);
		        	if (nbclients>perpage) {
		        		$('.listClients').flexipage({
		        			perpage: perpage,
		        			pager : false,
		        			navigation : true
		        		});
		        	};
		        } else {
		        	newcontent += '<p class="clientNull">Il n\'a pas encore de client référencié dans ce département</p>';
		        	$('#listClients').html(newcontent);
		        };
          });
});
//on scroll pour bien afficher la div
$('html, body').animate({  
  scrollTop:$('#content section').offset().top-20+'px'  
}, 'slow');
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
  .prepend('<a href"#" class="close"><img src="images/picto/close.png" class="btn_close" tilte="Fermer" alt="Fermer" /></a>');

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
