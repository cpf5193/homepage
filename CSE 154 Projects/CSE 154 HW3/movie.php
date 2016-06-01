<?php
header('Content-type: text/html; charset=UTF-8');
if(!isset($_GET["film"])){
	header("Location: selector.php");
	die();
}elseif(!file_exists($_GET["film"])){ /*no valid film provided as search query*/ ?>
<!--
Christon Fukuhara
CSE 154 BF/BU
Homework Assignment 3
October 17, 2012
-->
<!--
All extra features included; also included the functionality that if the "reviews" query is negative
or zero, the bottom of the main section should read "(0-0) of [$total_number_of_reviews]" instead of
"(1-0) of [$total_number_of_reviews]".
-->
<!DOCTYPE html>
<html>
	<head></head>	
	<body>Movie Not Found</body>
</html>
<?php	}else{ //all files are assumed to be valid; continue to main part of file
			$movie = $_GET["film"];
			list($movTitle, $year, $rating) = file("$movie/info.txt", FILE_IGNORE_NEW_LINES); /*assigns variable names to info lines*/ ?> 
		<title>Rancid Tomatoes - <?=$movTitle?></title>
		<meta name="description" content= "Rancid Tomatoes Film Review Webpage" />
		<meta name="keywords" content = "rancid, tomatoes, movie, reviews, review, rotten, fresh"/> 
		<link href="movie.css" type="text/css" rel="stylesheet" />
		<link href="hw3_images/rotten_thumb.gif" type="all/screen" rel="shortcut icon" />
	</head>

	<body>
		<div class="bodyBanner" id="topBanner"> 
			<img src="hw3_images/banner.png" alt="Rancid Tomatoes" width="974px" height="50px"/>
		</div>
		<h1><?=$movTitle?> (<?=$year?>)</h1>
		
		<div id="middleBox">
		<?php list($leftColRevs, $rightColRevs, $totalReviews, $numReviews) = decideReviews($movie); ?>
			<div class = "midBanner" id = "topMidBanner">
			<?php putRatingBanner($rating, $totalReviews); ?>
			</div>
			
			<div id="rightMidCol">
				<div>
			<?php   $overviewimg = file("$movie/overview.png", FILE_IGNORE_NEW_LINES);  ?>
					<img src= "<?=$movie?>/overview.png" alt="general overview" width="250px" height="412px"/>
				</div>

				<dl>				
				<?php overviewTerms($movie);?>
				</dl>
			</div>		
				
			<div id = "critics">
				<div id="leftMidCol">	
					<?php printReviews($leftColRevs);/*calls method to show the reviews in the left column*/?> 
				</div>
					
				<div id="midMidCol">
					<?php printReviews($rightColRevs);/*calls method to show the reviews in the right column*/?>
				</div>
			</div>
			
			<p id="botMidCol">
		<?php   $startVal = decideStartVal($numReviews);?>
				(<?=$startVal?>-<?=$numReviews/*range of reviews shown*/?>) of <?=$totalReviews?> 
			</p>
			
			<div class = "midBanner" id = "botMidBanner">
				<?php putRatingBanner($rating, $totalReviews); ?>
			</div>
		</div>

		<div id="validators">
			<a href="https://webster.cs.washington.edu/validate-html.php">
				<img src="hw3_images/transparent.png" class="w3c_html" width="64px" height="64px"/>
			</a><br />
			<a href="https://webster.cs.washington.edu/validate-css.php">
				<img src="hw3_images/transparent.png" class="w3c_css" width="64px" height="64px"/>
			</a>
		</div>		
		
		<div class = "bodyBanner" id = "botBanner">
			<img src="hw3_images/banner.png" alt="Rancid Tomatoes" width="974px" height="50px"/>
		</div>
	</body>
</html>
  <?php 
}//close else

	//FUNCTIONS:
	
	//function to print reviews in a column given an array of review information
	function printReviews($revArray){
		foreach($revArray as $reviewInfo){ //for each set of info in the review array
			list($revText, $rotOrFresh, $revName, $publication) = $reviewInfo; //assign variable names for each line of info
			$picName = trim(strtolower($rotOrFresh)) . "_thumb"; //for image src
		//	$picAlt = strtoupper(substr($picName, 0, 1)) + substr($picName, 1);/*capitalize first letter for img alt*/?>
			<p>
				<img src="hw3_images/transparent.png" class="<?=$picName?>" width="64px" height="64px"/>
				<q> <?=$revText?> </q>
			</p>
							
			<p>
				<img src="hw3_images/transparent.png" class="critic" width="64px" height="64px"/> <?=$revName?> <br />
				<span><?=$publication?></span>
			</p>
<?php   }
	}  
	
	/*function decideReviews returns an array of four elements, the first element containing an array of reviews for the left column,
	  the second element containing an array of reviews for the right column for the given movie. Each review is itself an array
	  of the information contained in each review text file. The third and fourth elements contain the variables $numReviews and 
	  $totalReviews, which are calculated in decideReviews and are passed back out with the array to use for the remainder of the file*/
	function decideReviews($movie){
	$reviews = array();																																	
		foreach(glob("$movie/review*.txt") as $fileName){ //for each review in the movie's directory 
			$reviews[] = file("$fileName", FILE_IGNORE_NEW_LINES); //insert the review as an array of its lines into an array (array of arrays)
		}
		$totalReviews = count($reviews);//number of reviews on file for the movie
		if(isset($_GET["reviews"])){ //query variable provided for number of reviews to display
			$numToShow = $_GET["reviews"]; 
			if($numToShow < 0) //negative query variable provided
				$numReviews = 0; //treat as 0
			elseif($numToShow >=  $totalReviews) //query variable bigger than actual number of reviews 
				$numReviews = $totalReviews; //treat as all reviews
			else
				$numReviews = $numToShow; //show amount of reviews requested
		}
		else $numReviews = $totalReviews; //no query variable provided; show all reviews
				
		if($numReviews % 2 == 1){ //odd number of reviews to display
			$revsInLeft = ($numReviews-1) / 2 + 1;
			$revsInRight = ($numReviews-1) / 2;
		} else{ //even number of reviews to display
			$revsInLeft = $numReviews / 2; 
			$revsInRight = $revsInLeft; //more efficient than repeating above assignment
		}
		return array(array_slice($reviews, 0, $revsInLeft)/*left column*/, 
array_slice($reviews, $revsInLeft, $revsInRight)/*right column*/, $totalReviews, $numReviews); //continued line
	}
	
	//function to place a rating banner in the middle box
	function putRatingBanner($rating, $totalReviews){
		if($rating>=60){ ?>																																	
			<img src="hw3_images/transparent.png" class = "fresh ratingimg" width="64px" height="64px"/><?=$rating?><span class ="outOf">% (out of <?=$totalReviews?> reviews)</span> <!--continued line-->
<?php   }
		else{  
?>
			<img src="hw3_images/transparent.png" class = "rotten ratingimg" width="64px" height="64px"/><?=$rating?><span class ="outOf">% (out of <?=$totalReviews?> reviews)</span> <!--continued line-->
<?php   } 
	}	
	
	//function to assign the starting value to the range of reviews based on the query variable "reviews"
	function decideStartVal($numReviews){
		if($numReviews > 0) //showing at least 1 review																										
			$startVal = 1; 
		else//used to show the appropriate range of reviews if the query variable is <= 0
			$startVal = 0; 
		return $startVal;
	}
	
	//function to print the terms & definitions of the overview definition list
	function overviewTerms($movie){
		$overview = file("$movie/overview.txt", FILE_IGNORE_NEW_LINES);
		list($term, $definition) = $overview;
		for($j=0; $j<count($overview); $j++){ 
			$sections = explode(":", $overview[$j]); //separate the terms of the list from the definitions using an array
			list($term, $definition) = $sections;  //assign variables to the two elements of the array
		?>
			<dt><?=$term?></dt>
			<dd><?=$definition?></dd>
<?php
		} 	?>
			<dt>LINKS</dt>
			<dd>
				<ul id = "links">
					<li><a href="http://www.ninjaturtles.com/">The Official TMNT Site</a></li>
					<li><a href="http://www.rottentomatoes.com/m/teenage_mutant_ninja_turtles/">RT Review</a></li>
					<li><a href="http://www.rottentomatoes.com/">RT Home</a></li>
				</ul>
			</dd>
<?php	}	?>