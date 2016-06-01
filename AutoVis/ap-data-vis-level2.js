/**
 * Autos pulse data visualization mid-level module.
 *
 * @module APDataVis2
 */
"use strict";

/**
 * @constructor
 * @augments Y.CIBaseWidget
 */
var pageData; //All data stored by the page

////////////////////////////////////////////////////////
// Constants
////////////////////////////////////////////////////////

var width = 800; //Width of visualization panel
var height = 800; //Height of visualization panel
var minDim = 800; //minimum size of width and height dimensions
var stdRad = 300; // common distance of dots from center
var maxModRad = 20; //Maximum model radius
var modelDist = 150; //Distance of models on mid-level from center
var maxMakeRad = 50; //Maximum make radius

///////////////////////////////////////////////////////
//Configurations
///////////////////////////////////////////////////////

var APDataVis2 = Y.APDataVis2 = function() {
	APDataVis2.superclass.constructor.apply(this, arguments);
};
APDataVis2.NAME = "APDataVis2";
APDataVis2.MODULE_TYPE = "dataVis2";
APDataVis2.PULSE_TYPE = "1";
APDataVis2.ATTRS = {
        "tier1Id" : {},
        "date" : {},
    };
//Default configurations
APDataVis2.CONFIG = {
    _LABELS : {
    	"PAGE_HEADING_TIER1" : "Brand Overview",
    	"PAGE_HEADING_TIER2" : "All Makes",
        "DATA_TYPE" : "Total Unique Visitors"
    },
    _LEGEND : {
        "yahooXValue": 25,
        "tier1XValue": 95,
        "tier2XValue": 150,
        "xValue": 140
    }
};

