<?php 
/*
Christon Fukuhara
CSE 154 BF/BU 
October 31, 2012
HW 5 login.php
  
Remember the Cow is an online to-do list that lets the user add and delete 
items to a list stored on a database, and uses sessions and cookies to retain
the users' data for a certain period of time.
  
login.php is a php file that validates the user's login information from index.php 
and redirects the user either back to index.php or to todolist.php
based on its validity. It is also used to establish a file location for list items, 
to decide if the input matches an existing or new user, and establish the login
session and the time cookie.
*/
include("common.php");
if(loggedIn())
	redirect("todolist.php");
if(!isset($_POST["name"])||!isset($_POST["password"]))
	redirect("index.php");#tried to access page without inputting information
$userNameEntry = $_POST["name"];
$passwordEntry = $_POST["password"];
if(!preg_match("/^([a-z][a-z0-9]{2,7})$/",$userNameEntry))
	redirect("index.php", "Invalid Username");
else if(!preg_match("/^([0-9].{4,10}[^a-zA-Z0-9])$/", $passwordEntry))
	redirect("index.php", "Invalid Password");
if(!file_exists("users.txt"))
	file_put_contents("users.txt", "");#establish a file for this user
$infoArray = file("users.txt", FILE_IGNORE_NEW_LINES);
$userNames = array();
$passwords = array();
foreach($infoArray as $entry){
	$namePass = explode(":",$entry);
	$userNames[]=$namePass[0];#list of all usernames in order
	$passwords[]=$namePass[1];#list of all passwords in order
}
if(!in_array($userNameEntry, $userNames)){#this username not in database yet
	if(preg_match("/$userNameEntry/", $passwordEntry))
		redirect("index.php", "Password Cannot Contain Username");
	else{	
		#enter new user into text file
		file_put_contents("users.txt", $userNameEntry.":".$passwordEntry."\n", FILE_APPEND);
		if(!isset($_SESSION))
			session_start();
		$_SESSION["userName"] = $userNameEntry; #set session variables; new user
		$_SESSION["password"] = $passwordEntry; 
		makeCookie(); 
		redirect("todolist.php"); 
	}
}
else{ #username already in database
	$pos = array_search($userNameEntry, $userNames);
	if($passwords[$pos]!=$passwordEntry){
		redirect("index.php", "Incorrect Password");
	}
	else{#userNameEntry exists and password matches
		if(!isset($_SESSION))
			session_start();
		if(!isset($_SESSION["userName"]))
			$_SESSION["userName"] = $userNameEntry; #set session variables; returning user
		if(!isset($_SESSION["password"]))
			$_SESSION["password"] = $passwordEntry;
		makeCookie();
		redirect("todolist.php");
	}
}

#Sets the cookie to the date and time of this login
function makeCookie(){
	$daylightSavings = date("T");
	if($daylightSavings==0)
		$offset=0;
	else $offset = 3600;			
	setcookie("lastTime", date("T g:i:s a", time() + 60*60*24*7 + $offset));
}
?>