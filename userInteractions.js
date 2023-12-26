// Este archivo gestionará las interacciones del usuario, como el cambio en los controles y la colocación del marcador de objetivo.

// userInteractions.js

// Funciones para mostrar/ocultar marcadores y círculos
function toggleMarkers() {
  if (document.getElementById('toggle-markers').checked) {
      markersLayer.addTo(map);
  } else {
      markersLayer.remove();
  }
}

function toggleCircles() {
  if (document.getElementById('toggle-circles').checked) {
      circlesLayer.addTo(map);
  } else {
      circlesLayer.remove();
  }
}


// Permitir al Usuario Colocar un Marcador de Objetivo

const redIcon = L.icon({
  iconUrl: 'internet-keyword-targeting-seo-target-icon--22.png', // Ruta a la imagen de marcador rojo
  iconSize: [41, 41],
});

var targetMarker;

map.on('click', function(e) {
    if (targetMarker) {
        targetMarker.setLatLng(e.latlng);
    } else {
        targetMarker = L.marker(e.latlng, {draggable: true, icon: redIcon}).addTo(map);
    }

    // Llamar a una función que verifique si el objetivo está dentro de algún círculo
    checkTargetInSensorRange(targetMarker.getLatLng());
});
