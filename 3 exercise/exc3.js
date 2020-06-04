function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}


/*
loadScript("https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.1.1/build/ol.js", function(){
    //initialization code
});
*/


loadScript("https://unpkg.com/leaflet@1.6.0/dist/leaflet.js", function(){
    //initialization code
});



var mapp;






var bdata
function loadedd()
{
	
	
	
	
	
	
	
	setTimeout(function(){fetch("https://data.foli.fi/gtfs/routes").
	then(function(response){if (response.status!==200){return}
	response.json().then(function(data)
	{
		bdata=data
		for (let t=0; t<data.length; t++)
			{
			document.getElementById('routemenu').innerHTML=document.getElementById('routemenu').innerHTML+"<option value=\""+data[t].route_id+"\">"+data[t].route_long_name+"</option>"	
			}
	}
	)})},500)
	
	var mymap = L.map('map').setView([60.4518,22.2666], 10)//([60.4518,22.2666], 13);
	
	L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(mymap);
	
	mapp=mymap
	

	/*
	var map = new ol.Map({
					target: 'map',
					layers: [
					  new ol.layer.Tile({
						source: new ol.source.OSM()
					  })
					],
					view: new ol.View({
					  center: ol.proj.fromLonLat([22.2666,60.4518]),
					  zoom: 15
					})
				  });
				  
	mapp=map
	alert(mapp.getLayers())
	

		var coordinates = [[22.2666,60.4518],[22.2500,60.4400]]; 

		  var layerLines = new ol.layer.Vector({
			  source: new ol.source.Vector({
				  features: [new ol.Feature({
					  geometry: new ol.geom.LineString(coordinates),
					  name: 'Line'
				  })]
			  }),
		  });

		  map.addLayer(layerLines);
	*/
}



function typingroute()
{
	
	const capitalize = (s) => {
	  if (typeof s !== 'string') return ''
	  return s.charAt(0).toUpperCase() + s.slice(1)
	}

	
	document.getElementById('routemenu').innerHTML=""
	for (let t=0; t<bdata.length; t++)
	{
	if (bdata[t].route_long_name==document.getElementById('dropdown').value)
		{
		document.getElementById('idValue').value=bdata[t].route_id
		break
		}
		
		
		
	if (bdata[t].route_long_name.startsWith(document.getElementById('dropdown').value) || bdata[t].route_long_name.startsWith(capitalize(document.getElementById('dropdown').value)))
		document.getElementById('routemenu').innerHTML=document.getElementById('routemenu').innerHTML+"<option value=\""+bdata[t].route_id+"\">"+bdata[t].route_long_name+"</option>"	
	}
	
}


ourpoints=[]

function showroute()
{
//alert(document.getElementById('idValue').value)

	shapes=[]

	
	fetch("https://data.foli.fi/gtfs/trips/route/"+document.getElementById('idValue').value).then(function(response){if (response.status!==200){return}
	response.json().then(function(data)
	{
		shapes=data.map(function(value){return value.shape_id})//each root has shape_id
		shapes=shapes.filter((v,i) => shapes.indexOf(v) === i)//unique shapes
		
			setTimeout(function(){
			for (let t=0; t<shapes.length; t++)
			{
				fetch("https://data.foli.fi/gtfs/shapes/"+shapes[t]).//each shape
				then(function(response){if (response.status!==200){return}
				response.json().then(function(data2)
				{
					points=[]
					for (let tt=0; tt<data2.length; tt++)//has bus stops
					{
						points.push([data2[tt].lat,data2[tt].lon])
					}
					var firstpolyline = new L.Polyline(points, {
								color: 'red',
								weight: 3,
								opacity: 0.5,
								smoothFactor: 1
							});
					firstpolyline.addTo(mapp);
				
				
				}
				)})
				
			}
			},500)
		
		
		}
	)})
	

	


}

