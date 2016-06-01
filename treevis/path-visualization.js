var Suffix = {
  getCountingSuffix: function(n) {
    switch(n) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  },

  isInt: function(n){
    return Number(n) === n && n % 1 === 0;
  },

  isFloat: function(n){
    return n === Number(n) && n % 1 !== 0;
  },

  addCountingSuffix: function(n) {
    var lastDigit = n % 10,
        suffix = this.getCountingSuffix(lastDigit);
    return n + suffix;
  },

  niceNumber: function(n) {
    // We should keep the current value if it's a NaN or "Infinity".
    if (!(this.isInt(n) || this.isFloat(n))) {
      n = Number(n);
    }
    if (n === Infinity || n === -Infinity || isNaN(n)) {
      return n;
    }
    if( Math.abs(n) >= 1000000000000 ) {
      return (Math.round((Math.round(n) / 1000000000000) * 10) / 10) + 'T';
    } else if( Math.abs(n) >= 1000000000 ) {
      return (Math.round((Math.round(n) / 1000000000) * 10) / 10) + 'B';
    } else if( Math.abs(n) >= 1000000 ) {
      return (Math.round((Math.round(n) / 1000000) * 10) / 10) + 'M';
    } else if( Math.abs(n) >= 1000 ) {
      return (Math.round(((Math.round(n) / 1000) * 10)) / 10) + 'K';
    }
    return Math.round((n * 10) / 10).toString();
  }
};

/* Dimension properties about the visualization */
var RECT_WIDTH = 130,  // Default width of a node
    RECT_HEIGHT = 40,  // Default height of a node
    RECT_BORDER_SIZE = 1,  // Default width of a node's border
    HOVER_BORDER_DIFF = 3,  // Default width of a node's border on hover
    MIN_LINK_WIDTH = 1,  // The minimum width a link can be
    EXTRA_PADDING = 40,  // The amount of padding to place around the tree visualization
    BETWEEN_NODES = 5,  // The amount of vertical space between nodes
    NODE_TEXT_PADDING = 10,  // The amount of left/right padding to give the text in a node
    DEFAULT_DY = 10,  // The default distance a line of text in a node has from the line above it
    PLUS_BTN_DIM = 20,  // The dimension of a plus button on a node
    LEVEL_HEADER_HEIGHT = 30,  // The height of a level header
    LEVEL_HEADER_MARGIN = 15;  // The bottom margin of a level header

/* Properties about the data */
var treeData = {},  // Represents the raw data from the input json file
    pathData = {},  // Represents the actual data as a hierarchy of nodes
    treeDepth = 0,  // Max tree depth
    levelHeader = null,  // The type of metric shown
    needsRefresh = false,  // Whether the visualization needs to be refreshed
    nodesAtATime = 5;  // Number of nodes to be shown at a time on expand

/* Properties for showing and hiding the loading icon */
var showLoadingChart = null,  // These will be passed as functions from controller-mixin
    hideLoadingChart = null;  // These will be passed as functions from controller-mixin

// An object constructor for a new path data node object
function newPathDataNode(name, value, children, nestingLevel, pathNames, id, childrenToShow, allChildren) {
  return {
    name: name,
    value: value,
    children: children,
    nestingLevel: nestingLevel,
    pathNames: pathNames,
    id: id,
    childrenToShow: childrenToShow,
    allChildren: allChildren
  };
}

/**
* Computes the text for the tooltips of the visualization on hover
* @param d: the node object to extract values from
* @type: whether the tooltip is shown from a link or a node
* @return html representing the tooltip content
*/
function getTooltipContent(d, type) {
  var value = (type === 'link' ? d.target.value : d.value),
      name = (type === 'link' ? d.source.name + ' \u2192 ' + d.target.name : d.name);

  return  '<span class="name">' + name + '</span>' +
          '<span class="metric">' + levelHeader + ': </span>' +
          '<span class="value">' + value + '</span>';
}

