import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Verificar conexión a la base de datos al iniciar
async function checkDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Base de datos conectada correctamente');
    return true;
  } catch (error) {
    console.error('✗ Error al conectar con la base de datos:', error.message);
    return false;
  }
}

// Rutas
app.get('/api/pacientes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, apellido, edad, sexo FROM pacientes ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

app.post('/api/pacientes', async (req, res) => {
  const { nombre, apellido, edad, sexo } = req.body;

  if (!nombre || !apellido || !edad || !sexo) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  if (edad < 0 || edad > 150) {
    return res.status(400).json({ error: 'La edad debe estar entre 0 y 150' });
  }

  if (!['M', 'F'].includes(sexo)) {
    return res.status(400).json({ error: 'El sexo debe ser M o F' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO pacientes (nombre, apellido, edad, sexo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellido, parseInt(edad), sexo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al registrar paciente:', error);
    res.status(500).json({ error: 'Error al registrar paciente' });
  }
});

app.get('/api/pacientes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, nombre, apellido, edad, sexo FROM pacientes WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    res.status(500).json({ error: 'Error al obtener paciente' });
  }
});

app.put('/api/pacientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, edad, sexo } = req.body;

  try {
    // Verificar que el paciente existe
    const checkResult = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const result = await pool.query(
      'UPDATE pacientes SET nombre = $1, apellido = $2, edad = $3, sexo = $4 WHERE id = $5 RETURNING *',
      [nombre, apellido, parseInt(edad), sexo, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({ error: 'Error al actualizar paciente' });
  }
});

app.delete('/api/pacientes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM pacientes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({ error: 'Error al eliminar paciente' });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'Backend funcionando correctamente',
      database: 'Conectada'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'Backend funcionando',
      database: 'Error de conexión'
    });
  }
});

// Iniciar servidor
async function startServer() {
  await checkDatabaseConnection();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

startServer();
