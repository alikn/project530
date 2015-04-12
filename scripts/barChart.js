define(["dataProcess","d3"], function (dataProcess,d3) {


	function init(){
		$("body").on("sectorChangeEvent", sectorChanged);
		$("body").on("materialChangeEvent", materialChanged)
		drawBarGraph(dataProcess.getChosenSector());
		//$("body").on("materialChangeEvent", materialChangedCircle);
		//drawBubbleChart(dataProcess.getChosenSector());
	}

	function materialChanged(event, newMaterial)
	{
		
		var selected = $('rect[material="'+newMaterial+'"]')
		var rects    = $('rect'); //get all bar chart elements
		
		for(i=0; i<rects.length; i++)
			{
				
				$(rects[i]).removeAttr('id'); //remove id attribute to change styling
			}
		
		selected.attr( "id", newMaterial); //assign id to current material rect to style
		
	}

	function materialChangedCircle(event, newMaterial)
	{
		
		var selected = $('circle[material="'+newMaterial+'"]')
		var circles    = $('circle'); //get all bubble chart elements
		
		for(i=0; i<circles.length; i++)
			{
				
				$(circles[i]).removeAttr('id'); //remove id attribute to change styling
			}
		
		selected.attr( "id", newMaterial); //assign id to current material rect to style
		
	}

	function sectorChanged(event, newSector)
	{
		drawBarGraph(newSector);
		//drawBubbleChart(newSector);
	}

	function drawBarGraph(newSector)
	{
		var sector_codes = dataProcess.getSectorCodesHashMap();
		var sector_desc = sector_codes[newSector];
		var chosenMaterial = dataProcess.getChosenMaterial();

		$('#barChart').empty();
		$('#barChart').append("<h3><span class='em-source'>"+ sector_desc + " Emissions" + "</span></h3>")
		

		var matEmissions = dataProcess.getMatEmissionForChosenSector();
		$.each( matEmissions, function( key, value ) 
		{
			//parse to number barchart expects integers
  			value = parseInt(value);
  		});

      
               
          
		var max_value = d3.max(d3.entries(matEmissions), function(d) { return Math.round(d.value); });
		
		var margin = {top: 20, right: 20, bottom: 30, left: 78},
		    width = 500 - margin.left - margin.right,
		    height = 490 - margin.top - margin.bottom;

		var y = d3.scale.linear()
		   .domain([0,max_value])
		   .range([height, 0]);

		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .1)
		    .domain(d3.entries(matEmissions).map(function(d) { 
		    	
		    	return d.key

		    }));

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
                .attr("class", "axis-label lower")
                .attr("transform", "rotate(-90)")
                .attr("y", (-margin.left) + 9)
                .attr("x", -height/2)
                .text('Tonnes/Year');

		svg.selectAll(".barsuccess")
		        .data(d3.entries(matEmissions))
		    	.enter().append("rect")
			        .attr("material", (d3.entries(matEmissions), function(d) { return d.key; }))
			        .attr("x", function(d) { return x(d.key) })
			        .attr("width", x.rangeBand())
			        .attr("y", function(d) { return y(d.value) ; })
			        .attr("height", function(d) { return height - y(d.value); })
			        .attr("class", "clickable")
			        .attr("id", function(d) { if(d.key===chosenMaterial){ return d.key} })
			        .on("click", itemClicked);


	}
	
	function drawBubbleChart(newSector)
	{
		
		var sector_codes = dataProcess.getSectorCodesHashMap();
		var sector_desc = sector_codes[newSector];
		var chosenMaterial = dataProcess.getChosenMaterial();
		var materialNames = dataProcess.getMaterialNames();

		$('#barChart').empty();
		$('#barChart').append("<h3><span class='em-source'>" + sector_desc + " Emissions" + "</span></h3>")


		var matEmissions = dataProcess.getMatEmissionForChosenSector();
		$.each( matEmissions, function( key, value ) 
		{
			//parse to number barchart expects integers
				value = parseInt(value);
		});


		// D3 Bubble Chart 
		var svg = d3.select('#barChart').append('svg')
						.attr('width', 400)
						.attr('height', 380);

		/* documentation for this can be found here 
		https://github.com/mbostock/d3/wiki/Pack-Layout
		*/
		var bubble = d3.layout.pack()
						.size([400, 380])
						.value(function(d) {return d.size;})
						.sort(function(a, b) {
									return -(a.value - b.value)
								}) 
						.padding(5);

		// generate data with calculated layout values
		var nodes = bubble.nodes(processData(matEmissions))
						.filter(function(d) { return !d.children;}); // filter out the outer bubble


		var vis = svg.selectAll('g')
						.data(nodes);


		var duration = 1000;
		var delay = 100;

		// update - this is created before enter.append. it only applies to updating nodes.
		vis.transition()
			.duration(duration)
			.delay(function(d, i) {delay = i * 7; return delay;}) 
			.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
			.attr('r', function(d) { return d.r; })
			.style('opacity', 1); // force to 1, so they don't get stuck below 1 at enter()

		var elemEnter = vis.enter()
		.append("g")
		.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })					

		var circles = elemEnter.append('circle')	
			.attr('r', function(d) { return d.r; })
			.attr('class', function(d) { return d.className; })
			.attr("class", "clickable")
			.attr("id", function(d) { if(d.name===chosenMaterial){ console.log("chosen circle  " + d.name); return d.name} })
			.attr("material", function(d) { return d.name; })
			.on("click", itemClicked)
			.style('opacity', 0) 
			.transition()
			.duration(duration * 1.2)
			.style('opacity', 1);

		// exit
		vis.exit()
			.transition()
			.duration(duration + delay)
			.style('opacity', 0)
			.remove();



		/* Create tooltip hover */
		elemEnter.append("text")
		    .text( function(d) { 
		        	if (d.r >= 25) // only add text if circle radius can fit it 
		        	{
		        		if (d.name === 'pm25') //handle PM2.5 formatting issue
		        			return "pm2.5"
		        		else
		        			return d.name
		        	}

		    	} )
		    .style("text-anchor", "middle")
		    .style("fill", "white")
		    .attr("class", "clickable text-title")
		    .attr("material", function(d) { return d.name; })
		    .on("click", itemClicked)


		elemEnter.append("text")
		   .text( function(d) { 
		    	
		        	if (d.r >= 45) //anything with radius smaller than 45 can not fit full texts so dont add text
		        	{
		        		
		        			return Math.round(d.size) + " tonnes"

		        	}

		    	} )
		    .style("text-anchor", "middle")
		    .attr("dy", "1.5em")
		    .style("fill", "white")
		    .attr("class", "clickable")
		    .attr("material", function(d) { return d.name; })
		    .on("click", itemClicked)

		elemEnter.append("title")
		    .text(function(d) { return materialNames[d.name] + ": " +  Math.round(d.size) + " tonnes" })
		    .style("text-anchor", "middle")
		    .attr("dy", "1.5em")
		    .style("fill", "white")
		    .attr("class", "clickable")
				  				
	}


	 function processData(data) 
	 {
				    var obj = data;
				    var newDataSet = [];
				   
				    for(var prop in obj) 
				    {
						console.log("obj is " + obj[prop])
						console.log("prop is " + prop)
						dataPoint = obj[prop] 
						newDataSet.push({name: prop, className: dataPoint.source, size: dataPoint});
				    }
				    return {children: newDataSet};
	}

	function itemClicked(d, i) 
	{
        chosenMaterial = d3.select(this).attr("material");
        $("body").trigger("materialChangeEvent", chosenMaterial);
    }

	return{
			init		: 			init
	};
})