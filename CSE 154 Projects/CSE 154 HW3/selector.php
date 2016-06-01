<html>
	<head>
		<link href="hw3_images/rotten_thumb.gif" type="all/screen" rel="shortcut icon" />
	</head>
	<body>
		<form action="movie.php" method="get">
			Select a Movie: 
			<select name="film">
			<?php
				$movieList = glob("*", GLOB_ONLYDIR);
				for($i=0; $i<count($movieList); $i++){
					if($movieList[$i]!="hw3_images"){?>
					<option><?=$movieList[$i]?></option>
			<?php 	} 
				}?>
			</select>
			<input type="submit"/> 
		</form>
	</body>
</html>