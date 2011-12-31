/**
 * @author Pedro Mass
 */
var DEFAULT = "--Choose One--";

// create the data object
var data = new Object();
data["start"] 	= ["Men or Women?", ["men", "women"]];
// level 1
data["men"] 		= ["Facial Hair?", ["hair", "no hair"]];
data["women"] 	= ["Blonde or Brunette?", ["blonde","brunette"]];
// level2
data["hair"] 		= ["Complexion?", ["dark","light"]];
data["no hair"] = ["Build?", ["big", "small"]];
data["blonde"]	=	["Height?", ["tall", "small"]];
data["brunette"]=	["Eyes?", ["brown","blue"]];
 

/**
 * Removes all the children, checks to see if there is data for the selection (value).
 * If there is, we dynamically create a select element and add it after the current select.
 * 
 * If there is no data, a boolean of true is passed back
 *
 * @param whichSelect	- reference to the select element we wish to add the new select 
 */
function processSelect(which){
	// variable used to alert user the consequences of this function
	var result = false;
	
	// check if the passed in value is not null
	if(!which){
		// not a valid reference 
		return result;
	}
	
	// check if the reference is a an element
	if(which.nodeType != 1){ //1 being for element nodes
		// not an element 
		return result;
	}
	
	// remove younger siblings
	killOlderSiblings(which);
	
	// check to see if there is any data
	if(which.value in data && data[which.value]){
		// add the select
		addChoice(which);
	} else{
		//create the final text node
		showResults(which);
	}
}

/**
 * Gets all the choices, displays them.
 */
function showResults(which){
	// get the values from the selects
	var values = getSelVals();

	// check if we received results	
	if(!values){
		return;
	}

	// display the results
	
	// create the list
	var uElem = document.createElement("ul");
	
	// set up the list items
	for(val in values){
		val = values[val];
		
		// create list item
		var li = document.createElement("li");
		// create list item text node
		var text = document.createTextNode(val);
		// add text to list item
		li.appendChild(text);
		
		// add li to ul
		uElem.appendChild(li);
	}
	
console.log(uElem);

	// add ul to the document
	which.parentNode.appendChild(uElem);
}

function getSelVals(){
	// get all the select values
	var selects = document.getElementsByTagName("select");
	var values = new Array();
	
	// get the values for those selects
	for(i=0, len=selects.length; i<len; i++){
		if (selects[i].value === DEFAULT){
			return null;
		}
		values.push(selects[i].value);
	}
	
	return values;
}


/**
 * Creates a div, adds the question, and creates the select option element
 * 
 * @param elem - element to add after  
 */
function addChoice(elem){
	// grab the data
	var options = data[elem.value][1];
	var question = data[elem.value][0];

	// add the defaul option to the options array (at the front)
	options.unshift(DEFAULT);
	
	// create the question
	// create p node
	var pQuestion = document.createElement("p");
	// create text node
	question = document.createTextNode(question);
	// attach to p node
	pQuestion.appendChild(question);
	// attach p node to the document
	elem.parentNode.appendChild(pQuestion);
	
	
	// create the select option element
	var selElem = document.createElement("select");
	
	// set up the options
	for (option in options){
		option = options[option];
		// create the option
		var optElem = document.createElement("option");
		// set attributes
		optElem.setAttribute("value", option);
		
		// build text
		var textElem = document.createTextNode(option);
		// append text to opt
		optElem.appendChild(textElem);
		
		//append opt to select
		selElem.appendChild(optElem);
	}
	
	// add the event handler to the select option element
	// does not work in IE
	if(ieSeven){
		selElem.setAttribute('onchange', function(){processSelect(this);});
		
	} else{
  	selElem.setAttribute('onchange', 'processSelect(this);');;
  }
	
	// add select to the document
	elem.parentNode.appendChild(selElem);
	
}

/**
 * Removes all elements that come after this one
 */
function killOlderSiblings(elem){
	if(!elem){
		return;
	}
	
	// while we have another sibling
	while(sib = elem.nextSibling){
		// remove it
		sib.parentNode.removeChild(sib);
	}
}