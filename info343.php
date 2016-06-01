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
		<title> Info 343 Projects</title>
		<link href = "info343.css" type="text/css" rel="stylesheet" />
		<link href = "homepage_images/logo.png" type="all/screen" rel="shortcut icon" />
	</head>

	<body>
		<nav class="header">
			<div class="header-logo">
        <a href="/mainpage.php"><img src="homepage_images/logo.png"></a>
      </div>
      <?= printNavBar(array("other"), "projects"); ?>
		</nav>

		<div class="content">

			<div class = "topBanner">
				<?php showError(); ?>
			</div>
			
			<div class="mainSection">
				<figure class="portal">
					<a href="info343/hw1">
						<img src="info343/hw1/img/icon.png" alt="logo">
						<figcaption>Homework 1</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="info343/hw2">
						<img src="info343/hw2/img/logo-vertical.png" alt="new logo">
						<figcaption>Homework 2</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="info343/hw3">
						<img src="info343/hw3/img/logo.png" alt="logo">
						<figcaption>Homework 3</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="info343/hw4/order.php">
						<img src="info343/hw4/img/screenshot.png" alt="order page">
						<figcaption>Homework 4</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="info343/lab1">
						<img src="info343/lab1/img/katie.png" alt="katie1">
						<figcaption>Lab 1</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="info343/lab2">
						<img src="info343/lab2/img/logo.png" alt="widget2">
						<figcaption>Lab 2</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="info343/lab3">
						<img src="info343/lab3/img/logo.png" alt="widget3">
						<figcaption>Lab 3</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="info343/lab4">
						<img src="info343/lab4/img/thumb.png" alt="screenshot4">
						<figcaption>Lab 4</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="info343/lab5">
						<img src="info343/lab5/img/screenshot.jpg" alt="screenshot5">
						<figcaption>Lab 5</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="info343/lab6">
						<img src="info343/lab6/img/screenshot.jpg" alt="screenshot6">
						<figcaption>Lab 6</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="info343/lab7">
						<img src="info343/lab7/img/screenshot.png" alt="screenshot7">
						<figcaption>Lab 7</figcaption>
					</a>
				</figure>
			</div>
		</div>
	</body>
</html>
<script src="mainpage.js" type="text/javascript" async="async"></script>
