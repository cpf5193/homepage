<?php
	session_start();
	include("redirect.php");
	header("Connection: keep-alive");
	if(!isset($_SESSION)||!isset($_POST["username"])||!isset($_POST["password"])){
		redirect("index.php",  "Please Log In");
	}
	$username = htmlspecialchars($_POST["username"]);
	$password = htmlspecialchars($_POST["password"]);
	$valid = file("authorized.txt");
	$matches = "false";
	for($i=0; $i<count($valid); $i++){
		if(trim($valid[$i])==$username.":".$password){
			$matches = "true";
			$i=count($valid);
			$_SESSION["username"] = "set";
			$_SESSION["password"] = "set";
		}
	}
	if($matches=="true"){
		redirect("mainpage.php");
	}
	else{
		redirect("index.php", "Incorrect login credentials");
	}
?>