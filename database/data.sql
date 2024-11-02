-- Tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE,
  user_pass VARCHAR(255), -- Solo se almacena si es autenticación directa
  google_id VARCHAR(255) UNIQUE, -- Solo se almacena si es autenticación con Google
  auth_provider VARCHAR(50) NOT NULL DEFAULT 'email' -- Valores posibles: 'email', 'google'
);

-- Tabla de llaves públicas (un usuario puede tener varias)
CREATE TABLE public_key (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  alias VARCHAR(255) NOT NULL,
  key_value TEXT NOT NULL
);

-- Tabla de archivos subidos (almacena detalles de cada archivo)
CREATE TABLE archivos_subidos (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  tamano INTEGER NOT NULL,
  tipo_contenido VARCHAR(50) NOT NULL,
  archivo BYTEA NOT NULL,
  hash_archivo VARCHAR(64) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  es_compartido BOOLEAN DEFAULT FALSE
);

-- Tabla de archivos compartidos (relaciona usuarios con archivos compartidos para firmarlos)
CREATE TABLE archivos_compartidos (
  id SERIAL PRIMARY KEY,
  archivo_id INT REFERENCES archivos_subidos(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  puede_firmar BOOLEAN DEFAULT FALSE,
  firmado BOOLEAN DEFAULT FALSE
);

-- Tabla de firmas de archivos
CREATE TABLE archivos_firmados (
  id SERIAL PRIMARY KEY,
  archivo_id INT REFERENCES archivos_subidos(id) ON DELETE CASCADE,
  public_key_id INT REFERENCES public_key(id), -- Referencia a la clave pública utilizada para firmar
  signature TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);