// client/src/SignFile.js
import React, { useState } from 'react';

function SignFile({ username }) {
    const [archivoId, setArchivoId] = useState('');
    const [privateKey, setPrivateKey] = useState('');

    const handleSignFile = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/files/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            <input
                type="text"
                placeholder="ID del archivo"
                value={archivoId}
                onChange={(e) => setArchivoId(e.target.value)}
            />
            <textarea
                placeholder="Llave privada"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
            />
            <button onClick={handleSignFile}>Firmar Archivo</button>
        </div>
    );
}

export default SignFile;
