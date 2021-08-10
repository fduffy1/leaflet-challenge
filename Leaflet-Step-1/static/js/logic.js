// Creating map object
var myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

function styleFunct(feat){
    return {
        stroke: true, 
        weight: 1,
        color: "white",
        radius: setRadius(feat.properties.mag),
        fillColor: setColor(feat.geometry.coordinates[2]),
        fillOpacity: .5
    }
}

function setRadius(mag){
    if(mag==0){
        return 1
    }
    return mag * 5
}

function setColor(depth){
    if (depth > 90){
        return "red"
    }
    else if (depth > 70){
        return "orangered"
    }
    else if (depth > 50){
        return "orange"
    }
    else if (depth > 30){
        return "yellow"
    }
    else if (depth > 10){
        return "yellowgreen"
    }
    else {
        return "green"
    }
}

// Grab the data with d3
d3.json(link).then(function(data) {
    L.geoJson(data, {

        pointToLayer: (feat, latLong) => {
            return L.circleMarker(latLong)
        },
        style: styleFunct,
        onEachFeature: (feat, layer)=> {
            layer.bindPopup(feat.properties.name)
        }
        //     // Create a new marker cluster group
        // var markers = L.markerClusterGroup();

        // // Loop through data
        // for (var i = 0; i < data.length; i++) {

        //     // Set the data location property to a variable
        //     var location = data[i].location;

        //     // Check for location property
        //     if (location) {

        //     // Add a new marker to the cluster group and bind a pop-up
        //     markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
        //         .bindPopup(response[i].descriptor));
        //     }

        // }

        // Add our marker cluster layer to the map
    }).addTo(myMap);

//     // Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    // var limits = geojson.options.limits;
    // var colors = geojson.options.colors;
    // var labels = [];
    var depth = ["-10 - 10", "10 - 30", "30 - 50", "50 - 70", "70 - 90", "90+"]
    var colors = ["green", "yellowgreen", "yellow", "orange", "orangered", "red"]
    for (var i = 0; i < depth.length; i++){
        div.innerHTML+= `<div><i style="background: ${colors[i]}"></i><span>${depth[i]}</span></div>`
    }
    return div;
  };

//   // Adding legend to the map
  legend.addTo(myMap);
});
