const L = require("leaflet");
const proj4 = require("proj4");

const map = L.map("mapid").setView([51.05, -114.066], 13);
const utm = proj4("EPSG:3857");
const attrib =
  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXBzYWx0IiwiYSI6ImNrY2NybjNxYzAxeTgyeXRrdTltZHRlN2gifQ.KZEPNfporcfasqLBqRG94w",
  {
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
  }
).addTo(map);

fetch("/api/coords/")
  .then((response) => response.json())
  .then((json) =>
    L.geoJSON(json.data, {
      onEachFeature: (feature, layer) => {
        let label = formatLabel({
          session: feature.properties.session,
          timestamp: feature.properties.timestamp,
          coords: feature.geometry.coordinates,
        });
        layer.bindPopup(label);
      },
    }).addTo(map)
  );

fetch("/api/id")
  .then((response) => response.json())
  .then((json) => {
    map.on("click", (e) => clickHandler(e, json));
    L.popup()
      .setLatLng(map.getCenter())
      .setContent(
        `
Hey! Welcome to Clickmap!<br>
Your session ID is <b>${json.id}</b><br>
Close me and do some clicking.`
      )
      .openOn(map);
    map.attributionControl.addAttribution(`Session ID: ${json.id}, ${attrib}`);
  });

const clickHandler = (e, json) => {
  let marker = new L.marker(e.latlng).addTo(map);
  let coords = marker.getLatLng();
  let data = {
    session: json.id,
    timestamp: Date.now(),
    coords: [coords.lng, coords.lat],
  };

  fetch("/api/coords/", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let label = formatLabel(data);
  marker.bindPopup(label).openPopup();
};

const coordsString = (coords) =>
  coords
    .map((s) => s.toFixed(3))
    .reverse()
    .join(", ");

const formatLabel = ({ session, timestamp, coords }) => {
  let dateString = new Date(timestamp).toString();
  let utmCoords = proj4(utm, coords);

  return `
<b>Added By:</b> ${session}<br>
<b>Added On:</b> ${dateString}<br>
<b>Lat/Long:</b> ${coordsString(coords)}<br>
<b>Web Mercator:</b> ${coordsString(utmCoords)}
`.trim();
};
