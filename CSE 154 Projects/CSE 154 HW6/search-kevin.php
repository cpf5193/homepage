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

search-kevin.php uses the given actor name and searches
the database, displaying all movies in which the given actor and Kevin
Bacon have both appeared in. If the input is not valid, not provided,
or produces no results, a message will be displayed to inform the user.

Additional Feature #4 Included
*/
header('Content-type: text/html; charset=UTF-8');
include("common.php");
hasInput();
list($db, $firstName, $lastName, $actorName, $getId) = initialize();
#get entered actor's id number
$otherActor = getId($db->query($getId), $actorName);
$getBaconId = "SELECT id FROM actors WHERE last_name = 'Bacon'
AND first_name = 'Kevin'";
#get Kevin Bacon's id number
$bacon = $db->query($getBaconId);
#turn results into usable strings
$baconId = getId($bacon, $actorName);
$findMovies = "SELECT name, year FROM movies m JOIN roles r1
ON r1.actor_id = $otherActor JOIN roles r2 ON r2.actor_id = $baconId
WHERE r1.movie_id = m.id AND r2.movie_id = m.id
ORDER BY year DESC, m.name ASC";
#get rows of movies that Kevin Bacon and the given actor were in together
$rows = $db->query($findMovies);
#turn result into indexed array
$rows = makeArray($rows);
if(count($rows)==0){
    showError("$actorName Has Not Appeared In Any Movies With Kevin Bacon"); 
}
?>
	<div id="main">
		<h1>Results For <?=$actorName?></h1>
		<p> Movies In Which Both Kevin Bacon and <?=$actorName?> Appear</p>
<?php 
showTable($actorName, $rows);
printFooter();
?>