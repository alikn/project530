define(["dataProcess","d3"], function (dataProcess,d3) {


	function init(){
		$("body").on("sectorChangeEvent", sectorChanged);
		drawBarGraph(dataProcess.getChosenSector());
	}

	function sectorChanged(event, newSector)
	{
		drawBarGraph(newSector);
	}

	function drawBarGraph(newSector)
	{
		var sector_codes = dataProcess.getSectorCodesHashMap();
		var sector_desc = sector_codes[newSector];

		$('#barChart').empty();
		$('#barChart').append("<h3><span class='em-source'>"+ sector_desc +"</span></h3>")
		

		var matEmissions = dataProcess.getMatEmissionForChosenSector();
		$.each( matEmissions, function( key, value ) 
		{
  			console.log( key + ": " + value );
  			value = Math.round(value);
  			console.log( "Newly " + key + ": " + value );
		});

           var data = new Object();
                data["pm25"] = 40;
                data["SOx"] = 10;


		 var max_value = d3.max(d3.entries(matEmissions), function(d) { return Math.round(d.value); });
		 //d3.max(data, function(array) {
		 console.log("Max is " + max_value );
		// return d3.max(array);
		// });

		var margin = {top: 20, right: 20, bottom: 30, left: 60},
		    width = 565 - margin.left - margin.right,
		    height = 420 - margin.top - margin.bottom;

		var y = d3.scale.linear()
		   .domain([0,max_value])
		   .range([height, 0]);

		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .1)
		    .domain(d3.entries(data).map(function(d) { return d.key; }));

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		var svg = d3.select("#barChart").append("svg")
		        .attr("width", width + margin.left + margin.right)
		        .attr("height", height + margin.top + margin.bottom)
		    .append("g")
		        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		  svg.append("g")
		        .attr("class", "x axis")
		        .attr("transform", "translate(0," + height + ")")
		        .call(xAxis);

		  svg.append("g")
		        .attr("class", "y axis")
		        .call(yAxis)
		    .append("text")
		        .attr("transform", "rotate(-90)")
		        .attr("y", 6)
		        .attr("dy", ".71em")
		        .style("text-anchor", "end")
		        .text("Tonnes");

		svg.selectAll(".barsuccess")
		        .data(d3.entries(matEmissions))
		    .enter().append("rect")
		        .attr("material", (d3.entries(matEmissions), function(d) { return d.key; }))
		        .attr("x", function(d) { console.log("X value is " + x(d.key)); return x(d.key) })
		        .attr("width", x.rangeBand())
		        .attr("y", function(d) { return y(Math.round(d.value)); })
		        .attr("height", function(d) { return height - y(Math.round(d.value)); })
		        .style( "fill", "orange" )
		        .on("click", rectClicked);


	}
	
	function rectClicked(d, i) 
	{
        
        
        chosenMaterial = d3.select(this).attr("material");
        $("body").trigger("materialChangeEvent", chosenMaterial);
    }

	return{
			init		: 			init
	};
})