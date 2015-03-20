define(["d3"],function(d3){
	"use strict";

	var materials = ['pm25', 'SOx'];

    var sectorGroup = {
            'INS'   :   'Industrial Sources',
            'NIS'   :   'Non-industrial Sources',
            'MOS'   :   'Mobile Sources',
            'INCS'  :   'Incineration Sources',
            'MIS'   :   'Miscellaneous Sources',
            'OPS'   :   'Open Sources',
            'NAS'   :   'Natural Sources'
            };

    var rawData = {};

    //an object with sectors' abbreviations as the key and sector group abbreviations as value
    var sector_sectorGroup = {};

    //an object with sectors' abbreviations as the key and sector full name as value
    var sectorCodes = {};

    var chosenMaterial = materials[0];

    var chosenSector;     

    function init(){
    	readAbbreviationData();
    	return readDataFiles();

    	$("body").on("materialChangeEvent", materialChanged);
        $("body").on("sectorChangeEvent", sectorChanged);
    }

    var dataFolder = '../v2/data/';

    function readAbbreviationData(){

        d3.text(dataFolder + 'sector_abb_group.csv', 'text/csv', function(text) {
            var sectorLinesArray = d3.csv.parseRows(text);
            for (var i = 1; i < sectorLinesArray.length; i++) {
                sector_sectorGroup[sectorLinesArray[i][1]] = sectorLinesArray[i][2];
                sectorCodes[sectorLinesArray[i][1]] = sectorLinesArray[i][0];
            }
            chosenSector = sectorLinesArray[0][1];
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

    function materialChanged(event, newMaterial){

    }

    function sectorChanged(event, newSector){
    	
    }

    function getMaterials(){
    	return materials;
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

	return{
		init 							: 		init,
		getMaterials 					: 		getMaterials,
		getSectorGroup 					: 		getSectorGroup,
		getRawData 						: 		getRawData,
		getSectorToSectorGroupHashMap 	: 		getSectorToSectorGroupHashMap,
		getSectorCodesHashMap 			: 		getSectorCodesHashMap,
		getChosenMaterial 				: 		getChosenMaterial,
		getChosenSector					: 		getChosenSector

	}
})