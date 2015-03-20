define(["d3"], function(d3){

	function init(){
		setupSectorGroupSelectors();
		 $("body").on("materialChangeEvent", materialChanged);
    }

    function materialChanged(event, newMaterial){
    	$('#filters span').removeClass().addClass("label label-default clickable");
	}
	
	function setupSectorGroupSelectors(){
        $('#filters span').on('click', function() {
            var sectorGroupId = $(this).attr("id");
            $(this).toggleClass(sectorGroupId);
            $(this).toggleClass("label-default");
            showSectorGroup(sectorGroupId);
        });
    }

    function showSectorGroup(sectorCode) {
        var sectors = d3.selectAll("path." + sectorCode);
        if (sectors.classed('highlight')) {
            sectors.attr("class", sectorCode);
        } else {
            sectors.classed('highlight', true);
        }
    }

	return{
			init		: 			init
	};
})