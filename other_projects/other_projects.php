<?php 
session_start();
header('Content-type: text/html; charset=UTF-8');
include("../session_manager.php");
include("../nav.php");
bounceSession();
?>
<!DOCTYPE html>
<html>
	<head>
		<title> Other Projects</title>
		<link href="other_projects.css" type="text/css" rel="stylesheet" />
		<link href="../homepage_images/logo.png" type="all/screen" rel="shortcut icon" />
	</head>

	<body>
		<nav class="header">
			<div class="header-logo">
        <a href="../mainpage.php"><img src="../homepage_images/logo.png"></a>
      </div>
      <?= printNavBar(array("other"), "projects"); ?>
		</nav>

		<div class="content">
			<div class = "topBanner">
				<?php showError(); ?>
			</div>
			<div class="mainSection">
				<figure class="portal">
					<a href="coding_challenges/src/BirthdayParadox.java"> 
						<img src="coding_challenges/img/cake.jpg" alt="cake">
						<figcaption> Birthday Paradox </figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="coding_challenges/src/FindNumbers.java">
						<img src="coding_challenges/img/numbers.jpg" alt="numbers">
						<figcaption> Find Numbers </figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="app/views/application/login.html">
						<img src="../homepage_images/freetime_login.png" alt="freetime">
						<figcaption> FreeTime </figcaption>
					</a>
				</figure>
			</div>
		</div>
	</body>
</html>
<script src="../mainpage.js" type="text/javascript" async="async"></script>
