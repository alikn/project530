define(["worldmap", "dataProcess"], function(worldmap, dataProcess){
	
	var map = new Datamap({
				height: 580,
				width: 1000,
				projection: 'equirectangular',
				element: document.getElementById('colorCodedMap'),
				fills: {
					// Color range for pm2.5
					pm250: 'rgb(255,229,204)',
					pm251: 'rgb(255,204,153)',
					pm252: 'rgb(255,153,51)',
					pm253: 'rgb(204,102,0)',
					pm254: 'rgb(102,51,0)',
					pm255: 'rgb(51,25,0)',
					
					// Color range for SOx
					SOx0: 'rgb(255,255,153)',
					SOx1: 'rgb(255,255,0)',
					SOx2: 'rgb(204,204,0)',
					SOx3: 'rgb(153,153,0)',
					SOx4: 'rgb(102,102,0)',
					SOx5: 'rgb(51,51,0)',
					
					// Color range for pm10
					pm100: 'rgb(255,204,204)',
					pm101: 'rgb(255,153,153)',
					pm102: 'rgb(204,0,0)',
					pm103: 'rgb(153,0,0)',
					pm104: 'rgb(102,0,0)',
					pm105: 'rgb(51,0,0)',
					
					// Color range for NOx
					NOx0: 'rgb(229,255,204)',
					NOx1: 'rgb(204,255,153)',
					NOx2: 'rgb(102,204,0)',
					NOx3: 'rgb(76,153,0)',
					NOx4: 'rgb(51,102,0)',
					NOx5: 'rgb(25,51,0)',
					
					// Color range for VOC
					VOC0: 'rgb(255,204,229)',
					VOC1: 'rgb(255,102,178)',
					VOC2: 'rgb(204,0,102)',
					VOC3: 'rgb(153,0,76)',
					VOC4: 'rgb(102,0,51)',
					VOC5: 'rgb(51,0,25)',
					
					// Color range for NH3
					NH30: 'rgb(204,229,255)',
					NH31: 'rgb(153,204,255)',
					NH32: 'rgb(0,102,204)',
					NH33: 'rgb(0,76,153)',
					NH34: 'rgb(0,51,102)',
					NH35: 'rgb(0,25,51)',
					
					UNKNOWN: 'rgb(192,192,192)',
					defaultFill: 'rgb(192,192,192)'
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
	map.legend = function (layer, data, options) {
				var material = dataProcess.getChosenMaterial();
				var container = d3.select(this.options.element);
				container.select('svg')
					.style("float", "left")
					.style("position", "relative");
					
				//remove the previous legend
				d3.select(".datamaps-legend").remove();
				
				//draw new legend
				data = data || {};
				//data.legendTitle = "Emissions";
				var i = 0;
				var ldata = ['Low', 'High', 'UNKNOWN'];
				if ( !this.options.fills ) {
				  return;
				}

				var html = '<dl>';
				var label = '';
				if( material =='pm25' || material == 'pm10'){
					html = '<b><p style="font-size: 15px">' + material +' (Micrograms per meter cube)' + '</p></b>' + html;
				}
				else {
					html = '<b><p>' + material +' (Kilotonnes)' + '</p></b>' + html;
				}
				
				html += '<dt>' + ldata[0] + '</dt>';
				for ( var fillKey in this.options.fills ) {
				if ( fillKey.indexOf( material) > -1) {
				  if ( fillKey === 'defaultFill') {
					if (! data.defaultFillName ) {
					  continue;
					}
					label = data.defaultFillName;
				  } else {
					if (data.labels && data.labels[fillKey]) {
					  label = data.labels[fillKey];
					} else {
					  label= ldata[i];
					  i = i+1;
					}
				  }
				  html += '<dd style="background-color:' +  this.options.fills[fillKey] + '">&nbsp;</dd>';
				}}
				html += '<dt>' + ldata[1] + '</dt>';
				html += '<dd style="background-color:' +  this.options.fills['UNKNOWN'] + '">&nbsp;</dd>';
				html += '<dt>' + ldata[2] + '</dt>';
				html += '</dl>';
				var hoverover = d3.select(this.options.element).append('div')
				  .attr('class', 'datamaps-legend')
				  .style('float', 'left')
				  //.style('background-color', 'rgb(128,128,128)')
				  .style("position", "relative")
				  .html(html);
			  }
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
				map.legend();
				console.log("selected material: " + pollutant);
				d3.text('data/map/'+pollutant+'.csv', 'text/csv', function(text) {
					console.log("file path is : data/map/"+pollutant+'.csv');
					regions = d3.csv.parseRows(text);
					for (i = 1; i < regions.length; i++) {
						console.log(regions[i]);
						if(regions[i][3] != 'UNKNOWN'){
							regions[i][3] = pollutant+regions[i][3];
						}
						console.log("level is : " + regions[i][3]);
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