/** Calculates the rendered height of the tree and shifts the svg and
* tree as needed to make the whole tree visible. Needed because when the
* Tree is expanded, the d3 orientation of the tree layout makes it
* extremely difficult to precalculate the rendered height of the tree
*/
function accommodateTree() {
  // get tree and svg bounding boxes
  var treeBB = $('g:first-child')[0].getBoundingClientRect(),
      svgBB = $('svg')[0].getBoundingClientRect();

  // Calculate height and difference in top attributes
  var actualHeight = treeBB.height,
      topDiff = svgBB.top - treeBB.top;

  // Get new y transformation of g element
  var oldTransformYString = d3.select('g:first-child').attr('transform'),
      splitString = oldTransformYString.split(',')[1],
      valString = splitString.substring(1, splitString.length - 1),
      oldValue = parseFloat(valString),
      newValue = oldValue + topDiff;

  d3.select('svg').attr('height', actualHeight + RECT_HEIGHT / 2 +
    HOVER_BORDER_DIFF + 4 + LEVEL_HEADER_MARGIN +
     LEVEL_HEADER_HEIGHT);
  d3.select('g:first-child').attr('transform', 'translate(2, ' +
    (newValue + HOVER_BORDER_DIFF + LEVEL_HEADER_MARGIN +
     LEVEL_HEADER_HEIGHT) + ')');
}

/**
* Calculates the appearance of the links between parents and children
* Uses a start and end point and two other points that have the same y coordinate
* as the endpoints respectively, and a basis interpolation for the custom shape
* @param d: the link data to extract positions from
* @param lineFunction: the d3 line function to apply to the points
*/
function lineData(d, lineFunction) {
  var sideBtnDim = (d.source === pathData ? 0 : PLUS_BTN_DIM);
  var points = [
    { x: d.source.y + RECT_WIDTH + sideBtnDim,
      y: d.source.x + RECT_HEIGHT / 2 },
    // add two points to facilitate the interpolation
    { x: d.source.y + RECT_WIDTH * 5 / 4 + sideBtnDim,
      y: d.source.x + RECT_HEIGHT / 2 },
    { x: d.target.y - RECT_WIDTH / 4,
      y: d.target.x + RECT_HEIGHT / 2 },
    { x: d.target.y,
      y: d.target.x  + RECT_HEIGHT / 2}
  ];
  return lineFunction(points);
}

/**
* Resets the svg and the data associated with the old tree
*/
function resetSvg() {
  // clear svg and node counts before drawing
  d3.select('.pathsvis').selectAll('*').remove();
}

/**
* Sets up the svg container, the tree layout, and the links
* width: the starting width of the svg
* height: the starting width of the svg
*/
function setupTree(width, height) {
  var svg = d3.select('.pathsvis').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    // This transform centers the root node vertically in the svg
    .attr('transform', 'translate(2, ' +
      ((nodesAtATime / 2) * (RECT_HEIGHT + BETWEEN_NODES) -
        PLUS_BTN_DIM / 2 - BETWEEN_NODES / 2 - PLUS_BTN_DIM / 2 +
        HOVER_BORDER_DIFF) + ')');

  // The 1.5 means that the space between levels is 0.5 times the node width
  var tree = d3.layout.tree()
    .nodeSize([RECT_HEIGHT + BETWEEN_NODES,
              (RECT_WIDTH + PLUS_BTN_DIM) * 1.5]);

  // Custom line function for the links
  var lineFunction = d3.svg.line()
    .x(function(point) { return point.x; })
    .y(function(point) { return point.y; })
    .interpolate('basis');

  var nodes = tree.nodes(pathData),
      links = tree.links(nodes);
  drawLinks(links, svg, lineFunction);
  return [svg, tree, lineFunction, nodes];
}

