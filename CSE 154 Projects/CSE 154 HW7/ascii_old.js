/*
Christon Fukuhara
CSE 154 BF/BU 
HW 7 ASCIImation
November 14, 2012

ASCIImation is an interactive page that displays and modifies animations
using ASCII code characters based on user interaction with the page.

ascii.js provides the functions that provide the ability of the page to 
be modified and interact with the user. 

*Extra Features 1 and 2 implemented*
*/
"use strict";

var interval = null;
var timer = null;
var frameNum = null;
var frameArray;

var SIZES = []; //array of possible font sizes, excluding custom initially
SIZES["Tiny"] = "7pt";
SIZES["Small"] = "10pt";
SIZES["Medium"] = "12pt";
SIZES["Large"] = "16pt";
SIZES["Extra Large"] = "24pt";
SIZES["XXL"] = "32pt";	

var SPEEDS = []; //array of possible timer intervals
SPEEDS["turbo"] = 50;
SPEEDS["normal"] = 250;
SPEEDS["slowmo"] = 1500;

window.onload = function(){
	ANIMATIONS["Custom"] = CUSTOMANIM["Custom"]; //add custom animation to animation list
	//attach handlers
	$("animations").onchange=showText;
	$("size").onchange=changeSize;
	$("turbo").onchange=setSpeed;
	$("normal").onchange=setSpeed;
	$("slowmo").onchange=setSpeed;
	$("start").onclick=runDisplay;
	$("stop").onclick=stopDisplay;
	halt();
}
//displays the current animation in the text area
function showText(){
	frameNum = 0;
	var textArea = $("display");
	textArea.value = ANIMATIONS[this.value]; //show the animation that was just changed to
}
//Changes the size of the displaying animation when the user changes the size field
function changeSize(){
	var textArea = $("display");
	var choice = this.value;
	if(choice == "Custom"){
		SIZES["Custom"] = getCustomSize(); //set custom array value to specified font
	}
	textArea.style.fontSize = SIZES[choice];
}
//sets the speed at which the panels of the animation change
function setSpeed(){
	if($("turbo").checked){interval = SPEEDS["turbo"];}
	else if($("normal").checked){interval = SPEEDS["normal"];}
	else{interval = SPEEDS["slowmo"];}
	if(timer!==null){ start();}// make sure clicking speed buttons doesn't start animation
}
//returns a string representing the user's specified font
function getCustomSize(){
	var customSize = prompt("Enter font size: (e.g. 12pt)") || "12pt";
	return customSize;
}
//starts the timer and enables and disables the appropriate controls when the display is running
function start(){
	clearInterval(timer);
	timer = setInterval(showFrame, interval);
	$("stop").disabled = false;
	$("start").disabled = true;
	$("animations").disabled = true;
}
//Enables and disables the appropriate controls when the display is not running
function halt(){
	$("stop").disabled = true;
	$("start").disabled = false;
	$("animations").disabled = false;
}
//starts running the current animation
function runDisplay(){
	frameArray = [];
	setSpeed();
	var fullAnim = $("display").value; //take frames from document
	var frames = fullAnim.split("=====\n"); //split into individual frames
	var i=0; 
	while(frames.length>0){ //create indexed array of frames 
		frameArray[i] = frames.shift();
		i++;
	}
	start();
}
//Stops running the current animation
function stopDisplay(){
	frameNum=0;
	clearInterval(timer);
	var toDisplay = ANIMATIONS[$("animations").value];
	$("display").value = toDisplay; //reset the text area to show all frames
	halt();
}
//Shows the next frame of the current animation
function showFrame(){
	var textArea = $("display");
	if(frameNum === null){ frameNum = 0; }
	textArea.value = frameArray[frameNum]; //display next frame
	if(!reverseChecked()){ //regular frame progression
		frameNum++; 
		if(frameNum==frameArray.length){ frameNum=0; }//reached last frame
	}
	else{ //reversed frame progression
		frameNum--; 
		if(frameNum<0){ frameNum = frameArray.length-1; }//reached first frame
	}
}
//returns whether or not the "reverse" checkbox is selected or not
function reverseChecked(){return $("reverse").checked;}