<?php 
session_start();
header('Content-type: text/html; charset=UTF-8');
include("session_manager.php");
include("nav.php");
bounceSession();
?>
<!DOCTYPE html>
<html>
	<head>
		<title> Chip Fukuhara's Homepage</title>
		<link href="mainpage.css" type="text/css" rel="stylesheet">
		<link href="homepage_images/logo.png" type="all/screen" rel="shortcut icon">
	</head>

	<body>
		<nav class="header">
			<div class="header-logo">
				<a href="/mainpage.php"><img src="homepage_images/logo.png"></a>
			</div>
      <?= printNavBar(array("home"), "home"); ?>
		</nav>

		<?php showError(); ?>
		<div class="mainSection projects">
			<div class="row">
				<figure class="portal">
					<a href="projects.php">
						<img src="homepage_images/wordsolver.png" alt="Projects">
						<figcaption> Projects </figcaption>
					</a>
				</figure>
			</div>
			<div class="row middle-row">
				<figure class="portal about">
					<a href="about.php">
						<img src="homepage_images/about_pictures/papas_wedding.jpg" alt="self portrait">
						<figcaption> About Me </figcaption>
					</a>
				</figure>
				<p class="main-text">
					<span class='welcome'>Welcome!</span>
					<span>This page is a showcase of my progress in programming and other various aspects of my life. Enjoy!</span>
				</p>
				<figure class="portal resume">
					<a href="Resume.pdf">
						<img src="homepage_images/resume.png" alt="resume">
						<figcaption> Resume </figcaption>
					</a>
				</figure>
			</div>
			<div class="row">
				<figure class="portal other">
					<a href="/other.php">
						<img src="homepage_images/trumpet.jpg" alt="Other">
						<figcaption> Other </figcaption>
					</a>
				</figure>
			</div>
		</div>
	</body>
</html>