/**
* Draws the links of the tree
* @param links: the data representing the links
* @param svg: the d3 svg selection
* @param lineFunction: the function determining the shape
*   of the links
*/
function drawLinks(links, svg, lineFunction) {
  // Need to save 'this' because d3 functions receive a dom element as 'this'
  var moduleThis = this;
  svg.selectAll('.link')
    .data(links)
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('id', function(d) { return nodeIdToLinkId(d.target.id); })
    .style('fill', 'none')
    .style('stroke-width', function(d) {
      var ranks = getRanks(),
          maxLinkWidth = RECT_HEIGHT / 4,
          widthRange = maxLinkWidth - MIN_LINK_WIDTH,
          numRanks = Object.keys(ranks).length;

      // If the widths are all the same, just make the width
      // Halfway between the max and min
      if (numRanks <= 1) {
        return MIN_LINK_WIDTH + (widthRange) / 2;
      } else {
        var rank = ranks[d.target.value],
            widthUnit = widthRange / numRanks;
        return MIN_LINK_WIDTH + rank * widthUnit;
      }
    }.bind(this))
    .attr('d', function(d) { return lineData(d, lineFunction); })
    .attr('data-toggle', 'tooltip')
    .attr('title', function(d) { return getTooltipContent(d, 'link'); })
    .on('mouseover', function(d, i) {
      highlightPathFromLink(d, this, true);
      var savedParent = this.parentNode;
      savedParent.removeChild(this);
      savedParent.appendChild(this);
      var mousePos = d3.mouse(d3.select(this).node());
      $('#' + this.getAttribute('id'))
        .tooltip({html: true, container: 'body', placement: 'top',
          delay: 0});
    })
    .on('mouseout', function(d, i) {
      highlightPathFromLink(d, this, false);
    })
    .each(function(d) {
      $('#' + this.getAttribute('id'))
        .tooltip({html: true, container: 'body', placement: 'top',
          delay: 0});
    });
}

/**
* Draws the nodes of the tree
* @param nodes: the data representing the nodes
* @param svg: the d3 svg selection
* @return the nodes selection
*/
function drawNodes(nodes, svg) {
  return svg.selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    // The natural orientation of the tree is top down, not left to right,
    // so switch x and y when translating
    .attr('transform', function(d) { return ('translate(' + d.y + ',' + d.x + ')'); });
}

/**
* Adds to the number of children shown for the given node
* @param d: the node object to increase the children for
*/
function moreChildren (d) {
  // Change the number of children to be rendered for this node's children
  var newChildren = d.allChildren.slice(d.childrenToShow,
    d.childrenToShow + nodesAtATime);
  d.children = d.children.concat(newChildren);
  d.childrenToShow += newChildren.length;

  // Redraw
  drawTree();
}

/**
* Draws the labels on top of each level for the visualization
* @param numLevels: the depth of the tree visualization
*/
function drawLevelLabels(numLevels) {
  var startX = 0,
      svg = d3.select('svg'),
      increment = 1.5 * (RECT_WIDTH +
                         PLUS_BTN_DIM);

  // Add the first label for the root element
  var firstLabel = svg.append('text')
    .attr('width', RECT_WIDTH)
    .attr('height', LEVEL_HEADER_HEIGHT)
    .attr('margin-bottom', LEVEL_HEADER_MARGIN)
    .attr('class', 'level-label')
    .text('Starting Point \u2192');
  firstLabel.attr('x', (RECT_WIDTH -
    firstLabel.node().getComputedTextLength()) / 2)
    .attr('y', 20);

  // Add the labels for all successive rows
  for (var i = 1; i <= numLevels; i++) {
    var label = svg.append('text')
      .attr('x', increment * i)
      .attr('width', RECT_WIDTH)
      .attr('height', LEVEL_HEADER_HEIGHT)
      .attr('margin-bottom', LEVEL_HEADER_MARGIN)
      .attr('class', 'level-label')
      .text(Suffix.addCountingSuffix(i) + ' Level \u2192');
    label
      .attr('x', increment * i +
        ((RECT_WIDTH + PLUS_BTN_DIM) -
         label.node().getComputedTextLength()) / 2)
      .attr('y', 20);
  }
}

