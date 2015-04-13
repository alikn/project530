define(["d3", "dataProcess"], function(d3, dataProcess){
    var sectorGroupAverageObj;
    //average truck with load weight in tonnes
    var averageTruckWeight = 250;

	function init(){
		setupSectorGroupSelectors();
		 $("body").on("materialChangeEvent", materialChanged);

         //filter highlighting
         $("body").on("pathHoverIn", highlightFilter);
         $("body").on("pathHoverOut", removeHighlightFilter);

         $("li .source-title").hover(toggleInfoDetails);


    }

    function materialChanged(event, newMaterial){
        $('#filters li div').removeClass("circleDeSelected")
                            .removeClass(function(){
                                return $(this).attr("id");
                            });

        $(".removable").remove();
        addAverageInfo();

    }
	
	function setupSectorGroupSelectors(){
        $('#filters li .circle').on('click', function() {
            var sectorGroupId = $(this).attr("id");
            $(this).toggleClass(sectorGroupId);
            $(this).toggleClass('circleDeSelected');
            showSectorGroup(sectorGroupId);
        });

        addAverageInfo();
    }

    function toggleInfoDetails(){
        $(this).closest("li").find(".toggleDisplay").slideToggle();
    }

    function addAverageInfo(){
        //Adding the average and equivalent info
        sectorGroupAverageObj = dataProcess.getAverageValueForSectorGroups();
        for(var secGroup in sectorGroupAverageObj){
            $("." + secGroup + "-container").find(".toggleDisplay")
                                    .append($("<span>", {class: "removable"})
                                                .text("Average: " + sectorGroupAverageObj[secGroup]["average"].toFixed(0) + " tonnes"))
                                    .append($("<span>", {class: "removable"})
                                                .text("Equivalent to: " + (sectorGroupAverageObj[secGroup]["average"] /averageTruckWeight).toFixed(0) + " X ")
                                                .append($("<img>", {class: "inlineTruckImg", "src" : "./images/truck.png"})));
        }
    }

    function showSectorGroup(sectorCode) {
        var sectors = d3.selectAll("path." + sectorCode);
        if (sectors.classed('highlight')) {
            sectors.classed("highlight", false);
        } 
        else {
            sectors.classed('highlight', true);
        }
    }

    function highlightFilter(event, sectorGroup){
        $("." + sectorGroup + "-li").addClass("filterDistinct");
    }

    function removeHighlightFilter(event, sectorGroup){
        $("." + sectorGroup + "-li").removeClass("filterDistinct");
    }

	return{
			init		: 			init
	};
})