/**
*
* @class APDataVis2
* @constructor
* @arguments Y.CIBasePageModule
*/
Y.extend(APDataVis2, Y.CIBasePageModule, {
	
    inputParams : {
        "tier1Id" : "t1",
        "date" : "d"
    },
   
    //////////////////////////////////////////////////////////////////////////////////////////////
    // TEMPLATES
    //////////////////////////////////////////////////////////////////////////////////////////////
   
    /*Template for the header*/
    _HEADER_TEMPLATE : "<h3>{{tier1Name}}: {{pageHeaderEnd}}</h3>" +
      				   "<h4>{{pageHeading}}</h4>",
							
    /*Template for the overall content of the page*/
    _TEMPLATE : "<div id=\"APBrandMapContainer\"> " + 
			    "   <div id=\"inputContainer\">"+
			    "		<div class=\"col row visitorContainer\" id=\"overviewBox\" display=\"none\">" +
				"			<div class=\"ci-top-summary-button-container bml2-button-container col\">" +
				"            	<button class=\"yui3-button row\" id=\"bml2-get-overview-button\">Get Overview</button>" +	
				"			</div>" +
				"		</div>"+
			    "		<div class=\"col row visitorContainer box-shadow\" id=\"midLevelFilter\" display=\"none\">" +
				"			<div id=\"makeFilter\" class=\"col\">" +	
				"				<div id=\"midFilterHeader\"><h4>Other Makes (By Cross-Visitation)</h4></div>" +
				"				<div id=\"midRadios\" class=\"row\"> " + 
				"					<div class=\"custom-radio mid-radio\" name=\"numMakes\" value=5>Top Five</div>" + 
				"					<div class=\"custom-radio mid-radio\" name=\"numMakes\" value=10>Top Ten</div>" + 
				"					<div class=\"custom-radio mid-radio custom-checked\" name=\"numMakes\" value=15>Top Fifteen</div>" +
				"				</div>" + 
				"			</div>"+
				"		</div>"+
			    "   </div>" + 
			    "	<div id=\"map\"></div>" +
			    "</div>",
			    
	/*Template for the makes on the top level*/
	_MAKE_TOOLTIP_TEMPLATE : "	<div class=\"tooltipTitle\">{{data.brandName}}</div> " + 
							"	<div class=\"displayInline\"> " + 
							"		<div id=\"uniqueVisitors\"><strong>{{label.DATA_TYPE}}:</strong> {{data.uniqueVisitorCount}}</div>" + 
							"	</div>",
			    
	/*Template for the cross line tooltips on the second level*/
	_CROSSMAKE_TOOLTIP_TEMPLATE : "<div class=\"tooltipTitle\">{{data.makeName}} (from {{data.centerName}})</div>  " +
								  "<div><strong>Unique Cross-Visitors: </strong>	{{data.uniqueCrossCount}}</div>" + 
								  "<div><strong>Percent Overlap: </strong> {{data.percent}}</div>" +
								  "<div><strong>Rank: #</strong>{{data.rank}} most cross-visited make</div>",
	
	/*Template for model tooltips on the second level*/
	_MIDMODEL_TOOLTIP_TEMPLATE : "<div class=\"tooltipTitle\">{{data.modelName}}</div>" + 
								 "<div class=\"displayInline\"> " + 
								 "	<div id=\"midModel\"><strong></strong></div>" + 
								 "</div>",			    
								 
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Initialization Methods
    ///////////////////////////////////////////////////////////////////////////////////////////////
			    
    /**
     * Binder initialization method, invoked after all binders on the page
     * have been constructed.
     */
    init: function (p_oAttrs) {
        this.set("config", Y.mix(APDataVis2.CONFIG, this.config, true, null, 0, true));
        APDataVis2.superclass.init.apply(this, arguments);
        pageData = this.get("pageData");
        this.node = p_oAttrs.node;
        this.template = Y.Handlebars.compile(this._TEMPLATE);
        this.headerTemplate = Y.Handlebars.compile(this._HEADER_TEMPLATE);
        this.make_tooltip_template = Y.Handlebars.compile(this._MAKE_TOOLTIP_TEMPLATE);
        this.crossmake_tooltip_template = Y.Handlebars.compile(this._CROSSMAKE_TOOLTIP_TEMPLATE);
        this.midmodel_tooltip_template = Y.Handlebars.compile(this._MIDMODEL_TOOLTIP_TEMPLATE);
        this.render();
        this.createBrandIdMap();
        var tier1Id = this.get("tier1Id");
        var tier1Name = this.idToBrand[this.get("tier1Id")];
        this.midFilterHandler(tier1Name, tier1Id);
        this.setBrandData(tier1Name, tier1Id);
    },			
    
    /*
     * Updates the map with the new page attributes
     * p_oAttrs: the page attributes used to update the page
     */
    update : function(p_oAttrs){
    	this.init(p_oAttrs);
    },
    
    /*
     * Renders the page content
     */
    render : function() {
        this.get("node").setContent(
            this.template(this.get("config")._LABELS)
        );
        Y.one("#bml2-get-overview-button").on("click", function() {
            Y.fire("BrandMap:getOverview2");
        });
        this.get("pageProxy").renderActions([]);
    },
    
    /*
     * Renders the page header
     */
    renderHeader : function() {
        var params = {
            "tier1Name" : this.get("config._LABELS.PAGE_HEADING_TIER1"),
            "tier2Name" : "All Makes",
            "pageHeading" : "All Makes",
            "pageHeaderEnd" : this.get("config._LABELS.PAGE_HEADER_END")
        };
        return this.headerTemplate(params);
    },
    
    /*
     * Attaches events for the mid-level filter
     * brandName: the name of the brand in the center of the mid-level
     * idNum: the id number of the brand in the center of the mid-level 
     */
    midFilterHandler : function(brandName, idNum){
        var that = this;
        Y.all(".mid-radio").on("click", function(elm) {
            Y.all(".mid-radio").removeClass("custom-checked");
            elm.currentTarget.addClass("custom-checked");
            that.getMidLevel(brandName, idNum);
        });
    },
    
    /////////////////////////////////////////////////////////////////////////
    // Tooltip Methods
    /////////////////////////////////////////////////////////////////////////
    
    /*
     * Shows the tooltips for the brand circles on the top level
     * coords: the base position of the tooltip
     * d: the json data to be used in the template
     */
    showMakeTooltip : function(coords, d){
    	this.showTooltip(coords, d, ".makeTooltip", this.make_tooltip_template, 15, -10);
    },
    
    
    /*
     * Shows the tooltips for the other makes on the second level
     * obj: the object that triggered the tooltip event
     * d: the json data to be used in the template
     */
    showCrossMakeTooltip : function(obj, d){
    	this.showTooltip(d3.mouse(obj), d, ".crossMakeTooltip", this.crossmake_tooltip_template, 0, 10);
    },
    
    /*
     * Shows the tooltips for the models of the clicked make on the second level 
     * obj: the object that triggered the tooltip event
     * d: the json data to be used in the template
     */
    showModelChoiceTooltip : function(obj, d){
    	this.showTooltip(obj, d, ".modelChoiceTooltip", this.midmodel_tooltip_template, 50, 0);
    },
    
    /*
     * Generic helper method for creating tooltips
     * mousePos is the position of the mouse
     * d is the json data to be used in the tooltip template
     * className is the class name of the tooltip to be shown
     * template is the type of template this tooltip will use
     * leftShift is the amount of left adjustment for the placing of the tooltip
     * topShift is the amount of top adjustment for the placing of the tooltip
     */
    showTooltip : function(mousePos, d, className, template, leftShift, topShift){
    	var coord = mousePos,
    	tooltip = d3.select(className),
    	svgElement = document.querySelector("#map svg");
    	var svgWidth = svgElement.height.baseVal.value/2;
    	var collapseWidth = document.getElementById("menuPanel").clientWidth;
    	if(collapseWidth == 250){
    		tooltip.style("left", (coord [0] + 138 + svgElement.width.baseVal.value/2 + leftShift) + "px");
    	}
    	else{ tooltip.style("left", (coord [0] - 97 + svgElement.width.baseVal.value/2 + leftShift) + "px"); }
    	tooltip.style("top", (coord[1] + 217 + svgElement.height.baseVal.value/2 + topShift) + "px");
    	Y.one(className).setHTML(template({data: d, label: this.get("config")._LABELS}));
    	Y.one(className).show();
    	var initHeight = document.querySelector(className).offsetHeight;
    	tooltip.style("top", (coord[1] + svgWidth + 257 - initHeight + topShift))
    },
    
    /*
     * Hides the tooltips for the brand circles on the top level
     */
    hideMakeTooltip : function(){
    	var tooltip = Y.one(".makeTooltip");
    	if(tooltip){
    		tooltip.hide();
    	}
    },
    
    /*
     * Hides the tooltips for the other makes on the second level
     */
    hideCrossMakeTooltip : function(){
    	var tooltip = Y.one(".crossMakeTooltip");
    	if(tooltip){
    		tooltip.hide();
    	}
    },
    
    /*
     * Hides the tooltips for the models of the clicked make on the second level
     */
    hideModelChoiceTooltip : function(){
    	var tooltip = Y.one(".modelChoiceTooltip");
    	if(tooltip){
    		tooltip.hide();
    	}
    },
    
    /////////////////////////////////////////////////////////////////////////////////////
    // Helper Methods
    /////////////////////////////////////////////////////////////////////////////////////
    
    /*Resets svg element on page*/
    resetSvgElt : function(){
    	if(d3.select("#map svg")){
    		d3.selectAll("#map svg")
    			.remove();
    	}
    	
    	//Append an svg g element for top-level circles
    	var svg =   d3.select("#map").append("svg")
		    		.attr("width", width)
		    		.attr("height", height);
    	
    	d3.select("#map").append("g").attr("id", "tooltips")
    		.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");
    	
    	//Append the tooltip for makes
	    Y.one("#map #tooltips").append("<div class = 'makeTooltip' style='display:none;'></div>");
    },
    
    /*
     * removes commas from a string, returns a number
     * toParse: the string from which the commas will be removed
     * returns a number with commas replaced by spaces
     */
    removeCommas : function(toParse){
    	return parseInt(toParse.replace(/\,/g,''));
    },
    
    /*
     * Creates a map from makeNames to json elements given the json object containing makeNames
     * storedTopData: the stored top-level data that will be used to create the map
     * returns a map from the json objects' makeNames to the total json object
     */
    brandToTopData : function(storedTopData){
    	var map = {};
    	for(var i=0; i<storedTopData.length; i++){
    		map[storedTopData[i].makeName] = storedTopData[i];
    	}
    	return map;
    },
    
    /*
     * Converts a polar coordinate duple into a cartesian coordinate duple
     * polarArray: a duple of [r,theta] polar data
     * returns a duple of [x,y] cartesian data
     */
    polarToCart : function(polarArray){
    	var cartesian = [];
		var r = polarArray[0];
		var theta = polarArray[1];
		cartesian.push(r * Math.cos(theta));
		cartesian.push(r * Math.sin(theta));
		return cartesian;
    },
    
    /*
     * turns an array holding data from the top level into json format
     * tripleArray: an array in the form [uniqueVisitorCount, brandName, id] 
     * returns a version of tripleArray in json format
     */
    topTurnToJSON : function(tripleArray){
    	var brandJSON = {};
    	brandJSON["uniqueVisitorCount"] = tripleArray[0];
    	brandJSON["brandName"] = tripleArray[1];
    	brandJSON["id"] = tripleArray[2];
    	return brandJSON;
    },
    
    /* 
     * Takes mid level data in the form [{id:a, makeName:b, percent:c, rank:d, uniqueVisitorCount:e}, totalUnique, centerName]
     * and returns it in json format
     * existing: a json object in the form {id:a, makeName:b, percent:c, rank:d, uniqueVisitorCount:e}
     * totalUnique: the total unique visitor count from clicked brand from the top level
     * centerName: the name of the clicked brand from the top level
     * returns a version of the provided data in json format
     */
    midTurnToJSON : function(existing, centerName){
    	var crossJSON = {};
    	crossJSON['id'] = existing['id'];
    	crossJSON['centerName']=centerName;
    	crossJSON['makeName']=existing['makeName'];
    	crossJSON['percent']=existing['percent'];
    	crossJSON['rank']=existing['rank'];
    	crossJSON['uniqueCrossCount']=existing['uniqueVisitorCount'];
    	return crossJSON;
    },
    
    /*
     * Gets the top padding of the brand logos from the image sprite
     * makeId: the id of the make whose logo is to be retrieved
     * returns the vertical indent at which the desired logo starts
     */
    getTopPadding : function(makeId){
    	var idToPadding = {
        		"Acura" : 0, "Aston Martin" : 80, "Audi" : 160, "Bentley" : 240, "BMW" : 320,
        		"Buick" : 400, "Cadillac" : 480, "Chevrolet" : 560, "Chevrolet Truck" : 640, "Chrysler" : 720, 
        		"Dodge" : 800, "Dodge Truck" : 880, "Ferrari" : 960, "Fiat" : 1040, "Fisker" : 1120,
        		"Ford" : 1200, "Ford Truck" : 1280, "Freightliner" : 1360, "GMC" : 1440, "GMC Truck" : 1520,
        		"Honda" : 1600, "HUMMER" : 1680, "Hyundai" : 1760, "Infiniti" : 1840, "Isuzu" : 1920,
        		"Jaguar" : 2000, "Jeep" : 2080, "Kia" : 2160, "Lamborghini" : 2240, "Land Rover" : 2320,
        		"Lexus" : 2400, "Lincoln" : 2480, "Lotus" : 2560, "MINI" : 2640, "Maserati" : 2720,
        		"Maybach" : 2800, "Mazda" : 2880, "Mazda Truck" : 2960, "Mercedes-Benz" : 3040, "Mercury" : 3120,
        		"Mitsubishi" : 3200, "Morgan" : 3280, "Nissan" : 3360, "Nissan Truck" : 3440, "Oldsmobile" : 3520, 
        		"Panoz" : 3600, "Pontiac" : 3680, "Porsche" : 3760, "RAM Truck" : 3840, "Ram" : 3920,
        		"Rolls-Royce" : 4000, "SMART" : 4080, "Saab" : 4160, "Saleen" : 4240, "Saturn" : 4320,
        		"Scion" : 4400, "Smart" : 4480, "Subaru" : 4560, "Suzuki" : 4640, "Tesla" : 4720,
        		"Toyota" : 4800, "Toyota Truck" : 4880, "Volkswagen" : 4960, "Volvo" : 5040, "smart" : 5120
    	}
    	return idToPadding[makeId];
    },
    
    /*
     * takes a json response and returns an array of duples representing the coordinates at which to place
     * the circles with a radius of stdRad
     * data: the json data to get degree arrays for 
     * returns an array of duples representing the points at which circles are to be placed
     */
    getCircleDegrees : function(data){
    	var degrees = [], numModels = data.length, degInt = 2*Math.PI / numModels, that=this;
    	for(var i=0; i<numModels; i++){
    		var r=stdRad, theta = i*degInt, point = this.polarToCart([r,theta]);
    		degrees.push(point);
    	}
    	return degrees;
    },
    
    /*
     * Takes a json response with each element containing a field "percent", finds the minimum, 
     * maximum, and (maximum-minimum) and returns them in a json object
     * modelData: the data to find the percent statistics for
     * returns the max, min, and difference of the percentages in a json object
     */
    findMinMaxPercent : function(modelData){
    	var maxPercent = 0, minPercent = Number.MAX_VALUE;
    	for(var i=0; i<modelData.length; i++){
    		var thisPercent = parseFloat(modelData[i].percent)/100;
    		if(maxPercent<thisPercent){
    			maxPercent = thisPercent;
    		}
    		if(minPercent>thisPercent){
    			minPercent = thisPercent;
    		}
    	}
    	var percentDiff = maxPercent - minPercent;
    	return {"minPercent" : minPercent,
    			"maxPercent" : maxPercent,
    			"percentDiff" : percentDiff};
    },
    
    /*
     * Takes an array of json objects containing a field uniqueVisitorCount
     * finds the minimum, maximum, and (maximum-minimum) and sets the values over all makes
     * jsonArray: the data to find the unique view statistics for
     */
    setMinMaxUV : function(jsonArray){
    	var min = Number.MAX_VALUE, max = 0;
    	for(var i=0; i<jsonArray.length; i++){
    		var uniqueViews = this.removeCommas(jsonArray[i].uniqueVisitorCount); 
    		if(min>uniqueViews){
    			min = uniqueViews;
    		}
    		if(max<uniqueViews){
    			max = uniqueViews;
    		}
    	}
    	this.minViews = min;
    	this.maxViews = max;
    	this.viewDiff = max-min;
    },
    
    /*
     * Takes an array of json objects containing a field uniqueVisitorCount
     * finds the minimum, maximum, and (maximum-minimum) and sets the values
     * over the cross-makes
     * jsonArray: the data to find the unique view statistics for
     */
    setMinMaxCrossUV : function(jsonArray){
    	var min = Number.MAX_VALUE, max = 0;
    	for(var i=0; i<jsonArray.length; i++){
    		var uniqueViews = this.removeCommas(jsonArray[i].uniqueVisitorCount); 
    		if(min>uniqueViews){
    			min = uniqueViews;
    		}
    		if(max<uniqueViews){
    			max = uniqueViews;
    		}
    	}
    	this.minCrossViews = min;
    	this.maxCrossViews = max;
    	this.crossViewDiff = max-min;
    },
    
    /*
     * finds the minimum, maximum, and a dictionary from brandNames to uniqueVisitorCounts
     * brandNames: the list of names to take unique counts from 
     * returns the dictionary, min, and max in a json object
     */
    uniqueCountStats : function(brandNames){
    	var brandToUniqueCount = {}, minCount = Number.MAX_VALUE, maxCount=0,
    	minWCommas = "", maxWCommas = "";
    	for(var i=0; i<this.storedBrandData.length; i++){
    		var brandElement = this.storedBrandData[i];
    		var name = brandElement.makeName;
    		var countWCommas = brandElement.uniqueVisitorCount;
    		var count = this.removeCommas(brandElement.uniqueVisitorCount);
    		if(brandNames.indexOf(name)>-1){
    			brandToUniqueCount[name] = countWCommas;
    			if(maxCount<count){
        			maxCount = count;
        			maxWCommas = countWCommas;
        		}
        		if(minCount>count){
        			minCount = count;
        			minWCommas = countWCommas;
        		}
    		}
    	}
    	return {"dict" : brandToUniqueCount,
    			"min" : minWCommas,
    			"max" : maxWCommas};
	},
	
    /*
     * Uses the stored cross-make data to find the maximum and minimum unique counts
     * returns the minimum and maximum unique counts in a json object
     */
    uniqueCrossStats : function(){
	    var crossData = this.storedCrossMakeData;
		var maxCount=0, minCount=Number.MAX_VALUE;
		for(var i=0; i<crossData.length; i++){
			var count = this.removeCommas(crossData[i].uniqueVisitorCount);
			if(maxCount<count){ maxCount = count;}
			if(minCount>count){ minCount = count;}
		}
		return {"min":minCount,
				"max":maxCount}
    },
    
    
    /////////////////////////////////////////////////////////////////////////////////////
    // Data Storage Variables
    /////////////////////////////////////////////////////////////////////////////////////
    /*list of json objects for all makes*/
	makeJSONs : [],
	
	/*json object for center make*/
	centerJSON : "",
	
	/*Dictionary mapping make names to number of unique views*/
	nameToViews : {},
    
    /*list of all brands for mid-level*/
    brandNames : [],
    
    /*list of all cross-brands for mid-level*/
    brandsNoCenter : [],
    
    /*Stores map from make name to make id*/
    brandToId : {},
    
    /*Stores map form make id to make name*/
    idToBrand : {},
    
    /*Stores top-level brand data*/
    storedBrandData: "",
    
    /*Stores mid-level cross make data*/
    storedCrossMakeData: "",
    
    /*Stores mid-level model data*/
    storedCrossModelData: "",
    
    /*Stores a json object in the form {dict: {[brandName : uniqueVisitorCount]}, minUnique:a, maxUnique:b}*/
    uniqueStats: {},
    
    /*Minimum unique views over all shown makes*/
    minViews : 0,
    
    /*Maximum unique views over all shown makes*/
    maxViews : 0,
    
    /*Difference between minimum and maximum unique views for all shown makes*/
    viewDiff : 0,
    
    /*Minimum unique views over cross-makes*/
    minCrossViews : 0,
    
    /*Maximum unique views over cross-makes*/
    maxCrossViews : 0,
    
    /*Difference between minimum and maximum unique views for cross-makes*/
    crossViewDiff : 0,
    
    /////////////////////////////////////////////////////////////////////////////////////
    // Get Data Methods
    /////////////////////////////////////////////////////////////////////////////////////
    
    /*retrieve the json containing all makes and unique visitor counts*/
    setBrandData : function(tier1Name, tier1Id){
    	var requestId, url,that=this;
    	
    	//Store top-level data and draw top level
    	function callback(transactionId, brandData){
    		if (requestId - 0 === transactionId - 0){
	            this.toggleBusyOverlay(false);
	            that.storedBrandData = brandData;
	            that.setMinMaxUV(that.storedBrandData);
	            that.getMidLevel(tier1Name, tier1Id);
    		}
    	}
    	url = "/autos-pulse/brand-map-data.php?d=" + this.get("date");
        this.toggleBusyOverlay(true);
        requestId = Y.CIDataCache.get(url, callback, this);
    },
    
    /*
     * Retrieves the mid-level data
     * brandName = name of the clicked make
     * idNum = id of the clicked make
     */
    getMidLevel: function(brandName, idNum){
    	var requestId, url, that=this;
    	
    	//Store mid-level cross make data and get models by brand
    	function callback (transactionId, brandData){
    		if(requestId - 0 === transactionId - 0){
    			var filtered = that.getMidFiltered(brandData);
    			that.storedCrossMakeData = filtered
    			that.getModelsByBrand(brandName, filtered, idNum);
    		}
    	}
    	url = "/autos-pulse/cross-brands-data.php?d=" + this.get("date")+"&t1="+idNum;
    	this.toggleBusyOverlay(true);
    	requestId = Y.CIDataCache.get(url, callback, this);
    },
    
    /*
     * Gets the model data given the brandName and data
     * brandName: the name of the clicked brand
     * brandData: the json returned by the database request for cross-brands
     * idNum: the tier1 id of the clicked brand
     */
    getModelsByBrand : function(brandName, brandData, idNum){
    	var requestId, url, that=this;
    	
    	//Store mid-level model data and draw mid level
    	function callback(transactionId, modelData){
    		if(requestId - 0 === transactionId - 0){
    			this.toggleBusyOverlay(false);
    			that.storedCrossModelData = modelData;
        		return that.drawMidLevel(brandName, brandData, modelData, idNum);	
    		}
    	}
    	url = "/autos-pulse/cross-brand-models.php?t1=" + idNum;
        requestId = Y.CIDataCache.get(url, callback, this);
    },
    
    /*
     * Gets and returns the filtered data based on the mid-level filter
     * midData: the data to be filtered
     */
    getMidFiltered : function(midData){
    	var value = document.querySelector("#midRadios .custom-checked").getAttribute("value");
    	return midData.slice(0, value);
    },
    
    /////////////////////////////////////////////////////////////////////////////////////
    // Mid-level Draw Methods
    /////////////////////////////////////////////////////////////////////////////////////
    
    /*
     * Draws the second level
     * brandName: the make name of the clicked brand
     * crossBrands: the json object returned for the cross-shopping brands data base request
     * crossModels: the json object returned for the clicked brand's models
     * idNum: the id number of the clicked brand
     */
    drawMidLevel : function(brandName, crossBrands, crossModels, idNum){
    	var that=this;
    	this.hideModelChoiceTooltip();
    	this.hideCrossMakeTooltip();
    	
    	//Set breadcrumbs
		var tier2 = document.querySelector(".ci-page-module-header-container h4");
		tier2.innerHTML = "<a class='back-link-top'>All Makes</a> <strong>></strong> " + brandName;
		
    	d3.select("h4 a.back-link-top")
			.on("click", function(d){
				Y.fire("BrandMap:toTopLevel", {
					"tier1Id" : "0",
					"tier2Id" : "0",
					"date"	  : that.get("date")
				});
			});
    	
    	this.createBrandIdMap();
    	this.setBrandLists(crossBrands, brandName);
    	this.setMakeJSONVars(brandName);
    	this.resetSvgElt();
    	this.drawCenter(brandName, idNum);
    	
    	var crossMakeGroup = 
        	d3.select("#map svg")
    			.append("g")
        		.attr("id", "crossMakes")
        		.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");
	    	
    	//Construct an array holding the places to put the cross-brands around the clicked brand
    	var degInt = 2*Math.PI/this.brandsNoCenter.length, degrees = [];
    	for(var i=0; i<this.brandsNoCenter.length; i++){
    		var degree = i*degInt,
    		coord = this.polarToCart([stdRad, degree]);
    		degrees.push([coord[0], coord[1]]);
    	}
    	
    	this.drawCrossMakes(degrees, brandName);
    	this.drawCrossLines(degrees, document.querySelector("#center"), brandName);
    	this.drawMidLevelModels(document.querySelector("#center"), crossModels);
    },
    
    
    /*
     * Uses the brand data to map all brand names to their ids
     */
    createBrandIdMap : function(){
    	for(var i=0; i<pageData.tier1Data.length; i++){
    		var tier1Obj = pageData.tier1Data[i];
    		this.brandToId[tier1Obj.name] = tier1Obj.id;
    		this.idToBrand[tier1Obj.id] = tier1Obj.name;
    	}
    },
    
    /*
     * Sets this.brandNames and this.brandsNoCenter using the array of json objects
     * crossBrands : the array of json objects representing the makes
     */
    setBrandLists : function(crossBrands, brandName){
    	//Construct array of cross-brand names
    	this.brandsNoCenter = [];
    	this.brandNames = [];
    	this.brandNames.push[brandName];
    	for(var i=0; i<crossBrands.length; i++){
    		this.brandNames.push(crossBrands[i].makeName);
    		this.brandsNoCenter.push(crossBrands[i].makeName);
    	}
    },
    
    /*
     * Sets this.makeJSONs, this.centerJSON, and this.nameToViews
     */
    setMakeJSONVars : function(brandName){
    	for(var i=0; i<this.storedBrandData.length; i++){
    		var json = this.storedBrandData[i];
    		if(this.brandsNoCenter.indexOf(json.makeName)>-1){
    			this.makeJSONs.push(json);
    		}
    		if(brandName == json.makeName){
    			this.centerJSON = json;
    		}
    		this.nameToViews[json.makeName] = json.uniqueVisitorCount;
    	}
    },
    
    /*
     * Draws the center make and its image
     */
    drawCenter : function(brandName, idNum){
    	//draw center circle
    	var that=this;
    	var centerGroup = d3.select("#map svg")
    		.append("g")
    		.attr("id", "centerGroup")
    		.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");
    	
    	centerGroup.append("circle")
			.attr("id", "center")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("opacity", 0)
			.attr("r", 0)
			.attr("fill", "#c16ba8")
			.transition()
			.duration(1500)
			.attr("r", function(){
				var minRad = maxMakeRad / 2;
				if(that.nameToViews[brandName]){
					var currentViews = that.removeCommas(that.nameToViews[brandName]);
					return minRad + ((currentViews-that.minViews) / that.viewDiff)*(maxMakeRad-minRad);
				} else return minRad;
			})
			.attr("class", "make")
			.attr("opacity", 1);
    	
    	
		centerGroup
	    	.append("svg")
			.attr("height", function(d,i){
				var minRad = maxMakeRad/2;
				if(that.nameToViews[brandName]){
					var currentViews = that.removeCommas(that.nameToViews[brandName]);
					return 2*(minRad + ((currentViews-that.minViews) / that.viewDiff)*(maxMakeRad-minRad));
				} else return minRad*2;
			})
			.attr("width", function(d,i){return this.height.baseVal.value;})
			.attr("x", function(){ return -1*this.height.baseVal.value/2; })
		    .attr("y", function(){ return -1*this.width.baseVal.value/2; })
			.append("svg:image")
				.attr("class", "logo")
				.attr("height", 0)
				.attr("width", 0)
				.attr("opacity", 0)
    			.attr("xlink:href", "http://l.yimg.com/dh/ap/autopulse/auto_logo_icons.png")
    			.attr("height", function(d,i){ 
    				var minRad = maxMakeRad / 2;
    				if(that.nameToViews[brandName]){
	    				var dimension = 2*(minRad + ((that.removeCommas(that.nameToViews[brandName])-that.minViews) / that.viewDiff)*(maxMakeRad-minRad)),
	    				ratio = dimension / 80;
	    				return 5200*ratio;
    				} else{
    					var ratio = 2*minRad/80;
    					return 5200*ratio;
    				}
    			})
    			.attr("width", function(d,i){
    				return this.height.baseVal.value / 5200 * 80;
    			})
    			.attr("x", 0)
    			.attr("y", function(d,i){
    				var dimension = this.height.baseVal.value,
    				ratio = dimension / 5200, offset = that.getTopPadding(brandName);
    				return -1*offset*ratio;
    			})
    			.transition()
    			.delay(500)
    			.duration(1500)
    			.attr("opacity", 1)
    			.each("end", function(){
    				d3.select(".logo")
	    				.on("mouseover", function(){
	    					if(that.nameToViews[brandName]){
	    						var json = that.topTurnToJSON([that.nameToViews[brandName], brandName, idNum]);
	    					} else var json = that.topTurnToJSON([0, brandName, idNum]);
		    				that.showMakeTooltip([0,0],json);
		    			})
		    			.on("mouseout", function(){
		    				that.hideMakeTooltip();
		    			});
    			})
    			
	},
	
	/*
	 * Draws the cross makes for the mid-level
	 * coords: the array of duples representing the points at which the makes will be placed
	 * brandName: the name of the center make
	 */
	drawCrossMakes : function(coords, brandName){
		this.uniqueStats = this.uniqueCountStats(this.brandsNoCenter);
		var brandToCount = this.uniqueStats.dict;
		var that=this;
		
		var crossMakes = d3.select("#map svg")
			.append("g")
			.attr("id", "crossMakes")
			.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");
		var crossGroup = crossMakes.selectAll(".crossMake")
			.data(this.brandsNoCenter)
			.enter()
			.append("g")
			.attr("id", function(d){
				return that.brandToId[d];
			})
			.attr("class", "crossMakeGroup");
	
		crossGroup
			.append("circle")
			.attr("cx", function(d,i){
				return coords[i][0];
			})
			.attr("cy", function(d,i){
				return coords[i][1];
			})
			.attr("opacity", 0)
			.attr("r", 0)
			.attr("fill", "#29a7df")
			.attr("cursor", "pointer")
			.attr("class", "crossMake")
			.transition()
			.duration(1500)
			.attr("r", function(d,i){
				var currentCount = that.removeCommas(brandToCount[d]),
				maxCount = that.removeCommas(that.uniqueStats.max), 
				minCount = that.removeCommas(that.uniqueStats.min),
				countRatio = (currentCount-minCount) / (maxCount-minCount),
				minRad = maxMakeRad*.6;
				return minRad + countRatio*(maxMakeRad-minRad);
			})
			.attr("opacity", 1);
		
		var imageSvg = crossGroup
			.append("svg")
			.attr("width", function(d,i){
				var currentCount = that.removeCommas(brandToCount[d]),
				maxCount = that.removeCommas(that.uniqueStats.max),
				minCount = that.removeCommas(that.uniqueStats.min),
				countRatio = (currentCount-minCount) / (maxCount-minCount),
				minRad = maxMakeRad*.6, r = minRad + countRatio*(maxMakeRad-minRad);
				return r*2;
			})
			.attr("height", function(){
				return this.getAttribute("width");
			})
			.attr("x", function(d,i){
				var r = this.getAttribute("width")/2;
				return coords[i][0] - r;
			})
			.attr("y", function(d,i){
				var r = this.getAttribute("width")/2;
				return coords[i][1] - r;
			})
			
		
		var image = imageSvg
			.append("svg:image")
			.attr("width", function(){
				return this.parentNode.getAttribute("width");
			})
			.attr("height", function(){
				var dimension = this.getAttribute("width"),
				ratio = dimension/80;
				return 5200*ratio;
			})
			.attr("x", 0)
			.attr("y", function(d,i){
				var dimension = this.getAttribute("width"),
				ratio = dimension/80, offset = that.getTopPadding(d);
				return -1*offset*ratio;
			})
			.attr("class", "crossLogo")
			.attr("cursor", "pointer")
			.attr("xlink:href", "http://l.yimg.com/dh/ap/autopulse/auto_logo_icons.png")
			.attr("opacity", 0)
			.transition()
			.delay(500)
			.duration(1500)
			.attr("opacity", 1)
			.each("end", function(){
				d3.selectAll(".crossLogo")
					.on("mouseover", function(d,i){
						var json = that.topTurnToJSON([brandToCount[d], d, that.brandToId[d]]);
						that.showMakeTooltip(coords[i], json);
						this.parentNode.previousSibling.setAttribute("fill", "#c16ba8");
					})
					.on("mouseout", function(){
						that.hideMakeTooltip();
						this.parentNode.previousSibling.setAttribute("fill", "#29a7df");
					})
					.on("click", function(d){
						that.hideMakeTooltip();
						Y.fire("BrandMap:topLevelClick", {
							"tier1Id" : that.brandToId[d],
							"tier2Id" : "0",
							"date"    : that.get("date")
						});
					});
			})
			
			
	},
    
    /*
     * Draws the models under the selected make for the second level
     * brandElement: the DOM object representing the clicked brand
     * modelData: the json object returned for the clicked brand's models
     */
    drawMidLevelModels : function(brandElement, modelData){
    	var modelToId = {};
    	for(var i=0; i<modelData.length; i++){
    		var jsonObj = modelData[i];
    		modelToId[jsonObj.modelName] = jsonObj.modelId;
    	}
    	//Calculate variables for placing models around the clicked brand
    	var makeX = parseFloat(brandElement.getAttribute("cx")), 
    	makeY = parseFloat(brandElement.getAttribute("cy")),
    	makeR = parseFloat(brandElement.getAttribute("r")), that=this,
    	numModels = modelData.length, degInt = 2*Math.PI/numModels, maxR = 25,
    	modelR = (3*numModels-3-2*modelDist*Math.PI-2*makeR*Math.PI) / (2*Math.PI - 2.5*numModels);
    	
    	if(modelR > maxR || numModels < 3){ modelR = maxR;}
    	
    	//temporary fix for makes with many models
    	if(modelR < 4){
    		var dist = 180,
    		modelR = (numModels-1-2*dist*Math.PI-2*makeR*Math.PI) / (2*Math.PI - 2.5*numModels),
    		distFromCent = modelR + makeR + dist;
    	}
    	else{ var distFromCent = modelR + makeR + modelDist; }
    	var degStart = 54*Math.PI/180;
    	//Append svg g element for mid-level models
    	d3.select("#map svg")
	    	.append("g")
	    	.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")")
			.selectAll(".midModel")
			.data(modelData)
			.enter()
			.append("circle")
				.attr("cx", function(d, i){
					var theta = i*degInt+degStart,  
					cartesian = that.polarToCart([distFromCent, theta]);
					return cartesian[0]; 
				})
				.attr("cy", function(d, i){ 
					var theta = i*degInt+degStart, 
					cartesian = that.polarToCart([distFromCent, theta]);
					return cartesian[1]; 
				})
		    	//Attach transition handler
				.on("click", function(d){
					Y.fire("BrandMap:midLevelClick", {
			            "tier1Id"   : that.get("tier1Id"),
			            "tier2Id"	: modelToId[this.getAttribute("value")],
			            "date"      : that.get("date")
			        });
					document.querySelector("#tier1Label").innerHTML = that.idToBrand[that.get("tier1Id")];
				})
		    	.attr("fill", "#8ac441")
				.attr("r", 0)
				.attr("value", function(d){return d.modelName;})
				.attr("class", "midModel")
				
				//Fade in the mid-level models
	    		.attr("opacity", 0)
	    		.transition()
	    		.duration(1500)
	    		.attr("opacity", 1)
	    		.attr("r", modelR)
	    		.each("end", function(){
	    			d3.selectAll(".midModel")
	    				.data(modelData)
	    				//Attach tooltip handlers
	    				.on("mouseover", function(d){
	    					if(this.getAttribute("class")!="center"){
	    						var coord = [parseFloat(this.getAttribute("cx")), parseFloat(this.getAttribute("cy"))];
		    					that.showModelChoiceTooltip(coord, d);
		    					this.setAttribute("fill", "#c16ba8");
		    					this.setAttribute("cursor", "pointer");
	    					} else return null;
	    				})
	    				.on("mouseout", function(d){
	    					if(this.getAttribute("class")!="center"){
		    					that.hideModelChoiceTooltip();
		    					this.setAttribute("fill", "#8ac441");
		    					this.setAttribute("cursor", "null");
	    					} else return null;
	    				});
	    		});
    	
    	//Append the tooltip for the mid-level models
    	 Y.one("#map #tooltips").append("<div class = 'modelChoiceTooltip' style='display:none;'></div>"); 	
    },
    
    /*
     * Draws the cross-shopping lines on the second level
     * crossData: the json object returned by the database request for cross-shopping data
     * keepDots: an array of the cross-brands on the second level
     * coords: the positions of the cross-brands on the second level
     * center: the clicked brand that has become the center of the second page
     */
    drawCrossLines : function(coords, center, brandName){
    	var crossData = this.storedCrossMakeData;
    	var connections = [], that=this,
    	
    	//Append an svg g element for the mid-level cross lines
		crossLineGroup = d3.select("#map svg")
			.append("g")
			.attr("id", "crossLineGroup")
			.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");
    	that.setMinMaxCrossUV(crossData);
    	//Create svg diagonal lines for the cross-lines
    	for(var i=0; i<coords.length; i++){
    		var line = d3.svg.diagonal()
    			.source({x:0, y:0})
    			.target({x: coords[i][0],
    					 y: coords[i][1]});
    		d3.select("#crossLineGroup")
    			.append("path")
    			.attr("value", i)  	
    			.attr("fill", "none")
    			.attr("stroke", "#868686")
    			//Determine the width of the cross lines based on percent
    			.attr("d", line)
    			.attr("class", "crossLine")
    			.attr("stroke-width", 0)
    			//Fade cross lines in
    			.attr("opacity", 0)
    			.transition()
	    		.duration(1500)
	    		.attr("stroke-width", function(){
					var minRad = maxMakeRad / 2,
					currentViews = that.removeCommas(crossData[i].uniqueVisitorCount),
					r = minRad + ((currentViews-that.minCrossViews) / that.crossViewDiff)*(maxMakeRad-minRad),
					max = r/2, min = 5, radDiff=max-min,
					viewRatio = (currentViews-that.minCrossViews)/
								 (that.maxCrossViews-that.minCrossViews),
					rad = min+viewRatio*radDiff;
					return rad;
    			})
	    		.attr("opacity", .5)
	    		.attr("display", null)
	    		.each("end", function(){
	    			d3.selectAll(".crossLine")
	    				//Attach tooltip handlers
		    			.on("mouseover", function(){
			    			var index = this.getAttribute("value");
			    			var json = that.midTurnToJSON(crossData[index], brandName);
			    			that.showCrossMakeTooltip(this, json);
			    			this.setAttribute("opacity", .9);
			    		})
			    		.on("mouseout", function(){
			    			that.hideCrossMakeTooltip();
			    			this.setAttribute("opacity", .5);
			    		})
	    		});
    	}
    	
    	//Move the cross lines behind the circles
    	var element = document.getElementById("crossLineGroup");
    	element.ownerSVGElement.insertBefore(element, element.ownerSVGElement.firstChild);
    	
    	//Append the tooltip div
    	Y.one("#map #tooltips").append("<div class = 'crossMakeTooltip' style='display:none;'></div>"); 	
    }
});
Y.CIBasePage.registerModuleConstructor(APDataVis2);