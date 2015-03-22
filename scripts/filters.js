define(["d3"], function(d3){

	function init(){
		setupSectorGroupSelectors();
		 $("body").on("materialChangeEvent", materialChanged);
    }

    function materialChanged(event, newMaterial){
        $('#filters span div').removeClass("circleSelected")
                            .removeClass(function(){
                                return $(this).attr("id");
                            });
    }
	
	function setupSectorGroupSelectors(){
        $('#filters span .circle').on('click', function() {
            var sectorGroupId = $(this).attr("id");
            $(this).toggleClass(sectorGroupId);
            $(this).toggleClass('circleSelected');
            showSectorGroup(sectorGroupId);
        });
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

	return{
			init		: 			init
	};
})