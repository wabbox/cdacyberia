/*$(document).ready(function() {
	$('#link_pc').click(function(){
		alert("clic");
	}
}*/

$(document).ready(function(){
	$('#windows').slideDown();
	$('#mac').hide();
	$('#dddd').hide();
	
	$('#telechargement > header > a').click(function(){
		if($(this).attr('id')=="link_pc"){
			$('#windows').slideDown();
			$('#mac').hide();
			$('#dddd').hide();
		} else if($(this).attr('id')=="link_mac"){
			$('#windows').hide();
			$('#mac').slideDown();
			$('#dddd').hide();
		} else if($(this).attr('id')=="link_dddd"){
			$('#windows').hide();
			$('#mac').hide();
			$('#dddd').slideDown();
		}
	}); 
});