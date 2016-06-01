<?php
header('Content-type: text/html; charset=UTF-8');
function printHead($title){
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?= $title ?></title>
		<!-- instructor-provided CSS and JavaScript links; do not modify -->
		<link href="hw4_images/heart.gif" type="image/gif" rel="shortcut icon"/>
		<link href="nerdluv.css" type="text/css" rel="stylesheet"/>			
	</head>
		
	<body>
		<div id="bannerarea">
			<img src="hw4_images/transparent.png" class="nerdluv" width="64px" height="64px"/>
			<br/>where meek geeks meet
		</div>
<?php }

#prints the bottom of the page, including links to validators and index.php
function printBottom(){?>
		<div>
			<p>This page is for single nerds to meet and date each other!  
			Type in your personal information and wait for the nerdly luv to begin!  
			Thank you for using our site.</p>
			<p>Results and page (C) Copyright NerdLuv Inc.</p>
			<ul>
				<li><a href="index.php">
						<img src="hw4_images/transparent.png" class="back" width="64px" height="64px"/>
						Back to front page
				</a></li>
			</ul>
		</div>
		<div id="w3c">
			<a href="https://webster.cs.washington.edu/validate-html.php">
				<img src="hw4_images/w3c_html.png" alt="Valid HTML" width="71px" height="25px"/>
			</a>
			<a href="https://webster.cs.washington.edu/validate-css.php">
				<img src="hw4_images/w3c_css.png" alt="Valid CSS" width="71px" height="25px"/>
			</a>
		</div>
	</body>
</html>
<script src="proto_homepage_opt.js" type="text/javascript" async="async"></script>
<?php }
	
#checks if an entered name field is empty or only whitespaces	
function validName($_PASSED/*allows use of both $_GET and $_POST*/){
	if(!isset($_PASSED["name"]))
		return false;
	return preg_match("/\S+/", $_PASSED["name"]);
}

#prints an error for invalid data
function printError(){
?>	<h1>Error! Invalid data.</h1>
	<p>We're sorry. You submitted invalid user information. Please go back and try again.</p>
<?php } ?>