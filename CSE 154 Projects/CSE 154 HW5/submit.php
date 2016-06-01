<?php
/*
Christon Fukuhara
CSE 154 BF/BU 
October 31, 2012
HW 5 submit.php
    
Remember the Cow is an online to-do list that lets the user add and delete 
items to a list stored on a database, and uses sessions and cookies to retain
the users' data for a certain period of time.
  
submit.php is the file that updates the user's file and session variables when 
an action is performed via post from todolist.php, and redirects back to todolist.php.
submit.php also performs checks on the user's input in todolist.php's form.
*/
include("common.php");
if(!loggedIn())
	redirect("index.php");
protect();
if(preg_match("/^add$/", $_POST["action"])){
	$specialCharsOut = htmlspecialchars($_POST["item"]);
	if(preg_match("/^\s*$/",$specialCharsOut)) #can't be blank or all white space
		redirect("todolist.php", "Cannot Add A Blank Item");
	#put new list item in the file
	file_put_contents("todo_{$_SESSION["userName"]}.txt", $_POST["item"]."\n", FILE_APPEND);
	chmod("todo_{$_SESSION["userName"]}.txt", 0664);
	#update the list in the $_SESSION array
	$updatedList = file("todo_{$_SESSION["userName"]}.txt");
}
elseif(preg_match("/^delete$/", $_POST["action"])){
	$listArray = file("todo_{$_SESSION["userName"]}.txt");
	if(count($listArray)==0)
		printError("Cannot Delete From An Empty List");
	$updatedList = array();
	for($i=0; $i<count($listArray); $i++){
		if($i!=$_POST["index"]){#skip the index that was deleted
			$updatedList[]=$listArray[$i];#will contain the updated list for $_SESSION
		}
	}
	unlink("todo_{$_SESSION["userName"]}.txt");#must update text file as well
	foreach($updatedList as $line){
		file_put_contents("todo_{$_SESSION["userName"]}.txt", $line, FILE_APPEND);
	}
}
else #action is set to something illegal
	printError("Illegal Action Attempted");
$_SESSION["list"] = $updatedList; #update list
redirect("todolist.php");

#Prints an ungraceful error and dies if the user manually creates invalid states
function protect(){
	$postSet = isset($_POST);
	$actionSet = isset($_POST["action"]);
	if(!($postSet && $actionSet))
		printError("Insufficient Data Provided");
	$validIndex = preg_match("/^[0-9]*$/", $_POST["action"]);
	if((preg_match("/^add$/", $_POST["action"])) && !(isset($_POST["item"]))) 
		printError("Cannot Add Null To List");
	if((preg_match("/^delete$/", $_POST["action"])) && 
(!(isset($_POST["index"])&&file_exists("todo_{$_SESSION["userName"]}.txt"))))
		printError("Cannot Delete This");
	if((preg_match("/^delete$/", $_POST["action"])) && !checkInBounds())
		printError("Index Bounds Violated");
}

#Checks to see if the given index has a corresponding line in the text file
function checkInBounds(){
	$tempArray = file("todo_{$_SESSION["userName"]}.txt", FILE_IGNORE_NEW_LINES);
	if(count($tempArray)==0)
		return false;
	return($_POST["index"]<count($tempArray));
}

#Prints an unfriendly error message and quits
function printError($message){?>
	<p id="ungraceful"><?=$message?></p><?php
die();
}