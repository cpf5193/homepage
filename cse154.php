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
		<title> CSE 154 Projects</title>
		<link href = "cse154.css" type="text/css" rel="stylesheet" />
		<link href = "homepage_images/logo.png" type="all/screen" rel="shortcut icon" />
	</head>

	<body>
		<nav class="header">
			<div class="header-logo">
        <a href="/mainpage.php"><img src="homepage_images/logo.png"></a>
      </div>
      <?= printNavBar(array(), "projects"); ?>
		</nav>

		<div class="content">
			<div class="topBanner">
				<?php showError(); ?>
			</div>
			<div class="mainSection">
				<figure class="portal">
					<a href="CSE%20154%20Projects/CSE%20154%20HW1/index.html">
						<img src="CSE%20154%20Projects/CSE%20154%20HW1/pie.jpg" alt="granny's pies">
						<figcaption>Granny's Pies</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="CSE%20154%20Projects/CSE%20154%20HW2/tmnt.html">
						<img src="CSE%20154%20Projects/CSE%20154%20HW2/hw2_images/rotten.png" alt="tmnt">
						<figcaption>TMNT</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="CSE%20154%20Projects/CSE%20154%20HW3/movie.php">
						<img src="CSE%20154%20Projects/CSE%20154%20HW3/hw3_images/fresh.png" alt="movie review">
						<figcaption>Movie Review</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="CSE%20154%20Projects/CSE%20154%20HW4/index.php">
						<img src="CSE%20154%20Projects/CSE%20154%20HW4/hw4_images/nerdluv_crop.png" alt="nerdluv">
						<figcaption>NerdLuv</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="CSE%20154%20Projects/CSE%20154%20HW5/index.php">
						<img src="CSE%20154%20Projects/CSE%20154%20HW5/hw5_images/logo.png" alt="to-do list">
						<figcaption>To-Do List</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="https://webster.cs.washington.edu/cpf5193/hw6/index.php">
						<img src="CSE%20154%20Projects/CSE%20154%20HW6/hw6_images/kevin_bacon.jpg" alt="kevin bacon">
						<figcaption>One Degree of Bacon</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="CSE%20154%20Projects/CSE%20154%20HW7/ascii.php">
						<img src="CSE%20154%20Projects/CSE%20154%20HW7/hw7_images/stickman.jpg" alt="stickman">
						<figcaption>ASCIImation</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="CSE%20154%20Projects/CSE%20154%20HW8/fifteen.php">
						<img src="CSE%20154%20Projects/CSE%20154%20HW8/hw8_images/mario.jpg" alt="mario">
						<figcaption>Fifteen Puzzle</figcaption>
					</a>
				</figure>
				<figure class="portal">
					<a href="https://webster.cs.washington.edu/cpf5193/hw9/names.php">
						<img src="CSE%20154%20Projects/CSE%20154%20HW9/hw9_images/pacifier.jpg" alt="pacifier">
						<figcaption>Baby Names</figcaption>
					</a>
				</figure>
			</div>
		</div>
	</body>
</html>
