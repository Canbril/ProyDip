import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"

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

    const googleLoginHandler = (googleResponse) => {
        console.log(googleResponse);
        console.log(jwtDecode(googleResponse?.credential));
    };

    return (
        <div class="mb-5 w-50 border-bottom-1">
            <h2 class="h2">Inicio de Sesión</h2>
            <div class="input-group mb-3">
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
            <GoogleLogin
                onSuccess={googleLoginHandler}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    );
}

export default Login;
