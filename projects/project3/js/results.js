/**
 * @author tuxedo
 */

var orgId = 1;

function addAccordion(which) {
	$(which).accordion({
		// collapsible: true,
		collapsible : true,
		autoHeight: false,
		header : "> div > h3"
	}).sortable({
		axis : "y",
		handle : "h3",
		stop : function(event, ui) {
			// IE doesn't register the blur when sorting
			// so trigger focusout handlers to remove .ui-state-focus
			ui.item.children("h3").triggerHandler("focusout");
		}
	});
}

function fixNull(input) {
	if(!input || input == "null") {
		input = "";
	}

	return input;
}

function getData(orgId) {
	// do something

	window.orgId = orgId;

	// get/add the tabs
	myAjax('get', {
		path : "/Application/Tabs?orgId=" + orgId
	}, buildTabs);
}

function buildTabs(data) {
	// if bad data
	if($(data).find('error').length != 0) {

	} else {
		// if no data
		if($('Tab', data).length == 0) {
			// replace with text
			var error = document.createElement("span");
			error.setAttribute("id", "orgTabs");
			error.appendChild(document.createTextNode("No Tabs were found"));

			// get the city select
			$("#orgTabs").replaceWith(error);

		} else {
			// build the tabs
			var tabs = '<ul id="orgTabs" class="tabs">';

			$('Tab', data).each(function(y) {
				var tabName = $.trim($(this).text());
				tabs += '<li><a href="#' + tabName + '">' + $(this).text() + '</a></li>';
			});
			tabs += '</ul>';

			$("#orgTabs").replaceWith(tabs);

			// get data
			getTabData(window.orgId);

			// set tab width
		}
	}
}

function getTabData(orgId) {
	// get all the tabs

	// setup result container
	var panes = '<div id="orgPanes" class="panes">';

	// setup the pane structure
	$("#orgTabs li").each(function() {
		// build a div for each div
		// grab the text of li
		var type = $.trim($(this).text());
		panes += '<div id="' + type.toLowerCase() + 'Data">This is for tab: ' + type + '</div>';
	});
	panes += '</div>';

	$("#orgPanes").replaceWith(panes);

	// fill panes with real data
	$("#orgTabs li").each(function(i) {
		// fill with data

		// grab the text of li
		var type = $.trim($(this).text());

		// make a functioncall
		var command = "get" + type + "Data(" + orgId + ");";
		$.globalEval(command);
	});
	// turn on tabs
	turnOnTabs();
}

function getGeneralData(orgId) {
	var path = "/" + orgId + "/General";

	// add data
	myAjax('get', {
		path : path
	}, getGeneralDataCallback);
}

function getLocationsData(orgId) {
	var path = "/" + orgId + "/Locations";

	// add data
	myAjax('get', {
		path : path
	}, getLocationsDataCallback);
}

function getTreatmentData(orgId) {
	var path = "/" + orgId + "/Treatments";

	// add data
	myAjax('get', {
		path : path
	}, getTreatmentDataCallback);
}

function getTrainingData(orgId) {
	var path = "/" + orgId + "/Training";

	// add data
	myAjax('get', {
		path : path
	}, getTrainingDataCallback);
}

function getFacilitiesData(orgId) {
	var path = "/" + orgId + "/Facilities";

	// add data
	myAjax('get', {
		path : path
	}, getFacilitiesDataCallback);
}

function getPhysiciansData(orgId) {
	var path = "/" + orgId + "/Physicians";

	// add data
	myAjax('get', {
		path : path
	}, getPhysiciansDataCallback);
}

function getPeopleData(orgId) {
	var path = "/" + orgId + "/People";

	// add data
	myAjax('get', {
		path : path
	}, getPeopleDataCallback);
}

function getEquipmentData(orgId) {
	var path = "/" + orgId + "/Equipment";

	// add data
	myAjax('get', {
		path : path
	}, getEquipmentDataCallback);
}

