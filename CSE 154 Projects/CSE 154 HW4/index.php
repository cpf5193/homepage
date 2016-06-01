<?php
header('Content-type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Index</title>
		<link href="hw4_images/heart.gif" type="image/gif" rel="shortcut icon"/>
		<style>
		* {font-size: 12pt; font-family: "Verdana", "Geneva", sans-serif;}
		a {color: #F44; text-decoration: none;}
		a:hover {background-color: #FFA;}
		a img {border: none;}
		body {background-color: white; padding-left: 1em;}
		body > div, form {width: 35em;}
		div, form{overflow: hidden;}
		h1 {margin-top: 0em;}
		ul img {vertical-align: middle;}
		ul {list-style-type: none; padding-left: 0em;}
		#w3c {clear: both;}
		#bannerarea {margin-bottom: 2em;}
		.signup, .back, .heart, .heartbig, .nerdluv{background: url(hw4_images/sprite.png) no-repeat;}
		.signup, .back, .heartbig{width: 32px; height: 32px;}
		.signup{background-position: -258px 0;}
		.back{background-position: -221px 0;}
		.heartbig{background-position: -186px 0;}
		.nerdluv{background-position: 0 0; width: 182px; height: 34px;}
		</style>
	</head>
	<body>
		<div id="bannerarea">
			<img src="hw4_images/transparent.png" class="nerdluv" width="64" height="64" />
			<br/>where meek geeks meet
		</div>
		<div>
			<h1>Welcome!</h1>
			<ul>
				<li><a href="signup.php">
					<img src="hw4_images/transparent.png" class="signup" width="64" height="64" />Sign up for a new account
				</a></li>
				<li><a href="matches.php">
					<img src="hw4_images/transparent.png" class="heartbig" width="64" height="64px" />Check your matches
				</a></li>
			</ul>
		</div>
		<div>
			<p>This page is for single nerds to meet and date each other!
			Type in your personal information and wait for the nerdly luv to begin!
			Thank you for using our site.</p>
			<p>Results and page (C) Copyright NerdLuv Inc.</p>
			<ul>
				<li><a href="index.php">
					<img src="hw4_images/transparent.png" class="back" width="64" height="64" />
					Back to front page
				</a></li>
			</ul>
		</div>
		<div id="w3c">
			<a href="https://webster.cs.washington.edu/validate-html.php">
				<img src="hw4_images/w3c_html.png" alt="Valid HTML" width="71" height="25" />
			</a>
			<a href="https://webster.cs.washington.edu/validate-css.php">
				<img src="hw4_images/w3c_css.png" alt="Valid CSS" width="71" height="25" />
			</a>
		</div>
	</body>
</html>
<script src="proto_homepage_opt.js" async></script>