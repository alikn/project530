require(["dataProcess", "page", "lineGraph", "filters", "infoBox", "barChart", "colorCodedMap", "tour"], 
	function(dataProcess, page, lineGraph, filters, infoBox, barChart, colorCodedMap, tour){
	
	$(document).ready(function(){
		var deferred = dataProcess.init();
		deferred.done(pageSetUp);
	});

	//after all the data is loaded, all the modules start
	function pageSetUp(){
		page.init();
		lineGraph.init();
		filters.init();
		infoBox.init();
		barChart.init();
		colorCodedMap.init();
        tour.init();
	}

})