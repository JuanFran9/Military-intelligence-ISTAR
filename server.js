const express = require('express');
const faker = require('faker');

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Simulación de datos para sensores
app.get('/api/sensors', (req, res) => {
    const sensors = Array.from({ length: 50}, () => ({
        id: faker.datatype.uuid(),
        type: 'thermal',
        location: {
            lat: faker.address.latitude(),
            lng: faker.address.longitude(),
        },
        data: {
            temperature: faker.datatype.number({ min: -10, max: 35 })
        }
    }));
    res.json(sensors);
});

// Endpoint para obtener datos de aviones
app.get('/api/planes', (req, res) => {
  const planes = Array.from({ length: 50 }, () => ({
      id: faker.datatype.uuid(),
      location: {
          lat: faker.address.latitude(),
          lng: faker.address.longitude()
      }
  }));

  res.json(planes);
});



// Simulación de datos para inteligencia
app.get('/api/intelligence', (req, res) => {
    const reports = Array.from({ length: 5 }, () => ({
        id: faker.datatype.uuid(),
        report: faker.lorem.paragraph(),
        timestamp: faker.date.recent(),
    }));
    res.json(reports);
});

// Simulación de endpoint para dirección del ciclo de inteligencia
app.post('/api/direct-intelligence', (req, res) => {
    // Aquí se procesaría la solicitud y se respondería con el resultado
    res.json({ message: 'Ciclo de inteligencia dirigido', body: req.body });
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Algo salió mal!');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Esto es en tu server.js
const path = require('path');

app.use(express.static(__dirname));  // Reemplaza 'path_to_your_static_files' con la ruta a tus archivos estáticos.
