<?php
/*
Christon Fukuhara
CSE 154 BF/BU
December 6, 2012
HW9 Baby Names names.html

Baby Names gives statistics and information about names for children born 
in the US

names.html provides the concrete content of the page

Extra Feature 1 Implemented
*/
header('Content-type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Baby Names</title>
		<style>
		body{font-family: "Georgia", serif; font-size: 12pt;}
		q{font-style: italic;}
		#errors p{color: red; border: black 10px solid; background-color: yellow; font-weight: bold;}
		#graph td, #graph th{width: 50px;}
		#graph td{vertical-align: bottom; height: 250px;}
		#graph{text-align: center;}
		#graph div{background-color: #FFBBBB;}
		.popular{color: red;}
		</style>
	</head>
	<body>
		<h1>
			Baby Names
			<span id="w3c">
				<a href="https://webster.cs.washington.edu/validate-html.php"><img src="hw9_images/w3c_html.png" alt="Valid HTML" /></a>
				<a href="https://webster.cs.washington.edu/validate-css.php"><img src="hw9_images/w3c_css.png" alt="Valid CSS" /></a>
				<a href="https://webster.cs.washington.edu/jslint/?referer"><img src="hw9_images/w3c_js.png" alt="Valid JS" /></a>
			</span>
		</h1>
		<div id="namearea">
			<h2>First Name:</h2>
			<div>
				<!-- list of all baby names should be inserted into this select box -->
				<select id="allnames" name="allnames" disabled="disabled"><option value="">(choose a name)</option></select>
				<button id="search"><img src="hw9_images/pacifier.gif" alt="icon" />Search</button>
				<span class="loading" id="loadingnames"><img src="hw9_images/loading.gif" alt="icon" /> Loading...</span>
			</div>

			<div>
				<label><input type="radio" id="genderm" name="gender" value="m" checked="checked" /> Male</label>
				<label><input type="radio" id="genderf" name="gender" value="f" /> Female</label>
			</div>
		</div>

		<!-- un-hide this 'resultsarea' div when you fetch data about the name -->
		<div id="resultsarea" style="display: none;">
			<div id="originmeaning">
				<h2>Origin/Meaning:</h2>
				<div class="loading" id="loadingmeaning"><img src="hw9_images/loading.gif" alt="icon" /> Searching...</div>
				<div id="meaning"></div><!-- baby name meaning data should be inserted into this div -->
			</div>
			<div id="grapharea">
				<h2>Popularity:</h2>
				<div class="loading" id="loadinggraph"><img src="hw9_images/loading.gif" alt="icon" /> Searching...</div>
				<!-- if there is no ranking data for the given name, show this error message -->
				<div id="norankdata" style="display: none;"> There is no ranking data for that name/gender combination. </div>
				<table id="graph"></table><!-- baby name ranking data should be inserted into this table -->
			</div>
			<div id="celebsarea">
				<h2>Celebrities with This First Name:</h2>
				<div class="loading" id="loadingcelebs"><img src="hw9_images/loading.gif" alt="icon" /> Searching...</div>
				<!-- baby name celebrity data should be inserted into this list -->
				<ul id="celebs"></ul>
			</div>
		</div>
		<div id="errors"></div><!-- an empty div for inserting any error text -->
	</body>
</html>
<script src="proto_homepage_opt.js" type="text/javascript" async="async"></script>
<script src="names.js" type="text/javascript" async="async"></script>