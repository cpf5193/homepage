(function(){
var VOTING=false;
var SUBMITTING=true;
var DISABLE_GALLERY=true;
var GRADING_MODE=true;
var GRADING_SCRIPT_URL="https://webster.cs.washington.edu/js/asciimation/grading.js";var FONT="9pt";
var SURVEY_LINK="http://apps.facebook.com/uwcseapptest/asciimation/vote.php?quarter=49fdf851b1992&homework=49fe37132c93f";
var STUDENTS_LIST_LINK="https://webster.cs.washington.edu/cse154/homework/hw7/ascii.php";
if(location.href.match(/\/ta/)){
	STUDENTS_LIST_LINK="https://www.cs.washington.edu/education/courses/cse154/12au/proxy.php?url="+STUDENTS_LIST_LINK;
}
var textarea=null;
var uwnetid="";
var loadScript=function(url,immediately){
	if(immediately){
		document.write("<script src=\""+url+"\" type=\"text/javascript\"></script>\n");
	}else{
		var scriptTag=document.createElement("script");
		scriptTag.type="text/javascript";
		scriptTag.src=url;
		document.body.appendChild(scriptTag);
	}
};
parseQueryParams();
if($_REQUEST["gallery"]==="1"||$_REQUEST["gallery"]==="true"||location.href.match(/taResources/)){
	DISABLE_GALLERY=false;
}if(GRADING_MODE){
	if(typeof(Prototype)==="undefined"){loadScript("https://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js",true);}
	if(typeof(JStep)==="undefined"){loadScript("https://webster.cs.washington.edu/js/jstep.js",true);}
	loadScript(GRADING_SCRIPT_URL,true);
}
if(window.addEventListener){
	window.addEventListener("load",galleryOnload,false);
}else if(window.attachEvent){
	window.attachEvent("onload",galleryOnload);
}
function galleryOnload(){
	var heart=document.createElement("span");
	heart.id="galleryheart";
	heart.innerHTML="&hearts;";
	heart.style.color="red";
	heart.style.backgroundColor="transparent";
	heart.style.fontFamily="Arial, sans-serif";
	heart.style.fontSize="24pt";
	heart.style.lineHeight="24pt";
	heart.style.position="fixed";
	heart.style.top="0px";
	heart.style.left="0px";
	document.body.appendChild(heart);
	if(DISABLE_GALLERY||(location.hostname!="webster.cs.washington.edu"&&!location.href.match(/taResources/))){
		return;
	}
	uwnetid=location.pathname.substring(1).replace(/\/.*/,"");
	if(typeof(uwnetid.trim)==="function"){
		uwnetid=uwnetid.trim();
	}if(!uwnetid||uwnetid.length<2||uwnetid.length>8){
		SUBMITTING=false;
	}
	var textareas=document.getElementsByTagName("textarea");
	if(textareas.length==0){
		return;
	}
	textarea=textareas[0];
	var firstFieldset=document.getElementsByTagName("fieldset")[0];
	if(firstFieldset){
		voteDiv=document.createElement("fieldset");
		voteDiv.id="votes";
		var legend=document.createElement("legend");
		legend.innerHTML="Gallery:";
		voteDiv.appendChild(legend);
		firstFieldset.parentNode.insertBefore(voteDiv,firstFieldset);
		firstFieldset.parentNode.insertBefore(document.createTextNode(" "),firstFieldset);
	}else{
		voteDiv=document.createElement("div");
		voteDiv.id="votes";
		voteDiv.style.fontSize=FONT;
		voteDiv.style.fontWeight="normal";
		voteDiv.style.left="0px";
		voteDiv.style.position="fixed";
		voteDiv.style.bottom="0px";
		voteDiv.style.fontSize=FONT;
		voteDiv.style.fontWeight="normal";
		document.body.appendChild(voteDiv);
	}
	if(VOTING){
		var a=document.createElement("a");
		a.href=SURVEY_LINK;
		a.innerHTML="Vote!";
		a.target="_blank";
		voteDiv.appendChild(a);
	}
	if(SUBMITTING){
		var button=document.createElement("button");
		button.id="submitasciiart";
		button.innerHTML="Submit";
		button.title="Click here to submit your ASCII art to Webster for other students to see!";
		button.onclick=submitClick;
		if(!firstFieldset){
			button.style.fontSize=FONT;
			button.style.fontWeight="normal";
		}
		voteDiv.appendChild(button);
	}
	var select=document.createElement("select");
	select.id="gallery";
	select.onchange=loadAnimation;
	select.title="This is a list of other students' ASCII art that has been submitted to Webster.  Take a look!";
	if(!firstFieldset){
		select.style.fontSize=FONT;
		select.style.fontWeight="normal";
		select.style.width="90px";
		select.style.maxWidth="90px";
	}
	voteDiv.appendChild(select);
	var option=document.createElement("option");
	option.value="";
	option.innerHTML="Loading...";
	if(!firstFieldset){
		option.style.fontSize=FONT;
		option.style.fontWeight="normal";
	}
	select.appendChild(option);
	fetchStudents();
}
function buildSelectOptions(ajax){
	var text=ajax.responseText;
	if(typeof(text.trim)==="function"){
		text=text.trim();
	}
	var sortedStudents=text.split(/\r?\n/);
	sortedStudents.sort();
	var select=document.getElementById("gallery");
	while(select.firstChild){
		select.removeChild(select.firstChild);
	}
	var option=document.createElement("option");
	option.value="";
	option.innerHTML="(choose)";
	option.style.fontSize=FONT;
	option.style.fontWeight="normal";
	select.appendChild(option);
	for(var i=0;i<sortedStudents.length;i++){
		if(sortedStudents[i]){
			var option=document.createElement("option");
			option.value=option.innerHTML=sortedStudents[i];
			select.appendChild(option);
		}
	}
}
function fetchStudents(){ajaxHelper(STUDENTS_LIST_LINK,buildSelectOptions);}
function loadAnimation(){
	var uwnetid=this.value;
	if(!uwnetid){
		return;
	}
	textarea.value="Fetching from Webster server...";
	ajaxHelper(STUDENTS_LIST_LINK+(STUDENTS_LIST_LINK.match(/[?]/)?"&":"?")+"name="+uwnetid,function(ajax){textarea.value=ajax.responseText;});
}
function submitClick(event){
	if(typeof(event.stopPropagation)==="function"){
		event.stopPropagation();
	}
	if(!uwnetid||!textarea.value){return;}
	if(!confirm("This will submit an ASCII animation for '"+uwnetid+"' to our gallery for other students to see.  The ASCII art submitted will be whatever is currently showing in your main text area.  Continue?")){return;}
	ajaxHelper(STUDENTS_LIST_LINK,function(ajax){alert("Your ASCII art was submitted successfully!");fetchStudents();},true,{"name":uwnetid,"ascii":textarea.value});return false;
}
function ajaxHelper(url,fn,post,params){var ajax=new XMLHttpRequest();var paramStr=null;ajax.onreadystatechange=function(event){if(ajax.readyState==4){if(ajax.status==200){fn(ajax);}else if(ajax.status!=0){ajaxError(ajax);}}};if(post){paramStr="";if(params){params["dontcacheme"]=new Date().getTime()+"+"+Math.random();for(var name in params){paramStr+=(paramStr.length==0?"":"&")+encodeURIComponent(name)+"="+encodeURIComponent(params[name]);}}}else{url+=(url.match(/[?]/)?"&":"?")+"dontcacheme="+(new Date().getTime()+"+"+Math.random());}
ajax.open(post?"POST":"GET",url,true);if(post){ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");}
ajax.send(paramStr);}
function ajaxError(ajax,exception){
	var errorText="Error making web request.\n\nServer status:\n"+ajax.status+" "+ajax.statusText+"\n\n"+"Server response text:\n"+ajax.responseText;
	if(exception){errorText+="\nException: "+exception.message;}
	alert(errorText);
	return errorText;
}
function parseQueryParams(){
	$_REQUEST={};
	if(!window.location.search||window.location.search.length<1){return $_REQUEST;}
	var url=window.location.search.substring(1);
	var chunks=url.split(/&/);
	for(var i=0;i<chunks.length;i++){
		var keyValue=chunks[i].split(/=/);
		if(keyValue[0]&&keyValue[1]){
			var thisValue=unescape(keyValue[1]);
			thisValue=thisValue.replace(/[+]/," ");
			$_REQUEST[keyValue[0]]=thisValue;
		}
	}
	return $_REQUEST;
}})();