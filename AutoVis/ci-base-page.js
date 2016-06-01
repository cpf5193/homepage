"use strict";

var TEMPLATE = "<div id=\"menuPanel\" class=\"menuPanel\"></div>" +
"<div id=\"home-container\" class=\"bodyPanel\">" +
"  <div id=\"home-body\" class=\"bodyColor\">" +
"    <div class=\"ci-page-module-container\">" +

"      <div class=\"ci-page-module-header-container\"></div>" +
"      <div id=\"home-header\">" +
"        <div id=\"search-filter-container\"></div>" +
"        <div class=\"ci-page-module-drawer-container drawer-hide\">" +
"          <div class=\"ci-page-module-drawer-colored\">" +
"            <div class=\"ci-page-module-drawer-top-gradient\"></div>" +
"            <div class=\"ci-page-module-drawer\"></div>" +
"            <div class=\"ci-page-module-drawer-bottom-gradient\"></div>" +
"            <div class=\"ci-page-module-drawer-bottom-lid\"></div>" +
"          </div>" +
"          <div class=\"ci-page-module-drawer-bottom-arrow-container\">" +
"            <div class=\"ci-page-module-drawer-bottom-arrow\"></div>" +
"          </div>" +
"        </div>" +
"      </div>" +
"      <div id=\"ci-page-module-header-errors\"></div>" +
"      <div id=\"page-content\">" +
"    </div>" +
"  </div>" +
"</div>";
/**
 *
 * @constructor
 * @augments Y.Base
 * @type {Function}
 */
