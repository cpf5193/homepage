<?php 
header('Content-type: text/html; charset=UTF-8');
if(!isset($_SESSION))
	session_start();
#prints tags up to start of head
function uptohead(){?>
<!DOCTYPE html>
	<html>
		<head><?php
}
#prints the tags from the end of the head to beginning of main div
function uptomain(){ ?>
</head>
<body>
	<div class="headfoot">
		<h1><img src="hw5_images/logo.png" alt="logo" width="80" height="83"/>Remember<br />the Cow</h1>
	</div>
	<div id="main"><?php
}
#Outputs the bottom section of the html for index.php and todolist.php
function afterMain(){ ?>
		</div>
		<div class="headfoot">
			<p>
				"Remember The Cow is nice, but it's a total copy of another site." - PCWorld<br/>
				All pages and content &copy; Copyright CowPie Inc.
			</p>
			<div id="w3c">
				<a href="https://webster.cs.washington.edu/validate-html.php">
					<img src="hw5_images/w3c_html.png" alt="Valid HTML" width="71" height="25"/></a>
				<a href="https://webster.cs.washington.edu/validate-css.php">
					<img src="hw5_images/w3c_css.png" alt="Valid CSS" width="71" height="25"/></a>
			</div>
		</div>
	</body>
</html><?php 
}
#returns the error message
function getError(){
	if(isset($_SESSION["error"]))
		return $_SESSION["error"];
}
#Displays a friendly error message for invalid user actions
function showError($error){ ?>
	<div id="errorMessage"> <?= $error?> </div><?php
	unset($_SESSION["error"]);
}
#Checks whether the user is logged in or not
function loggedIn(){ return (isset($_SESSION["userName"])); }
#Redirects the user to another page, and sets the error message if there is one
function redirect($destination, $error = NULL){
	if($error)
		$_SESSION["error"]=$error;
	header("Location: $destination");
	die();
}
#Prevents unauthorized manual access to different pages
function restrictedAccess(){
	if(!isset($_SESSION))
		redirect("index.php", "Access Restricted: Please Log In");
}	
#destroys the current session and regenerates the id
function clearSession(){
	session_destroy();
	session_regenerate_id(TRUE);
	session_start();
}?>