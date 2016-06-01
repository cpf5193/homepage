<?php
/*
Christon Fukuhara
CSE 154 BF/BU HW8b
November 27, 2012
Fifteen Puzzle fifteen.html

Fifteen Puzzle is a simple game where the user clicks on directly adjacent squares
that neighbor an empty slot on a 4x4 grid of tiles, and that tile slides into the 
empty space, until the tiles are in order.

fifteen.html contains the contents of the webpage

Implemented Extra Feature #4
*/
header('Content-type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Fifteen Puzzle</title>
		<link href="hw8_images/fifteen.gif" type="image/gif" rel="shortcut icon" />
		<style>
		body{text-align: center;}
		#puzzlearea{width: 400px; height: 400px; position: relative; margin-left: auto; margin-right: auto;}
		#background, #boardSize, #shuffle, body{font-family: cursive; font-size: 14pt;}
		.box{border: black 5px solid; position: absolute; font-size: 40pt;}
		.box:hover{cursor: default;}
		.box p{height:100%; margin-top: 0; margin-bottom: 0;}
		.movable:hover{cursor: pointer; border-color: red;}
		#winMessage p{color: red; border: black 10px solid; background-color: yellow; font-weight: bold;}
		</style>
	</head>

	<body>
		<h1>Fifteen Puzzle</h1>
		<p>
			The goal of the fifteen puzzle is to un-jumble its fifteen squares
			by repeatedly making moves that slide squares into the empty space.
			How quickly can you solve it?
		</p>
		<div id="puzzlearea"></div>
		<p id="controls">
			Background Image: <select id="background"></select><!-- option tags are added in dynamically from fifteen.js -->	
			<select id="boardSize"></select><!-- option tags are added in dynamically from fifteen.js -->
			<button id="shuffle">Shuffle</button>
		</p>
		<!-- this area will show the number of times the user has solved the puzzle-->
		<div id="winCount"></div>
		<!-- this area will show a message to inform users they have won -->
		<div id="winMessage"></div>
		<p>
			American puzzle author and mathematician Sam Loyd is often falsely
			credited with creating the puzzle; indeed, Loyd claimed from 1891
			until his death in 1911 that he invented it.
			The puzzle was actually created around 1874 by Noyes Palmer Chapman,
			a postmaster in Canastota, New York.
		</p>
		<div id="w3c">
			<a href="https://webster.cs.washington.edu/validate-html.php">
				<img src="hw8_images/w3c_html.png" alt="Valid HTML" width="71" height="25"/></a>
			<a href="https://webster.cs.washington.edu/validate-css.php">
				<img src="hw8_images/w3c_css.png" alt="Valid CSS" width="71" height="25"/></a>
			<a href="https://webster.cs.washington.edu/jslint/?referer">
				<img src="hw8_images/w3c_js.png" alt="Valid JS" width="71" height="25"/></a>
		</div>
	</body>
</html>
<script src="fifteen.js" type="text/javascript" async="async"></script>