YUI().use('node', 'event', 'base', function (Y) {
var CIBasePage = Y.CIBasePage = function () {
    CIBasePage.superclass.constructor.apply(this, arguments);
};
CIBasePage.NAME = "CIBasePage";
CIBasePage.PULSE_TYPE = null;
CIBasePage.ATTRS = {};

var _MODULE_CONSTRUCTORS = {};
CIBasePage.registerModuleConstructor = function(p_fConstructor) {
    var pulseType = p_fConstructor.PULSE_TYPE;
    if (!_MODULE_CONSTRUCTORS[pulseType]) {
        _MODULE_CONSTRUCTORS[pulseType] = {};
    }
    _MODULE_CONSTRUCTORS[pulseType][p_fConstructor.MODULE_TYPE] = p_fConstructor;
};

//Default configurations
CIBasePage.CONFIG = {
    _LABELS : {
        _TIME_DIMENSION_LABEL : "Month"
    },
    DEFAULT_TIER1_INDEX : 0
};

Y.extend(CIBasePage, Y.Base, {
    inputParams : {
        "tier1Id" : "t1",
        "tier2Id" : "t2",
        "categoryId" : "c",
        "date" : "d"
    },

    init: function (p_oAttrs) {

        CIBasePage.superclass.init.apply(this, arguments);
        Y.later(200, this, this._checkURIHashChange);

        var pageData, menuListAttrs, searchFilterAttrs,
        page = this;

        this.set("config", Y.mix(CIBasePage.CONFIG, this.config, true, null, 0, true));

        // Set a flag so when we see this object later, we can tell what it is.
        this._processPageData();
        pageData = this.get("pageData");

        // Because this module is static, we don't need a handlebars template for it.
        this.render();

        this.pageHeaderNode = Y.one(".ci-page-module-header-container");
        this.pageDrawerContainerNode = Y.one(".ci-page-module-drawer-container");
        this.pageDrawerNode = Y.one(".ci-page-module-drawer");
        this.pageContentNode = Y.one("#page-content");
        this.pageModuleDrawerNode = Y.one(".ci-page-module-drawer-bottom-arrow");
        this._defaultParams = {
            "tier1Id" : pageData.tier1Data[this.get("config").DEFAULT_TIER1_INDEX].id,
            "tier2Id" : pageData.tier2Data[pageData.tier1Data[this.get("config").DEFAULT_TIER1_INDEX].id][0].id,
            "siteId" : pageData.siteId,
            "categoryId" : [],
            "date" : pageData.searchDate
        };
        this.setAttrs(this._defaultParams);

        this.set("pageProxy", {
            showDrawer : function () {
                page.pageDrawerContainerNode.removeClass("drawer-hide");
            },
            hideDrawer : function () {
                page.pageDrawerContainerNode.addClass("drawer-hide");
            },
            setDrawerContent : function (p_sContent) {
                page.pageDrawerNode.set("innerHTML", p_sContent);
            },
            setHeaderContent : function (p_sContent) {
                page.pageHeaderNode.set("innerHTML", p_sContent);
            },
            renderActions : function(p_aActions) {
                page.searchFilter.renderActions(p_aActions);
            },
            displayError : function(p_sError) {
                page._displayError(p_sError);
            },
            /**
             * @deprecated
             */
            getSelectedDate : function() {
                return page.searchFilter.getSelectedDate();
            },
            selectPreviousDate : function(date) {
                page.searchFilter.selectPreviousDate();
            },
            selectNextDate : function(date) {
                page.searchFilter.selectNextDate();
            }
        });
        this._defaultType = "tierData";

        this._attachEvents();

        // Store the default data (contained as a subset of the data within pageData) in the cache.
        Y.CIDataCache.cacheInsert("/common/tier-summary-data.php?" +
            "&tier1Id=" + encodeURIComponent(this._defaultParams.tier1Id) +
            "&tier2Id=" + encodeURIComponent(this._defaultParams.tier2Id) +
            "&tier2Name=" + encodeURIComponent(this.get("pageData").tier2ById[this._defaultParams.tier1Id+"-"+this._defaultParams.tier2Id].name) +
            "&siteId=" + encodeURIComponent(this._defaultParams.siteId) +
            "&date=" + encodeURIComponent(this._defaultParams.date) +
            "&pulseType=" + encodeURIComponent(this.getPulseType()),
            pageData);

        this.parseMonths(pageData);
        menuListAttrs = {
            node :Y.one("#menuPanel"),
            pageData : pageData
        };

        searchFilterAttrs = {
            node : Y.one("#search-filter-container"),
            months : pageData.months,
            config : this.get("config")
        };

        // Priority is: attribute specific settings (highest) -> defaults
        Y.mix(menuListAttrs, this._defaultParams);
        Y.mix(searchFilterAttrs, this._defaultParams);

        this.menuList = this.getMenuList(menuListAttrs);
        this.searchFilter = new Y.SearchFilter(searchFilterAttrs);
        this.updateToReflectHash();
    },

    parseMonths : function(p_oPageData) {
        var times = p_oPageData.months,
            parsedTimes = [],
            nextTime = null,
            timesById, time, newTime, i;

        timesById = p_oPageData.timesById = {};

        for (i = 0; i < times.length; i++) {
            time = times[i];
            newTime = {
                name: time.timeValue,
                id: time.timeId
            };

            // Time periods are returned in descending order from current into the past.
            if (nextTime !== null) {
                newTime.next = nextTime;
                nextTime.previous = newTime;
            }

            parsedTimes.push(newTime);
            timesById[newTime.id] = newTime;

            nextTime = newTime;
        }

        p_oPageData.months = parsedTimes;
    },

    getMenuList : function () {},

    /**
    *
    */
   render : function () {
       this.get("node").setContent(
           TEMPLATE
       );
   },

    /**
    * Update the page module to reflect
    */
    updateToReflectHash : function() {
        var hashSegments, moduleType;

        this._lastSetHash = window.location.hash;
        hashSegments = this._parseURIHash();
        this.setAttrs(hashSegments);
        this.menuList.update(hashSegments);
        this.searchFilter.setSelectedDate(hashSegments.date);
        this._clearError();

        moduleType = hashSegments._TYPE;
        this._createModuleIfNeeded(moduleType);
        this.get("node").set("className", "ci-module-" + moduleType);
    },

    _getModuleConstructor : function(p_sModuleName) {
        return _MODULE_CONSTRUCTORS[this.getPulseType()][p_sModuleName];
    },

    /**
     * Return a payload object which contains the parsed URI Hash.
     * @return {Object}
     * @private
     */
    _parseURIHash : function() {
        var segments = window.location.hash.split("&"),
            moduleType = segments.shift().split("#")[1],
            compressedAttributes = {},
            attributes = {},
            i, j, keyVal, lookupAttr, attr,
            additionalParams;
        
        for (i = 0; i < segments.length; i++) {
            keyVal = segments[i].split("=");
            compressedAttributes[keyVal[0]] = keyVal[1];
        }

        for (lookupAttr in this.inputParams) {
            if (this.inputParams.hasOwnProperty(lookupAttr)) {
                attributes[lookupAttr] = null;
            }
        }

        for (attr in compressedAttributes) {
            for (lookupAttr in this.inputParams) {
                if (this.inputParams.hasOwnProperty(lookupAttr) &&
                    this.inputParams[lookupAttr] === attr) {
                    attributes[lookupAttr] = compressedAttributes[attr];
                }
            }
        }

        if(Y[moduleType] && Y[moduleType].ADDPARAMS){
            additionalParams = Y[moduleType].ADDPARAMS
            for(j = 0; j < additionalParams.length; j++){
                if(compressedAttributes[additionalParams[j]] !== undefined){
                    attributes[additionalParams[j]] = compressedAttributes[additionalParams[j]];
                }
            }
        }
        if(!this.validateParameters(attributes)){
	        var type = moduleType;
	        if (type === "dataVis1" || type==="dataVis2" || type === "dataVis3") {
	            attributes.categoryId = [];
	        	if(attributes.tier1Id == 0){
	                moduleType = "dataVis1";
	            } else if(attributes.tier2Id == 0){
	            	moduleType = "dataVis2";
	            } else { moduleType = "dataVis3"; }
	        }
	        else if(attributes.tier1Id == null){
	          moduleType = this._defaultType;
	          attributes = Y.clone(this._defaultParams);	
	        }
	        else{
	            attributes.categoryId = [];
	        }
        }
        attributes._TYPE = moduleType;

        return attributes;
    },

    /**
     * Check if the current URI Hash is different that the last time we checked or set it.
     * If it is, we need to update the modules on the page to reflect the new Hash.
     * @private
     */
    _checkURIHashChange : function() {
        if (window.location.hash !== "#" + this._lastSetHash &&
            window.location.hash !== this._lastSetHash) {
            // Since the last time we checked, the hash has changed.
            // We need to update the page to reflect it.
            this.updateToReflectHash();
        }

        Y.later(200, this, this._checkURIHashChange);
    },

    /**
     * Create convenience lookup hashes for tier1Id, tier2Id and categoryId in the global pageData object.
     * @private
     */
    _processPageData : function() {
        var pageData = this.get("pageData"),
            that = this,
            i, tier1Id, tier2Id;

        pageData._isPageData = true;

        pageData.categoriesById = {};
        for (i = 0; i < pageData.category.length; i++) {
            pageData.categoriesById[pageData.category[i].id] = pageData.category[i];
        }

        pageData.tier1ById = {};
        for (i = 0; i < pageData.tier1Data.length; i++) {
            pageData.tier1ById[pageData.tier1Data[i].id] = pageData.tier1Data[i];
        }

        pageData.tier2ById = {};
        for (tier1Id in pageData.tier2Data) {
            if (pageData.tier2Data.hasOwnProperty(tier1Id)) {
                for (i = 0; i < pageData.tier2Data[tier1Id].length; i++) {
                    tier2Id = pageData.tier2Data[tier1Id][i].id;
                    pageData.tier2ById[tier1Id+"-"+tier2Id] = pageData.tier2Data[tier1Id][i];
                    pageData.tier2ById[tier1Id+"-"+tier2Id].tier1Id = tier1Id;
                }
                pageData.tier1ById[tier1Id].tier2Data = pageData.tier2Data[tier1Id];
            }
        }

        // Will be populated as data is loaded.
        pageData.pulseData = {};

        // Helper function.
        pageData.getTier2Name = function(p_sTier2Id, p_sTier1Id) {
            if(p_sTier1Id === undefined || p_sTier1Id === null){
                p_sTier1Id = that.get("tier1Id");
            }
            if (this.tier2ById[p_sTier1Id+"-"+p_sTier2Id]) {
                return this.tier2ById[p_sTier1Id+"-"+p_sTier2Id].name;
            } else {
                return "";
            }
        };
        
        // Helper function.
        pageData.getTier2URL = function(p_sTier2Id, p_sTier1Id) {
            if(p_sTier1Id === undefined || p_sTier1Id === null){
                p_sTier1Id = that.get("tier1Id");
            }
            if (this.tier2ById[p_sTier1Id+"-"+p_sTier2Id]) {
                return this.tier2ById[p_sTier1Id+"-"+p_sTier2Id].url;
            } else {
                return "";
            }
        };
    },

    /**
    *
    * @param p_oAttrs
    * @private
    */
   _onGoBtnClick : function(p_oAttrs) {
       var moduleType;
       if(p_oAttrs.tier1Id == "0" && p_oAttrs.tier1Name == "ALL"){
    	   moduleType = "dataVis1";
       } else if (p_oAttrs.categoryId && p_oAttrs.categoryId.length > 0 && p_oAttrs.categoryId[0] !== "0") {
           moduleType = "searchBehaviorTable";
       } else if (this.currentModule.tier2_context || this.currentModule.tier1_context) {
           moduleType = this.currentModule.getModuleType();
           if(moduleType == "crossShoppingPage" && p_oAttrs.tier2Name == "ALL"){
               moduleType = "DMATable";
           }
           else if(this.currentModule.getModuleType() == "DMATable" && p_oAttrs.tier2Name != "ALL"){
               moduleType = "crossShoppingPage";
           }
       } else {
           moduleType = "tierData";
       }
       this._updateURIHash(moduleType, p_oAttrs);
   },

   _onCompareGoClick : function(p_oAttrs) {
       this._updateURIHash(this.currentModule.getModuleType(), p_oAttrs);
   },

   _onSearchFilterChange : function(p_oAttrs) {
       this._updateURIHash(this.currentModule.getModuleType(), p_oAttrs);
   },


   /**
    * Replace the current module with a DMA Table.
    * A DMA table always updates within its own init() method, so no update() call is needed.
    * @param p_oEventData
    * @private
    */
   _onDMAViewAll : function(p_oEventData) {
       this._updateURIHash("DMATable", p_oEventData);
   },

   /**
    * @param p_oEventData
    * @private
    */
   _onDMAGetOverview : function(p_oEventData) {
       this._updateURIHash("tierData", p_oEventData);
   },

   /**
    * Replace the current module with a cross shopping table module.
    * A Cross shopping table always updates within its own init() method, so no update() call is needed.
    * @param p_oEventData
    * @private
    */
   _onCrossShoppingViewAll : function(p_oEventData) {
       this._updateURIHash("crossShoppingPage", p_oEventData);
   },

    /**
     * Replace the current module with a cross visitation module.
     * @param p_oEventData
     * @private
     */
    _onCrossVisitationViewAll : function(p_oEventData) {
        this._updateURIHash("crossSitePage", p_oEventData);
    },

    /**
    * Replace the current module with a cross visitation module.
    * @param p_oEventData
    * @private
    */
    _onUniqueVisitorPageViewClick : function(p_oEventData) {
       this._updateURIHash("UVPVPage", p_oEventData, ["chartType"]);
   },

   /**
    *
    * @param p_oEventData
    * @private
    */
   _onGetOverview : function(p_oEventData) {
       this._updateURIHash("tierData", p_oEventData);
   },

   /**
    *
    * @param p_oEventData
    * @private
    */
   _onHistoryClick : function(p_oEventData) {
       this._updateURIHash("tierData", p_oEventData);
   },
   
   /**
    * @param p_oEventData
    * @private
    */
   _onTopLevelClick : function(p_oEventData){
	   this._updateURIHash("dataVis2", p_oEventData);
   },
   
   /**
    * @param p_oEventData
    * @private
    */
   _onMidLevelClick : function(p_oEventData){
	   this._updateURIHash("dataVis3", p_oEventData);
   },
   
   /**
    * @private
    */
   _toTopLevel : function(p_oEventData){
	   this._updateURIHash("dataVis1", p_oEventData);
   },

    /**
    * When the model list has loaded new data, the module may have been waiting on it for the name of a model
    * that wasn't there before.
    * @private
    */
   _onTier2ListLoad : function() {
       if (this.currentModule._pendingTier2Id) {
           delete this.currentModule._pendingTier2Id;
           this.currentModule.init({});
           this._updatePageModuleDrawer();
           this._updatePageModuleHeader();
       }
   },

   /**
    * Get header HTML from the current module and put it in the header.
    * @param p_oEventData
    * @private
    */
   _updatePageModuleHeader : function() {
       if (this.currentModule) {
           this.pageHeaderNode.set("innerHTML", this.currentModule.renderHeader());
       }
   },

   /**
    *
    * @param p_oEventData
    * @private
    */
   _updatePageModuleDrawer : function() {
       if (this.currentModule) {
           this.pageDrawerNode.set("innerHTML", this.currentModule.renderDrawer());
           this.currentModule.attachDrawerEvents();
       }
   },

   /**
    * Method called when an MDX parse error occurs.
    * @param p_oResult response from server
    * @private
    */
   _onParseError : function(p_oResult) {
       if (p_oResult && p_oResult.diagnostics && p_oResult.diagnostics.message) {
           this._displayError(p_oResult.diagnostics.message);
       } else {
           this._displayError("An Error occurred while parsing an MDX query.");
       }
   },

   /**
    * Display error text as red text on the page.
    * This is very bare-bones right now.
    * @param p_sErrorText
    * @private
    */
   _displayError : function(p_sErrorText) {
       var errorNode = Y.one("#ci-page-module-header-errors");
       errorNode.set("innerHTML", p_sErrorText);
   },

   /**
    * Clear any errors displayed with displayError()
    * @private
    */
   _clearError : function() {
       this._displayError("");
   },

   /**
    *
    * @private
    */
   _hideDrawer : function() {
       Y.fire("PulsePage:hideCategoryDrawer");
   },

   /**
    *
    * @private
    */
   _attachEvents : function() {
       Y.on("CrossShopping:viewAll", this._onCrossShoppingViewAll, this);
       Y.on("CrossVisitation:viewAll", this._onCrossVisitationViewAll, this);
       Y.on("SearchFilter:filterChange", this._onSearchFilterChange, this);
       Y.on("UVPV:viewChart", this._onUniqueVisitorPageViewClick, this);
       Y.on("DMA:dmaViewAll", this._onDMAViewAll, this);
       Y.on("DMA:getOverview", this._onDMAGetOverview, this);
       Y.on("CrossShopping:getOverview", this._onGetOverview, this);
       Y.on("CrossSite:getOverview", this._onGetOverview, this);
       Y.on("UVPV:getOverview", this._onGetOverview, this);
       Y.on("GoBtn:click", this._onGoBtnClick, this);
       Y.on("SearchBehaviorTable:compareGoClick", this._onCompareGoClick, this);
       Y.on("parseMDX:failure", this._onParseError, this);
       Y.on("PageError:error", this._displayError, this);
       Y.on("PageError:clear", this._clearError, this);
       Y.on("MenuList:historyClick", this._onHistoryClick, this);
       Y.on("BrandMap:topLevelClick", this._onTopLevelClick, this);
       Y.on("BrandMap:midLevelClick", this._onMidLevelClick, this);
       Y.on("BrandMap:toTopLevel",this._toTopLevel, this);
       Y.on("BrandMap:getOverview2", this._onGetOverview, this);
       Y.on("BrandMap:getOverview3", this._onGetOverview, this);
       this.pageModuleDrawerNode.on("click", this._hideDrawer, this);
   },

    validateParameters : function(p_oAttr) {
        var tier1Id = p_oAttr.tier1Id,
            tier2Id = p_oAttr.tier2Id,
            categoryId,
            date = p_oAttr.date;

        // Category id should always be an array.
        if (p_oAttr.categoryId) {
            categoryId = p_oAttr.categoryId = p_oAttr.categoryId.split(',');
        } else {
            categoryId = p_oAttr.categoryId = [];
        }

        if ((tier1Id === null || tier1Id === "0") && (tier2Id === null || tier2Id === "0") && categoryId.length === 0) {
            // If all three are null, use the defaults.
            return false;        	
        }
        
        if (tier1Id !== null && tier1Id !== "0" && tier2Id !== null && tier2Id !== "0") {
            p_oAttr.categoryId = [];
        }

        return true;
    },

    /**
     * Update the URI's hash to the specified value.
     * Or, if the state is the same as the default values, leave the hash empty.
     * @private
     * @returns Boolean true if the location was updated.
     */
    _updateURIHash : function(p_sModuleType, p_oAttrs, additionalParams) {
    	var newHash = this._generateURIHash(p_sModuleType, Y.merge(this.getAttrs(), p_oAttrs), additionalParams);
        if (newHash !== this._lastSetHash) {
            if (newHash === null) {
                window.location.hash = "";
            } else {
                window.location.hash = newHash;
            }
            return true;
        }
        return false;
    },

    /**
     * Generate a string which can be reused to reinitialize this module to its current state.
     * Used for bookmarking and browser history.
     * Returns null if the values are equal to the default values or not present.
     * @return String || null
     * @private
     */
    _generateURIHash : function(p_sModuleType, p_oAttrs, additionalParams) {
        var segments = [],
            allDefaults = true,
            value, param, key;

        if (p_oAttrs) {
            for (param in this.inputParams) {
                if (this.inputParams.hasOwnProperty(param)) {
                    value = p_oAttrs[param];
                    if (Y.Lang.isUndefined(value) || Y.Lang.isNull(value)) {
                        continue;
                    }

                    if (value !== this._defaultParams[param]) {
                        allDefaults = false;
                    }

                    key = this.inputParams[param];

                    segments.push(encodeURI(key) + "=" + encodeURI(value));
                }
            }
            if(additionalParams){
                for(var i = 0; i <= additionalParams.length; i++){
                    value = p_oAttrs[additionalParams[i]];
                    if (Y.Lang.isUndefined(value) || Y.Lang.isNull(value)) {
                        continue;
                    }
                    segments.push(encodeURI(additionalParams[i]) + "=" + encodeURI(value));
                }
            }
            if (!allDefaults || p_sModuleType !== this._defaultType) {
                // Only return a hash if the values weren't all the defaults.
                // This is to keep the URL from immediately redirecting away from the default non-hash URL,
                // Which breaks back functionality and looks weird.
                return p_sModuleType + "&" + segments.join("&");
            }
        }

        return null;
    },

    /**
     * Creates and initializes a page module of the given type with the given constructor if the current module is not
     * already of that type.
     * @private
     */
    _createModuleIfNeeded : function(p_sModuleType) {
        var moduleConstructor = this._getModuleConstructor(p_sModuleType),
            moduleAttributes;
        
        var inheritedAttributes = ['tier1Id','tier2Id','categoryId','date','pageData','pageProxy'];
        if (moduleConstructor && (!this.currentModule || this.currentModule.getModuleType() !== p_sModuleType)) {
            if (this.currentModule) {
                this.currentModule.unload();
            }

            if(Y[p_sModuleType] && Y[p_sModuleType].ADDPARAMS){
                inheritedAttributes = inheritedAttributes.concat(Y[p_sModuleType].ADDPARAMS);
            }
            moduleAttributes = this.getAttrs(inheritedAttributes);
            moduleAttributes.node = this.pageContentNode;
            this.currentModule = new moduleConstructor(moduleAttributes);

            // Modules that have a model context may need to delay their rendering until the model list is done loading
            // if the model name they needed was missing when they first were initialized.
            if (this.currentModule.tier2_context) {
                Y.on("MenuList:tier2ListLoad", this._onTier2ListLoad, this);
            }

            // Drawer and Header are always updated when a module changes.
            this._updatePageModuleDrawer();
            this._updatePageModuleHeader();
        } else if (this.currentModule) {
            this.currentModule.update(this.getAttrs(inheritedAttributes));
        }
    }

});
});