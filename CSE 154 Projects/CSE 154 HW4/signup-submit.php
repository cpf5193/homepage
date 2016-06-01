<?php header('Content-type: text/html; charset=UTF-8'); /*prints the comment header and gets the common functions*/
printHead("Signup-Submit");
	if(!validData($_POST))#calls the function to check if all post data is valid
		printError();
	elseif(isInFile($_POST["name"], "singles2.txt"))
		printRegisteredError();
	else{
		$getter = $_POST; # to get post data
		$infoArray = array(); 
		foreach($getter as $transfer){
			$infoArray[]=$transfer; #put the post data in an indexed array 
		}
		$seekGender = "";
		if(count($infoArray)==9){ #must have chosen both seekGenders
			$seekGender = "MF";
			#cut off individual seekGender indices
			$infoArray = array_slice($infoArray, 0, 7);
		}
		#exactly one of the seekGender fields must be set
		else if(isset($_POST["female"]))
			$seekGender="F";
		else $seekGender="M";
		$infoArray[7]=$seekGender; 
		list($name, $gender, $age, $personality, $os, $seekingmin, $seekingmax, $seekGender)=$infoArray;
		addListing($name, $infoArray);#call function to add new user to text file	?>				
		<div>
			<p><strong>Thank you!</strong><br/></p>
			<p>Welcome to NerdLuv, <?=$name?>!</p>
			<p>Now <a href="matches.php">log in to see your matches!</a><br/></p>
		</div>
<?php  }
	printBottom();/*prints the footer from common.php*/