function getGeneralDataCallback(data) {
	// path: ...ESD/{orgId}/General

	// if bad data
	if($(data).find('error').length != 0) {
		console.log("There was an error")
	} else {
		// if no data
		if($('name', data).length == 0) {
			// replace with text
			var error = document.createElement("div");
			error.setAttribute("id", "generalData");
			var errorSpan = document.createElement("span");
			errorSpan.appendChild(document.createTextNode("No General Information Found"));
			error.appendChild(errorSpan);

			// get the city select
			$("#generalData").replaceWith(error);

		} else {
			// build the pane
			var pane = '<div id="generalData" class="getAutoHeight">';
			pane += "<p class='paneTitle'>General Information</p>";

			// example xml
			// <data>
			// 	<name>Some Hospital</name>
			// 	<description>Something cool here about the hospital</description>
			//	<email>sf@lkj.sdf</email>
			//	<website>http://www.rit.edu</website>
			//	<nummembers>33</nummembers>
			//	<numcalls>300</numcalls>
			// </data>

			// get data
			var name = fixNull($.trim($('name', data).text()));
			var description = fixNull($.trim($('description', data).text()));
			var email = fixNull($.trim($('email', data).text()));
			var website = fixNull($.trim($('website', data).text()));
			var numMembers = fixNull($.trim($('nummembers', data).text()));
			var numCalls = fixNull($.trim($('numcalls', data).text()));

			// we are going to build a table
			pane += '<table cellspacing="1" class="center">';
			pane += '<tbody>';
			pane += '<tr><td>Name: </td><td>' + name + '</td></tr>';
			// check if we have a valid url
			pane += '<tr><td>Website: </td>';
			if(website) {
				// add link
				pane += "<td><a target='_blank' href='" + website + "'>" + website + "</a>" + '</td>';
			} else {
				pane += '<td></td>';
			}
			// check if we have an email
			pane += '<tr><td>Email: </td>';
			if(email) {
				// add mailto link
				pane += "<td>" + '<a href="mailto:' + email + '?Subject=' + encodeURI("question for " + name) + '">' + email + "</a>" + "</td>";
			} else {
				pane += '<td></td>';
			}
			pane += '</tr>';
			pane += '<tr><td>Description: </td><td>' + description + '</td></tr>';
			pane += '<tr><td>Number of Members: </td><td>' + numMembers + '</td></tr>';
			pane += '<tr><td>Number of calls last year: </td><td>' + numCalls + '</td></tr>';
			pane += '</tbody>';
			pane += '</table>';
			pane += '</div>';

			$("#generalData").replaceWith(pane);
		} // if no data
	}// if error

	// turn on tabs
	turnOnTabs();
}// function

function getLocationsDataCallback(data) {

}

function getTreatmentDataCallback(data) {
	// path ...ESD/{orgId}/Treatments

	// if bad data
	if($(data).find('error').length != 0) {
		console.log("There was an error")
	} else {
		// if no data
		if($('count', data).length == 0 || parseInt($('count', data).text()) < 1) {
			// replace with text
			var error = document.createElement("div");
			error.setAttribute("id", "treatmentData");
			var errorSpan = document.createElement("span");
			errorSpan.appendChild(document.createTextNode("No Treatment Information Found"));
			error.appendChild(errorSpan);

			// get the city select
			$("#treatmentData").replaceWith(error);

		} else {
			// build the pane
			var pane = '<div id="treatmentData" class="getAutoHeight">';
			pane += "<p class='paneTitle'>Treatments</p>";

			// <count>5</count>
			// <treatment>
			//		<typeId>10</typeId>
			//		<type>Burn Center</type>
			// 		<abbreviation>Tr-Burn</abbreviation>
			// </treatment>

			// we are going to build a table
			pane += '<table id="treatmentDataTable" class="maxWidth">';
			pane += '<thead>';
			pane += '<tr><th>Type</th><th>Abbreviation</th></tr>';
			pane += '</thead>';
			pane += '<tbody>';

			$('treatment', data).each(function() {

				// get data
				var type = fixNull($.trim($(this).find('type').text()));
				var abv = fixNull($.trim($(this).find('abbreviation').text()));
				pane += '<tr><td>' + type + '</td><td>' + abv + '</td></tr>';

			});
			pane += '</tbody>';
			pane += '</table>';
			pane += '</div>';

			$("#treatmentData").replaceWith(pane);

			// add the table sorter class
			addTableSort($('#treatmentDataTable'));
		} // if no data
	}// if error

	// turn on tabs
	turnOnTabs();
}

function getTrainingDataCallback(data) {
	// path ...ESD/{orgId}/Training

	// if bad data
	if($(data).find('error').length != 0) {
		console.log("There was an error")
	} else {
		// if no data
		if($('count', data).length == 0 || parseInt($('count', data).text()) < 1) {
			// replace with text
			var error = document.createElement("div");
			error.setAttribute("id", "trainingData");
			var errorSpan = document.createElement("span");
			errorSpan.appendChild(document.createTextNode("No Training Information Found"));
			error.appendChild(errorSpan);

			// get the city select
			$("#trainingData").replaceWith(error);

		} else {
			// build the pane
			var pane = '<div id="trainingData" class="getAutoHeight">';
			pane += "<p class='paneTitle'>Training</p>";

			// <count>22</count>
			// <training>
			// 	<typeId>35</typeId>
			// 	<type>1 CFR Certified First Responder</type>
			// 	<abbreviation>CFR</abbreviation>
			// </training>

			// we are going to build a table
			pane += '<table id="trainingDataTable" class="maxWidth">';
			pane += '<thead>';
			pane += '<tr><th>Type</th><th>Abbreviation</th></tr>';
			pane += '</thead>';
			pane += '<tbody>';

			$('training', data).each(function() {

				// get data
				var type = fixNull($.trim($(this).find('type').text()));
				var abv = fixNull($.trim($(this).find('abbreviation').text()));
				pane += '<tr><td>' + type + '</td><td>' + abv + '</td></tr>';

			});
			pane += '</tbody>';
			pane += '</table>';
			pane += '</div>';

			$("#trainingData").replaceWith(pane);

			// add the table sorter class
			addTableSort($('#trainingDataTable'));
		} // if no data
	}// if error

	// turn on tabs
	turnOnTabs();

}

