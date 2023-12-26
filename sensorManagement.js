// sensorManagement.js
//Este archivo manejará la carga de datos de sensores, la visualización de sensores en el mapa y la actualización de la lista de sensores en rango


// 1. Función para obtener datos de los sensores del servidor
function fetchSensorData() {
  fetch('/api/sensors')
      .then(response => response.json())
      .then(data => {
          showSensorsOnMap(data);
      })
      .catch(error => console.error('Error al cargar los datos de sensores:', error));
}


// 2. Función para procesar y mostrar los datos de los sensores en el mapa
function showSensorsOnMap(sensors) {
    // Asegúrate de limpiar los marcadores antiguos si es necesario
    markersLayer.clearLayers();
    circlesLayer.clearLayers();

    sensors.forEach(sensor => {
        const marker = L.marker([sensor.location.lat, sensor.location.lng])
            .bindPopup(`Sensor ID: ${sensor.id}<br>Temperature: ${sensor.data.temperature}`);

        marker.on('click', function() {
             marker.openPopup();
        });

        // Añadir un círculo alrededor del marcador
        const circle = L.circle([sensor.location.lat, sensor.location.lng], {
          color: 'blue',
          fillColor: '#c01',
          fillOpacity: 0.1,
          radius: 1000000 // 100 km en metros
      }).addTo(circlesLayer);

       // Almacenar el ID del sensor en las opciones del círculo para su uso posterior
        circle.options.sensorId = sensor.id;

        markersLayer.addLayer(marker);
        circlesLayer.addLayer(circle);
    });
}
