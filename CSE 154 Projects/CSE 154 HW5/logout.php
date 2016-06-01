<?php
/*
Christon Fukuhara
CSE 154 BF/BU 
October 31, 2012
HW 5 logout.php
   
Remember the Cow is an online to-do list that lets the user add and delete 
items to a list stored on a database, and uses sessions and cookies to retain
the users' data for a certain period of time.
  
logout.php is the handler for logout requests by the user from the todolist.php page. 
On legal visits to logout.php, the session is reset and the user is redirected to index.php.
*/
include("common.php");
if(!loggedIn())
	redirect("index.php");
if(isset($_SESSION["userName"])) #destroy session, log user out before redirecting 
	clearSession();
redirect("index.php");
?>
	