function getFacilitiesDataCallback(data) {
	// path ...ESD/{orgId}/Facilities

	// if bad data
	if($(data).find('error').length != 0) {
		console.log("There was an error")
	} else {
		// if no data
		if($('count', data).length == 0 || parseInt($('count', data).text()) < 1) {
			// replace with text
			var error = document.createElement("div");
			error.setAttribute("id", "facilitiesData");
			var errorSpan = document.createElement("span");
			errorSpan.appendChild(document.createTextNode("No Facility Information Found"));
			error.appendChild(errorSpan);

			// get the city select
			$("#facilitiesData").replaceWith(error);

		} else {
			// build the pane
			var pane = '<div id="facilitiesData" class="getAutoHeight">';
			pane += "<p class='paneTitle'>Facilities</p>";

			// <count>2</count>
			// <facility>
			// 	<typeId>11</typeId>
			// 	<type>A/C</type>
			// 	<quantity>18</quantity>
			// 	<description>desc</description>
			// </facility>

			// we are going to build a table
			pane += '<table id="facilitiesDataTable" class="maxWidth">';
			pane += '<thead>';
			pane += '<tr><th>Name</th><th>Quantity</th><th>Description</th></tr>';
			pane += '</thead>';
			pane += '<tbody>';

			$('facility', data).each(function() {

				// get data
				var name = fixNull($.trim($(this).find('type').text()));
				var quantity = fixNull($.trim($(this).find('quantity').text()));
				var desc = fixNull($.trim($(this).find('description').text()));
				pane += '<tr><td>' + name + '</td><td>' + quantity + '</td><td>' + desc + '</td></tr>';

			});
			pane += '</tbody>';
			pane += '</table>';
			pane += '</div>';

			$("#facilitiesData").replaceWith(pane);

			// add the table sorter class
			addTableSort($('#facilitiesDataTable'));
		} // if no data
	}// if error

	// turn on tabs
	turnOnTabs();

}

function getPhysiciansDataCallback(data) {
	// path ...ESD/{orgId}/Physicians

	// if bad data
	if($(data).find('error').length != 0) {
		console.log("There was an error")
	} else {
		// if no data
		if($('count', data).length == 0 || parseInt($('count', data).text()) < 1) {
			// replace with text
			var error = document.createElement("div");
			error.setAttribute("id", "physiciansData");
			var errorSpan = document.createElement("span");
			errorSpan.appendChild(document.createTextNode("No Physicians Information Found"));
			error.appendChild(errorSpan);

			// get the city select
			$("#physiciansData").replaceWith(error);

		} else {
			// build the pane
			var pane = '<div id="physiciansData" class="getAutoHeight">';
			pane += "<p class='paneTitle'>Physicians with Admitting Privilages</p>";

			// <count>551</count>
			// <physician>
			//	 <personId>2</personId>
			//	 <fName>Deborah</fName>
			//	 <mName>H.</mName>
			//	 <lName>Abell</lName>
			//	 <suffix>null</suffix>
			//	 <phone>585-218-9560</phone>
			//	 <license>null</license>
			// </physician>

			// we are going to build a table
			pane += '<table id="physiciansDataTable" class="maxWidth">';
			pane += '<thead>';
			pane += '<tr><th>Name</th><th>License</th><th>Contact</th></tr>';
			pane += '</thead>';
			pane += '<tbody>';

			$('physician', data).each(function() {

				// get data
				var name = "";
				if( suffix = fixNull($.trim($(this).find('suffix').text()))) {
					name += suffix + ' ';
				}
				if( fName = fixNull($.trim($(this).find('fName').text()))) {
					name += fName + ' ';
				}
				if( mName = fixNull($.trim($(this).find('mName').text()))) {
					name += mName + ' ';
				}
				if( lName = fixNull($.trim($(this).find('lName').text()))) {
					name += lName + ' ';
				}

				var license = fixNull($.trim($(this).find('license').text()));
				var phone = fixNull($.trim($(this).find('phone').text()));
				pane += '<tr><td>' + name + '</td><td>' + license + '</td><td>' + phone + '</td></tr>';

			});
			pane += '</tbody>';
			pane += '</table>';
			pane += '</div>';

			$("#physiciansData").replaceWith(pane);

			// add the table sorter class
			addTableSort($('#physiciansDataTable'));
		} // if no data
	}// if error

	// turn on tabs
	turnOnTabs();
}

