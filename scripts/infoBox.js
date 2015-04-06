define(["dataProcess"], function(dataProcess){

    var newMaterial = dataProcess.getChosenMaterial(); 

	function init(){
		loadInfoBox();
		$("body").on("materialChangeEvent", materialChanged);
	}
	
	function loadInfoBox(mat) {
        if(mat){
            newMaterial = mat;
        }
        $.getJSON("data/materialdescriptions.json", function (data) {
            
            if (newMaterial === "pm25" || newMaterial === "pm10" || newMaterial === "TPM" || newMaterial === "tpm") {               
                $("#infoBox").html(data.pm);
            } else {              
               $("#infoBox").html(data[newMaterial.toUpperCase()]);                
            }
        });
    }

    function materialChanged(event, mat){
    	//change the content in the infoBox        
        loadInfoBox(mat);
    }

	return{
			init		: 			init
	};
})