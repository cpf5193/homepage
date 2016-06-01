<?php 
/*
Christon Fukuhara
CSE 154 BF/BU 
October 31, 2012
HW 5 todolist.php
    
Remember the Cow is an online to-do list that lets the user add and delete 
items to a list stored on a database, and uses sessions and cookies to retain
the users' data for a certain period of time.
  
todolist.php is a form that displays the user's corresponding list from the database/text file
by submitting to submit.php, and allows the user to update the list by adding or deleting 
list items.
*/
header('Content-type: text/html; charset=UTF-8');
include("common.php");
//if(!loggedIn())#hasn't logged in yet; do not allow access
	//redirect("index.php");
uptohead();?>
<title>Remember the Cow - Index</title>
<style>
h2{border: 3pt solid black;}
h2, #errorMessage, #main p{text-align: center;}
body{margin: 0; padding: 0; font-family: "Arial", "Helvetica", sans-serif; font-size: 14pt;}
h2, .headfoot{ background-color: #005AB4; color: white;}
#errorMessage{border: 2pt solid black;  background-color: red; color: black; font-size: 18pt; padding: 5pt; margin-bottom: 18px;}
#main{color: black; margin: 2em; background-image: url("hw5_images/background.jpg"); background-repeat: no-repeat; background-size: 100% 100%; font-weight: bold;}
body, input, select, option, button, a {color: #005AB4; font-family: Arial, Helvetica, sans-serif; font-size: 14pt;}
body, h1 {margin: 0; padding: 0;}
.headfoot {background-color: #005AB4; color: white; padding: 0.5em;}
h1 img {float: left; margin-right: 1em;}
li {margin-bottom: 0.5em; width: 20em;}
li input[type="submit"] {float: right; margin-left: 1em;}
#todolist form {display: inline;}
#todolist li {clear: right;}
</style>
<link href="hw5_images/favicon.ico"type="image/ico" rel="shortcut icon"/>
<?= uptomain(); ?>	
<h2><?= $_SESSION["userName"]?>'s To-Do List</h2>
<?php
$error = getError();
if($error)
	showError($error);?>
<ul id="todolist">
	<?= listItems();?>
	<li>
		<form action="submit.php" method="post">
			<input type="hidden" name="action" value="add" />
			<input name="item" type="text" size="25" autofocus="autofocus" />
			<input type="submit" value="Add" />
		</form>
	</li>
</ul>
<div>
	<a href="logout.php"><strong>Log Out</strong></a><?php
	#show time of last login
	if(isset($_COOKIE["lastTime"])) 
		$timeStamp = $_COOKIE["lastTime"];
	else $timeStamp = "???";?>
	<em>(logged in since <?=$timeStamp?>)</em>
</div>
<?php afterMain(); 

#Shows all the current items in the database for the user
function listItems(){
	if(isset($_SESSION)){
		if(file_exists("todo_{$_SESSION["userName"]}.txt")){
			$listArray = file("todo_{$_SESSION["userName"]}.txt", FILE_IGNORE_NEW_LINES);
			$_SESSION["list"] = $listArray;
		}
		else{#new entry to database; start new file
			file_put_contents("todo_{$_SESSION["userName"]}.txt", "");
			$_SESSION["list"] = array();#list set to size 0
		}
	}
	for($i=0; $i<count($_SESSION["list"]); $i++){ ?>
		<li>
			<form action="submit.php" method="post">
				<input type="hidden" name="action" value="delete" />
				<input type="hidden" name="index" value="<?=$i?>" />
				<input type="submit" value="Delete" />
			</form>
			<?=($_SESSION["list"][$i])?>
		</li><?php
	}
} ?>