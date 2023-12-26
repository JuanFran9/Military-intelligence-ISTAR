// mapSetup.js
//configuración inicial del mapa y las capas de marcadores y círculos
var map = L.map('map-container').setView([40.416775, -3.703790], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var markersLayer = L.layerGroup().addTo(map);
var circlesLayer = L.layerGroup().addTo(map);
var planesLayer = L.layerGroup().addTo(map);
var linesLayer = L.layerGroup().addTo(map);

map.on('click', function(e) {
  if (targetMarker) {
      targetMarker.setLatLng(e.latlng);
  } else {
      targetMarker = L.marker(e.latlng, { draggable: true, icon: redIcon }).addTo(map);
  }

  // Borra las alertas existentes cada vez que se selecciona un nuevo objetivo.
  document.getElementById('alert-messages').innerHTML = '';

  // Resto de tu lógica para manejar el nuevo objetivo...
});
