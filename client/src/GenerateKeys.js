// client/src/GenerateKeys.js
import React, { useState } from 'react';

function GenerateKeys() {
    const [alias, setAlias] = useState('');

    const handleGenerateKeys = async () => {
        try {
            const response = await fetch('http://backend:5000/api/generate-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alias }),
            });

            if (!response.ok) {
                throw new Error('Error al generar las llaves');
            }

            const privateKeyBlob = await response.blob();
            const url = window.URL.createObjectURL(privateKeyBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'privateKey.pem';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Generar Llaves RSA</h1>
            <input
                type="text"
                placeholder="Ingresa un alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
            />
            <button onClick={handleGenerateKeys}>Generar y Descargar Llaves</button>
        </div>
    );
}

export default GenerateKeys;
