import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function SharedFiles({ token }) {
    const [sharedFiles, setSharedFiles] = useState([]);
    const [archivoId, setArchivoId] = useState('');
    const [privateKeyFile, setPrivateKeyFile] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);

        const fetchSharedFiles = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/shared-files`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const files = await response.json();
                if (Array.isArray(files)) {
                    setSharedFiles(files);
                } else {
                    console.error('Error: La respuesta no es un arreglo.', files);
                    setSharedFiles([]);
                }
            } catch (error) {
                console.error('Error al obtener los archivos compartidos:', error);
                setSharedFiles([]);
            }
        };

        fetchSharedFiles();
    }, [token]);

    const handlePrivateKeyUpload = (e) => {
        setPrivateKeyFile(e.target.files[0]);
    };

    const handleSignFile = async () => {
        if (!privateKeyFile || !archivoId) {
            alert('Por favor, selecciona un archivo y carga la clave privada.');
            return;
        }

        const privateKey = await privateKeyFile.text();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/sign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ archivo_id: archivoId, privateKey }),
            });

            if (!response.ok) {
                throw new Error('Error al firmar el archivo');
            }

            const data = await response.json();
            alert(`Archivo firmado exitosamente. Firma: ${data.signature}`);
        } catch (error) {
            console.error('Error al firmar el archivo:', error);
            alert('Error al firmar el archivo');
        }
    };

    return (
        <div class="mb-5 w-50 border-bottom-1">
            <h2 class="h2">Archivos Compartidos</h2>
            <select class="form-select mb-3" value={archivoId} onChange={(e) => setArchivoId(e.target.value)}>
                <option value="">Selecciona un archivo</option>
                {sharedFiles.length > 0 ? (
                    sharedFiles.map((file) => (
                        <option key={file.id} value={file.id}>{file.nombre_archivo}</option>
                    ))
                ) : (
                    <option value="">No tienes archivos compartidos</option>
                )}
            </select>
            <div class="input-group">
                <input class="form-control" type="file" accept=".pem" onChange={handlePrivateKeyUpload} />
                <button class="btn btn-secondary" onClick={handleSignFile}>Firmar Archivo</button>
            </div>
        </div>
    );
}

export default SharedFiles;
