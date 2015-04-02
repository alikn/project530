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
		$('#barChart').append("<h3><span class='em-source'>"+ sector_desc + " Emissions" + "</span></h3>")
		

		var matEmissions = dataProcess.getMatEmissionForChosenSector();
		$.each( matEmissions, function( key, value ) 
		{
			//parse to number barchart expects integers
  			value = parseInt(value);
  		});

       //trial data to be removed later
       var data = new Object();
            data["pm25"] = 2;
            data["pm10"] = 7.55;
            data["tpm"] = 8.968269197;
            data["SOx"] = 0.035;
            data["voc"] = 89.697;
               
          
		var max_value = d3.max(d3.entries(matEmissions), function(d) { return Math.round(d.value); });
		
		var margin = {top: 20, right: 20, bottom: 30, left: 60},
		    width = 565 - margin.left - margin.right,
		    height = 420 - margin.top - margin.bottom;

		var y = d3.scale.linear()
		   .domain([0,max_value])
		   .range([height, 0]);

		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .1)
		    .domain(d3.entries(matEmissions).map(function(d) { return d.key; }));

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
		    
		    
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .tickSize(5);

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
		        .attr("y", -60)
		        .attr("dy", ".71em")
		        .style("text-anchor", "end")
		        .text("Tonnes");

		svg.selectAll(".barsuccess")
		        .data(d3.entries(matEmissions))
		    .enter().append("rect")
		        .attr("material", (d3.entries(matEmissions), function(d) { return d.key; }))
		        .attr("x", function(d) { return x(d.key) })
		        .attr("width", x.rangeBand())
		        .attr("y", function(d) { return y(d.value) ; })
		        .attr("height", function(d) { return height - y(d.value); })
		        .style( "fill", "orange" )
		        .attr("class", "clickable")
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