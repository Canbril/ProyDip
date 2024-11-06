import { useState } from 'react';

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                if (data.token) {
                    // Almacena el token y el username en el almacenamiento local
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', username); // Guardar el username
                    setIsAuthenticated(true);
                    // Aquí podrías redirigir al usuario a otra página si es necesario
                }
            } else {
                // Maneja el error
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
                onChange={(e) => setUsername(e.target.value)} 
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
