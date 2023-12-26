// script.js
// se utilizará para iniciar las funciones necesarias y coordinar los otros scripts
document.addEventListener('DOMContentLoaded', () => {
  fetchSensorData();
  fetchPlaneData();
  document.getElementById('toggle-markers').addEventListener('change', toggleMarkers);
  document.getElementById('toggle-circles').addEventListener('change', toggleCircles);
});
