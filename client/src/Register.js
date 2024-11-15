import React, { useState } from 'react';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            setMessage(data.message || data.error);
        } catch (error) {
            console.error('Error en el registro:', error);
            setMessage('Error en el registro');
        }
    };

    return (
        <div class="mb-5 w-50 border-bottom-1">
            <h2 class="h2">Registro</h2>
            {message && <p>{message}</p>}
            <div class="input-group">
                <input class="form-control" type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input class="form-control" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input class="form-control" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button class="btn btn-secondary" onClick={handleRegister}>Registrar</button>
            </div>
        </div>
    );
}

export default Register;
