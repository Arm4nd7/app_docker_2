import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos en memoria
let pacientes = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    edad: 34,
    sexo: 'M'
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'García',
    edad: 32,
    sexo: 'F'
  }
];

let nextId = 3;

// Rutas
app.get('/api/pacientes', (req, res) => {
  res.json(pacientes);
});

app.post('/api/pacientes', (req, res) => {
  const { nombre, apellido, edad, sexo } = req.body;

  if (!nombre || !apellido || !edad || !sexo) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const nuevoPaciente = {
    id: nextId++,
    nombre,
    apellido,
    edad: parseInt(edad),
    sexo
  };

  pacientes.push(nuevoPaciente);
  res.status(201).json(nuevoPaciente);
});

app.get('/api/pacientes/:id', (req, res) => {
  const paciente = pacientes.find(p => p.id === parseInt(req.params.id));
  if (!paciente) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }
  res.json(paciente);
});

app.put('/api/pacientes/:id', (req, res) => {
  const paciente = pacientes.find(p => p.id === parseInt(req.params.id));
  if (!paciente) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }

  const { nombre, apellido, edad, sexo } = req.body;
  paciente.nombre = nombre || paciente.nombre;
  paciente.apellido = apellido || paciente.apellido;
  paciente.edad = edad !== undefined ? parseInt(edad) : paciente.edad;
  paciente.sexo = sexo || paciente.sexo;

  res.json(paciente);
});

app.delete('/api/pacientes/:id', (req, res) => {
  const index = pacientes.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }

  const deletedPaciente = pacientes.splice(index, 1);
  res.json(deletedPaciente[0]);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`✓ Servidor ejecutándose en http://localhost:${PORT}`);
});
