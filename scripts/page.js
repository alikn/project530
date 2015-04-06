define(["dataProcess"], function(dataProcess){

	var materials = dataProcess.getMaterials();
    var materialNames = dataProcess.getMaterialNames();

	function init(){
		setupMaterialSelector();

		$("body").on("materialChangeEvent", materialChanged);
		
	}
	
	function setupMaterialSelector(){
        for(var i = 0; i < materials.length; i++){
            $(".materialSelect select").append($("<option>").text(materialNames[materials[i]]));
        }

        $(".materialSelect select").on('change', dropDownChanged);
    }

    function dropDownChanged(event){
    	var chosenMaterialFullName = $(this).val();
        var chosenMaterial;
        for(var i = 0; i < materials.length; i++){
            if(materialNames[materials[i]] == chosenMaterialFullName){
                chosenMaterial = materials[i];
                break;
            }
        }
        $("body").trigger("materialChangeEvent", chosenMaterial);
    }

    function materialChanged (event, newMateril){
    	 $(".materialSelect select").val(materialNames[newMateril]);
    }

	return{
			init		: 			init
	};
})