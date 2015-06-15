define(["d3", "dataProcess", "utilities"], function(d3, dataProcess, utilities){
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
        
        removeDeselectedStateFromFilters();
        $(".removable").remove();
        addAverageInfo();

    }

    function removeDeselectedStateFromFilters(){
        $('#filters li div').removeClass("circleDeSelected")
                            .removeClass(function(){
                                return $(this).attr("id");
                            });
    }
	
	function setupSectorGroupSelectors(){
        $('#filters li .circle').on('click', function() {
            $this = $(this);
            var sectorGroupId = $this.attr("id");
            //difrentiating between select all butoon and others
            if(sectorGroupId != "SAS"){
                var displayingSectorGroups = dataProcess.getDisplayingSectorGroups();
                
                //keeping track of the displaying sector groups in dataProcess.displayingSctorGroups array
                if($this.hasClass(sectorGroupId)){
                    displayingSectorGroups.push(sectorGroupId);
                } else {
                    utilities.removeElementFromArray(displayingSectorGroups, sectorGroupId);
                }
                $("body").trigger("selectedSectorGroupsChange", sectorGroupId);

                //toggeling the classes of the circles in the legend
                $this.toggleClass(sectorGroupId);
                $this.toggleClass('circleDeSelected');
            } else {
                removeDeselectedStateFromFilters();
                dataProcess.resetDisplayingSectorGroups();
                $("body").trigger("selectedSectorGroupsReset");
            }
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
                                                .append($("<img>", {class: "inlineTruckImg", "src" : "./images/truck-small.png"})));
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