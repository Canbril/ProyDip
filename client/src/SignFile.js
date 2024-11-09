import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function SignFile({ token }) {
    const [archivoId, setArchivoId] = useState('');
    const [privateKeyFile, setPrivateKeyFile] = useState(null);
    const [userFiles, setUserFiles] = useState([]); // Inicializamos como arreglo vacío
    const [username, setUsername] = useState('');

    useEffect(() => {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);

        const fetchUserFiles = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/user-files`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Verificar si la respuesta es un arreglo
                const files = await response.json();
                if (Array.isArray(files)) {
                    setUserFiles(files);
                } else {
                    console.error('Error: La respuesta no es un arreglo.', files);
                    setUserFiles([]); // Asegurarse de que sea un arreglo vacío en caso de error
                }
            } catch (error) {
                console.error('Error al obtener los archivos:', error);
                setUserFiles([]); // Asegurarse de que sea un arreglo vacío en caso de error
            }
        };

        fetchUserFiles();
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
        <div>
            <h2>Firmar Archivo</h2>
            <select value={archivoId} onChange={(e) => setArchivoId(e.target.value)}>
                <option value="">Selecciona un archivo</option>
                {userFiles.length > 0 ? (
                    userFiles.map((file) => (
                        <option key={file.id} value={file.id}>{file.nombre_archivo}</option>
                    ))
                ) : (
                    <option value="">No tienes archivos subidos</option>
                )}
            </select>
            <input type="file" accept=".pem" onChange={handlePrivateKeyUpload} />
            <button onClick={handleSignFile}>Firmar Archivo</button>
        </div>
    );
}

export default SignFile;
