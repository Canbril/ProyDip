import React, { useState, useEffect } from 'react';

function VerifySignature({ token }) {
    const [signatures, setSignatures] = useState([]);
    const [selectedSignature, setSelectedSignature] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);

    useEffect(() => {
        // Obtener las firmas del usuario
        const fetchSignatures = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/signatures`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                setSignatures(data);
            } catch (error) {
                console.error('Error al obtener firmas:', error);
            }
        };

        fetchSignatures();
    }, [token]);

    const handleVerifySignature = async () => {
        try {
            const [archivo_id, signature] = selectedSignature.split(',');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ archivo_id, signature }),
            });

            const data = await response.json();
            setVerificationResult(data.isValid ? 'Firma válida' : 'Firma inválida');
        } catch (error) {
            console.error('Error al verificar la firma:', error);
            setVerificationResult('Error al verificar la firma');
        }
    };

    return (
        <div>
            <h2>Verificar Firma</h2>
            <select
                value={selectedSignature}
                onChange={(e) => setSelectedSignature(e.target.value)}
            >
                <option value="">Seleccione una firma</option>
                {signatures.map((sig) => (
                    <option key={sig.id} value={`${sig.archivo_id},${sig.signature}`}>
                        {sig.nombre_archivo} - Fecha: {new Date(sig.created_at).toLocaleString()}
                    </option>
                ))}
            </select>
            <button onClick={handleVerifySignature}>Verificar Firma</button>
            {verificationResult && <p>{verificationResult}</p>}
        </div>
    );
}

export default VerifySignature;
