"use strict";	
	(function(){
		window.onload = function(){
			if($("errorBox"))
				$("errorBox").className = "hidden";
			if($("errorMessage"))
				$("errorMessage").innerHTML = "";
			if($("enable"))
				$("enable").onclick=function(){genericAjax("enable.php", "username="+$("username").value+"&password="+$("password").value, activateLinks);};
		};
		
		function genericAjax(service, queryString, toCall){
			new Ajax.Request(service + "?" + queryString, {
				method: "get",
				onSuccess: toCall,
				onFailure: ajaxFail
			});
		}
		
		function activateLinks(ajax){
			if(ajax.responseText){
				if(JSON.parse(ajax.responseText).matches){
					var toActivate = document.getElementsByClassName("disabled");
					var i=toActivate.length;
					while(i>0){toActivate[0].className=""; i--;}
					$("errorBox").className="";
					$("errorMessage").innerHTML = "Links Activated";
				}
			}
			else{
				$("errorBox").className = "";
				$("errorMessage").innerHTML="Incorrect Credentials";
			}
		}
		
		function ajaxFail(ajax){
			alert("<p>Error making Ajax request:" + 
			"\n\nServer status:\n" + ajax.status + " " + ajax.statusText + 
			"\n\nServer response text:\n" + ajax.responseText + "</p>");
		}
	})();