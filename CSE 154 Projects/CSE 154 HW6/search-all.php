<?php
/*
Christon Fukuhara
CSE 154 BF/BU 
November 7, 2012
HW 6 search-all.php
  
My Movie Database is a simulation of the game "The Six Degrees of Kevin Bacon",
contingent on the theory that any actor in the imdb database can be connected 
to a common movie with Kevin Bacon through six linked actors. My Movie Database
provides the user the ability to search for common movie appearances with Kevin 
Bacon for a given actor name, or the movies that a given actor has appeared in. 

search-all.php uses the given actor name and searches
the database, displaying all movies that the given actor appeared in.
If the input is not valid, not provided, or produces no results, a 
message will be displayed to inform the user.

Additional Feature #4 Included
*/
header('Content-type: text/html; charset=UTF-8');
include("common.php");
hasInput();
list($db, $firstName, $lastName, $actorName, $getId) = initialize();
#get given actor's id number
$actorId = getId($db->query($getId), $actorName);
$findMovies = "SELECT name, year FROM movies m 
JOIN roles r on movie_id = m.id 
WHERE actor_id = $actorId
ORDER BY year DESC, m.name ASC";
#find all rows matching movies the given actor appeared in
$rows = $db->query($findMovies);
?>
	<div id="main">
		<h1>Results For <?=$actorName?></h1>
		<p> Movies <?=$actorName?> Has Appeared In</p>
<?php	
showTable($actorName, $rows);
printFooter();
?>