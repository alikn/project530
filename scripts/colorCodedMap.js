define(["worldmap", "dataProcess"], function(worldmap, dataProcess){
	
	var map = new Datamap({
				height: 310,
				width: 680,
				projection: 'equirectangular',
				element: document.getElementById('colorCodedMap'),
				fills: {
					// Color range for pm2.5
					pm250: 'rgb(103,166,186)',
					pm251: 'rgb(73,140,161)',
					pm252: 'rgb(73,140,165)',
					pm253: 'rgb(58,111,128)',
					pm254: 'rgb(54,103,119)',
					pm255: 'rgb(42,79,91)',
					
					// Color range for SOx
					SOx0: 'rgb(182,140,78)',
					SOx1: 'rgb(159,118,81)',
					SOx2: 'rgb(159,120,57)',
					SOx3: 'rgb(130,99,39)',
					SOx4: 'rgb(122,94,42)',
					SOx5: 'rgb(91,64,33)',
					
					// Color range for tpm
					tpm0: 'rgb(117,153,99)',
					tpm1: 'rgb(90,132,75)',
					tpm2: 'rgb(97,135,81)',
					tpm3: 'rgb(71,105,57)',
					tpm4: 'rgb(68,102,52)',
					tpm5: 'rgb(53,77,44)',
					
					// Color range for pm10
					pm100: 'rgb(179,87,83)',
					pm101: 'rgb(154,57,58)',
					pm102: 'rgb(159,55,56)',
					pm103: 'rgb(128,46,40)',
					pm104: 'rgb(125,48,41)',
					pm105: 'rgb(89,33,30)',
					
					// Color range for NOx
					NOx0: 'rgb(229,255,204)',
					NOx1: 'rgb(204,255,153)',
					NOx2: 'rgb(102,204,0)',
					NOx3: 'rgb(76,153,0)',
					NOx4: 'rgb(51,102,0)',
					NOx5: 'rgb(25,51,0)',
					
					// Color range for VOC
					voc0: 'rgb(160,101,149)',
					voc1: 'rgb(136,69,123)',
					voc2: 'rgb(133,70,116)',
					voc3: 'rgb(110,55,95)',
					voc4: 'rgb(108,55,89)',
					voc5: 'rgb(81,37,69)',
					
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
						quantity: 10381
					}
				},
				geographyConfig: {
					highlightOnHover: false,
					borderWidth: 1,
					borderColor: '#FDFDFD',
					popupTemplate: function(geo, data) {
						return ['<div class="hoverinfo"><strong>',
								geo.properties.name,
                        ': ' + data.quantity + ' ' + data.title,
							'</strong></div>'].join('');
					}
				},
				done: function(datamap) {
				}
			});
			
	
	//override updateChoropleth method of worldmap.js
	map.updateChoropleth = function(data){
		var svg = this.svg;
		var color;
		var subunitData = data["data"];
		var subunit = subunitData.subunit;
		var fill = subunitData.fillKey;
		color = map.options.fills[fill];
		
		svg.selectAll('.' + subunit)
				.transition()
				.style('fill', color);
			//if it's an object, overriding the previous data
			if ( subunitData === Object(subunitData) ) {
				this.options.data[subunit] = map.defaults(subunitData, this.options.data[subunit] || {});
				var geo = this.svg.select('.' + subunit).attr('data-info', JSON.stringify(this.options.data[subunit]));
			}
	}

	map.defaults = function(obj) {
		Array.prototype.slice.call(arguments, 1).forEach(function(source) {
		  if (source) {
			for (var prop in source) {
			  if (obj[prop] == null) obj[prop] = source[prop];
			}
		  }
		});
		return obj;
	}
	//override the legend method of worldmap.js
	map.legend = function (layer, data, options) {
		var material = dataProcess.getChosenMaterial();
		var container = d3.select(this.options.element);
		container.select('svg')
			.style("float", "left")
			.style("margin-top", "40px")
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
		updateMap(pollutant);
		$("body").on("materialChangeEvent", materialChanged);
	}
	
	function materialChanged(event, newMaterial){
        pollutant = newMaterial;
		updateMap(pollutant);;
    }
	function updateMap(pollutant){
		map.legend();
		//console.log("selected material: " + pollutant);
		d3.text('data/map'+pollutant.toLowerCase() + '.csv', 'text/csv', function(text) {
			//console.log("file path is : data/map"+pollutant+'.csv');
			regions = d3.csv.parseRows(text);
			for (i = 1; i < regions.length; i++) {
				//console.log(regions[i]);
				if(regions[i][3] != 'UNKNOWN'){
					regions[i][3] = pollutant+regions[i][3];
				}
				//console.log("level is : " + regions[i][3]);
				if ( regions[i][1] != 0 ) {
					map.updateChoropleth({
						data: {subunit: regions[i][4], fillKey: regions[i][3], quantity: regions[i][1], title: regions[0][1]},
					});
				}
				else {
					map.updateChoropleth({
						data: {subunit: regions[i][4], fillKey: regions[i][3], quantity: 'UNKNOWN', title: ''},
					});
				}
			}
		});
	}
	return{
			init		: 			init
	};
})