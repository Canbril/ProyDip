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
        <div class="mb-5 w-50 border-bottom-1">
            <h2 class="h2">Subir Archivo</h2>
            <div class="input-group">
                <input class="form-control" type="file" onChange={handleFileChange} />
                <button class="btn btn-secondary" onClick={handleUpload}>Subir</button>
            </div>
        </div>
    );
}

export default UploadFile;