function getPeopleDataCallback(data) {
	console.log('people data');
	console.log(data);

	// path ...ESD/{orgId}/People

	// if bad data
	if($(data).find('error').length != 0) {
		console.log("There was an error")
	} else {
		// if no data
		if($('siteCount', data).length == 0 || parseInt($('siteCount', data).text()) < 1) {
			// replace with text
			var error = document.createElement("div");
			error.setAttribute("id", "peopleData");
			var errorSpan = document.createElement("span");
			errorSpan.appendChild(document.createTextNode("No People Information Found"));
			error.appendChild(errorSpan);

			// get the city select
			$("#peopleData").replaceWith(error);

		} else {
			// build the pane
			var pane = '<div id="peopleData" class="getAutoHeight">';
			pane += "<p class='paneTitle'>People</p>";

			// <siteCount>2</siteCount>
			// <site address="1000 South Ave." siteId="1" siteType="main">
			//	 <personCount>5</personCount>
			//	 <person>
			//		 <personId>1</personId>
			//		 <honorific>null</honorific>
			//		 <fName>null</fName>
			//		 <mName>null</mName>
			//		 <lName>Jan Taylor, RN</lName>
			//		 <suffix>null</suffix>
			//		 <role>ED Director</role>
			//		 <contactmethods/>
			//	 </person>

			// loop thru the sites

			$('site', data).each(function(i) {
				// build the group div
				group = '<div class="group">';

				// grab site info
				var address = $(this).attr('address');
				var siteType = $(this).attr('siteType');

				// create the header for it
				group += '<h3 class="accTitle"><a href="site' + i + '">' + siteType + ": " + address + '</a></h3>'

				// create div container for the results
				group += '<div class="accDiv">';

				// check if site has people
				if($('personCount', $(this)).length == 0 || parseInt($('personCount', $(this)).text()) < 1) {
					// doesn't have people
					group += '<p>No People found for this location</p>'
				} else {
					// we have people

					// build a table!
					group += '<table class="maxWidth peopleDataTable">';
					group += '<thead>';
					group += '<tr><th>Name</th><th>Role</th></tr>';
					group += '</thead>';
					group += '<tbody>';

					console.log('this is');
					console.log($(this));

					$('person', $(this)).each(function() {
						// get data
						var name = "";
						if( suffix = fixNull($.trim($(this).find('suffix').text()))) {
							name += suffix + ' ';
						}
						if( fName = fixNull($.trim($(this).find('fName').text()))) {
							name += fName + ' ';
						}
						if( mName = fixNull($.trim($(this).find('mName').text()))) {
							name += mName + ' ';
						}
						if( lName = fixNull($.trim($(this).find('lName').text()))) {
							name += lName + ' ';
						}
						if( honor = fixNull($.trim($(this).find('honorific').text()))) {
							name += '(' + honor + ') ';
						}

						var role = fixNull($.trim($(this).find('role').text()));

						// add row
						group += '<tr><td>' + name + '</td><td>' + role + '</td></tr>';

					});
					// end the table
					group += '</tbody>';
					group += '</table>';

				}

				// close the results div
				group += '</div>';

				// close the group div
				group += '</div>';

				// add group to the pane
				pane += group;

			});
			pane += '</div>';

			$("#peopleData").replaceWith(pane);

			// add the table sorter class
			// loop thru all the tables
			$("#peopleData").find('.peopleDataTable').each(function(){
				addTableSort($(this));
			});

			// add accordian
			addAccordion($("#peopleData"));
			
			// fix some accoridian size issues in lightbox
			$("#peopleData").find('.accTitle').each(function(){
				// resize the title: accTitle
				$(this).css("width", "96.456%");
			});
			$("#peopleData").find('.accDiv').each(function(){
				// resize the table: accDiv
				$(this).css("width", "90%");
			});
			
			$("#peopleData").css("width", "97.8%");
			
				
		} // if no data
	}// if error

	// turn on tabs
	turnOnTabs();
}

function getEquipmentDataCallback(data) {

}

function turnOnTabs() {
	// setup ul.tabs to work as tabs for each div directly under div.panes
	// here we did:
	// mouseover - switch tabs -> event: 'mouseover'
	// history - requires each tab to have an href
	$("ul.tabs").tabs("div.panes > div", {
		history : true
	});
}

// perform JavaScript after the document is scriptable.
$(document).ready(function() {
	turnOnTabs();
});
