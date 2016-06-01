/*
Christon Fukuhara
CSE 154 BF/BU
December 6, 2012
HW9 Baby Names names.js

Baby Names gives statistics and information about names for children born 
in the US

names.js provides the dynamic changes and functionality of the page.

Extra Feature 1 Implemented
*/

"use strict";
(function(){
	var SERVICE = "https://webster.cs.washington.edu/cse154/babynames.php?type=";
	window.onload = function(){
		$("allnames").disabled="disabled";
		$("loadingnames").show();
		$("resultsarea").hide();
		ajaxWithType("list", loadnames, "", "");
		$("search").observe("click", showResults);
	};
	
	//loads the list of name choices into the select box and enables it
	function loadnames(ajax){
		var array = ajax.responseText.split("\n");
		for(var i=0; i<array.length; i++){
			var element = document.createElement("option");
			element.innerHTML = array[i];
			element.value = array[i];
			$("allnames").appendChild(element);
		}
		$("allnames").disabled="";
		$("loadingnames").hide();
	}
	
	//handles ajax errors and exceptions
	function ajaxFail(ajax, exception){
		$$(".loading").each(Element.hide);
		if(ajax.status == 410){
			$("norankdata").show();
		}
		else{
			$("errors").innerHTML = "<p>Error making Ajax request:" + 
			"\n\nServer status:\n" + ajax.status + " " + ajax.statusText + 
			"\n\nServer response text:\n" + ajax.responseText + "</p>";
		}
	    if (exception) {
		  throw exception;
	    }
	}
	
	//shows the results of a request for a name's information
	function showResults(){
		clearAll();
		if($("allnames").value.length>0){//something other than default selected
			$("loadingmeaning").show();	
			$("loadinggraph").show();
			$("loadingcelebs").show();
			$("resultsarea").show();
			var name = $("allnames").value;
			var gender = getGender();
			ajaxWithType("meaning", meaning, name, "");//build and run meaning
			ajaxWithType("rank", rank, name, gender);//build and run rank
			ajaxWithType("celebs", celebs, name, gender);//build and run celebs
		}
	}
	
	//explicitly clears previously added html contents when the page loads 
	//or another search is requested
	function clearAll(){
		$("norankdata").hide();
		$("errors").innerHTML = "";
		$("celebs").innerHTML = "";
		$("meaning").innerHTML = "";
		$("graph").innerHTML = "";
	}
	
	//builds and returns a new ajax request object based on request type
	/*type is the type of request, func is the function to run upon success, 
	name is the name query parameter, and gender is the gender query parameter.
	name and gender should be given an empty string if it is not required for 
	the request*/
	function ajaxWithType(type, func, name, gender){
		//add any parameters in addition to type
		var paramString = "";
		if(type!="list" && name.length>0){
			paramString+= "&name=" + name;
		}
		if((type=="celebs" || type=="rank") && gender.length>0){
			paramString+= "&gender=" + gender;
		}
		//build the ajax object
		return new Ajax.Request(
			SERVICE + type + paramString,
			{method: "GET",
			onSuccess: func,
			onFailure: ajaxFail,
			onException: ajaxFail
			}
		);
	}
	
	//returns the gender for the given name
	function getGender(){
		var genders = document.getElementsByName("gender");
		for(var i=0; i<genders.length; i++){
			if(genders[i].checked){
			/*return first checked button's value,
			one and only one can be checked*/
				return genders[i].value;
			}
		}
	}
	
	
	//inserts the meaning of the given name into the page
	function meaning(ajax){
		$("meaning").innerHTML = ajax.responseText;
		$("loadingmeaning").hide();
	}
	
	//builds the rank graph for the given name and places it in the page
	function rank(ajax){
		var array = ajax.responseXML.getElementsByTagName("rank");
		var years = document.createElement("tr");
		var bars = document.createElement("tr");
		for(var i=0; i<array.length; i++){
			var decade = document.createElement("th");
			var rank = document.createElement("td");
			//get XML rank
			var rawRank = array[i].firstChild.nodeValue;
			var bar = document.createElement("div");
			if(rawRank <=10 && rawRank!=0){
				bar.addClassName("popular");
			}
			if(rawRank==0){
				bar.style.height = 0 + "px";
			}
			else{
				bar.style.height = parseInt((1000-rawRank)/4) + "px";
			}
			decade.innerHTML = array[i].getAttribute("year");
			bar.innerHTML = rawRank;
			rank.appendChild(bar);
			//put the table headers and data into the respective rows
			years.appendChild(decade);
			bars.appendChild(rank);
		}
		//place both rows on the page
		$("graph").appendChild(years);
		$("graph").appendChild(bars);
		$("loadinggraph").hide();
	}
	
	//builds a list of celebrities with the same first name as the given name
	//and displays it on the page
	function celebs(ajax){
		//turn text into JSON data array
		var actorList = JSON.parse(ajax.responseText).actors;
		//create and add list elements
		for(var i=0; i<actorList.length; i++){
			var actor = actorList[i];
			var child = document.createElement("li");
			child.innerHTML = actor.firstName + " " + actor.lastName + " " + 
					" (" + actor.filmCount + " films)";
			$("celebs").appendChild(child);
		}
		$("loadingcelebs").hide();
	}
})();