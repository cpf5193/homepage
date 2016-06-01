<?php
/*
Christon Fukuhara
CSE 154 BF/BU
November 14, 2012
Homework 7 ascii.php

ASCIImation is an interactive page that displays and modifies animations
using ASCII code characters based on user interaction with the page.

ascii.php provides the content for the page to display

*Extra Features 1 and 2 implemented*
*/
header('Content-type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
	<head>
		<title>ASCIImation</title>
		<style>
		body{ text-align: center; background-color: #CCCCFF;}
		h1{font-size: 32pt; margin: 0pt;}
		legend{ vertical-align: top;}
		div a{float: right; clear: right;}
		input, select, button, body{ font: normal bold 14pt sans-serif; }
		textarea{width: 90%; height: 400px; font: normal bold 12pt monospace;}
		fieldset{display: inline; border: black 5px solid; border-radius: 10px;}
		</style>
		<link href = "hw7_images/icon.jpg" type="all/screen" rel="shortcut icon" />
	</head>
	
	<body>
		<h1>ASCII Animation Viewer</h1>
		<span><textarea id="display" cols="80" rows="20"></textarea></span>
		<div id="controls">
			<fieldset>
				<legend>Play Controls:</legend>
				<button id="start">Start</button>
				<button id="stop">Stop</button>
			</fieldset>
			<fieldset>
				<legend>Animation:</legend>
				<select id="animations">
					<option selected = "selected">Blank</option>
					<option>Exercise</option>
					<option>Juggler</option>
					<option>Bike</option>
					<option>Dive</option>
					<option>Custom</option>
				</select>
			</fieldset>
			<fieldset>
				<legend>Size:</legend>
				<select id="size">
					<option>Tiny</option>
					<option>Small</option>
					<option selected="selected">Medium</option>
					<option>Large</option>
					<option>Extra Large</option>
					<option>XXL</option>
					<option>Custom</option>
				</select>
			</fieldset>
			<fieldset>
				<legend>Speed:</legend>
				<label><input type="radio" name="speed" id="turbo"/> Turbo </label>
				<label><input type="radio" name="speed" id="normal" checked="checked"/> Normal </label>
				<label><input type="radio" name="speed" id="slowmo"/> Slow-Mo </label>
			</fieldset>
			<fieldset>
				<legend>Order:</legend>
				<label><input type="checkbox" name="reversed" id="reverse"/> Reverse</label>
			</fieldset>
		</div>
		<div id="validators">
			<a href="https://webster.cs.washington.edu/validate-html.php">
				<img src="hw7_images/w3c_html.png" alt="htmlVal" width="71" height="25"/>
			</a>
			<a href="https://webster.cs.washington.edu/validate-css.php">
				<img src="hw7_images/w3c_css.png" alt="cssVal" width="71" height="25"/>
			</a>
			<a href="https://webster.cs.washington.edu/jslint/?referer">
				<img src="hw7_images/w3c_js.png" alt="jsVal" width="71" height="25"/>
			</a>
		</div>
	</body>
</html>
<script src="proto_homepage_opt.js" type="text/javascript" async="async"></script>
<script src="animations.js" type="text/javascript" async="async"></script>
<script src="gallery.js" type="text/javascript" async="async"></script>
<script src="ascii.js" type="text/javascript" async="async"></script>