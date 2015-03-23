define(["worldmap", "dataProcess"], function(worldmap, dataProcess){
	
	var map = new Datamap({
				height: 700,
				width: 1000,
				projection: 'equirectangular',
				element: document.getElementById('colorCodedMap'),
				fills: {
					0: 'rgb(153,255,153)',
					1: 'rgb(51,255,51)',
					2: 'rgb(0,204,0)',
					3: 'rgb(0,153,0)',
					4: 'rgb(0,102,0)',
					5: 'rgb(0,51,0)',
					UNKNOWN: 'rgb(128,128,128)',
					defaultFill: 'rgb(128,128,128)'
				},
				data: {
					USA: {
						fillKey: 'MEDIUM',
						numberOfThings: 10381
					}
				},
				geographyConfig: {
					highlightOnHover: false,
					borderWidth: 1,
					borderColor: '#FDFDFD',
					popupTemplate: function(geo, data) {
						return ['<div class="hoverinfo"><strong>',
								geo.properties.name,
							'</strong></div>'].join('');
					}
				},
				done: function(datamap) {
					datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
						alert(geography.properties.name);
				});
				}
			});
	map.legend();
	function init(){
		var pollutant = dataProcess.getChosenMaterial();
		console.log("selected material: " + pollutant);
		UpdateMap(pollutant);
		$("body").on("materialChangeEvent", materialChanged);
	}
	function materialChanged(event, newMaterial){
        pollutant = newMaterial;
		UpdateMap(pollutant);
    }
	function UpdateMap(pollutant){
				console.log("selected material: " + pollutant);
				d3.text(pollutant+'.csv', 'text/csv', function(text) {
					regions = d3.csv.parseRows(text);
					for (i = 1; i < regions.length; i++) {
						console.log(regions[i]);
						if(regions[i][0] == 'Greece'){
							map.updateChoropleth({
									GRC: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Russian Federation'){
							map.updateChoropleth({
									RSA: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Austria'){
							map.updateChoropleth({
									AUT: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Belgium'){
							map.updateChoropleth({
									BEL: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Switzerland'){
							map.updateChoropleth({
									CHE: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Japan'){
							map.updateChoropleth({
									JPN: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Czech Republic'){
							map.updateChoropleth({
									CZE: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Germany'){
							map.updateChoropleth({
									DEU: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Denmark'){
							map.updateChoropleth({
									DNK: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Estonia'){
							map.updateChoropleth({
									EST: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Spain'){
							map.updateChoropleth({
									ESP: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Finland'){
							map.updateChoropleth({
									FIN: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'France'){
							map.updateChoropleth({
									FRA: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Italy'){
							map.updateChoropleth({
									ITA: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Latvia'){
							map.updateChoropleth({
									LVA: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Netherland'){
							map.updateChoropleth({
									NLD: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Norway'){
							map.updateChoropleth({
									NOR: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Poland'){
							map.updateChoropleth({
									POL: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Portugal'){
							map.updateChoropleth({
									PRT: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Sweden'){
							map.updateChoropleth({
									SWE: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Slovakia'){
							map.updateChoropleth({
									SVK: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == "United Kingdom"){
							map.updateChoropleth({
									GBR: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Canada'){
							map.updateChoropleth({
									CAN: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == "United States of America"){
							map.updateChoropleth({
									USA: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Australia'){
							map.updateChoropleth({
									AUS: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Mongolia'){
							map.updateChoropleth({
									MNG: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Philippines'){
							map.updateChoropleth({
									PHL: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Singapore'){
							map.updateChoropleth({
									SGP: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Ghana'){
							map.updateChoropleth({
									GHA: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Madagascar'){
							map.updateChoropleth({
									MDG: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Mauritius'){
							map.updateChoropleth({
									MUS: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Senegal'){
							map.updateChoropleth({
									SEN: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Tabzania'){
							map.updateChoropleth({
									TZA: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Kuwait'){
							map.updateChoropleth({
									KWT: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Lebanon'){
							map.updateChoropleth({
									LBN: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Brazil'){
							map.updateChoropleth({
									BRA: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Chile'){
							map.updateChoropleth({
									CHL: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Ecuador'){
							map.updateChoropleth({
									ECU: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Mexico'){
							map.updateChoropleth({
									MEX: {fillKey: regions[i][3]},
									});
						}
						else if(regions[i][0] == 'Peru'){
							map.updateChoropleth({
									PER: {fillKey: regions[i][3]},
									});
						}					
					}
				});
	}
	
	return{
			init		: 			init
	};
})