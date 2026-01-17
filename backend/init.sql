-- Crear tabla de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    edad INTEGER NOT NULL CHECK (edad >= 0 AND edad <= 150),
    sexo CHAR(1) NOT NULL CHECK (sexo IN ('M', 'F')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos iniciales
INSERT INTO pacientes (nombre, apellido, edad, sexo) VALUES
('Juan', 'Pérez', 34, 'M'),
('María', 'García', 32, 'F')
ON CONFLICT DO NOTHING;
