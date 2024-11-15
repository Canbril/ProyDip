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
            } else {
                setError(data.error || 'Error en el inicio de sesión');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            setError('Error en el inicio de sesión');
        }
    };

    return (
        <div class="mb-5 w-50 border-bottom-1">
            <h2 class="h2">Inicio de Sesión</h2>
            <div class="input-group">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    class="form-control"
                    type="text" 
                    placeholder="Usuario" 
                    value={username} 
                    onChange={(e) => setLocalUsername(e.target.value)} 
                />
                <input
                    class="form-control"
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button class="btn btn-secondary" onClick={handleLogin}>Iniciar Sesión</button>
            </div>
        </div>
    );
}

export default Login;
