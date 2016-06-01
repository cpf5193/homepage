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
		<title> Chip Fukuhara's Homepage</title>
		<link href = "index.css" type="text/css" rel="stylesheet" />
		<link href = "../homepage_images/logo.png" type="all/screen" rel="shortcut icon" />
	</head>

	<body>
		<nav class="header">
			<div class="header-logo">
        <a href="../mainpage.php"><img src="../homepage_images/logo.png"></a>
      </div>
      <?= printNavBar(array("other"), "projects"); ?>
		</nav>

		<div class="content">
			<div class="mainSection">
				<figure class="portal">
					<a href="spirals.png">
						<img src="spirals.png" alt="spirals">
						<figcaption> Intersections </figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="Galaxy_Spirals.png">
						<img src="Galaxy_Spirals.png" alt="galaxy-spirals">
						<figcaption> Galaxy Spirals </figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="Linear_Spirals.png">
						<img src="Linear_Spirals.png" alt="linear-spirals">
						<figcaption> Linear Spirals </figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="top_level_current.png">
						<img src="top_level_current.png" alt="top-level">
						<figcaption> Top Level </figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="mid_level_current.png">
						<img src="mid_level_current.png" alt="mid-level">
						<figcaption> Mid Level </figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="model_level_current.png">
						<img src="model_level_current.png" alt="model-level">
						<figcaption> Model Level </figcaption>
					</a>
				</figure>
			</div>
		</div>
	</body>
</html>
