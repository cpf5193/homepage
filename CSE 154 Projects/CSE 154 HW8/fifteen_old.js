/*
Christon Fukuhara
CSE 154 BF/BU HW8b
November 27, 2012
Fifteen Puzzle fifteen.js

Fifteen Puzzle is a simple game where the user clicks on directly adjacent squares
that neighbor an empty slot on a 4x4 grid of tiles, and that tile slides into the 
empty space, until the tiles are in order.

fifteen.js controls the functionality of the webpage and the gameplay of the tiles

Implemented Extra Feature #4
*/

"use strict";
(function(){
	var EMPTYX = 3;//offset of empty slot from left
	var EMPTYY = 3;//offset of empty slot from top
	var BOARDSIZE = 400; //height and width of entire grid (constant)
	var DIMENSION = 4; //Number of rows & columns
	var TILESIZE = Math.round(BOARDSIZE/DIMENSION); //height and width of each tile
	//rather than hard-coding the background options into the html, I used the rule that each 
	//was given a lower case descriptive name, which is also the name of the image file (e.g. 
	//webster.cs.washington.edu/cpf5193/hw8b/mario.jpg)
	var OPTIONNAMES = ["mario", "zelda", "kirby", "chrome", "firefox", "ie"]; //background options
	
	window.onload = function(){
		for(var i=0; i<(DIMENSION*DIMENSION-1); i++){
			createBox(); //create the initial tiles
		}
		bgOptions(); //create background options
		chooseBackground(); //choose initial background
		boardSize();
		if(!localStorage.winCount || localStorage.winCount=="NaN"){
			localStorage.winCount = 0;
		}
		//set handlers
		document.getElementById("boardSize").onchange = changeDim;
		document.getElementById("winCount").innerHTML = 
			"<p> Total Wins: " + localStorage.winCount + " <p>";
		document.getElementById("background").onchange = chooseBackground;
		document.getElementById("shuffle").onclick = shuffle;
		var boxes = document.querySelectorAll(".box");
		for(var j=0; j<boxes.length; j++){
			boxes[j].onmouseover = hoverEffects;
			boxes[j].onmouseout = exited;
		}
	};

	/*creates a new initial tile and its attributes*/
	function createBox(){
		var box = document.createElement("div");
		var puzzleSpace = document.getElementById("puzzlearea");
		var numBoxes = puzzleSpace.childNodes.length;
		var xPos = numBoxes%DIMENSION;
		var yPos = Math.floor(numBoxes/DIMENSION);
		setId(box, xPos, yPos); //set id of each box based on x and y position
		box.classList.add("box"); //give each box the same class
		//set box's appearance
		box.style.left = (xPos*TILESIZE) + "px";
		box.style.top = (yPos*TILESIZE) + "px";
		box.style.width = (TILESIZE-10) + "px";
		box.style.height = (TILESIZE-10) + "px";
		box.innerHTML = "<p>" + (numBoxes+1) + "</p>"; //size of numBoxes grows as they are added
		var background = document.getElementById("background");
		box.style.backgroundImage = 
		"url(\"hw8_images/"+background.value+"\")";
		box.style.backgroundPosition = -(xPos*TILESIZE) + "px " + -(yPos*TILESIZE) + "px";
		puzzleSpace.appendChild(box);	
	}

	/*Sets the background according to what is chosen in the background drop-down list*/
	function chooseBackground(){
		var background = document.getElementById("background");
		var boxes = document.querySelectorAll(".box");
		for(var opt=0; opt<OPTIONNAMES.length; opt++){
			if(OPTIONNAMES[opt].selected=="selected"){
				OPTIONNAMES[opt].selected=""; //find "selected" background, prepare to change
			}
		}			
		var path="url(\"hw8_images/"+background.value + "\")";
		localStorage.bgImg = path;
		for(var i=0; i<boxes.length; i++){
			//set background and update associated variables
			boxes[i].style.backgroundImage = "" + path;
			boxes[i].selected="selected";
		}
	}
	
	/*Sets the background image options for the user to select from*/
	function bgOptions(){
		if(!localStorage.bgImg){
			//bgImg is the first option if not already set
			localStorage.bgImg = "url(\"hw8_images/"+OPTIONNAMES[0]+".jpg\")"; 
		}
		var background = document.getElementById("background");
		var option; var optionPath;
		for(var i=0; i<OPTIONNAMES.length; i++){
			option = document.createElement("option");
			option.selected = "";
			optionPath = "url(\"hw8_images/"+OPTIONNAMES[i]+".jpg\")";
			if(localStorage.bgImg==(optionPath)){
				option.selected = "selected"; //set stored bgImg to selected
			}
			option.id = OPTIONNAMES[i];
			option.value = option.id + ".jpg";
			option.innerHTML = OPTIONNAMES[i].toUpperCase();	
			background.appendChild(option);
		}
	}

	/*Creates the options for the dimensions of the puzzle area, initially selecting 4x4*/
	function boardSize(){
		var board = document.getElementById("boardSize");
		var option;
		for(var i=2; i<7; i++){
			option = document.createElement("option");
			option.value = i; 
			option.innerHTML = i + " x " + i;
			if(i==4){
				option.selected = "selected";
			}
			board.appendChild(option);
		}
	}
	
	/*Changes the dimensions of the grid and resets the grid*/
	function changeDim(){
		DIMENSION = this.value;
		EMPTYX = DIMENSION-1;
		EMPTYY = DIMENSION-1;
		TILESIZE = Math.round(BOARDSIZE/DIMENSION);
		var puzzleSpace = document.getElementById("puzzlearea");
		while(puzzleSpace.hasChildNodes()){//clear boxes
			puzzleSpace.removeChild(puzzleSpace.firstChild);
		}
		for(var i=0; i<(DIMENSION*DIMENSION-1); i++){
			createBox(); //create the initial tiles
		}
		var boxes = document.querySelectorAll(".box");
		for(var j=0; j<boxes.length; j++){
			boxes[j].onmouseover = hoverEffects;
			boxes[j].onmouseout = exited;
		}
		chooseBackground();
	}
	
	/*Moves the current box to the empty slot and updates id of this box
	  and the offset of the empty box*/
	function toEmpty(){
		if(checkWinner()){
			document.getElementById("winMessage").innerHTML = "";
		}
		moveNoCheck(this); 
		if(checkWinner()){
			document.getElementById("winMessage").innerHTML = "<p>Congratulations! You Won!</p>";
			localStorage.winCount = parseInt(localStorage.winCount)+1;
			document.getElementById("winCount").innerHTML = 
				"<p> Total Wins: " + localStorage.winCount + " <p>";
		}
	}
	
	/*Performs the swapping of stored state variables for the box being moved and the empty space
	without checking whether the grid has been solved*/
	function moveNoCheck(box){
		var newEmptyX = parseInt(box.style.left)/TILESIZE;
		var newEmptyY = parseInt(box.style.top)/TILESIZE;
		box.style.left = (EMPTYX*TILESIZE) + "px";
		box.style.top = (EMPTYY*TILESIZE) + "px";
		setId(box, EMPTYX, EMPTYY);
		EMPTYX = newEmptyX;
		EMPTYY = newEmptyY;
	}

	/*Returns the block back to its original state when the mouse exits the tile*/
	function exited(){
		this.onclick=null;
		if(this.classList.contains("movable")){
			this.classList.remove("movable");
		}
	}
	
	//Changes border color and cursor style if box is movable and hovered over
	function hoverEffects(){
		if(canMove(this)){
			this.onclick=toEmpty;
			if(!this.classList.contains("movable")){
				this.classList.add("movable");
			}
		}
	}
	
	/*Checks if the tiles are in the correct positions from 1 to 15*/
	function checkWinner(){
		//quick check to see if empty space is in the bottom right corner
		if(EMPTYX!=(DIMENSION-1) || EMPTYY!=(DIMENSION-1)){ 
			return false;
		}
		var boxList = document.getElementById("puzzlearea").childNodes;
		for(var yPos=0; yPos<DIMENSION; yPos++){
			for(var xPos=0; xPos<DIMENSION; xPos++){
				//check if this block is in the expected position
				var index = DIMENSION*yPos+xPos;
				if(index<DIMENSION*DIMENSION-1){
					var wrongX = parseInt(boxList[index].style.left)!=(xPos*TILESIZE);
					var wrongY = parseInt(boxList[index].style.top)!=(yPos*TILESIZE);
					if(wrongX || wrongY){
						return false;
					}
				}
			}
		}
		return true;
	}
	
	//makes 1000 random tile moves to shuffle the playing tiles
	function shuffle(){
		var neighbors = [];
		for(var i=0; i<1000; i++){
			neighbors = emptyNeighbors();
			//choose random valid neighbor, move to empty space
			moveNoCheck(neighbors[parseInt(Math.random()*neighbors.length)]);
		}
	}
	
	/*Check if this tile is a neighbor of the empty space*/
	function canMove(box){ 
		return (emptyNeighbors().indexOf(box)!=-1); 
	}
	
	//gets the DOM object box at grid position xPos, yPos
	function boxAtPos(xPos, yPos){
		if(isInGrid(xPos, yPos)){
			return document.getElementById("box" + xPos + yPos);
		}
	}
	
	//sets the box's id based on its position
	function setId(box, xPos, yPos){ box.id = "box" + xPos + yPos; }
	
	//returns whether the given x and y position is in the grid
	function isInGrid(xPos, yPos){
		return (xPos>=0 && xPos <DIMENSION && yPos>=0 && yPos<DIMENSION);
	}
	
	//returns an array holding all neighbors that can move into the empty space
	function emptyNeighbors(){
		var neighbors = [];
		if(isInGrid(EMPTYX+1, EMPTYY)){
			neighbors.push(boxAtPos(EMPTYX+1, EMPTYY));
		}
		if(isInGrid(EMPTYX-1, EMPTYY)){
			neighbors.push(boxAtPos(EMPTYX-1, EMPTYY));
		}
		if(isInGrid(EMPTYX, EMPTYY+1)){
			neighbors.push(boxAtPos(EMPTYX, EMPTYY+1));
		}
		if(isInGrid(EMPTYX, EMPTYY-1)){
			neighbors.push(boxAtPos(EMPTYX, EMPTYY-1));
		}
		return neighbors;
	}
})();