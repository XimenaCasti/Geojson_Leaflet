// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });

  // Function to determine marker size
    function markerSize(magnitude) {
        return magnitude * 5;
    };
    
    // Function to determine marker color by depth
    function chooseColor(depth){
        if (depth < 10) return "#0000FF"; // Bright yellow
        else if (depth < 30) return "#FFFF00"; // Blue 0000FF
        else if (depth < 50) return "#A52A2A"; // Brown
        else if (depth < 70) return "#FFA500"; // Orange
        else if (depth < 90) return "#800080"; // Purple
        else return "#FFC0CB"; // Pink
    }

    function createFeatures(earthquakeData) {
        // Function to run for each feature
        function onEachFeature(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
        }
    
        // Define how each feature will be represented on the map
        function pointToLayer(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    
        // Create a GeoJSON layer with the earthquake data
        let earthquakes = L.geoJSON(earthquakeData, {
            onEachFeature: onEachFeature,
            pointToLayer: pointToLayer // Ensure this line has a comma at the end
        });
    
    // Now call createMap and pass the earthquakes layer
    createMap(earthquakes);
    }   
      
      
    function createMap(earthquakes) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        40.09, -95.71
      ],
      zoom: 4,
      layers: [street, earthquakes]
    });


    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  };

  let legend = L.control({
    position: "bottomright"
  });
    
  
  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");


    let scales = [-10, 10, 30, 50, 70, 90];
    let tones = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < scales.length; i++) {
      div.innerHTML += "<i style='background: " + tones[i] + "'></i> "
        + scales[i] + (scales[i + 1] ? "&ndash;" + scales[i + 1] + "<br>" : "+");
    }
    return div;
  };
   // Finally, we our legend to the map.
   legend.addTo(myMap);
