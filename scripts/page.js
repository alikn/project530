define(["dataProcess"], function(dataProcess){

	var materials = dataProcess.getMaterials();

	function init(){
		setupMaterialSelector();
	}
	
	function setupMaterialSelector(){
        for(var i = 0; i < materials.length; i++){
            $(".materialSelect select").append($("<option>").text(materials[i]));
        }

        $(".materialSelect select").on('change',function(event){
            chosenMaterial = $(this).val();
            $("body").trigger("materialChangeEvent", chosenMaterial);
        })
    }

	return{
			init		: 			init
	};
})