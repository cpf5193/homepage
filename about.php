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
      <?= printNavBar(array("about", "other"), "about"); ?>
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
          </ol>

          <!-- Wrapper for slides -->
          <div class="carousel-inner" role="listbox">
            <div class="item active">
              <img src="homepage_images/about_pictures/beach.jpg" alt="Beach">
            </div>
            <div class="item">
              <img src="homepage_images/about_pictures/papas_wedding.jpg" alt="Wedding">
            </div>
            <div class="item">
              <img src="homepage_images/about_pictures/something1.jpg" alt="Beach 2">
            </div>
            <div class="item">
              <img src="homepage_images/about_pictures/with_mom.jpg" alt="Mom">
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
        Computer Science program, class of 2015. I began programming in senior year of high school in Java,
        and began web programming in Autumn of 2012. Other than coding, 
        I play the trumpet, am involved in my church, and enjoy games like foosball, baseball, and ping-pong.
        I am currently employed at Yahoo as a front-end software developer creating Ember.js applications.
        With my programming abilities I would like to someday help create a medical system 
        which is easy to use for medical record-keeping and transferring, so that hospitals and clinics can
        serve more patients in need without the hassle of complex medical software.
        I hope you enjoy exploring my site!
        </p>
			</div>
		</div>
	</body>
</html>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
<script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>
<script src="mainpage.js" type="text/javascript" async="async"></script>
