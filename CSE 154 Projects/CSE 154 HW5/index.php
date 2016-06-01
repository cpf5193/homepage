<?php
/*
Christon Fukuhara
CSE 154 BF/BU 
October 31, 2012
HW 5 index.php

Remember the Cow is an online to-do list that lets the user add and delete 
items to a list stored on a database, and uses sessions and cookies to retain
the users' data for a certain period of time.

index.php is a file containing a form for a visitor to the site to enter login information.
index.php submits to login.php when the user presses submit, and displays the specified 
error if instructed to by login.php. It also displays the value of the time cookie.
*/
header('Content-type: text/html; charset=UTF-8');
include("common.php");
if(loggedIn())//can't log in twice
	redirect("todolist.php");
$error = getError();
clearSession();
uptohead();?>
<title>Remember the Cow - Index</title>
<style>
#errorMessage, #main p, #loginform input {text-align: center;}
body{margin: 0; padding: 0; font-family: "Arial", "Helvetica", sans-serif; font-size: 14pt;}
.headfoot{ background-color: #005AB4; color: white;}
#errorMessage{border: 2pt solid black;  background-color: red; color: black; font-size: 18pt; padding: 5pt; margin-bottom: 18px;}
#main{background-image: url("hw5_images/background.jpg"); background-repeat: no-repeat; background-size: 100% 100%; font-weight: bold;}
#loginform div{margin-left: auto; margin-right: auto; width: 30%;}
#loginform input{width: 50%; margin-top:2pt; margin-bottom: 2pt;}
#loginform input[type="submit"] {width: 100%;}
#loginform input, #main {color: black;}
body, input, select, option, button, a {color: #005AB4; font-family: Arial, Helvetica, sans-serif; font-size: 14pt;}
body, h1 {margin: 0; padding: 0;}
.headfoot {background-color: #005AB4; color: white; padding: 0.5em;}
h1 img {float: left; margin-right: 1em;}
#main {margin: 2em;}
</style>
<link href="hw5_images/favicon.ico" type="image/ico" rel="shortcut icon"/>
<?= uptomain(); 
if($error)
	showError($error); //shows an error if one is specified by the $_SESSION variable ?>
<p>The best way to manage your tasks.<br/>Never forget the cow (or anything else) again!</p>
<p>Log in now to manage your to-do list.<br/>If you do not have an account, one will be created for you.</p>
<form id="loginform" action="login.php" method="post">
	<div><input name="name" type="text" size="8" autofocus="autofocus"/><strong>User Name</strong></div>
	<div><input name="password" type="password" size="8"/><strong>Password</strong></div>
	<div><input type="submit" value="Log in"/></div>
</form>
<p><?php
	if(isset($_COOKIE["lastTime"]))
		$displayDate = "was at ".$_COOKIE["lastTime"];
		else $displayDate = "is unknown";
	?>
	<em>(last login from this computer <?=$displayDate?>)</em>
</p>
<?= afterMain(); ?>	