markers=[]
function showbuses()
{	




//ourpoints=[]

//getting our points between which buses go


//shapes=[]

	
	fetch("https://data.foli.fi/gtfs/routes").then(//with current route
	function(response){if (response.status!==200){return}
	response.json().then(

	
	function(data)
	{
		
		
		//shapes=data.map(function(value){return value.shape_id})//route has many shapes
		//shapes=shapes.filter((v,i) => shapes.indexOf(v) === i)//unique shapes
		
					
			fetch("https://data.foli.fi/siri/vm").then(function(response){if (response.status!==200){return}



			response.json().then(function(data2)
			{
				/*
				console.log(
				JSON.stringify(
					Object.keys(data2.result.vehicles).filter(key=>data2.result.vehicles[key].publishedlinename==document.getElementById('idValue').value)
					.reduce((obj, key) => {
						obj[key] = data2.result.vehicles[key];
						return obj;
					  }, {})
					
					
				)
				)	
				*/
				
				nameofroute=""
				for (const property in data) {
						if(data[property]["route_id"]==document.getElementById('idValue').value)
							nameofroute=data[property]["route_short_name"]
						}
						
						//alert(nameofroute)
				
				buses=Object.keys(data2.result.vehicles).filter(key=>data2.result.vehicles[key].publishedlinename==nameofroute)
					.reduce((obj, key) => {
						obj[key] = data2.result.vehicles[key];
						return obj;
					  }, {})
					  
					  if (markers.length)//remove old markers
						{for(let i=0;i<markers.length;i++)
						{
						mapp.removeLayer(markers[i])
						}
						}
						let res = [];
						
						
						//console.log(Object.keys(buses).length)
						if (Object.keys(buses).length)
						for (const property in buses) {

							var marker = L.marker([buses[property].latitude,buses[property].longitude]).addTo(mapp);
							markers.push(marker)
							
							
							
						}
						else
							alert("no buses with route id"+document.getElementById('idValue').value)
				/**/
				
				})})
					
		
		
		
	//
	//		allshapes=[]
	//		
	//		for (let t=0; t<shapes.length; t++)
	//		{
	//
	//			fetch("https://data.foli.fi/gtfs/v0/20191128-102321/shapes/"+shapes[t]).//each shape
	//			then(function(response){if (response.status!==200){return}
	//			response.json().then(function(data2)
	//			{
	//				//console.log(typeof data2)
	//				
	//				
	//				//alert((data2.values()))
	//				//console.log(data2.values())
	//				
	//				
	//				var result = Object.keys(data2).map(function(key) {
	//				  return data2[key];
	//				});
	//				allshapes.push(result)
	//				
	//				
	//				if(t==shapes.length-1)
	//					setTimeout(function(){
	//						
	//						
	//						it=[].concat.apply([], allshapes)
	//						it=it.filter((v,i) => it.indexOf(v) === i)//unique
	//						//console.log(it)
	//						
	//						
	//						
	//						
	//					},500)
	//				
	//			
	//				
/*  //
	//				
	//				for (let tt=0; tt<data2.length; tt++)//has bus stops
	//				{
	//					ourpoints.push([data2[tt].lat,data2[tt].lon])
	//				}
	//				
	//				
	//				ourpoints=ourpoints.filter((v,i) => ourpoints.indexOf(v) === i)//unique
	//				
	//				
	//				rememberstops=[]
	//				fetch("https://data.foli.fi/gtfs/stops").//each shape
	//					then(function(response){if (response.status!==200){return}
	//					response.json().then(function(data3)
	//					{
	//						var result = Object.keys(data3).map(function(key) {
	//						  return [Number(key), data3[key]];
	//						});
	//						
	//						for(ii in result)
	//							
	//							{
	//							ii2=result[ii]
	//								
	//								for (iii in ourpoints)
	//								{iii2=ourpoints[iii]
	//								
	//							
	//									if((iii2[0]==ii2[1].stop_lat)&&(iii2[1]==ii2[1].stop_lon))
	//										{
	//										rememberstops.push(ii2[0])
	//										//alert([ii2[1].stop_lat,ii2[1].stop_lon])
	//										//alert(iii2)	
	//										//alert(ii2[0])
	//										}
	//								}							
	//							}
	//						rememberstops=rememberstops.filter((v,i) => rememberstops.indexOf(v) === i)
	//						alert(rememberstops)
	//					}							
	//					)
	//					}
	//					)*/
	//					}
	//			
	//				
	//				
	//				
	//				
	//			
	//			
	//			
	//			)
	//			}
	//			
	//			)
	//			
	//			
	//			
	//			
	//			
	//			
	//			
	//			
	//			
	//			
	//			
	//			
	//			
	//			
	//			allshapes=[].concat.apply([], allshapes)
	//		}
	//		
	//
	//
		
		
		
		
		
		}


)





				
}
)




}













/*
for(let i=0;i<1;i++)
{
	
	setTimeout( function(){




fetch("https://data.foli.fi/siri/vm").then(function(response){if (response.status!==200){return}



response.json().then(function(data)
	{	
				
				if (markers.length)//remove old markers
				{for(let i=0;i<markers.length;i++)
				{
				mapp.removeLayer(markers[i])
				}
				}
				let res = [];
				
				
				data.result.vehicles
				/*
				//function theygenerating(){}()
				they=[80003]
				
				let res = [];
				var a=data.result.vehicles
				var b=they
				for (const entry of Object.entries(a)) {
				  if (b.includes(Number(entry[0]))) {
					res.push(entry[1]);
				  }
				}*/
				/*
				for(let i=0;i<res.length;i++)
				{
					//alert([res[i]["latitude"],res[i]["longitude"]])
					if (res[i]["latitude"])
						{
						var marker = L.marker([res[i]["latitude"],res[i]["longitude"]]).addTo(mapp);
						markers.push(marker)
						}

				}

							}
							)
							}
				)
				
				},0)
				}
			*/	
