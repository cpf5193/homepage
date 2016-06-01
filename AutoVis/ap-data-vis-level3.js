/**
 * Unique Visitors & Total Page Views line Chart module.
 * 
 * @module APDataVis3
 */
"use strict";

/**
 * @constructor
 * @augments Y.CIBaseWidget
 */
var pageData; // All data stored by the page

// //////////////////////////////////////////////////////
// Constants
// //////////////////////////////////////////////////////

var width = 725; // Width of visualization panel
var height = 725; // Height of visualization panel
var maxModRad = 25; // Maximum model radius
var minDim = 725; // minimum size of width and height dimensions
var stdRad = (minDim*.97)/2-maxModRad*2;

// /////////////////////////////////////////////////////
// Configurations
// /////////////////////////////////////////////////////

var APDataVis3 = Y.APDataVis3 = function() {
APDataVis3.superclass.constructor.apply(this, arguments);
};
APDataVis3.NAME = "APDataVis3";
APDataVis3.MODULE_TYPE = "dataVis3";
APDataVis3.PULSE_TYPE = "1";
APDataVis3.ATTRS = {
	"tier1Id" : {},
	"tier2Id" : {},
	"date" : {}
};
// Default configurations
APDataVis3.CONFIG = {
	_LABELS : {
		"PAGE_HEADING_TIER1" : "Brand Overview"
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
 * @class APDataVis3
 * @constructor
 * @arguments Y.CIBasePageModule
 */
Y.extend(APDataVis3, Y.CIBasePageModule, {
	
    inputParams : {
        "tier1Id" : "t1",
        "tier2Id" : "t2",
        "date" : "d"
    },
    
    // ////////////////////////////////////////////////////////////////////////////////////////////
    // TEMPLATES
    // ////////////////////////////////////////////////////////////////////////////////////////////
    
    /* Template for the header */
    _HEADER_TEMPLATE : "<h3>{{tier1Name}}: {{pageHeaderEnd}}</h3>" +
       				   "<h4>{{pageHeading}}</h4>",
       				
    /* Template for the overall content of the page */
    _TEMPLATE : "<div id=\"APBrandMapContainer\"> " + 
			    "   <div id=\"inputContainer\">"+
			    "		<div class=\"col row visitorContainer\" id=\"navButtonBox\" display=\"none\">" +
			    "			<div class=\"ci-top-summary-button-container\">" +
		        "				<button class=\"yui3-button\" id=\"bml3-get-overview-button\">Get Overview</button>"+
		        "  				<select id=\"renderType\" class=\"yui3-dropdown\">"+
		        "        			<option value=\"table\">Cross-Shopping Chart</option>"+
		        "        			<option value=\"visual\">Cross-Shopping Table</option>"+
		        "   			</select>"+
		        "			</div>" +
		        "		</div>"+
			    "		<div class=\"col row visitorContainer box-shadow\" id=\"modelLevelFilter\" display=\"none\">" +
				"			<div id=\"modelFilter\" class=\"col\">" +		
				" 				<div id=\"modelFilterHeader\"><h4>Most Cross-Visited Models</h4></div>" +
			    " 				<div id=\"modelRadios\" class=\"row\"> " + 
			    "		 			<div class=\"custom-radio model-radio\" name=\"numModels\" value=10>Top Ten</div>" + 
			    "		  			<div class=\"custom-radio model-radio custom-checked\" name=\"numModels\" value=20>Top Twenty</div>" + 
			    "		  			<div class=\"custom-radio model-radio\" name=\"numModels\" value=30>Top Thirty</div>" +
			    "	  			</div>" + 
			    "			</div>"+
			    "		</div>"+
			    "   </div>" + 
			    "	<div id=\"contentContainer\">" + 
			    "		<div class=\"col row\" id=\"modelListBox\" display=\"none\">" +
			    "			<h4 id=\"modelListHeader\">Top Cross-Visited Models</h4>" + 
			    "			<ul id=\"modelList\"></div>" +
			    "			<div id=\"map\" class=\"col\" style=\"clear:right; margin-top:-30px;\"></div>" +
			    "		</div>" +
			    "	</div>" +
			    "</div>",   				   
			    
    /* Template for model tooltips on the second level */
	_MIDMODEL_TOOLTIP_TEMPLATE : "<div class=\"tooltipTitle\">{{data.modelName}}</div>" + 
								 "<div class=\"displayInline\"> " + 
								 "	<div id=\"midModel\"><strong></strong></div>" + 
								 "</div>",
								 
	/* Template for cross model and line tooltips on the third level */
	_MODEL_TOOLTIP_TEMPLATE : "<div class=\"tooltipTitle\">{{data.crossMakeName}} {{data.crossModelName}} " +
													"(from {{data.centerMakeName}} {{data.centerModelName}}) </div>" + 
							  "<div><strong>Unique Cross-Visitors:</strong>	{{data.crossViews}}</div>" + 
							  "<div><strong>Percent Overlap:</strong> {{data.percent}}</div>" +
							  "<div><strong>Rank: #</strong>{{data.rank}} most cross-visited model</div>",
							  
    // /////////////////////////////////////////////////////////////////////////////////////////////
    // Initialization Methods
    // /////////////////////////////////////////////////////////////////////////////////////////////
			    
    /**
	 * Binder initialization method, invoked after all binders on the page have
	 * been constructed.
	 */
    init: function (p_oAttrs) {
        this.set("config", Y.mix(APDataVis3.CONFIG, this.config, true, null, 0, true));
        APDataVis3.superclass.init.apply(this, arguments);
        pageData = this.get("pageData");
        this.node = p_oAttrs.node;
        this.template = Y.Handlebars.compile(this._TEMPLATE);
        this.headerTemplate = Y.Handlebars.compile(this._HEADER_TEMPLATE);
        this.midmodel_tooltip_template = Y.Handlebars.compile(this._MIDMODEL_TOOLTIP_TEMPLATE);
        this.model_tooltip_template = Y.Handlebars.compile(this._MODEL_TOOLTIP_TEMPLATE);
        this.render();
        this.createIdBrandMap();
        this.attachDropHandler();
        var tier2Data = pageData.tier2ById;
    	var makeId = this.get("tier1Id");
    	var modelId = this.get("tier2Id");
    	var makeName = this.idToBrand[makeId];
    	this.modelFilterHandler(makeName, makeId, modelId);
        this.getModelLevel(makeName, makeId, modelId);
    },
    
    /*
	 * Updates the map with the new page attributes p_oAttrs: the page
	 * attributes used to update the page
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
        Y.one("#bml3-get-overview-button").on("click", function() {
            Y.fire("BrandMap:getOverview3");
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
	 * Attaches events for the dropdown menu between cross-shopping table and
	 * visualization
	 */
    attachDropHandler : function(){
    	var that=this;
    	Y.one("#renderType").on("change", function(){
	    	Y.fire("CrossShopping:viewAll", {
	                "tier1Id"   : that.get("tier1Id"),
	                "tier2Id"   : that.get("tier2Id"),
	                "date"      : that.get("date")
	    	});
    	});
    },
    
    /*
	 * Attaches events for the model-level filter makeName: the make name of the
	 * clicked model modelName: the name of the clicked model modelId: the id of
	 * the clicked model
	 */
    modelFilterHandler : function(makeName, makeId, modelId){
    	var that=this;
    	Y.all(".model-radio").on('click', function(elm){
    		Y.all(".model-radio").removeClass("custom-checked");
    		elm.currentTarget.addClass("custom-checked");
    		that.getModelLevel(makeName, makeId, modelId); 
    	});
    },    
    
    // ///////////////////////////////////////////////////////////////////////
    // Show Tooltip Methods
    // ///////////////////////////////////////////////////////////////////////
    
    /*
	 * Shows the tooltips for the models of the clicked make on the second level
	 * coords: the coordinates of the clicked model d: the json data to be used
	 * in the template
	 */
    showModelChoiceTooltip : function(coords, d){
    	var menuShift;
    	var collapseWidth = document.getElementById("menuPanel").clientWidth;
    	if(collapseWidth === 0){
    		menuShift = -90;
    	} else menuShift = 145;
    	this.showTooltip(coords, d, ".modelChoiceTooltip", this.midmodel_tooltip_template, 50+menuShift, 20);
    },
    
    /*
	 * Shows the tooltips for the cross models of the clicked model on the third
	 * level coords: the base position of the tooltip d: the json data to be
	 * used in the template
	 */
    showModelTooltip : function(coords, d){
    	var menuShift;
    	var collapseWidth = document.getElementById("menuPanel").clientWidth;
    	if(collapseWidth === 0){
    		menuShift = -90;
    	} else menuShift = 145;
    	this.showTooltip(coords, d, ".modelTooltip", this.model_tooltip_template, menuShift, -30);
    },
    
    /*
	 * Generic helper method for creating tooltips mousePos is the position of
	 * the mouse d is the json data to be used in the tooltip template className
	 * is the class name of the tooltip to be shown template is the type of
	 * template this tooltip will use leftShift is the amount of left adjustment
	 * for the placing of the tooltip topShift is the amount of top adjustment
	 * for the placing of the tooltip
	 */
    showTooltip : function(mousePos, d, className, template, leftShift, topShift){
    	var list = document.querySelector("#modelList").childNodes;
    	if(list.length>1){
    		var listWidth = document.querySelector("#modelListBox").getBoundingClientRect().width + 11;
    	} else { var listWidth = 236; }
    	var coord = mousePos,
    	tooltip = d3.select(className),
    	svgElement = document.querySelector("#map svg");
    	var svgWidth = svgElement.height.baseVal.value/2;
    	tooltip.style("left", (coord [0] + leftShift +  listWidth + svgWidth) + "px");
    	tooltip.style("top", (coord[1] + 187 + svgWidth + topShift) + "px");
    	Y.one(className).setHTML(template({data: d, label: this.get("config")._LABELS}));
    	Y.one(className).show();
    	var initWidth = document.querySelector(className).offsetWidth;
    	var initHeight = document.querySelector(className).offsetHeight;
    	if(initWidth<120){
    		tooltip.style("min-width", "200px");
    	} tooltip.style("top", (coord[1] + svgWidth + 227 - initHeight))
    },
    
    // ///////////////////////////////////////////////////////////////////////////////////
    // Hide Tooltip Methods
    // ///////////////////////////////////////////////////////////////////////////////////
    
    
    /*
	 * Hides the tooltips for the models of the clicked make on the second level
	 */
    hideModelChoiceTooltip : function(){
    	this.hideTooltip(".modelChoiceTooltip");
    },
    
    /*
	 * Hides the tooltips for the models of the clicked make on the second level
	 */
    hideModelTooltip : function(){
    	this.hideTooltip(".modelTooltip");
    },

    /*
	 * Generic method for hiding tooltips selection: the selection that chooses
	 * which tooltip to hide
	 */
    hideTooltip : function(selection){
    	var tooltip = Y.one(selection);
    	if(tooltip){
    		tooltip.hide();
    	}
    },
    
    // ///////////////////////////////////////////////////////////////////////////////////
    // Helper Methods
    // ///////////////////////////////////////////////////////////////////////////////////
    
    /*
	 * removes commas from a string, returns a number toParse: the string from
	 * which the commas will be removed returns a number with commas replaced by
	 * spaces
	 */
    removeCommas : function(toParse){
    	return parseInt(toParse.replace(/\,/g,''));
    },
    
    /*
	 * Removes spaces in the given string returns a version of the string with
	 * all spaces removed
	 */
    removeWhiteSpace : function(toParse){
    	return toParse.replace(/\ /g,"");
    },
    
    /* Removes the svg element on the page if it exists, creates a new one */
    resetSvgElt : function(){
    	if(d3.select("#map svg")){
    		d3.selectAll("#map svg")
    			.remove();
    	}
    	
    	// Append an svg g element for top-level circles
    	var svg =   d3.select("#map").append("svg")
		    		.attr("width", width*.97)
		    		.attr("height", height*.97);
    	
    	d3.select("#map").append("g").attr("id", "tooltips")
    		.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");
    	
    	// Append the tooltip for makes
	    Y.one("#map #tooltips").append("<div class = 'makeTooltip' style='display:none;'></div>");
    },
    
    /*
	 * Converts a polar coordinate duple into a cartesian coordinate duple
	 * polarArray: a duple of [r,theta] polar data returns a duple of [x,y]
	 * cartesian data
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
	 * Takes mid level data in the form [{id:a, makeName:b, percent:c, rank:d,
	 * uniqueCount:e}, totalUnique, centerName] and returns it in json format
	 * existing: a json object in the form {id:a, makeName:b, percent:c, rank:d,
	 * uniqueCount:e} totalUnique: the total unique visitor count from clicked
	 * brand from the top level centerName: the name of the clicked brand from
	 * the top level returns a version of the provided data in json format
	 */
    midTurnToJSON : function(existing, centerName){
    	var crossJSON = {};
    	crossJSON['id'] = existing['id'];
    	crossJSON['centerName']=centerName;
    	crossJSON['makeName']=existing['makeName'];
    	crossJSON['percent']=existing['percent'];
    	crossJSON['rank']=existing['rank'];
    	crossJSON['uniqueCrossCount']=existing['uniqueCount'];
    	return crossJSON;
    },
    
    /*
	 * Takes model level data in the form [centerMakeName, centerModelName,
	 * {makeName:a, modelName:b, crossViews:c, rank:d, percent:e}] and returns
	 * it in json format makeName: the make name of the center model modelName:
	 * the model name of the center model modelData: a json object in the form
	 * {makeName:a, modelName:b, crossViews:c, rank:d, percent:e} returns a
	 * version of the provided data in json format
	 */
    modelTurnToJSON : function(makeName, modelName, modelData){
    	var crossJSON = {};
    	crossJSON['centerMakeName'] = makeName;
    	crossJSON['centerModelName'] = modelName;
    	crossJSON['crossMakeName'] = modelData.makeName;
    	crossJSON['crossModelName'] = modelData.modelName;
    	crossJSON['crossViews'] = modelData.crossViews;
    	crossJSON['rank'] = modelData.rank;
    	crossJSON['percent'] = modelData.percent;
    	return crossJSON;
    },
    
    /*
	 * takes a json response and returns an array of duples representing the
	 * coordinates at which to place the circles with a radius of 300 data: the
	 * json data to get degree arrays for returns an array of duples
	 * representing the points at which circles are to be placed
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
	 * Takes a json response with each element containing a field "percent",
	 * finds the minimum, maximum, and (maximum-minimum) and returns them in a
	 * json object modelData: the data to find the percent statistics for
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
	 * Uses the brand data to map all brand names to their ids and vice-versa
	 */
    createIdBrandMap : function(){
    	for(var i=0; i<pageData.tier1Data.length; i++){
    		var tier1Obj = pageData.tier1Data[i];
    		this.idToBrand[tier1Obj.id] = tier1Obj.name;
    	}
    },

    // ///////////////////////////////////////////////////////////////////////////////////
    // Data Storage Variables
    // ///////////////////////////////////////////////////////////////////////////////////
    
    /* Stores a map from id numbers to brand names */
    idToBrand : {},
    
    // ///////////////////////////////////////////////////////////////////////////////////
    // Get Data Methods
    // ///////////////////////////////////////////////////////////////////////////////////
    
    /*
	 * Gets the model-level data for the third level makeName: the make name of
	 * the clicked model modelName: the name of the clicked model modelId: the
	 * id of the clicked model
	 */
    getModelLevel : function(makeName, makeId, modelId){
    	var requestId, url, that=this;
    	this.toggleBusyOverlay(true);
    	// Store model data and draw model level
    	function callback(transactionId, modelData){
    		if(requestId - 0 === transactionId - 0){
    			var filtered = that.getModelFiltered(modelData);
    			that.storedModelData = filtered;
    			that.drawModelLevel(makeName, makeId, modelId, filtered);
    			this.toggleBusyOverlay(false);
    		}
    	}
    	
    	url = "/autos-pulse/model-data.php?t2="+modelId+"&d="+this.get("date");
    	requestId = Y.CIDataCache.get(url, callback, this);
    },
    
    /*
	 * Gets and returns the filtered data based on the model-level filter
	 * modelData: the data to be filtered
	 */
    getModelFiltered : function(modelData){
    	var value = document.querySelector("#modelRadios .custom-checked").getAttribute("value");
    	return modelData.slice(0, value);
    },
    
    // /////////////////////////////////////////////////////////////////////////////
    // Model-level Draw Methods
    // /////////////////////////////////////////////////////////////////////////////
    
    /*
	 * Draws the model level by delegation makeName: the name of the make
	 * belonging to the clicked model modelName: name of the clicked model
	 * modelId: the id of the clicked model modelData: the data returned from
	 * the model query {crossViews:a, makeName:b, modelName:c, percent:d,
	 * rank:e}
	 */
    drawModelLevel : function(makeName, makeId, modelId, modelData){
    	this.hideModelChoiceTooltip();
    	this.hideModelTooltip();
    	d3.select("#modelList").html("");
    	var modelName = this.getModelName(makeId, modelId);
		if(modelName){
	    	this.setBreadcrumbs(makeName, modelName);
	    	this.drawCenterModel(modelData, modelName);
	    	this.drawCrossModels(makeName, modelName, modelData);
	    	this.drawCrossLines(makeName, modelName, modelData);
		} else { setTimeout(this.drawModelLevel(makeName, makeId, modelId, modelData), 200); }
    }, 
    
    /*
	 * Gets the model name from the page data given the make and model id
	 * makeId: the id of the make for the model to get the name of modelId: the
	 * id of the model to get the name of
	 */
    getModelName : function(makeId, modelId){
    	var modelName = "";
    	var tier2Data = pageData.tier2Data[makeId];
    	if(tier2Data){
	    	for(var i=0; i<tier2Data.length; i++){
	    		var elt = tier2Data[i];
	    		if(elt.id == modelId){
	    			modelName = elt.name;
	    			i=tier2Data.length;
	    		}
	    	}
	    	return modelName;
    	} else{ return undefined; }
    },
    
    /*
	 * Sets up the breadcrumb links for the model level makeName: the make name
	 * of the clicked model modelName: the name of the clicked model
	 */
    setBreadcrumbs : function(makeName, modelName){
    	
    	// transition to third-level breadcrumb
    	var breadCrumb = document.querySelector(".ci-page-module-header-container h4"), that=this;
    	breadCrumb.innerHTML = "<a class='back-link-top'>All Makes</a> <strong>></strong> <a class='back-link-mid'> " + makeName + 
    						   "</a> <strong>></strong> " + modelName;
    	
    	// set handlers for level 1 and 2 breadcrumb links
    	d3.select("h4 a.back-link-top")
			.on("click", function(){
				Y.fire("BrandMap:toTopLevel", {
					"tier1Id" : "0",
					"tier2Id" : "0",
					"date"	  : that.get("date")
				});
			});
		d3.select("h4 a.back-link-mid")
			.on("click", function(){
				Y.fire("BrandMap:topLevelClick", {
		            "tier1Id"   : that.get("tier1Id"),
		            "tier2Id"	: "0",
		            "date"      : that.get("date")
		        });
			});
    },
    
    /*
	 * Draws the clicked model on the model level modelData: the response for
	 * the cross-model data
	 */
    drawCenterModel : function(modelData, centerName){
    	var that=this;
    	this.resetSvgElt();
    	d3.select("#map svg")
    		.append("g")
    		.attr("id", "centerGroup")
    		.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")")
	    		.append("circle")
	    		.attr("id", "center")
	    		.attr("cx", 0)
	    		.attr("cy", 0)
	    		.attr("r", 0)
	    		.attr("opacity", 0)
	    		.transition()
	    		.duration(1500)
	    		.attr("opacity", 1)
	    		.attr("r", maxModRad)
	    		.each("end", function(){
	    			if(modelData.length === 0)
    					that.showModelChoiceTooltip([-232,0], {"modelName":centerName});
    				else that.showModelChoiceTooltip([-8,0], {"modelName":centerName});
	    			Y.one("#expand-container").on("click", function(){
	    				if(window.location.hash.split("&").shift().split("#")[1] === "dataVis3"){
		    				that.hideModelChoiceTooltip();
		    				if(modelData.length === 0)
		    					that.showModelChoiceTooltip([-232,0], {"modelName":centerName});
		    				else that.showModelChoiceTooltip([-8,0], {"modelName":centerName});
	    				}
	    			});

	    		});
    	// Add tooltip divs
    	Y.one("#map #tooltips").append("<div class = 'modelChoiceTooltip' style='display:none;'></div>"); 
    	Y.one("#map #tooltips").append("<div class = 'modelTooltip' style='display:none;'></div>"); 
    },

    /*
	 * Draws the cross-shopping models on the third page with their tooltips
	 * makeName: the make name of the clicked model modelName: the name of the
	 * clicked model modelData: the json object returned by the database request
	 * for cross-model data
	 */
    drawCrossModels : function(makeName, modelName, modelData){
    	var degrees = this.getCircleDegrees(modelData), that=this;
    	var minMaxDiff = this.findMinMaxPercent(modelData);
    	// Create svg g element for model-level cross models
    	var temp = d3.select("#map svg")
    		.append("g")
    		.attr("id", "crossModels")
    		.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")")
	    		.selectAll("#crossModels .model")
	    		.data(degrees)
	    		.enter()
	    		.append("circle")
	    			.attr("cx", 0) 
	    			.attr("cy", 0)
	    			.attr("opacity", 0)
	    			.attr("r", 0)
	    			.attr("id", function(d, i){ return that.removeWhiteSpace(modelData[i].makeName) + that.removeWhiteSpace(modelData[i].modelName); })
	    			.attr("class", "model")
	    			.attr("fill", "#8ac441")
	    			// Fade and slide circles in
	    			.transition()
	    			.duration(1500)
	    			// Determine size of circles based on percentages
	    			.attr("r", function(d, i){
	    				var max = maxModRad, min = 2*max/5, radDiff = max-min,
	    				percent = parseFloat(modelData[i].percent) / 100, 
	    				percentRatio = (percent-minMaxDiff.minPercent)/(minMaxDiff.percentDiff), 
	    				rad = min+percentRatio*radDiff;
	    				return rad;
	    			})
	    			.attr("opacity", 1)
	    			.attr("cx", function(d){ return d[0]; })
	    			.attr("cy", function(d){ return d[1]; })
	    			.attr("class", "model")
	    			.each("end", function(d,i){
		    			// Attach tooltip handlers
	    				d3.selectAll(".model")
		    	    		.data(degrees)
			    			.on("mouseover", function(d,i){
			    				var newPos = [d[0], d[1]];
			    				var json = that.modelTurnToJSON(makeName, modelName, modelData[i]);
			    				that.showModelTooltip(newPos, json);
			    				this.setAttribute("fill", "#c16ba8");
			    				var selector = "#model" + (i+1);
			    				d3.select(selector)
			    					.attr("style", "background-color:#c16ba8; font-family: 'Arial'; color:#fff; " +
			    						"padding-top: 4px; padding-right: 20px; height: 20px;");
			    				d3.select(".model" + (i+1))
			    					.attr("opacity", 0.9);
			    			})
			    			.on("mouseout", function(d,i){
			    				that.hideModelTooltip();
			    				this.setAttribute("fill", "#8ac441");
			    				var selector = "#model" + (i+1);
	    						d3.select(selector)
	    							.attr("style", "font-family:'Arial'; padding-top:4px;" +
	    									 "padding-right: 20px; height: 20px;");
	    						d3.select(".model" + (i+1))
	    							.attr("opacity", 0.5);
			    			});
	    			});
    	that.drawModelList(makeName, modelName, modelData, degrees);
    }, 
    
    /*
	 * Draws the list of models on the side of the svg to keep track of models
	 * modelData: the data to extract the model names from degrees: the points
	 * at which the models will be placed
	 */
    drawModelList : function(makeName, modelName, modelData, degrees){
    	var that=this, maxWidth = 0;
    	d3.select("#modelList")
			.selectAll(".listItem")
			.data(degrees)
			.enter()
			.append("li")
			.html(function(d,i){
				var data = modelData[i];
				return (i+1) + ". " + data.makeName + " " + data.modelName;
			})
			.attr("value", function(d,i){
				var itemWidth = this.getBoundingClientRect().width;
				if(itemWidth>maxWidth){
					maxWidth = itemWidth;
				}
				var data = modelData[i];
				return that.removeWhiteSpace(data.makeName) + that.removeWhiteSpace(data.modelName);
			})
			.attr("id", function(d,i){
				return "model" + (i+1);
			})
			.attr("class", "listItem")
			.attr("style", function(d,i){
				return "font-family: 'Arial'; height:20px; padding-top: 4px; padding-right: 20px;";
			})
			.on("mouseover", function(d,i){
				var identifier = this.getAttribute("value");
				
				d3.select("#" + identifier)
					.attr("fill", "#c16ba8");
				var circle = document.getElementById(identifier);
				d3.select(".model" + (i+1))
					.attr("opacity", 0.9);
				var json = that.modelTurnToJSON(makeName, modelName, modelData[i]);
				that.showModelTooltip(d, json);
			})
			.on("mouseout", function(d,i){
				var identifier = this.getAttribute("value");
				d3.select("#" + identifier)
					.attr("fill", "#8ac441");
				d3.select(".model" + (i+1))
				.attr("opacity", 0.5)
				var circle = document.getElementById(identifier);    			
				that.hideModelTooltip();
			});
    	if(modelData.length === 0){
    		d3.select("#modelList")
    			.append("li")
    			.html("No Data")
    			.attr("id", "noDataMessage");
    	}
    },
    
    /*
	 * Draws the cross-shopping lines on the model-level makeName: the make name
	 * of the clicked model modelName: the name of the clicked model modelData:
	 * the json object returned by the database request for cross-model data
	 */
    drawCrossLines : function(makeName, modelName, modelData){
    	var that=this, degrees = this.getCircleDegrees(modelData);
    	
    	// Set up svg group for model cross lines
    	var modelLineGroup = d3.select("#map svg")
							.append("g")
								.attr("id", "modelLineGroup")
								.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");
    	
    	// Find percentage statistics
    	var minMaxDiff = this.findMinMaxPercent(modelData);
    	
    	// Draw cross-model lines
    	for(var i=0; i<degrees.length; i++){
    		var line = d3.svg.diagonal()
			.source({x:0, y:0})
			.target({x: degrees[i][0],
					 y: degrees[i][1]});
    		modelLineGroup
    			.append("path")
    			.attr("value", i)
    			.attr("fill", "none")
				.attr("stroke", "#868686")
				.attr("d", line)
				.attr("class", "crossModelLine model" + (i+1))
				// determine width of lines by percentage
				.attr("stroke-width", function(){
					var minWidth = 5, maxWidth = maxModRad*2/3, widthDiff = maxWidth-minWidth, 
					percent = parseFloat(modelData[i].percent) / 100, 
					percentRatio = (percent-minMaxDiff.minPercent)/(minMaxDiff.percentDiff), 
					width = minWidth+percentRatio*widthDiff;
					return width;
				})
				
				// fade lines in
				.attr("opacity", 0)
    			.transition()
    			.delay(750)
	    		.duration(1500)
	    		.attr("opacity", .5)
	    		// Attaches mouseover and mouseout handlers after fade in
	    		.each("end", function(d,i){
	    			d3.selectAll(".crossModelLine")
		    			.on("mouseover", function(){
		    				var index = this.getAttribute("value");
		    				var newPos = [d3.mouse(this)[0], d3.mouse(this)[1]];
		    				var json = that.modelTurnToJSON(makeName, modelName, modelData[index]);
		    				that.showModelTooltip(newPos, json);
	    					this.setAttribute("opacity", .9);
    						d3.select("#model"+(parseInt(index)+1))
    							.attr("style", "background-color:#c16ba8; font-family:'Arial'; color:#fff; " +
    									"padding-top: 4px; padding-right: 20px; height: 20px;");
    						document.querySelectorAll(".model")[index].setAttribute("fill", "#c16ba8");
	    					
		    			})
		    			.on("mouseout", function(){ 
		    				var index = this.getAttribute("value");
		    				that.hideModelTooltip(); 
	    					this.setAttribute("opacity", .5);
    						d3.select("#model"+(parseInt(this.getAttribute("value"))+1))
    							.attr("style", "font-family:'Arial'; padding-top: 4px; padding-right: 20px;" +
    									"height: 20px;");
    						document.querySelectorAll(".model")[index].setAttribute("fill", "#8ac441");
		    			});
	    		});
    	}
    	
    	// Move cross lines behind circles
    	var element = document.getElementById("modelLineGroup");
    	element.ownerSVGElement.insertBefore(element, element.ownerSVGElement.firstChild);
    }
});

Y.CIBasePage.registerModuleConstructor(APDataVis3);
