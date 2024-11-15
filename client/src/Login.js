import React, { useState } from 'react';

function Login({ setIsAuthenticated, setUsername, setToken }) {
    const [username, setLocalUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username);
                setIsAuthenticated(true);
                setUsername(username);
                setToken(data.token);
                console.log('Token JWT:', data.token);
            } else {
                setError(data.error || 'Error en el inicio de sesión');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            setError('Error en el inicio de sesión');
        }
    };

    return (
        <div>
            <h2>Inicio de Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input 
                type="text" 
                placeholder="Usuario" 
                value={username} 
                onChange={(e) => setLocalUsername(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Contraseña" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleLogin}>Iniciar Sesión</button>
        </div>
    );
}

export default Login;
