<?php
#prints the header of each page
function printHeader(){
?>
	<!DOCTYPE html>
	<html>
		<head>
			<title>My Movie Database (MyMDb)</title>
			<meta charset="utf-8"/>
			<link href="hw6_images/favicon.png" type="image/png" rel="shortcut icon"/>
			<style>
			body{font-family: "Times New Roman", "Verdana", sans-serif; font-size: 14pt;}
			table { border-collapse: collapse; }
			tr:nth-child(even), body{ background-color: gray; }
			h1, #frame, table{ margin-left: auto; margin-right: auto;}
			#frame, h1, table, #title{ width: 80%; }
			.year, .num{ width: 10%;}
			.year, .name{ border-left: none; }
			.num, .name{ border-right: none; }
			#frame{background-color: white; border: 3px solid white; border-radius: 5px; text-align: center;}
			#banner span{vertical-align: middle;}
			#banner img{float: left; position: absolute; left: 11%;}
			#banner, #banner img{ margin: 5pt; }
			p{ margin: 15pt; }
			h1{ background-color: #E8E8E8; }
			#w3c, #banner{background-image: url("hw6_images/banner-background.png"); color: white; border-radius: 5px; padding: 5pt; font-size: 32pt;}
			</style>
		</head>

		<body>
			<div id="frame">
				<div id="banner">
					<a href="index.php">
						<img src="hw6_images/mymdb.png" alt="banner logo" width="136" height="49"/>
					</a>
					<span>My Movie Database</span>
				</div>
<?php
}

#prints the footer of each page
function printFooter(){
?>
				<!-- form to search for every movie by a given actor -->
				<form action="search-all.php" method="get">
					<fieldset>
						<legend>All movies</legend>
						<div>
							<input name="firstname" type="text" size="12" placeholder="first name" autofocus="autofocus"/> 
							<input name="lastname" type="text" size="12" placeholder="last name"/> 
							<input type="submit" value="go"/>
						</div>
					</fieldset>
				</form>

				<!-- form to search for movies where a given actor was with Kevin Bacon -->
				<form action="search-kevin.php" method="get">
					<fieldset>
						<legend>Movies with Kevin Bacon</legend>
						<div>
							<input name="firstname" type="text" size="12" placeholder="first name"/> 
							<input name="lastname" type="text" size="12" placeholder="last name"/> 
							<input type="submit" value="go"/>
						</div>
					</fieldset>
				</form>
			</div> <!-- end of #main div -->
						
			<div id="w3c">
				<a href="https://webster.cs.washington.edu/validate-html.php">
					<img src="hw6_images/w3c_html.png" alt="Valid HTML5" width="71" height="25"/>
				</a>
				<a href="https://webster.cs.washington.edu/validate-css.php">
					<img src="hw6_images/w3c_css.png" alt="Valid CSS" width="71" height="25"/>
				</a>
			</div>
		</div> <!-- end of #frame div -->
	</body>
</html>
<?php
}

#sets the initial variables, checks validity of input, and returns variables to be used
function initialize(){
	printHeader();
	$db = new PDO("mysql:dbname=imdb;host=localhost", "cpf5193", "FRtqFrAJGYzCj");
	$firstName = $_GET["firstname"];
	$firstPrepped = $db->quote($firstName . "%");
	$lastName = $_GET["lastname"];
	$lastPrepped = $db->quote($lastName);
	$actorName = $firstName . " " . $lastName;
	hasInput();
	if(!checkName($firstName, $lastName))
		showError("Not a Valid Name");
	#query string to get the id for the given actor or closest match if duplicates
	$getId = "SELECT id FROM actors WHERE last_name = $lastPrepped
	AND first_name LIKE $firstPrepped ORDER BY film_count DESC, id ASC LIMIT 1";
	return array($db, $firstName, $lastName, $actorName, $getId);
}

#protects against empty or unsubmitted input
function hasInput(){
	if(!isset($_GET))
		showError("No User Input Provided");
	else if(!isset($_GET["firstname"]) || $_GET["firstname"]=="")
		showError("First Name Required");
	else if(!isset($_GET["lastname"]) || $_GET["lastname"]=="")
		showError("Last Name Required");
}

#gets the id of the given actor or prints an error if it does not exist
function getId($pdoObj, $actorName){
	$idNum = NULL;
	foreach($pdoObj as $row)
		$idNum=$row[0];
	if($idNum==NULL)
		showError("Actor $actorName Not Found");
	return $idNum;
}

#creates an indexed array
function makeArray($rows){
	$assocArray = array();
	foreach($rows as $row){
		$assocArray[] = $row;
	}
	return $assocArray;
}

#displays the table of results for the given request
function showTable($actorName, $rows){?>
	<table border = "1">
		<tr>
			<td class = "num">#</td>
			<td class = "title">Title</td>
			<td class = "year">Year</td>
		</tr>
<?php 	$i=1;
		foreach($rows as $row){ ?>
		<tr> 
			<td class = "num"> <?=$i?> </td>
			<td class = "name"> <?=$row["name"]?> </td>
			<td class = "year"> <?=$row["year"]?> </td>
		</tr>
<?php	$i++;
} ?>
	</table>
<?php
}

#checks if both the first name and last name are valid strings
function checkName($firstName, $lastName){
	/*regex string should be alphabetic characters, apostraphes, dashes, periods, or spaces
	with a possible space or dash in between*/
	$regex = "/^[A-Za-z.\'\"]*([- ]?[A-Za-z.\'\"]*)*$/i";
	return (preg_match($regex, $firstName) && preg_match($regex, $lastName));		
}

#displays a message to the user 
function showError($message){ ?>
	<p><?=$message?></p>
	<div id="main">
<?php
	printFooter();
	die();
} ?>