// client/src/UploadFile.js
import React, { useState } from 'react';

function UploadFile() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Por favor, selecciona un archivo');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
            const response = await fetch('http://localhost:5000/api/files/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Incluye el token en las cabeceras
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al subir el archivo');
            }

            const data = await response.json();
            alert('Archivo subido exitosamente');
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            alert('Error al subir el archivo');
        }
    };

    return (
        <div>
            <h2>Subir Archivo</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Subir</button>
        </div>
    );
}

export default UploadFile;
