define(["d3"],function(d3){
	"use strict";

	var materials = ['pm25', 'pm10', 'tpm', 'SOx', 'voc'];

    var sectorGroup = {
            'INS'   :   'Industrial Sources',
            'NIS'   :   'Non-industrial Sources',
            'MOS'   :   'Mobile Sources',
            'INCS'  :   'Incineration Sources',
            'MIS'   :   'Miscellaneous Sources',
            'OPS'   :   'Open Sources'
            };

    var materialNames = {
        'pm25'      :   'Particulate Matter 2.5',
        'pm10'      :   'Particulate Matter 10',
        'tpm'       :   'Total Particulate Matter',
        'SOx'       :   'Sulfur Oxide (SOx)',
        'voc'       :   'Volatile Organic Compounds'
    }

    var rawData = {};

    //an object with sectors' abbreviations as the key and sector group abbreviations as value
    var sector_sectorGroup = {};

    //an object with sectors' abbreviations as the key and sector full name as value
    var sectorCodes = {};

    var chosenMaterial = materials[0];

    var chosenSector;     

    function init(){
    	$("body").on("materialChangeEvent", materialChanged);
        $("body").on("sectorChangeEvent", sectorChanged);

        readAbbreviationData();
    	return readDataFiles();
    }

    var dataFolder = './data/';

    function readAbbreviationData(){

        d3.text(dataFolder + 'sector_abb_group.csv', 'text/csv', function(text) {
            var sectorLinesArray = d3.csv.parseRows(text);
            for (var i = 1; i < sectorLinesArray.length; i++) {
                sector_sectorGroup[sectorLinesArray[i][1]] = sectorLinesArray[i][2];
                sectorCodes[sectorLinesArray[i][1]] = sectorLinesArray[i][0];
            }

            chosenSector = "WOI";
            console.log(chosenSector);
        });
    }

    var countNumFilesReceived = 0;
    function readDataFiles(){
        var defer = $.Deferred();
        for(var i = 0; i < materials.length; i++){
            d3.text(dataFolder + materials[i] + '.csv', 'text/csv', function(text) {
                var parsedText = d3.csv.parseRows(text);
                //due to async nature of the ajax call, once this function is running i has already changed.
                //Therefore, the material name is extracted from the file.
                var currentMaterial = parsedText[0][0];
                rawData[currentMaterial] = parsedText;
                countNumFilesReceived++;
                //this will not allow the program to run unless all files are loaded
                if(countNumFilesReceived == materials.length){
                    //because of async nature of reading the data
                    defer.resolve();
                }
            });
        }
        
        return defer.promise();
    }

    function matEmissionForChosenSector(){
        var materialValues = {};
        for(var mat in rawData){
            for(var j = 1; j < rawData[mat].length - 1; j++){
                if (rawData[mat][j][0] == chosenSector){    
                    var ind = rawData[mat][j].length;
                    while(!materialValues[mat] && ind > 1){
                        if(rawData[mat][j][ind]){
                            materialValues[mat] = rawData[mat][j][ind];
                        }
                        ind--;
                    }
                }
            }
        }
        return materialValues;
    }


    function getAverageValueForSectorGroups(){
        var aveValObj = {};
        var matData = rawData[chosenMaterial];

        //summing up the value for all the years and 
        //counting the total of number of values summed up for each sector group
        for(var j = 1; j < matData.length; j++){
            var currentSecGroup = sector_sectorGroup[matData[j][0]];
            if(!aveValObj[currentSecGroup]){
                aveValObj[currentSecGroup] = {"sum" : 0, "count" : 0, "average" : 0};
            }
            matData[j].forEach(function(val){
                 if(val && !isNaN(val)){
                    aveValObj[currentSecGroup]["sum"] += parseInt(val);
                    //console.log("val is:\t" + val + " and after summation:\t" +  aveValObj[currentSecGroup]["sum"]);
                    aveValObj[currentSecGroup]["count"]++;
                 }
            });
        }

        //calculating the average
        for(var secGroupObj in aveValObj){
            if(aveValObj[secGroupObj]["count"]){
                aveValObj[secGroupObj]["average"] = aveValObj[secGroupObj]["sum"] / aveValObj[secGroupObj]["count"];
            }
        }

        return aveValObj;
    }

    function getMaxValueForChosenMaterial(){
        var maxValue = 0;
        for(var j = 1; j < rawData[chosenMaterial].length - 1; j++){
            rawData[chosenMaterial][j].forEach(function(val){
                if(!isNaN(val) && parseInt(val) > maxValue){
                    maxValue = parseInt(val);
                }
            })
        }
        return maxValue;
    }

    function materialChanged(event, newMaterial){
        chosenMaterial = newMaterial;
    }

    function sectorChanged(event, newSector){
    	chosenSector = newSector;
        console.log(matEmissionForChosenSector());
    }

    function getMaterials(){
    	return materials;
    }

    function getMaterialNames(){
        return materialNames;
    }

    function getSectorGroup(){
    	return sectorGroup;
    }

    function getRawData(){
    	return rawData;
    }

    function getSectorToSectorGroupHashMap(){
    	return sector_sectorGroup;
    }

    function getSectorCodesHashMap(){
    	return sectorCodes;
    }

    function getChosenMaterial(){
    	return chosenMaterial;
    }

    function getChosenSector(){
    	return chosenSector;
    }

    function getMatEmissionForChosenSector(){
        return matEmissionForChosenSector();
    }

	return{
		init 							: 		init,
		getMaterials 					: 		getMaterials,
        getMaterialNames                :       getMaterialNames,
		getSectorGroup 					: 		getSectorGroup,
		getRawData 						: 		getRawData,
		getSectorToSectorGroupHashMap 	: 		getSectorToSectorGroupHashMap,
		getSectorCodesHashMap 			: 		getSectorCodesHashMap,
		getChosenMaterial 				: 		getChosenMaterial,
		getChosenSector					: 		getChosenSector,
        matEmissionForChosenSector      :       matEmissionForChosenSector,
        getMatEmissionForChosenSector   :       getMatEmissionForChosenSector,
        getMaxValueForChosenMaterial    :       getMaxValueForChosenMaterial,
        getAverageValueForSectorGroups  :       getAverageValueForSectorGroups

	}
})