/**
* Draws the rectangles for the nodes
* @param node: the d3 selection of all node objects
*/
function drawRectangles(node) {
  // Need to save 'this' because d3 functions receive a dom element as 'this'
  var moduleThis = this;
  return node
    .append('rect')
    .attr('width', function(d, i) {
      if (d !== pathData) {
        return RECT_WIDTH + PLUS_BTN_DIM;
      }
      return RECT_WIDTH;
    })
    .attr('height', RECT_HEIGHT)
    .attr('class', 'borderRect')
    .attr('id', function(d){ return d.id; })
    .attr('data-toggle', 'tooltip')
    .attr('title', function(d) { return getTooltipContent(d, 'node'); })
    .on('mouseover', function(d, i) {
      highlightPathFromNode(d, this, true);
      $('#' + d.id).tooltip({html: true, container: 'body',
        placement: 'top', delay: 0});
    })
    .on('mouseout', function(d, i) {
      d3.select('.tooltip').remove();
      highlightPathFromNode(d, this, false);
    })
    .each(function(d) {
      $('#' + d.id).tooltip({html: true, container: 'body',
        placement: 'top', delay: 0});
    });
}

/**
* Highlights or unhighlights the ancestor path of the given node
* @param d: the node object to highlight from
* @param nodeElt: the node's dom element
* @param isActive: whether the node should be highlighted or unhighlighted
*/
function highlightPathFromNode(d, nodeElt, isActive) {
  var node = d3.select(nodeElt);
  node.classed('active', isActive);
  var link = d3.select('#' + nodeIdToLinkId(d.id)),
      domLink = link[0][0];
  if (domLink) {
    link.classed('active', isActive);
    var savedParent = domLink.parentNode;
    savedParent.removeChild(domLink);
    savedParent.appendChild(domLink);
  }
  if (d.parent) {
    highlightPathFromNode(d.parent,
      document.getElementById(d.parent.id), isActive);
  }
}

/**
* Highlights or unhighlights the ancestor path of the given link
* @param d: the link object to highlight from
* @param linkElt: the link's dom element
* @param isActive: whether the link should be highlighted or unhighlighted
*/
function highlightPathFromLink(d, linkElt, isActive) {
  var link = d3.select(linkElt);
  link.classed('active', isActive);
  var targetNode = d3.select('#' + d.target.id);
  targetNode.classed('active', isActive);
  highlightPathFromNode(d.source,
    document.getElementById(d.source.id), isActive);
}

/**
* Converts from a node's id to a link's id without a leading '#'
* @param nodeId: the id of the node without a leading '#'
* @return the id of the link without a leading '#'
*/
function nodeIdToLinkId(nodeId) {
  return 'link' + nodeId.substring(4, nodeId.length);
}

/** Draws the add or remove buttons for expanding
* the tree on user click
* @param node: the d3 selection of all node objects
*/
function drawAddRemoveButtons(node) {
  var addRemoveBtn = node
    .append('text')
    .attr('height', PLUS_BTN_DIM)
    .attr('width', PLUS_BTN_DIM)
    .attr('transform', function(d) {
      return 'translate(' + RECT_WIDTH  + ','
              + (RECT_HEIGHT / 2 + PLUS_BTN_DIM /2 - 2) + ')';
    });

  // Insert the 'add' buttons
  addRemoveBtn
    .filter(function(d) {
      return d.allChildren && d.allChildren.length !== 0 && 
            (!d.children || d.children.length === 0) && d.name !== '{Exit}';
    })
    .attr('class', 'plus-btn fa fa-plus-circle')
    .text('\uf055')
    .on('click', function(d) {
      addChildren(d);
    });

  // Insert the 'remove' buttons
  addRemoveBtn
    .filter(function (d) { return (d.children && d.children.length > 0 && (d !== pathData)); })
    .attr('class', 'remove-btn fa fa-minus-circle')
    .text('\uf056')
    .on('click', function(d, i) {return removeChildren(d); });
}

