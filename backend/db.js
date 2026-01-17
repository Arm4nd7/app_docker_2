import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'pacientes_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Verificar la conexión
pool.on('connect', () => {
  console.log('✓ Conectado a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones:', err);
});

export default pool;
