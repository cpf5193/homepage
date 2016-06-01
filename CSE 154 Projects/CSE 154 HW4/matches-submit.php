<?php
header('Content-type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Matches-Submit</title>
		<link href="hw4_images/heart.gif" type="image/gif" rel="shortcut icon"/>
		<style>
		* {font-size: 12pt; font-family: "Verdana", "Geneva", sans-serif;}
		a:hover {background-color: #FFA;}
		a {color: #F44; text-decoration: none;}
		body {background-color: white; padding-left: 1em;}
		body > div, form {width: 35em;}
		div, form{overflow: hidden;}
		#bannerarea {margin-bottom: 2em;}
		.back, .heart, .nerdluv{background: url(hw4_images/sprite.png) no-repeat;}
		.back{background-position: -221px 0; width: 32px; height: 32px;}
		.nerdluv{background-position: 0 0; width: 182px; height: 34px;}
		ul img {vertical-align: middle;}
		.match img{float: left;}
		.match img {margin-right: 10px; margin-bottom: 3em;}
		.match p {background-color: #E0E0FF; clear: left;}
		.match ul {padding-left: 160px;}
		.match {margin-bottom: 1em;}
		#back{list-style: none; padding-left: 0;}
		</style>	
	</head>
		
	<body>
		<div id="bannerarea">
			<img src="hw4_images/transparent.png" class="nerdluv" width="64px" height="34px"/>
			<br/>where meek geeks meet
		</div>
		<?php
		if(!validName($_GET))#checks if given name is valid
			printError();
		else{
			$userName = $_GET["name"];
			findMatches($userName, "singles2.txt"); 
		}?>
		<div>
			<p>This page is for single nerds to meet and date each other!  
			Type in your personal information and wait for the nerdly luv to begin!  
			Thank you for using our site.</p>
			<p>Results and page (C) Copyright NerdLuv Inc.</p>
			<ul id="back">
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

<?php
#determines and displays the user's matches
function findMatches($userName, $file){
	$peopleStrings=file($file);#make array of database's info strings
	$people = array();
	foreach($peopleStrings as $infoString){
		$people[]=explode(",", $infoString);#make each string into an array
	}
	$foundUser=false;
	$index = 0;
	$skipIncrement = false;
	while(!($foundUser)){
		if(strcmp($userName, $people[$index][0])==0){#user's name == current person's name
			$foundUser=true;
			$skipIncrement=true;#required to reach error function call
			list($userName, $userGender, $userAge, $userPers, $userOs, 
$userMin, $userMax, $userSeekGender) = $people[$index]; 
		}
		if(!$skipIncrement)
			$index++;
		if($index==count($people))#did not find match -- user is not in database
			printExistError();
	}
?>
			<h1>Matches for <?=$userName?></h1>
<?php
	#look through database for matches
	foreach($people as $person){
		#assign current person's variables to compare with user's
		list($name, $gender, $age, $personality, $os, $seekingmin, $seekingmax,
$seekGender)=$person;
		if($name!=$userName){#if current person != self
			$ageCheck=checkAges($userAge, $age, $userMin, $userMax, $seekingmin, $seekingmax);
			$osCheck=checkOs($userOs, $os);
			$persCheck=checkPers($userPers, $personality);
			$seekGenderCheck=checkSeekGender($userSeekGender, $seekGender, $userGender, $gender);
			if($osCheck && $persCheck && $ageCheck && $seekGenderCheck)
				printMatch($name, $gender, $age, $personality, $os);
		}
	}
}
	
#displays a found match's name, image, and info on the webpage	
function printMatch($matchName, $gender, $age, $personality, $os){ ?>
	<div class="match">
		<p><?=$matchName?><img src="<?=getPic($matchName)?>" alt="<?=$matchName?>'s Picture" width="120" height="120"/></p>
		<ul>
			<li><strong>gender:</strong> <?=$gender?></li>
			<li><strong>age:</strong> <?=$age?></li>
			<li><strong>type:</strong> <?=$personality?></li>
			<li><strong>OS:</strong> <?=$os?></li>
		</ul>
	</div>
<?php }
	
/*returns a path to get the match's picture from*/
function getPic($matchName){
	$convertedName = implode("_",explode(" ", strtolower($matchName)));
		return("hw4_images/$convertedName.jpg");
}
	
#checks if the user and current person's ages are within each other's seeking age ranges	
function checkAges($userAge, $age, $userMin, $userMax, $seekingMin, $seekingMax){
	$userAgeOkay = ($userAge<=$seekingMax && $userAge>=$seekingMin);
	$matchAgeOkay = ($age>=$userMin && $age<=$userMax);
	return($userAgeOkay && $matchAgeOkay);
}

#checks if the user and current person's OS choices match		
function checkOs($userOs, $os){
	return($userOs == $os);
}
	
/*checks if the user and current person's personality types have 
at least one character in common*/	
function checkPers($userPers, $personality){
	return(similar_text($userPers, $personality)>0);
}

#checks if the user and current person's seekGenders are compatible
function checkSeekGender($userSeekGender, $seekGender, $userGender, $gender){
	$userGenderOkay = (similar_text($seekGender, $userGender)==1);
	$matchGenderOkay = (similar_text($userSeekGender, $gender)==1);
	return($userGenderOkay && $matchGenderOkay);
}

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
<?php } 

/*prints specific error for when the user tries to find matches for 
a name that is not in the database*/
function printExistError(){
?>	<p><strong>Error! Search Failed.</strong></p>
	<p>
	 We're sorry. This name is not registered in the nerdLuv system. 
	 Please go to the "New User Signup" page to register this name.
	</p>
<?php	
	#still have to print bottom before quitting
	printBottom(); /*prints the footer from common.php*/
	exit();
}?>