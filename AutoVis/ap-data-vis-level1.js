/**
 * Autos pulse data visualization top-level module.
 *
 * @module APDataVis1
 */
"use strict";

/**
 * @constructor
 * @augments Y.CIBaseWidget
 */
var pageData; //All data stored by the page

////////////////////////////////////////////////////////
//Constants
////////////////////////////////////////////////////////

var width = 800; //Width of visualization panel
var height = 800; //Height of visualization panel
var radToPageScale = 20; // Ratio of the radius of the largest top-level circle to the page size
var stdRad = 300; // common distance of dots from center
var minDim = 800; //minimum size of width and height dimensions
var numToPixels = minDim/10; //scaling factor for first level dots
var turnRadius = Math.PI / 7; //difference in theta for successive top-level dots
var pointToPageScale = 2.5; //Ratio of distance of point from center to page size

///////////////////////////////////////////////////////
//Configurations
///////////////////////////////////////////////////////

YUI().use('node', 'event', 'base', function (Y) {

	var APDataVis1 = Y.APDataVis1 = function() {
		APDataVis1.superclass.constructor.apply(this, arguments);
	};
	APDataVis1.NAME = "APDataVis1";
	APDataVis1.MODULE_TYPE = "dataVis1";
	APDataVis1.PULSE_TYPE = "1";
	APDataVis1.ATTRS = {
			 "date" : {},
	 };
	//Default configurations
	APDataVis1.CONFIG = {
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
	 * @class APDataVis1
	 * @constructor
	 * @arguments Y.CIBasePageModule
	 */
	Y.extend(APDataVis1, Y.Base, {

			inputParams : {
					"date" : "d"
			},

			
			//////////////////////////////////////////////////////////////////////////////////////////////
			// TEMPLATES
			//////////////////////////////////////////////////////////////////////////////////////////////
			
			/*Template for the header*/
			_HEADER_TEMPLATE : "<h3>{{tier1Name}}: {{pageHeaderEnd}}</h3>" +
									 "<h4>{{pageHeading}}</h4>",
			
			/*Template for the slider*/
			_SLIDER_TEMPLATE :  "<div class=\"col row visitorContainer box-shadow\" id=\"visitorSlider\">" +	
								"    <div id=\"viewSliderContainer\">"+
								"        <div id=\"viewSliderTitle\"><h4>Number of Unique Visitors</h4></div>"+
								"        <div id=\"uniqueVisitorSliderRow\" class=\"row\"></div>"+
								"        <div id=\"uniqueVisitorSliderLabel\" class=\"row\">"+
								"            <div id=\"uniqueVisitorGroup1\" class=\"l1\">0</div>"+
								"            <div id=\"uniqueVisitorGroup2\" class=\"l2\">10k</div>"+
								"            <div id=\"uniqueVisitorGroup3\" class=\"l3\">25k</div>"+
								"            <div id=\"uniqueVisitorGroup4\" class=\"l4\">50k</div>"+
								"            <div id=\"uniqueVisitorGroup5\" class=\"l5\">100k</div>"+
								"            <div id=\"uniqueVisitorGroup6\" class=\"l6\">MAX</div>"+
								"        </div>"+
								"    </div>"+
								"</div>",

			/*Template for the makes on the top level*/
		_TOP_TOOLTIP_TEMPLATE : "	<div class=\"tooltipTitle\">{{data.brandName}}</div> " + 
								"	<div class=\"displayInline\"> " + 
								"		<div id=\"uniqueVisitors\"><strong>{{label.DATA_TYPE}}:</strong> {{data.uniqueVisitorCount}}</div>" + 
								"	</div>",
								
			///////////////////////////////////////////////////////////////////////////////////////////////
			// Initialization Methods
			///////////////////////////////////////////////////////////////////////////////////////////////
						
			/**
			 * Binder initialization method, invoked after all binders on the page
			 * have been constructed.
			 */
			init: function (p_oAttrs) {
					// this.set("config", Y.mix(APDataVis1.CONFIG, this.config, true, null, 0, true));
					// APDataVis1.superclass.init.apply(this, arguments);
					// pageData = this.get("pageData");
					// this.node = p_oAttrs.node;
					// this.template = Y.Handlebars.compile(this._TEMPLATE);
					// this.headerTemplate = Y.Handlebars.compile(this._HEADER_TEMPLATE);
					// this.top_tooltip_template = Y.Handlebars.compile(this._TOP_TOOLTIP_TEMPLATE);
					// this.render();
					// this.getTopLevel();
				this.render();
				this.getTopLevel();
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
					// this.get("node").setContent(
							// this.template(this.get("config")._LABELS)
					// );
					// this.createInputControls();
					// this.get("pageProxy").renderActions([]);
					this.createInputControls();
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
			 * Creates the input controls for the top-level page and attaches the event handlers for slider changes
			 */
			createInputControls : function(){
					YUI({
						//Last Gallery Build of this module
						gallery: 'gallery-2012.04.18-20-14'
					}).use('gallery-yui-dualslider', function(Y) {
						var eleYuiSlider = new Y.DualSlider({
								id: 'uniqueVisitorSlider',
								axis: 'x',
								min: 0,
								max: 5,
								length: '247px'
						}),
						that = this,
						sliderChangeHandler = function(e){
								var eleYuiSlider = e.currentTarget;
								eleYuiSlider.syncUI();
								document.querySelector(".ci-page-module-header-container h4").innerHTML = "All Makes";
								that.drawTopLevel(that.storedBrandData);
						}
						eleYuiSlider.render('#uniqueVisitorSliderRow');
						eleYuiSlider.after('slideEnd', sliderChangeHandler);
						eleYuiSlider.after('railMouseDown', sliderChangeHandler);
						eleYuiSlider.setValue(0);
						eleYuiSlider.setValue2(5);
						this.eleYuiSlider = eleYuiSlider;
						Y.all("#uniqueVisitorSlider .yui3-dualslider-thumb").setContent("");
					});
			},
			
			/////////////////////////////////////////////////////////////////////////
			// Tooltip Methods
			/////////////////////////////////////////////////////////////////////////
			
			/*
			 * Generic helper method for creating tooltips
			 * mousePos is the position of the mouse
			 * d is the json data to be used in the tooltip template
			 * className is the class name of the tooltip to be shown
			 * template is the type of template this tooltip will use
			 * leftShift is the amount of left adjustment for the placing of the tooltip
			 * topShift is the amount of top adjustment for the placing of the tooltip
			 */
			showTooltip : function(mousePos, d){
				var tooltip = d3.select(".topTooltip"),
				svgElement = document.querySelector("#map svg");
				tooltip.style("left", (mousePos[0] + 150 + svgElement.width.baseVal.value/2) + "px");
				tooltip.style("top", (mousePos[1] + 217 + svgElement.height.baseVal.value/2) + "px");
				Y.one(".topTooltip").setHTML(this.top_tooltip_template({data: d, label: this.get("config")._LABELS}));
				Y.one(".topTooltip").show();
			},
			
			/*
			 * Hides the tooltips for the brand circles on the top level
			 */
			hideTooltip : function(){
				var tooltip = Y.one(".topTooltip");
				if(tooltip){
					tooltip.hide();
				}
			},
			
			/////////////////////////////////////////////////////////////////////////////////////
			// Helper Methods
			/////////////////////////////////////////////////////////////////////////////////////
			
			/*
			 * removes commas from a string, returns a number
			 * toParse: the string from which the commas will be removed
			 * returns a number with commas replaced by spaces
			 */
			removeCommas : function(toParse){
				return parseInt(toParse.replace(/\,/g,''));
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
			turnToJSON : function(tripleArray){
				var brandJSON = {};
				brandJSON["uniqueVisitorCount"] = tripleArray[0];
				brandJSON["brandName"] = tripleArray[1];
				brandJSON["id"] = tripleArray[2];
				return brandJSON;
			},
			
			/*
			 * Takes arrays in the forms pointArray = [x, y] and countBrandId = [uniqueVisitorCount, brandName, id] 
			 * and returns quintuple arrays in the form [x,y,uniqueVisitorCount,brandName,id]
			 * pointArray: an array of cartesian points in the form [[x1,y1],[x2,y2]...]
			 * countBrandId: an array of counts, brandNames, and Ids in the form [[count1,brand1,id1],[count2,brand2,id2]...]
			 * returns an array of quintuples in the form [[x1,y1,count1,brand1,id1],[x2,y2,count2,brand2,id2]...]
			 */
			makeQuintArrays : function(pointArray, countBrandId){
				var quintArray = [];
			for(var i=0; i<pointArray.length; i++){
				var element = [];
				element.push(pointArray[i][0]);
				element.push(pointArray[i][1]);
				element.push(countBrandId[i][0]);
				element.push(countBrandId[i][1]);
				element.push(countBrandId[i][2]);
				quintArray.push(element);
			}
			return quintArray;
			},
			
			/*
			 * Multiplies all values in the array of duples by the scaleFactor
			 * array: an array in the form [[x1,y1],[x2,y2]...]
			 * scaleFactor: the number by which each element of the arrays will be multiplied by
			 * returns an array of duples in the form [[x1*scaleFactor,y1*scaleFactor],[x2*scaleFactor,y2*scaleFactor]...]
			 */
			scaleAll : function(array, scaleFactor){
			var scaledArray = [];
			for(var i=0; i<array.length; i++){
				scaledArray.push([array[i][0]*scaleFactor, array[i][1]*scaleFactor]);
			}
			return scaledArray;
		},
			
		/*
		 * Gets the mapped slider values given array of values
		 * values: a pair of values representing the end points of a range
		 * returns an array containing the mapped slider values from values[0] to values[1]
		 */
			getSliderRangeValue : function(values){
					var rangeValues = [],
					getRange = function(val){
							switch(val){
									case 0: return 0;
									case 1: return 10000;
									case 2: return 25000;
									case 3: return 50000;
									case 4: return 100000;
									case 5: return Number.MAX_VALUE;
							}
					}
					for(var i=values[0]; i <= values[1]; i++){
							rangeValues.push(getRange(i));
					}
					return rangeValues;
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
			 * the circles with a radius of 300
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
		 * gets the radius of the top-level circle
		 * i: the position of the circle in the sorted array
		 * numMakes: the total number of makes to be displayed at top-level
		 */
		getRadii : function(i, numMakes){
			var max= minDim / radToPageScale, min = max/2,
			interval = (max-min)/numMakes;
			return max - i*interval;
		},
		
		/*
		 * Gets an array of points representing the coordinates of the top-level dots
		 * numPoints: the number of points to construct
		 */
		getPoints : function(numPoints){
			var maxDist = this.getDistToPoint(numPoints-1);
					var windowSpace = minDim / 2;
					
					//Creates the coordinates of the top-level brand circles
					var allPoints = [];
					var degree = Math.PI/3;
					for(var i=0; i<numPoints; i++){
							//Multiplying by 5 balances out the effect of squaring
							var theta = 5 * Math.sqrt(degree);
							//Square to get a more gradual decrease in radius change
							var r = Math.pow(Math.log(theta), 2) / pointToPageScale;
							allPoints.push(this.polarToCart([r, theta]));
							degree += turnRadius;
					}
					return allPoints;
			},
			
			/*
		 * Gets the distance from the center to the make based on its position in the sorted array
		 * returns the distance from the center to the make
		 */
		getDistToPoint : function(pointNumber){
			return (Math.pow(Math.log(5 * Math.sqrt(pointNumber*turnRadius)), 2) 
					/ pointToPageScale * numToPixels + (minDim / radToPageScale));   		
		},
		
			/////////////////////////////////////////////////////////////////////////////////////
			// Data Storage Variables
			/////////////////////////////////////////////////////////////////////////////////////
		
			/*Stores top-level brand data*/
			storedBrandData: "",
			
			/*Stores map from make name to make id*/
			brandToId : {},
			
			/////////////////////////////////////////////////////////////////////////////////////
			// Get Data Methods
			/////////////////////////////////////////////////////////////////////////////////////
			
			/*retrieve the json containing all makes and unique visitor counts*/
			getTopLevel : function(){
				var requestId, url,that=this;
				
				//Store top-level data and draw top level
				function callback(transactionId, brandData){
					if (requestId - 0 === transactionId - 0){
								this.toggleBusyOverlay(false);
								that.storedBrandData = brandData;
								that.drawTopLevel(brandData);
					}
				}
				url = "/autos-pulse/brand-map-data.php?d=" + this.get("date");
					this.toggleBusyOverlay(true);
					requestId = Y.CIDataCache.get(url, callback, this);
			},
			
			/*
			 * Filters out the top-level data based on the slider values
			 * data: the top level data to be filtered out
			 * returns the data that is within the values of the slider
			 */
			getFilteredData : function(data){
				var visitors = [this.eleYuiSlider.get("value"), this.eleYuiSlider.get("value2")],
					that = this, filteredData = [],
					rangeValues = that.getSliderRangeValue(visitors);
					filteredData = data.filter(function(value){
						var temp = value.uniqueVisitorCount
						var uniqueVisitors = that.removeCommas(temp);
							return uniqueVisitors>=rangeValues[0] && 
									 uniqueVisitors<=rangeValues[rangeValues.length-1];
					});
					return  Y.clone(filteredData, true);
			},
			
			
			/////////////////////////////////////////////////////////////////////////////////////
			// Top-level Draw Methods
			/////////////////////////////////////////////////////////////////////////////////////
			
			
			/*
			 * Draw the top level given the top-level data
			 * data: the data returned from the database request for the top-level data
			 */
			drawTopLevel : function(data){
	//    	this.hideTooltip();
				
				//Initial variables
				var filteredData = this.getFilteredData(data);
				var brandToCount = {}, countToBrand = {}, numToString = {}, sortedArrays = [], 
				sortedCounts = [], tier1Data = pageData.tier1Data;
				
				//reset breadcrumb
				document.querySelector(".ci-page-module-header-container h4").innerHTML = "All Makes";
					
				
				//Map the brand names to ids
				for(var i=0; i<tier1Data.length; i++){
					var tier1Obj = tier1Data[i];
					this.brandToId[tier1Obj.name] = tier1Obj.id;
				}
				
				//Create mappings from unique view numbers to unique view strings and unique views to brand names
				for(var i=0; i<filteredData.length; i++){
					var element = filteredData [i];
					var visCountString = filteredData[i].uniqueVisitorCount;
					var visCountNum = this.removeCommas(visCountString);
					numToString[visCountNum] = visCountString;
					countToBrand[visCountNum] = filteredData[i].makeName;
					sortedCounts.push(visCountNum);
				}
				
				//Sort the unique count  numbers
				sortedCounts.sort(function(a,b){ return b-a; });
				
				//Create an array of triple arrays holding sorted count, brand name, and id
				for(var i=0; i<sortedCounts.length; i++){
					var count = sortedCounts[i];
					var brand = countToBrand[count];
					sortedArrays.push([numToString[count], brand, this.brandToId[brand]]);
				}
				this.drawCircles(sortedArrays);
			},
			
			/*
			 * Draws the top-level make circles
			 * tripleArray: an array in the form [uniqueVisitorCount, brandName, id] 
			 */
			drawCircles : function(tripleArray){
				var numMakes = tripleArray.length,
				that = this, points = this.getPoints(tripleArray.length, this), 
				scaledPoints = this.scaleAll(points, numToPixels),
				//quintArray: [xPos, yPos, uniqueCount, brandName, id]
				quintArray = this.makeQuintArrays(scaledPoints, tripleArray);

				//Replace svg element on reset rather than adding more
				if(d3.select("#map svg")){
					d3.selectAll("#map svg")
						.remove();
				}
				
				//Append an svg g element for top-level circles
				var svg =   d3.select("#map").append("svg")
							.attr("width", width*.97)
							.attr("height", height*.97)
							.append("g")
							.attr("id", "makes")
							.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

				//Draw top-level circles
				var makes = svg.selectAll(".make")
							.data(quintArray);
				var circleGroup = 
					makes
					.enter()
					.append("g")
					.attr("id", function(d){ return d[4]; })
					.attr("class", "topCircle");
				circleGroup
					.append("circle")
					.attr("cx", function(d){ return d[0]; })
					.attr("cy", function(d){ return d[1]; })
					.attr("r", function(d,i){ return that.getRadii(i, numMakes);})
					.attr("cursor", "pointer")
					.attr("class", "make")
					.attr("value", function(d){ return d[3];})
					.attr("fill", "#29a7df")
					
					//Attach tooltip handlers
					.on("mouseover", function(d){ var json=that.turnToJSON([d[2],d[3],d[4]]); that.showTooltip([d[0],d[1]], json);})
				.on("mouseout", function(){ that.hideTooltip(); })
							
				circleGroup
					.append("svg")
						.attr("x", function(d,i){ return d[0] - that.getRadii(i, numMakes); })
						.attr("y", function(d,i){ return d[1] - that.getRadii(i, numMakes); })
					.attr("height", function(d,i){return 2*that.getRadii(i, numMakes);})
					.attr("width", function(d,i){return 2*that.getRadii(i, numMakes);})
					.append("svg:image")
							.attr("class", "logo")
							.attr("cursor", "pointer")
								.attr("xlink:href", "http://l.yimg.com/dh/ap/autopulse/auto_logo_icons.png")
								.attr("height", function(d,i){ 
									var dimension = 2*that.getRadii(i, numMakes),
									ratio = dimension / 80;
									return 5200*ratio;
								})
								.attr("width", function(d,i){
									return 2*that.getRadii(i, numMakes);
								})
								.attr("x", 0)
								.attr("y", function(d,i){
									var dimension = 2*that.getRadii(i, numMakes),
									ratio = dimension / 80, offset = that.getTopPadding(d[3]);
									return -1*offset*ratio;
								})
													
								//Attach tooltip handlers
								.on("mouseover", function(d){ 
									var json=that.turnToJSON([d[2],d[3],d[4]]); 
									that.showTooltip([d[0],d[1]], json);
									this.parentNode.previousSibling.setAttribute("fill", "#c16ba8");
								})
								.on("mouseout", function(){ 
									that.hideTooltip(); 
									if(this.parentNode.parentNode.getAttribute("class")!="make center")
										this.parentNode.previousSibling.setAttribute("fill", "#29a7df");
								})
								
								//Attach click handlers
								.on("click", function(d){
									that.hideTooltip();
									Y.fire("BrandMap:topLevelClick", {
													"tier1Id"   : d[4],
													"date"      : that.get("date")
											});
								});
				
				d3.select("#map").append("g").attr("id", "tooltips")
					.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");
				//Append the tooltip for top-level
				Y.one("#map #tooltips").append("<div class = 'topTooltip' style='display:none;'></div>");
			}
	});
	console.log(APDataVis1());
	APDataVis1().init();
});