define(["dataProcess"], function(dataProcess){

	var materials = dataProcess.getMaterials();

	function init(){
		setupMaterialSelector();

		$("body").on("materialChangeEvent", materialChanged);
		
	}
	
	function setupMaterialSelector(){
        for(var i = 0; i < materials.length; i++){
            $(".materialSelect select").append($("<option>").text(materials[i]));
        }

        $(".materialSelect select").on('change', dropDownChanged);
    }

    function dropDownChanged(event){
    	chosenMaterial = $(this).val();
        $("body").trigger("materialChangeEvent", chosenMaterial);
    }

    function materialChanged (event, newMateril){
    	 $(".materialSelect select").val(newMateril);
    }

	return{
			init		: 			init
	};
})