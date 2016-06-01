<?php
#Redirects the user to another page, and sets the error message if there is one
function redirect($destination, $error = NULL){
	if($error){
		$_SESSION["error"]=$error;
	}
	header("Location: $destination");
	die();
}?>