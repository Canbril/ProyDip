
CREATE DATABASE dbdiplomado
--\c adminDB

-- Tabla de usuarios
--Permite registrar usuarios mediante autenticación con correo y contraseña o mediante Google, almacenando el tipo de autenticación
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE,
  user_pass VARCHAR(255), -- Solo se almacena si es autenticación directa
  google_id VARCHAR(255) UNIQUE, -- Solo se almacena si es autenticación con Google
  auth_provider VARCHAR(50) NOT NULL DEFAULT 'email' -- Valores posibles: 'email', 'google'
);

-- Tabla de llaves públicas (un usuario puede tener varias)
--Un usuario puede crear varios pares de llaves, almacenándose en la base de datos únicamente la llave pública
CREATE TABLE `public_KEY` (
  id SERIAL NOT NULL,
  alias varchar(255) NOT NULL,
  key_value TEXT NOT NULL,
  PRIMARY KEY (`id`)
)

-- Tabla de archivos subidos (almacena detalles de cada archivo)
--Guarda los archivos que suben los usuarios, incluyendo metadatos y un campo es_compartido para indicar si el archivo es público.
CREATE TABLE archivos_subidos (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  tamano INTEGER NOT NULL,
  tipo_contenido VARCHAR(50) NOT NULL,
  archivo BYTEA NOT NULL,
  hash_archivo VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  es_compartido BOOLEAN DEFAULT FALSE
);

-- Tabla de archivos compartidos (relaciona usuarios con archivos compartidos para firmarlos)
--Define las relaciones de archivos compartidos, permitiendo saber si otros usuarios pueden firmar y si el archivo ha sido firmado.
CREATE TABLE archivos_compartidos (
  id SERIAL PRIMARY KEY,
  archivo_id INT REFERENCES archivos_subidos(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  puede_firmar BOOLEAN DEFAULT FALSE,
  firmado BOOLEAN DEFAULT FALSE
);

-- Tabla de firmas de archivos
--Almacena las firmas realizadas en los archivos, ligadas al alias del usuario firmante.
CREATE TABLE archivos_firmados (
 id SERIAL PRIMARY KEY, 
archivo_id INT REFERENCES archivos_subidos(id) ON DELETE CASCADE, 
public_key_id INT REFERENCES public_key(id), -- Referencia a la clave pública utilizada para firmar signature TEXT NOT NULL, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
