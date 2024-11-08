import React, { useState } from 'react';

function UploadFile({ token }) {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al subir el archivo');
            }

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
