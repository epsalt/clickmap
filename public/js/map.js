const session = "12345";
const map = L.map("mapid").setView([51.05, -114.066], 13);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXBzYWx0IiwiYSI6ImNrY2NybjNxYzAxeTgyeXRrdTltZHRlN2gifQ.KZEPNfporcfasqLBqRG94w",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
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
        var label = formatLabel({
          session: feature.properties.session,
          timestamp: feature.properties.timestamp,
          coords: feature.geometry.coordinates,
        });
        layer.bindPopup(label);
      },
    }).addTo(map)
  );

map.on("click", (e) => {
  var marker = new L.marker(e.latlng).addTo(map);
  var coords = marker.getLatLng();
  var data = {
    session: session,
    timestamp: Date.now(),
    coords: [coords.lat, coords.lng],
  };

  fetch("/api/coords/", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  var label = formatLabel(data);
  marker.bindPopup(label).openPopup();
});

const formatLabel = ({ session, timestamp, coords }) => {
  var dateString = new Date(timestamp).toString();
  var coordString = coords.map((s) => s.toFixed(3)).toString();

  return `
<b>Added By:</b> ${session}<br>
<b>Added On:</b> ${dateString}<br>
<b>Coordinates:</b> ${coordString}
`.trim();
};
