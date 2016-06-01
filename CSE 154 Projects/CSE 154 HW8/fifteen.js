"use strict";
(function(){
	var EMPTYX=3;var EMPTYY=3;var BOARDSIZE=400;var DIMENSION=4;
	var TILESIZE=Math.round(BOARDSIZE/DIMENSION);
	var OPTIONNAMES=["mario","zelda","kirby","chrome","firefox","ie"];
	window.onload=function(){
		for(var i=0;i<(DIMENSION*DIMENSION-1);i++){createBox();}
		bgOptions();
		chooseBackground();
		boardSize();
		if(!localStorage.winCount||localStorage.winCount=="NaN"){localStorage.winCount=0;}
		document.getElementById("boardSize").onchange=changeDim;
		document.getElementById("winCount").innerHTML="<p> Total Wins: "+localStorage.winCount+" <p>";
		document.getElementById("background").onchange=chooseBackground;
		document.getElementById("shuffle").onclick=shuffle;
		var boxes=document.querySelectorAll(".box");
		for(var j=0;j<boxes.length;j++){
			boxes[j].onmouseover=hoverEffects;boxes[j].onmouseout=exited;
		}
	};
	function createBox(){
		var box=document.createElement("div");
		var puzzleSpace=document.getElementById("puzzlearea");
		var numBoxes=puzzleSpace.childNodes.length;
		var xPos=numBoxes%DIMENSION;
		var yPos=Math.floor(numBoxes/DIMENSION);
		setId(box,xPos,yPos);box.classList.add("box");
		box.style.left=(xPos*TILESIZE)+"px";
		box.style.top=(yPos*TILESIZE)+"px";
		box.style.width=(TILESIZE-10)+"px";
		box.style.height=(TILESIZE-10)+"px";
		box.innerHTML="<p>"+(numBoxes+1)+"</p>";
		var background=document.getElementById("background");
		box.style.backgroundImage="url(\"hw8_images/"+background.value+"\")";
		box.style.backgroundPosition=-(xPos*TILESIZE)+"px "+-(yPos*TILESIZE)+"px";
		puzzleSpace.appendChild(box);
	}
	function chooseBackground(){
		var background=document.getElementById("background");
		var boxes=document.querySelectorAll(".box");
		for(var opt=0;opt<OPTIONNAMES.length;opt++){
			if(OPTIONNAMES[opt].selected=="selected"){OPTIONNAMES[opt].selected="";}
		}
		var path="url(\"hw8_images/"+background.value+"\")";
		localStorage.bgImg=path;
		for(var i=0;i<boxes.length;i++){
			boxes[i].style.backgroundImage=""+path;
			boxes[i].selected="selected";
		}
	}
	function bgOptions(){
		if(!localStorage.bgImg){localStorage.bgImg="url(\"hw8_images/"+OPTIONNAMES[0]+".jpg\")";}
		var background=document.getElementById("background");
		var option;
		var optionPath;
		for(var i=0;i<OPTIONNAMES.length;i++){
			option=document.createElement("option");
			option.selected="";
			optionPath="url(\"hw8_images/"+OPTIONNAMES[i]+".jpg\")";
			if(localStorage.bgImg==(optionPath)){option.selected="selected";}
			option.id=OPTIONNAMES[i];
			option.value=option.id+".jpg";
			option.innerHTML=OPTIONNAMES[i].toUpperCase();
			background.appendChild(option);
		}
	}
	function boardSize(){
		var board=document.getElementById("boardSize");
		var option;
		for(var i=2;i<7;i++){
			option=document.createElement("option");
			option.value=i;
			option.innerHTML=i+" x "+i;
			if(i==4){option.selected="selected";}
			board.appendChild(option);
		}
	}
	function changeDim(){
		DIMENSION=this.value;
		EMPTYX=DIMENSION-1;
		EMPTYY=DIMENSION-1;
		TILESIZE=Math.round(BOARDSIZE/DIMENSION);
		var puzzleSpace=document.getElementById("puzzlearea");
		while(puzzleSpace.hasChildNodes()){
			puzzleSpace.removeChild(puzzleSpace.firstChild);
		}
		for(var i=0;i<(DIMENSION*DIMENSION-1);i++){createBox();}
		var boxes=document.querySelectorAll(".box");
		for(var j=0;j<boxes.length;j++){
			boxes[j].onmouseover=hoverEffects;
			boxes[j].onmouseout=exited;
		}
		chooseBackground();
	}
	function toEmpty(){
		if(checkWinner()){
			document.getElementById("winMessage").innerHTML="";
		}
		moveNoCheck(this);
		if(checkWinner()){
			document.getElementById("winMessage").innerHTML="<p>Congratulations! You Won!</p>";
			localStorage.winCount=parseInt(localStorage.winCount)+1;
			document.getElementById("winCount").innerHTML="<p> Total Wins: "+localStorage.winCount+" <p>";
		}
	}
	function moveNoCheck(box){
		var newEmptyX=parseInt(box.style.left)/TILESIZE;
		var newEmptyY=parseInt(box.style.top)/TILESIZE;
		box.style.left=(EMPTYX*TILESIZE)+"px";
		box.style.top=(EMPTYY*TILESIZE)+"px";
		setId(box,EMPTYX,EMPTYY);
		EMPTYX=newEmptyX;
		EMPTYY=newEmptyY;
	}
	function exited(){
		this.onclick=null;
		if(this.classList.contains("movable")){this.classList.remove("movable");}
	}
	function hoverEffects(){
		if(canMove(this)){
			this.onclick=toEmpty;
			if(!this.classList.contains("movable")){this.classList.add("movable");}
		}
	}
	function checkWinner(){
		if(EMPTYX!=(DIMENSION-1)||EMPTYY!=(DIMENSION-1)){return false;}
		var boxList=document.getElementById("puzzlearea").childNodes;
		for(var yPos=0;yPos<DIMENSION;yPos++){
			for(var xPos=0;xPos<DIMENSION;xPos++){
				var index=DIMENSION*yPos+xPos;
				if(index<DIMENSION*DIMENSION-1){
					var wrongX=parseInt(boxList[index].style.left)!=(xPos*TILESIZE);
					var wrongY=parseInt(boxList[index].style.top)!=(yPos*TILESIZE);
					if(wrongX||wrongY){return false;}
				}
			}
		}
		return true;
	}
	function shuffle(){
		var neighbors=[];
		for(var i=0;i<1000;i++){
			neighbors=emptyNeighbors();
			moveNoCheck(neighbors[parseInt(Math.random()*neighbors.length)]);
		}
	}
	function canMove(box){
		return(emptyNeighbors().indexOf(box)!=-1);
	}
	function boxAtPos(xPos,yPos){
		if(isInGrid(xPos,yPos)){
			return document.getElementById("box"+xPos+yPos);
		}
	}
	function setId(box,xPos,yPos){box.id="box"+xPos+yPos;}
	function isInGrid(xPos,yPos){return(xPos>=0&&xPos<DIMENSION&&yPos>=0&&yPos<DIMENSION);}
	function emptyNeighbors(){
		var neighbors=[];
		if(isInGrid(EMPTYX+1,EMPTYY)){
			neighbors.push(boxAtPos(EMPTYX+1,EMPTYY));
		}
		if(isInGrid(EMPTYX-1,EMPTYY)){neighbors.push(boxAtPos(EMPTYX-1,EMPTYY));}
		if(isInGrid(EMPTYX,EMPTYY+1)){neighbors.push(boxAtPos(EMPTYX,EMPTYY+1));}
		if(isInGrid(EMPTYX,EMPTYY-1)){neighbors.push(boxAtPos(EMPTYX,EMPTYY-1));}
		return neighbors;
	}
})();