/**
* Draws the buttons at the bottom of child groups to increase the number
* of children in that group that are shown
* @param node: the node object to show a button for
*/
function drawMoreChildrenBtns(node) {
  if (node.children && node.children.length > 0) {
    if (node.childrenToShow !== node.allChildren.length) {
      var lastChild = node.children[node.children.length - 1];
      var moreChildrenContainer = d3.select(d3.select('#' + lastChild.id).node().parentNode)
        .attr('class', 'lastChildContainer node');
      var moreChildrenBtn = moreChildrenContainer
        .append('rect')
        .filter(function(d) { return d.parent.childrenToShow < d.parent.allChildren.length; });
      if (moreChildrenBtn[0].length > 0) {
        moreChildrenBtn
          .attr('class', 'lastChild borderRect')
          .attr('stroke', '#DDDDDD')
          .attr('stroke-width', 1)
          .attr('width', (RECT_WIDTH + PLUS_BTN_DIM) * 3 / 4)
          .attr('height', RECT_HEIGHT / 2)
          .attr('x', (RECT_WIDTH + PLUS_BTN_DIM) / 8)
          .attr('y', RECT_HEIGHT + HOVER_BORDER_DIFF - 1)
          .on('click', function(d) { return moreChildren(d.parent); });
      }
      var moreChildrenText = moreChildrenContainer
        .append('text')
        .filter(function(d) { return d.parent.childrenToShow < d.parent.allChildren.length; });
      if (moreChildrenText[0].length > 0) {
        moreChildrenText
          .attr('class', 'moreBtn')
          .text(node.allChildren.length - node.childrenToShow +
                ' more pages')
          .attr('width', moreChildrenBtn.attr('width'))
          .attr('height', moreChildrenBtn.attr('height'))
          .attr('x', parseInt(moreChildrenBtn.attr('x'), 10) +
                     NODE_TEXT_PADDING / 2)
          .attr('y', parseInt(moreChildrenBtn.attr('y'), 10) +
                     NODE_TEXT_PADDING * 1.5);
      }
    }
    for(var i=0; i<node.children.length; i++) {
      drawMoreChildrenBtns(node.children[i]);
    }
  }
}

/**
* Renders the text of the nodes
* @param node: the d3 selection of all node objects
*/
function drawText(node) {
  // Need to save 'this' because d3 functions receive a dom element as 'this'
  var moduleThis = this;
  var textElt = node
    .append('text')
    .attr('class', 'infoText')
    .attr('dx', NODE_TEXT_PADDING)
    .attr('dy', RECT_HEIGHT / 2)
    .attr('width', RECT_WIDTH -
          NODE_TEXT_PADDING);

  // Insert the name text
  textElt
    .append('tspan')
    .attr('dy', DEFAULT_DY)
    .attr('x', 0)
    .attr('class', 'name')
    .attr('width', RECT_WIDTH)
    .text(function(d) { return d.name; })
    .each(function(d) { cutText(this); });

  // Insert the value text
  textElt
    .append('tspan')
    .attr('dy', DEFAULT_DY * 2)
    .attr('x', NODE_TEXT_PADDING)
    .attr('class', 'value')
    .attr('width', RECT_WIDTH)
    .text(function(d) { return Suffix.niceNumber(d.value); })
    .each(function(d) { cutText(this); });
}

/**
* Overall draw function to render the tree
*/
function drawTree() {
  // Clear svg and calculate number of nodes in levels of tree
  resetSvg();

  // Get dimensions, draw svg, set up link and node functions
  var numLevels = getNumLevels(pathData),
      width = (numLevels - 1) *
        (1.5 * (RECT_WIDTH + PLUS_BTN_DIM)) +
        RECT_WIDTH + PLUS_BTN_DIM + EXTRA_PADDING,
      height = nodesAtATime * (RECT_HEIGHT +
        BETWEEN_NODES) + RECT_HEIGHT / 2 + HOVER_BORDER_DIFF,
      structures = setupTree(width, height),
      svg = structures[0],
      tree = structures[1],
      lineFunction = structures[2],
      nodes = structures[3];
      node = drawNodes(nodes, svg);

  // Draw rectangles, add/remove buttons, text
  drawLevelLabels(numLevels);
  drawRectangles(node);
  drawAddRemoveButtons(node);
  drawText(node);
  drawMoreChildrenBtns(pathData);

  // After expand, it is easier and takes less calculation to
  // just figure out how much the svg element is too small by and resize
  // rather than to figure out the required height with a precalculation
  accommodateTree();
}