#takes the name of a new user and the post data, adds new user to database
function addListing($name, $infoArray){
	$newListing = '';
	foreach($infoArray as $info){
		$newListing .= ($info . ',');#create string to add from post data
	}
	$newListing = substr($newListing, 0, strlen($newListing)-1);#delete extra comma
	if(file_exists("singles2.txt"))
		file_put_contents("singles2.txt", "$newListing\n", FILE_APPEND);
	$nameForImageFile=implode("_",explode(" ", strtolower($name)));#modify name for image path
	if(is_uploaded_file($_FILES["photo"]["tmp_name"])){
		chmod("hw4_images/$nameForImageFile.jpg", 0777);
		move_uploaded_file($_FILES["photo"]["tmp_name"], "hw4_images/$nameForImageFile.jpg");	
	}
}
#checks each post field for validity	
function validData($_POST){
	if(count($_POST)<8)#at least one post field is empty
		return false;
	return(validName($_POST)&&protectAge($_POST)&&protectGender($_POST)&&protectPers($_POST)
		&&protectOs($_POST)&&protectSeekAge($_POST)&&protectSeekGender($_POST));/*validName is a function from common.php*/
}
#check if age is between 0 and 99
function protectAge($_POST){
	if(!isset($_POST["age"]))
		return false;
	return preg_match("/^\d\d?$/", $_POST["age"]);
}
#check if gender is either M or F
function protectGender($_POST){
	if(!isset($_POST["gender"]))
		return false;
	return preg_match("/^(M|F)$/", $_POST["gender"]);
}
#check if personality is a valid Kiersey personality type
function protectPers($_POST){
	if(!isset($_POST["personality"]))
		return false;
	return preg_match("/^([IE][NS][FT][JP])$/", $_POST["personality"]);
}
#check if the OS is either Windows, Mac OS X, or Linux
function protectOs($_POST){
	if(!isset($_POST["os"]))
		return false;
	return preg_match("/^(Windows|Mac OS X|Linux)$/", $_POST["os"]);
}
#check if the seeking min and max are between 0 and 99 and max > min
function protectSeekAge($_POST){
	if(!(isset($_POST["seekingmin"]) && isset($_POST["seekingmax"])))
		return false;
	return (preg_match("/^\d\d?$/", $_POST["seekingmin"]) 
		&& preg_match("/^\d\d?$/", $_POST["seekingmax"]) 
		&& $_POST["seekingmin"]<=$_POST["seekingmax"]);
}
#check if at least one of male or female has been checked for seekGender
function protectSeekGender($_POST){
	$maleSet=false;
	$femaleSet=false;
	if(isset($_POST["male"]))
		$maleSet= (preg_match("/^on$/", $_POST["male"]));
	if(isset($_POST["female"]))
		$femaleSet=(preg_match("/^on$/", $_POST["female"]));
	return($maleSet || $femaleSet);
}
#check if user's name is already in database
function isInFile($name, $fileName){
	$allLines = file($fileName);
	$allNames = array();
	foreach($allLines as $line){
		$tempArray=explode(",", $line);
		$allNames[]=$tempArray[0];
	}
	$found=false;
	for($i=0; $i<count($allNames); $i++){
		if($name==$allNames[$i]){
			$found=true;
			$i=count($allNames);#quit loop if found
		}
	}
	return $found;
}
#prints an error for when a user enters an existing username
function printRegisteredError(){
?>	<p><strong>Error! Registration Failed.</strong></p>
	<p>
	 We're sorry. This name is already registered in the nerdLuv
	 system. Please go to the "Returning User" page to see your matches.
	</p>
<?php } 
function printHead($title){ ?>
<!DOCTYPE html>
<html>
	<head>
		<title><?= $title ?></title>
		<link href="hw4_images/heart.gif" type="image/gif" rel="shortcut icon"/>
		<style>
		* {font-size: 12pt; font-family: "Verdana", "Geneva", sans-serif;}
		a {color: #F44; text-decoration: none;}
		a:hover {background-color: #FFA;}
		a img {border: none;}
		body {background-color: white; padding-left: 1em;}
		body > div, form {width: 35em;}
		div, form{overflow: hidden;}
		ul img {vertical-align: middle;}
		ul {list-style-type: none; padding-left: 0em;}
		#w3c {clear: both;}
		#bannerarea {margin-bottom: 2em;}
		.back, .nerdluv{background: url(hw4_images/sprite.png) no-repeat;}
		.back{ width: 32px; height: 32px;}
		.back{background-position: -221px 0;}
		.nerdluv{background-position: 0 0; width: 182px; height: 34px;}
		</style>
	</head>
	<body>
		<div id="bannerarea">
			<img src="hw4_images/transparent.png" class="nerdluv" width="64px" height="64px"/>
			<br/>where meek geeks meet
		</div>
<?php }

#prints the bottom of the page, including links to validators and index.php
function printBottom(){?>
		<div>
			<p>This page is for single nerds to meet and date each other!  
			Type in your personal information and wait for the nerdly luv to begin!  
			Thank you for using our site.</p>
			<p>Results and page (C) Copyright NerdLuv Inc.</p>
			<ul>
				<li><a href="index.php">
						<img src="hw4_images/transparent.png" class="back" width="64px" height="64px"/>
						Back to front page
				</a></li>
			</ul>
		</div>
		<div id="w3c">
			<a href="https://webster.cs.washington.edu/validate-html.php">
				<img src="hw4_images/w3c_html.png" alt="Valid HTML" width="71px" height="25px"/>
			</a>
			<a href="https://webster.cs.washington.edu/validate-css.php">
				<img src="hw4_images/w3c_css.png" alt="Valid CSS" width="71px" height="25px"/>
			</a>
		</div>
	</body>
</html>
<script src="proto_homepage_opt.js" type="text/javascript" async="async"></script>
<?php }
#checks if an entered name field is empty or only whitespaces	
function validName($_PASSED/*allows use of both $_GET and $_POST*/){
	if(!isset($_PASSED["name"]))
		return false;
	return preg_match("/\S+/", $_PASSED["name"]);
}
#prints an error for invalid data
function printError(){
?>	<h1>Error! Invalid data.</h1>
	<p>We're sorry. You submitted invalid user information. Please go back and try again.</p>
<?php } ?>