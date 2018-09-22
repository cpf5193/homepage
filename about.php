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
		<title>About Me</title>
    <link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css"> <!-- Only includes carousel -->
		<link href="about.css" type="text/css" rel="stylesheet" />
		<link href="homepage_images/logo.png" type="all/screen" rel="shortcut icon" />
	</head>

	<body>
		<nav class="header">
			<div class="header-logo">
				<a href="/mainpage.php"><img src="homepage_images/logo.png"></a>
			</div>
      <?= printNavBar(array("about"), "about"); ?>
		</nav>
		<div class="content">
			<div class = "topBanner">
				<h1>About Me</h1>
				<?php showError(); ?>
			</div>

			<div class="mainSection">
				<div id="carousel" class="carousel slide" data-ride="carousel">
          <!-- Indicators -->
          <ol class="carousel-indicators">
            <li data-target="#carousel" data-slide-to="0" class="active"></li>
            <li data-target="#carousel" data-slide-to="1"></li>
            <li data-target="#carousel" data-slide-to="2"></li>
            <li data-target="#carousel" data-slide-to="3"></li>
            <li data-target="#carousel" data-slide-to="4"></li>
            <li data-target="#carousel" data-slide-to="5"></li>
            <li data-target="#carousel" data-slide-to="6"></li>
            <li data-target="#carousel" data-slide-to="7"></li>
            <li data-target="#carousel" data-slide-to="8"></li>
          </ol>

          <!-- Wrapper for slides -->
          <div class="carousel-inner" role="listbox">
            <div class="item active">
              <img src="homepage_images/about_pictures/elephant.jpg" alt="Elephant Thailand">
            </div>
            <div class="item">
              <img src="homepage_images/about_pictures/rock-climbing.jpg" alt="Rock Climbing">
            </div>
            <div class="item">
              <img src="homepage_images/about_pictures/socal-swing.jpg" alt="Santa Monica Swing">
            </div>
            <div class="item">
              <img src="homepage_images/about_pictures/spain-boardwalk.jpg" alt="Boardwalk in Spain">
            </div>
            <div class="item">
              <img src="homepage_images/about_pictures/spain-cross.jpg" alt="Cross in Spain">
            </div>
            <div class="item">
              <img src="homepage_images/about_pictures/spain-ice-chair.jpg" alt="Ice bar in Spain">
            </div>
            <div class="item">
              <img src="homepage_images/about_pictures/thailand-kayak.jpg" alt="Kayaking in Thailand">
            </div>
            <div class="item">
              <img src="homepage_images/about_pictures/toproping.jpg" alt="Top Roping">
            </div>
          </div>

          <!-- Left and right controls -->
          <a class="left carousel-control" href="#carousel" role="button" data-slide="prev">
            <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="right carousel-control" href="#carousel" role="button" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
        <p>Hi, My name is Christon(Chip) Fukuhara. I am a graduate of the University of Washington
        Computer Science program, class of 2015. I began programming in 2011 in Java,
        and began web programming in Autumn of 2012. Other than coding, 
        I play the trumpet and guitar, and am a leader of the young professional community for my Echo Church in Sunnyvale. I enjoy
        activities like rock climbing, escape rooms, foosball, and hanging out with my friends over a meal.
        I am currently employed at Yahoo as a front-end software developer creating Ember.js applications.
        With my programming abilities I would love to work on software that impacts those who are struggling with medical conditions,
        especially those who are unable to pay for their medical bills. I hope you enjoy exploring my site!
        </p>
			</div>
		</div>
	</body>
</html>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
<script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>
