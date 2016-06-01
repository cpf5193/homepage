<?php
/*
Christon Fukuhara
CSE 154 BF/BU 
November 7, 2012
HW 6 index.php
  
My Movie Database is a simulation of the game "The Six Degrees of Kevin Bacon",
contingent on the theory that any actor in the imdb database can be connected 
to a common movie with Kevin Bacon through six linked actors. My Movie Database
provides the user the ability to search for common movie appearances with Kevin 
Bacon for a given actor name, or the movies that a given actor has appeared in. 

index.php is the beginning site for MyMDb, containing a form that allows
the user to input a first name and last name to submit via GET to either search-kevin.php
or search-all.php, which will display all matches given a valid input.

Additional Feature #4 Included
*/
header('Content-type: text/html; charset=UTF-8');
include("common.php");
printHeader();
?>
			<div id="main">
				<h1>The One Degree of Kevin Bacon</h1>
				<p>Type in an actor's name to see if he/she was
				   ever in a movie with Kevin Bacon!</p>
				<p><img src="hw6_images/kevin_bacon.jpg" alt="Kevin Bacon" width="340" height="425"/></p>
<?= printFooter();?>