/**
* Cuts off text that is too long to fit on a node
* @param d3Elt: the dom element representing the node
*/
function cutText(d3Elt) {
  var self = d3.select(d3Elt),
      textLength = self.node().getComputedTextLength(),
      text = self.text();
  while (textLength > RECT_WIDTH - NODE_TEXT_PADDING
        && text.length > 0) {
    text = text.slice(0, -1);
    self.text(text + '...');
    textLength = self.node().getComputedTextLength();
  }
}

/**
* Removes the given node's children from the tree
* @param node: the node object to remove the children for
*/
function removeChildren(node) {
  node.children = [];
  node.childrenToShow = 0;
  drawTree();
}

function addChildren(node) {
  if (node.children) {
    node.children = node.allChildren.slice(node.children.length,
                  node.children.length + nodesAtATime);
  } else {
    node.children = node.allChildren.slice(0, nodesAtATime);
  }
  
  node.childrenToShow = node.children.length;
  drawTree();
}

/** Extracts the raw data into pathData in a nice format
* @param data: the data to extract from
*/
function buildData(data) {
  if (!data) {
    return;
  }
  
  var dataNode = newPathDataNode(
    data.name, data.value, [], 0, [], 'node0',
    nodesAtATime, []
  );

  pathData = dataNode;
  levelHeader = data.unit;
  extractData(data.children, dataNode);
}

/** Helper for buildData, inserts the extra attributes into pathData
* @param nodeArray: the array representing the children of parentNode in the data
* @param parentNode: the node in pathData to insert the extracted data into
*/
function extractData(nodeArray, parentNode) {
  if (!nodeArray) {
    return;
  } else if(nodeArray.length === 0) {
    parentNode.allChildren = [];
    parentNode.children = [];
    parentNode.childrenToShow = 0;
  }

  var extractedData = [],
      limitedData = [];

  for (var i = 0; i < nodeArray.length; i++) {
    var newNode = newPathDataNode(
      nodeArray[i].name,
      nodeArray[i].value,
      [],
      parentNode.nestingLevel + 1,
      // insert the names on the path to this node
      parentNode.pathNames.concat([nodeArray[i].name]),
      parentNode.id + '-' + i,
      nodesAtATime,
      []
    );

    extractedData.push(newNode);

    if (i < nodesAtATime && parentNode.nestingLevel < 1) {
      limitedData.push(newNode);
    }

    extractData(nodeArray[i].children, newNode);
    
    parentNode.allChildren = extractedData;
    parentNode.children = limitedData;
    parentNode.childrenToShow = limitedData.length;
  }
}

/**
* Recursively retrieves the depth of the tree
* @param startNode: the node in pathData to start counting from
*/
function getNumLevels(startNode) {
  if (!startNode) {
    return 0;
  } else if (!startNode.children || startNode.children.length === 0) {
    return 1;
  } else {
    return 1 + Math.max.apply(null, startNode.children.map(
      function(node) { return getNumLevels(node); }));
  }
}

/**
* gets the unique values in the tree as an array
* @param node: the node object to start counting unique values from
* @param vals: the object which will store the unique values as keys
*/
function getUniqueValues(node, vals) {
  if (node) {
    if (node !== pathData && !vals[node.value]) {
      vals[node.value] = 0;
    }
    if (node.children) {
      for(var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        getUniqueValues(child, vals);
      }
    }
  }
}

/**
* Retrieves the ranks of the values of the tree
* @return an object with all values of the tree as keys
*   and their ranks as the values
*/
function getRanks() {
  // Get all values in the tree, remove the 'all' value
  var allValues = {};
  getUniqueValues(pathData, allValues);

  // Get the keys, sort them, give them each a rank
  var keys = Object.keys(allValues).sort(function(a, b) { return a - b; });

  for(var i=0; i<keys.length; i++) {
    allValues[keys[i]] = i;
  }
  return allValues;
}

/**
* Starting point of the visualization, renders tree after page loads
*/
function drawVis() {
  var _this = this;
  d3.json("data.json", function(error, json) {
    if (error) {
      return console.warn(error);
    } else {
      treeData = json;
      buildData(json);
      drawTree();
    }
  });
}

drawVis();