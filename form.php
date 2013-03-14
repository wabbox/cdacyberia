<?php
# Déclaration de l'adresse de destination.
$mailto = 'afipperrin@gmail.com'; 

if (!preg_match("#^[a-z0-9._-]+@(hotmail|live|msn).[a-z]{2,4}$#", $mailto)) {
	// On filtre les serveurs qui rencontrent des bogues.
	$passage_ligne = "\r\n";
} else {
	$passage_ligne = "\n";
}

if (!isset($_POST)) {
	$reponse = 'postFalse';
} else {
#Déclaration fonction

#Cette fonction sert à nettoyer et enregistrer un texte
	function Rec($text)
	{
		$text = htmlspecialchars(trim($text), ENT_QUOTES);
		if (1 === get_magic_quotes_gpc())
		{
			$text = stripslashes($text);
		}

		$text = nl2br($text);
		return $text;
	};
#Cette fonction sert à vérifier la syntaxe d'un email
	function IsEmail($email)
	{
		$value = preg_match('/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!\.)){0,61}[a-zA-Z0-9_-]?\.)+[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!$)){0,61}[a-zA-Z0-9_]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/', $email);
		return (($value === 0) || ($value === false)) ? false : true;
	}
	// formulaire envoyé, on récupère tous les champs.
	foreach($_POST as $key=>$value){
		Rec($_POST[$key]);
	}
	extract($_POST);
	$email = (IsEmail($email)) ? $email : ''; // soit l'email est vide si erroné, soit il vaut l'email entré
	if (!empty($nom)&&!empty($prenom)&&!empty($email)&&!empty($message)) {
		//traitement spécifique des champs
	$nom = ucfirst($nom);
	$prenom = ucfirst($prenom);
	$sender = $nom." ".$prenom;
	$title = "CDA contact - ".$objet." - ".$sender;
	// Remplacement de certains caractères spéciaux
		$message = str_replace("&#039;","'",$message);
		$message = str_replace("&#8217;","'",$message);
		$message = str_replace("&quot;",'"',$message);
		$message = str_replace('<br>','',$message);
		$message = str_replace('<br />','',$message);
		$message = str_replace("&lt;","<",$message);
		$message = str_replace("&gt;",">",$message);
		$message = str_replace("&amp;","&",$message);
	//=====Déclaration des messages au format texte et au format HTML.
		$message_html = "<html>
		<head>
		<title>".$title."</title>
		<link href=\"http://".$_SERVER['SERVER_NAME']."/cda/css/mail.css\" rel=\"stylesheet\" type=\"text/css\" />
		<style type=\"text/css\">
		body {
			color: #444540;
			background-color: #EBEBE9;
			font-size: 15px;
		}
		span {
			font-size: 18px;
			font-weight: bold;
		}
		</style>
		</head>
		<body>
		<style type=\"text/css\">
		body {
			color: #444540;
			background-color: #EBEBE9;
			font-size: 15px;
		}
		span {
			font-size: 18px;
			font-weight: bold;
		}
		</style>
		<h1>".$objet."</h1>	
			<ul>
			<li><span>Nom</span> : ".$nom."</li>  
			<li><span>Prénom</span> : ".$prenom."</li>
			<li><span>Société</span> : ".$societe."</li>
			<li><span>Adresse</span> : <ul><li>".$adresse."</li>".$codePostal." ".$ville."<li></li></ul></li>
			<li><span>Numéro téléphone</span> : ".$telephone."</li>
			<li><span>E-mail</span> : ".$email."</li>
			</ul>
			<p><span>Message</span> : ".$message."</p>
		</body>
		</html>
		";
		// nom des champ : nom prenom societe adresse telephone email objet message
		$message_txt = 
			"Objet : ".$objet.$passage_ligne 
			."Nom : ".$nom.$passage_ligne 
			."Prénom : ".$prenom.$passage_ligne
			."Société : ".$societe.$passage_ligne
			."Adresse : ".$adresse." ".$codePostal." ".$ville.$passage_ligne
			."Numéro téléphone : ".$telephone.$passage_ligne
			."E-mail : ".$email.$passage_ligne
			."Message : ".$message.$passage_ligne;
//==========

//=====Création de la boundary
		$boundary = "-----=".md5(rand());
//========== 

//=====Création du header de l'e-mail.
		$header = "From: \"".$sender."\"<".$email.">".$passage_ligne;
		$header.= "Reply-to: \"".$sender."\"<".$email.">".$passage_ligne;
		$header.= "MIME-Version: 1.0".$passage_ligne;
		$header.= "Content-Type: multipart/alternative;".$passage_ligne." boundary=\"$boundary\"".$passage_ligne;
//==========

//=====Création du message.
		$message = $passage_ligne."--".$boundary.$passage_ligne;
//=====Ajout du message au format texte.
		$message.= "Content-Type: text/plain; charset=\"UTF-8\"".$passage_ligne;
		$message.= "Content-Transfer-Encoding: 8bit".$passage_ligne;
		$message.= $passage_ligne.$message_txt.$passage_ligne;
//==========
		$message.= $passage_ligne."--".$boundary.$passage_ligne;
//=====Ajout du message au format HTML
		$message.= "Content-Type: text/html; charset=\"UTF-8\"".$passage_ligne;
		$message.= "Content-Transfer-Encoding: 8bit".$passage_ligne;
		$message.= $passage_ligne.$message_html.$passage_ligne;
//==========
		$message.= $passage_ligne."--".$boundary."--".$passage_ligne;
		$message.= $passage_ligne."--".$boundary."--".$passage_ligne;
//==========

		// Envoi du mail
		if (mail($mailto,$title,$message,$header)) {
			$reponse = 'mailTrue';
		} else {
			$reponse = 'mailFalse';
		}
	} else {
		$reponse = 'noRequired';
	}
}
$array['reponse'] = $reponse;
echo json_encode($array);
?>