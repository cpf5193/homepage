"use strict";

(function(){
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



	//////////////////////////////////////////////////////////////////////////////////////////////
	// TEMPLATES
	//////////////////////////////////////////////////////////////////////////////////////////////

	/*Template for the header*/
	_HEADER_TEMPLATE : "<h3>{{tier1Name}}: {{pageHeaderEnd}}</h3>" +
							 "<h4>{{pageHeading}}</h4>";

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
						"</div>";

	/*Template for the makes on the top level*/
	_TOP_TOOLTIP_TEMPLATE : "	<div class=\"tooltipTitle\">{{data.brandName}}</div> " + 
						"	<div class=\"displayInline\"> " + 
						"		<div id=\"uniqueVisitors\"><strong>{{label.DATA_TYPE}}:</strong> {{data.uniqueVisitorCount}}</div>" + 
						"	</div>";

	///////////////////////////////////////////////////////////////////////////////////////////////
	// Initialization Methods
	///////////////////////////////////////////////////////////////////////////////////////////////
				
	/**
	 * Binder initialization method, invoked after all binders on the page
	 * have been constructed.
	 */
	function init() {
			// this.set("config", Y.mix(APDataVis1.CONFIG, this.config, true, null, 0, true));
			// APDataVis1.superclass.init.apply(this, arguments);
			// pageData = this.get("pageData");
			// this.node = p_oAttrs.node;
			// this.template = Y.Handlebars.compile(this._TEMPLATE);
			// this.headerTemplate = Y.Handlebars.compile(this._HEADER_TEMPLATE);
			// this.top_tooltip_template = Y.Handlebars.compile(this._TOP_TOOLTIP_TEMPLATE);
			// this.render();
			// this.getTopLevel();
		render();
		getTopLevel();
	}
			
	/*
	 * Updates the map with the new page attributes
	 * p_oAttrs: the page attributes used to update the page
	 */
	// function update(p_oAttrs){
	// 	init(p_oAttrs);
	// }

	/*
	 * Renders the page content
	 */
	function render() {
		// this.get("node").setContent(
				// this.template(this.get("config")._LABELS)
		// );
		// this.createInputControls();
		// this.get("pageProxy").renderActions([]);
		var yuislider =	createInputControls();
	}

	/*
	 * Renders the page header
	 */
	function renderheader() {
		var params = {
			"tier1Name" : this.get("config._LABELS.PAGE_HEADING_TIER1"),
			"tier2Name" : "All Makes",
			"pageHeading" : "All Makes",
			"pageHeaderEnd" : this.get("config._LABELS.PAGE_HEADER_END")
		};
		return this.headerTemplate(params);
	}
				
	/*
	 * Creates the input controls for the top-level page and attaches the event handlers for slider changes
	 */
	function createInputControls(){
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
			document.querySelectorAll('#uniqueVisitorSlider .yui3-dualslider-thumb').setContent("");
			return eleYuiSlider;
		});
	}

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
	function showTooltip(mousePos, d){
		var tooltip = d3.select(".topTooltip"),
		svgElement = document.querySelector("#map svg");
		tooltip.style("left", (mousePos[0] + 150 + svgElement.width.baseVal.value/2) + "px");
		tooltip.style("top", (mousePos[1] + 217 + svgElement.height.baseVal.value/2) + "px");
		document.querySelector(".topTooltip").setHTML(this.top_tooltip_template({data: d, label: this.get("config")._LABELS}));
		document.querySelector(".topTooltip").show();
	}

	/*
	 * Hides the tooltips for the brand circles on the top level
	 */
	function hideTooltip(){
		var tooltip = document.querySelector(".topTooltip");
		if(tooltip){
			tooltip.hide();
		}
	}



	/////////////////////////////////////////////////////////////////////////////////////
	// Get Data Methods
	/////////////////////////////////////////////////////////////////////////////////////
	
	/*retrieve the json containing all makes and unique visitor counts*/
	function getTopLevel(){
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
		toggleBusyOverlay(true);
		requestId = Y.CIDataCache.get(url, callback, this);
	}

	/*
	 * Filters out the top-level data based on the slider values
	 * data: the top level data to be filtered out
	 * returns the data that is within the values of the slider
	 */
	function getFilteredData(data){
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
	}

	init();
}());