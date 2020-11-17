// Welcome to the United States Geological Survey, or USGS for short! The USGS is responsible for providing scientific data about natural hazards, 
// the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools 
// to supply timely, relevant, and useful information about the Earth and its processes. As a new hire, you will be helping them out with an 
// exciting new project!  The USGS is interested in building a new set of tools that will allow them visualize their earthquake data. 
// They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. 
// Their hope is that being able to visualize their data will allow them to better educate the public and other government organizations 
// (and hopefully secure more funding..) on issues facing our planet.

// Your first task is to visualize an earthquake data set.
// 1. Get your data set.  The USGS provides earthquake data in a number of different formats, updated every 5 minutes. Visit the USGS GeoJSON 
// Feed page and pick a data set to visualize. When you click on a data set, for example 'All Earthquakes from the Past 7 Days', you will be 
// given a JSON representation of that data. You will be using the URL of this JSON to pull in the data for our visualization.

// 2.  Import & Visualize the Data.  Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and 
// latitude.  Your data markers should reflect the magnitude of the earthquake by their size and and depth of the earth quake by color.
//  Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.

// HINT the depth of the earth can be found as the third coordinate for each earthquake.

// Include popups that provide additional information about the earthquake when a marker is clicked.

// Create a legend that will provide context for your map data.



// Get dataset
// Store our API endpoint inside queryUrl
queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Create Base (Initial) Map Layer

var initialLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

// Define Map Object (mapid is the tag in the HTML)

var myMap = L.map("mapid", {
  center: [51.505, -0.09],
  zoom: 3
});

// Add myMap to the initial layer

initialLayer.addTo(myMap);

// Get Marker Size based on the magnitude of the earthquake.

function earthquakeMarkerSize(mag) {
    if (mag <= 1) {
        return(2);
    } else if ((mag > 1) && (mag <= 2)) {
        return(4);
    } else if ((mag > 2) && (mag <= 3)) {
        return(6);
    } else if ((mag > 3) && (mag <= 4)) {
        return(8);
    } else if ((mag > 4) && (mag <= 5)) {
        return(10);
    } else {
        return(12);
    };
  } 

// Get Marker Color based on the depth of the earthquake.
  function earthquakeMarkerColor(depth) {
    if (depth <= 10) {
        return("#DAF7A6");
    } else if ((depth > 10) && (depth <= 20)) {
        return("#FFC300");
    } else if ((depth > 20) && (depth <= 30)) {
        return("#FF5733");
    } else if ((depth > 30) && (depth <= 40)) {
        return("#C70039");
    } else if ((depth > 40) && (depth <= 50)) {
        return("#900C3F");
    } else {
        return("#581845");
    };
  } 

//Function to format circle marker for each earthquake

function styleCircle(feature) 
{
  return {
    opacity: 1,
    fillOpacity: 0.75,
    fillColor: earthquakeMarkerColor(feature.geometry.coordinates[2]),
    color: "#000000",
    radius: earthquakeMarkerSize(feature.properties.mag),
    stroke: true,
    weight: 0.5
  }
};

baseLayer = new L.LayerGroup();

//Earthquake Data

d3.json(queryUrl, function (data) 
{
  //Add geoJson layer
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleCircle,
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3><p>" + feature.properties.place + "</p><h5><p> Magnitude: " + feature.properties.mag + "<h5><p> Depth:" + feature.geometry.coordinates[2] + "</p></h5>");
    }
  }).addTo(baseLayer);

  //Add earthquake layer to map

  baseLayer.addTo(myMap) ;

  //Place Legend of Depth colors in bottom right of map.

  var legend = L.control({position: "bottomright"});
  legend.onAdd = function(myMap) 
  {
        //Add legend details
        var div = L.DomUtil.create("div", "info legend"),
        grades = [10, 20, 30, 40, 50, 60],
        labels = ['<strong>Depth Categories</strong'];
        
        var colors =
          [
            "#DAF7A6",
            "#FFC300",
            "#FF5733",
            "#C70039",
            "#900C3F",
            "#581845"
          ];

        // Looping through our intervals to generate a label with a colored square for each interval.
        for (var i = 0; i < feature.geometry.coordinates[2]; i++) 
        {
          div.innerHTML +=
            labels.push( "<i style='background: " + colors[i] + "'></i> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+"));
        }
        
        return div;

  };

  //Add legend to map
  legend.addTo(myMap);

});
