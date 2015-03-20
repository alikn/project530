define(["dataProcess"], function(dataProcess){

	var materials = dataProcess.getMaterials(),
        rawData = dataProcess.getRawData(),
        sectorGroup = dataProcess.getSectorGroup(),
        chosenMaterial = dataProcess.getChosenMaterial(),
        chosenSector = dataProcess.getChosenSector;

 
    var w = 925, 
        h = 550, 
        margin = 30, 
        startYear = 1985, 
        endYear = 2012, 
        startValue = 0, 
        endValue = 450000, 
        y = d3.scale.linear().domain([endValue, startValue]).range([0 + margin, h - margin]), 
        x = d3.scale.linear().domain([1985, 2012]).range([0 + margin - 5, w]), 
        years = d3.range(startYear, endYear+1);

    var vis, line;

    //an object with sectors' abbreviations as the key and sector group abbreviations as value
    var sector_sectorGroup = dataProcess.getSectorToSectorGroupHashMap();

    //an object with sectors' abbreviations as the key and sector full name as value
    var sectorCodes = dataProcess.getSectorCodesHashMap();

    function init(){
        setupD3();
        drawAllPaths();
        setupAxes();

        $("body").on("materialChangeEvent", materialChanged);
        $("body").on("sectorChangeEvent", sectorChanged);
    }

    function setupD3(){
        vis = d3.select("#vis")
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                .call(d3.behavior.zoom().scaleExtent([1, 18]).on("zoom", redraw))
                .append("svg:g");

        line = d3.svg.line().x(function(d, i) {
                                return x(d.x);
                            }).y(function(d) {
                                return y(d.y);
                             });
    }

    
    function drawAllPaths(){
        drawPath(rawData[chosenMaterial]);
    }
    
    //draws all paths of the graph
    function drawPath(pathsArray){
        for (i = 1; i < pathsArray.length; i++) {
            var values = pathsArray[i].slice(1);

             
            var currData = [];

            for (j = 0; j < values.length; j++) {
                if (values[j] != '') {
                    currData.push({x: years[j],y: values[j]});
                }
            }
            vis.append("svg:path")
                .data([currData])
                .attr("sector", pathsArray[i][0])
                .attr("class", sector_sectorGroup[pathsArray[i][0]])
                .attr("d", line)
                .on("mouseover", onmouseover)
                .on("mouseout", onmouseout)
                .on("click", pathClicked);

        }
    }


    function materialChanged(event, newMaterial){
        console.log("selected material: " + newMaterial);
        chosenMaterial = newMaterial;
        
        d3.select("svg").remove();

        setupD3();
        drawAllPaths();
        setupAxes();
        d3.select("[sector=" + chosenSector+ "]").classed("selected", true);
    }

    function sectorChanged(event, newSector){
    	d3.select(".selected").classed("selected", false);
        d3.select("[sector=" + newSector+ "]").classed("selected", true);
        chosenSector = newSector;
        console.log("selected sector: " + chosenSector);
    }

    function setupAxes(){
        //adding x axis
        vis.append("svg:line")
            .attr("x1", x(1985))
            .attr("y1", y(startValue))
            .attr("x2", x(2012))
            .attr("y2", y(startValue))
            .attr("class", "axis");

        //adding y axis
        vis.append("svg:line")
            .attr("x1", x(startYear))
            .attr("y1", y(startValue))
            .attr("x2", x(startYear))
            .attr("y2", y(endValue))
            .attr("class", "axis");

        //adding x axis labels
        vis.selectAll(".xLabel")
            .data(x.ticks(5))
            .enter().append("svg:text")
            .attr("class", "xLabel")
            .text(String)
            .attr("x", function(d) {
                return x(d)
            })
            .attr("y", h - 10)
            .attr("text-anchor", "middle");

        //adding y axis labels
        vis.selectAll(".yLabel")
            .data(y.ticks(10))
            .enter()
            .append("svg:text")
            .attr("class", "yLabel")
            .text(String)
            .attr("x", 0)
            .attr("y", function(d) {
                return y(d)
            })
            .attr("text-anchor", "right")
            .attr("dy", 3);

        //adding the ticks on the x axis
        vis.selectAll(".xTicks")
            .data(x.ticks(5))
            .enter()
            .append("svg:line")
            .attr("class", "xTicks")
            .attr("x1", function(d) {
                return x(d);
            })
            .attr("y1", y(startValue))
            .attr("x2", function(d) {
                return x(d);
            })
            .attr("y2", y(startValue) + 7);

        //adding the ticks on the y axis
        vis.selectAll(".yTicks")
            .data(y.ticks(10))
            .enter()
            .append("svg:line")
            .attr("class", "yTicks")
            .attr("y1", function(d) {
                return y(d);
            })
            .attr("x1", x(1984.5))
            .attr("y2", function(d) {
                return y(d);
            }).attr("x2", x(1985));
    }

    function pathClicked(d, i){
        //d3.select(".selected").classed("selected", false);
        chosenSector = d3.select(this).attr("sector");
        //d3.select(this).classed("selected", true);
        //console.log("selected sector: " + chosenSector);
        $("body").trigger("sectorChangeEvent", chosenSector);
    }

    function onmouseover(d, i) {
        var currClass = d3.select(this).attr("class");
        d3.select(this).classed("current", true);
        var sectorCode = $(this).attr("sector");

        //This should be shown in a tooltip
        var blurb = '<h2>' + "Sector Group: " + sectorGroup[sector_sectorGroup[sectorCode]] 
                    + ", Sector: " + sectorCodes[sectorCode] + '</h2>';
        
        $("#default-blurb").hide();
        $("#blurb-content").html(blurb);
    }

    function onmouseout(d, i) {
        var currClass = d3.select(this).attr("class");
        var prevClass = currClass.substring(0, currClass.length - 8);
        //d3.select(this).attr("class", prevClass);
        d3.select(this).classed("current", false);
        $("#default-blurb").show();
        $("#blurb-content").html('');
    }

    function redraw(){
        vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
	
	return{
			init		: 			init
	};
})