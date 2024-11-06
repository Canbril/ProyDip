import React, { useState } from 'react';

function GenerateKeys({ token }) {
    const handleGenerateKeys = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/generate-keys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
            <button onClick={handleGenerateKeys}>Generar y Descargar Llaves</button>
        </div>
    );
}

export default GenerateKeys;
