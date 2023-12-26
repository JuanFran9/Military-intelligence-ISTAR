

function fetchPlaneData() {
  // Suponiendo que tienes una ruta de API para obtener datos de aviones
  fetch('/api/planes')
      .then(response => response.json())
      .then(data => {
          showPlanesOnMap(data);
      })
      .catch(error => console.error('Error al cargar los datos de aviones:', error));
}


function showPlanesOnMap(planes) {
    planesLayer.clearLayers();

    planes.forEach(plane => {
        const planeMarker = L.marker([plane.location.lat, plane.location.lng], {
            icon: L.icon({
                iconUrl: 'plane-icon.png', // Asegúrate de tener un icono para el avión
                iconSize: [38, 38],
                iconAnchor: [19, 19]
            })
        }).addTo(planesLayer);

        planeMarker.options.planeId = plane.id; // Almacenar el ID del avión
    });
}

// 3. funcion para ver que el objetivo está en el rango de los sensores
function checkTargetInSensorRange(targetLatLng) {
  let isTargetInRange = false;

  circlesLayer.eachLayer(function(circle) {
      if (map.distance(circle.getLatLng(), targetLatLng) <= circle.getRadius()) {
          isTargetInRange = true;
      }
  });

  if (isTargetInRange) {
      findClosestPlanes(targetLatLng);
  } else {
      // Limpia la lista o muestra un mensaje si el objetivo no está en el rango de ningún sensor
      updatePlanesList([]);
  }
}


function findClosestPlanes(targetLatLng) {
  // Crear un arreglo para almacenar las distancias entre el objetivo y los aviones
  const planesDistances = [];

  // Iterar a través de cada marcador de avión en la capa de aviones
  planesLayer.eachLayer(function(planeMarker) {
      // Calcular la distancia entre el objetivo y el marcador de avión
      const distance = targetLatLng.distanceTo(planeMarker.getLatLng());

      // Agregar la información de distancia, ID y coordenadas del avión al arreglo
      planesDistances.push({
          planeId: planeMarker.options.planeId, // ID del avión
          distance: distance, // Distancia al objetivo
          lat: planeMarker.getLatLng().lat, // Latitud del avión
          lng: planeMarker.getLatLng().lng // Longitud del avión
      });
  });

  // Ordenar los aviones por distancia y tomar los 3 más cercanos
  const closestPlanes = planesDistances.sort((a, b) => a.distance - b.distance).slice(0, 3);

  // Pasar las coordenadas de los aviones más cercanos y el objetivo a la función de actualización
  updatePlanesList(closestPlanes, targetLatLng);
}



function updatePlanesList(closestPlanes, targetLatLng) {
  // Limpia las líneas previas en la capa de líneas
  linesLayer.clearLayers();

  // Obtiene una referencia al elemento HTML con el ID 'planes-list'
  const planesList = document.getElementById('planes-list');

  // Limpia el contenido previo de la lista
  planesList.innerHTML = '';

  // Itera a través de los aviones más cercanos
  closestPlanes.forEach(plane => {
      // Crea un elemento de lista en el HTML para mostrar la información del avión
      const listItem = document.createElement('li');
      listItem.textContent = `Avión ID: ${plane.planeId}, a ${(plane.distance/1000).toFixed(2)} km`;

      const alertButton = document.createElement('button');
       alertButton.textContent = 'Alertar';
        alertButton.onclick = function() {
          displayAlert(plane.planeId, targetLatLng);
        };
      listItem.appendChild(alertButton);
      // Agrega el elemento de lista a la lista en el HTML
      planesList.appendChild(listItem);

      // Crea una línea (polilínea) que conecta el objetivo con el avión
      const linePoints = [targetLatLng, [plane.lat, plane.lng]];

      // Agrega la línea al mapa con color rojo
      const line = L.polyline(linePoints, { color: 'red' }).addTo(linesLayer);
  });

  // Si no hay aviones cercanos, muestra un mensaje en la lista
  if (closestPlanes.length === 0) {
      planesList.innerHTML = '<li>El objetivo no se encuentra dentro del alcance de un sensor</li>';
  }
}

// function sendAlert(planeId, targetLatLng) {
//   const alertMessage = `Avión ID: ${planeId}, dirígete a las coordenadas ${targetLatLng.lat.toFixed(2)}, ${targetLatLng.lng.toFixed(2)}.`;
//   // Aquí podrías usar algo más avanzado como WebSockets para un sistema en tiempo real.
//   // Para este ejemplo, simplemente usaremos el almacenamiento local.
//   localStorage.setItem('alert', alertMessage);
//   displayAlertInChat(planeId); // Función para mostrar la alerta en el chat.
// }

function displayAlert(planeId, targetLatLng) {
  const alertMessages = document.getElementById('alert-messages');
  alertMessages.innerHTML = ''; // Borra mensajes anteriores.

  const alertDiv = document.createElement('div');
  alertDiv.textContent = `Alerta para Avión ID: ${planeId} - Dirígete a las coordenadas ${targetLatLng.lat.toFixed(2)}, ${targetLatLng.lng.toFixed(2)}`;
  alertMessages.appendChild(alertDiv);
}


document.getElementById('plane-id-input').onchange = function() {
  const planeId = this.value;
  const alert = localStorage.getItem('alert');
  if (alert.includes(planeId)) {
      displayAlertInChat(planeId);
  }
};
