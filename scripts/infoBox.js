define([], function(){

	function init(){
		loadInfoBox();
		$("body").on("materialChangeEvent", materialChanged);
	}
	
	function loadInfoBox() {
        var newMaterial = $(".materialSelect option:selected").text();        
        $.getJSON("data/materialdescriptions.json", function (data) {
            
            if (newMaterial === "pm25" || newMaterial === "pm10" || newMaterial === "TPM" || newMaterial === "tpm") {               
                $("#infoBox").html(data.pm);
            } else {              
               $("#infoBox").html(data[newMaterial.toUpperCase()]);                
            }
        });
    }

    function materialChanged(){
    	//change the content in the infoBox        
        loadInfoBox();
    }

	return{
			init		: 			init
	};
})