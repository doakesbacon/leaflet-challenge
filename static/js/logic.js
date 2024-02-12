let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


//this function will make the marker size
function markerSize(magnitude) {
    return magnitude * 8000;
};

d3.json(url).then(function (data) {
    // Console log the data retrieved 
    console.log(data);
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });


  function chooseColor(depth) {
    if (depth < 10) return "lightgreen";
    else if (depth < 30) return "greenyellow";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "orangered";
    else return "red";
};

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  

    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
  
      pointToLayer: function(feature, latlng) {
  
        let markers = {
          radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
        }
        return L.circle(latlng,markers);
      }
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }

  function createMap(earthquakes) {

    // Create tile layer
    let grayscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1
    });
  
    // Create our map, giving it the grayscale map and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [grayscale, earthquakes]
    });
  
// Add legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let depth = [-10, 10, 30, 50, 70, 90];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";

    // Loop through each depth level
    for (let i = 0; i < depth.length; i++) {
        // Create a colored box and text for each depth level
        div.innerHTML +=
            '<div><i style="background:' + chooseColor(depth[i]) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+') + '</div>';
    }

    return div;
};
legend.addTo(myMap);
}