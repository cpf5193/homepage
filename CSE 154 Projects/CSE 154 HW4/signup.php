<?php header('Content-type: text/html; charset=UTF-8');?>
<?=printHead("Signup"); /*prints the heading from commmon.php*/?>
<div>
	<form action="signup-submit.php" enctype="multipart/form-data" method="post">
		<fieldset>
			<legend>New User Signup: </legend>
			<strong>Name: </strong><input type="text" name="name" size="16"/><br/>
			<strong>Gender: </strong>	 
				<label> <input type="radio" name="gender" value="M"/> Male </label>
				<label> <input type="radio" name="gender" value="F" checked="checked"/> Female </label><br/>
			<strong>Age: </strong><input type="text" name="age" size="6" maxlength="2"/><br/>
			<strong>Personality type: </strong>
				<input type="text" name="personality" size="6" maxlength="4"/>(<a href="http://www.humanmetrics.com/cgi-win/JTypes2.asp">Don't know your type?</a>)<br/>
			<strong>Favorite OS: </strong>
				<select name="os">
					<option value="Windows" selected="selected">Windows</option>
					<option value="Mac OS X">Mac OS X</option>
					<option value="Linux">Linux</option>
				</select><br/>
			<strong>Seeking age: </strong>
				<input type="text" name="seekingmin" size="6" maxlength="2" placeholder="min"/> to 
				<input type="text" name="seekingmax" size="6" maxlength="2" placeholder="max"/><br/>
			<strong>Seek Gender(s): </strong>
				<label><input type="checkbox" name="male" checked="checked"/>Male </label>
				<label><input type="checkbox" name="female"/>Female </label><br/>
			<strong>Photo:</strong>				
				<input type="file" name="photo" /><br/>		
				<input type="submit" value="Sign Up"/>
		</fieldset>
	</form>
</div>
<?=	printBottom(); /*prints the footer from common.php*/?>

<?php
function printHead($title){?>
<!DOCTYPE html>
<html>
	<head>
		<title><?= $title ?></title>
		<!-- instructor-provided CSS and JavaScript links; do not modify -->
		<link href="hw4_images/heart.gif" type="image/gif" rel="shortcut icon"/>
		<link href="signup.css" type="text/css" rel="stylesheet"/>			
	</head>
		
	<body>
		<div id="bannerarea">
			<img src="hw4_images/transparent.png" class="nerdluv" width="64px" height="64px"/>
			<br/>where meek geeks meet
		</div>
<?php }

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
<?php } ?>