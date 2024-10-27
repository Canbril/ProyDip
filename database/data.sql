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
CREATE TABLE public_key (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  alias VARCHAR(255) NOT NULL,
  key_value TEXT NOT NULL
);

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



--Inserts de ejemplo

-- Insertar usuarios
INSERT INTO users (username, email, user_pass, auth_provider) VALUES 
('usuario1', 'usuario1@example.com', 'password1', 'email'),
('usuario2', 'usuario2@example.com', NULL, 'google'),
('usuario3', 'usuario3@example.com', 'password3', 'email');

-- Insertar llaves públicas asociadas a los usuarios
INSERT INTO public_key (user_id, alias, key_value) VALUES 
(1, 'usuario1_key1', 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsamplekeydata1...'),
(1, 'usuario1_key2', 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsamplekeydata2...'),
(2, 'usuario2_key1', 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsamplekeydata3...');

-- Insertar archivos subidos por los usuarios
INSERT INTO archivos_subidos (user_id, nombre_archivo, tamano, tipo_contenido, archivo, hash_archivo, es_compartido) VALUES 
(1, 'documento1.pdf', 2048, 'application/pdf', decode('89504E470D0A1A0A...', 'hex'), 'hashdata1', FALSE);

INSERT INTO archivos_subidos (user_id, nombre_archivo, tamano, tipo_contenido, archivo, hash_archivo, es_compartido) VALUES 
(2, 'imagen1.png', 1024, 'image/png', decode('89504E470D0A1A0A...', 'hex'), 'hashdata2', TRUE);

INSERT INTO archivos_subidos (user_id, nombre_archivo, tamano, tipo_contenido, archivo, hash_archivo, es_compartido) VALUES 
(3, 'archivo_texto.txt', 512, 'text/plain', decode('89504E470D0A1A0A...', 'hex'), 'hashdata3', FALSE);

-- Insertar registros de archivos compartidos con otros usuarios
INSERT INTO archivos_compartidos (archivo_id, user_id, puede_firmar, firmado) VALUES 
(2, 1, TRUE, FALSE), -- El usuario 1 puede firmar el archivo de usuario 2, pero aún no lo ha firmado
(3, 1, FALSE, FALSE), -- El usuario 1 puede acceder, pero no puede firmar
(1, 2, TRUE, TRUE); -- El usuario 2 firmó el archivo de usuario 1

-- Insertar firmas en archivos
--Un usuario A firma el archivo compartido por un Usuario B
INSERT INTO archivos_firmados (archivo_id, public_key_id, signature) VALUES 
(1, 2, 'firmaEjemplo1Data');
