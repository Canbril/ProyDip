// client/src/App.js
import React, { useState, useEffect } from 'react';
import GenerateKeys from './GenerateKeys';
import Register from './Register';
import Login from './Login';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(''); // Agregar estado para username

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username'); // Obtener el username
        if (token) {
            setIsAuthenticated(true);
            setUsername(storedUsername); // Establecer el username
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username'); // Limpiar el username
        setIsAuthenticated(false);
    };

    return (
        <div className="App">
            <header>
                <h1>Aplicación de Generación de Llaves RSA</h1>
                {isAuthenticated && <button onClick={handleLogout}>Cerrar Sesión</button>}
            </header>
            <main>
                {!isAuthenticated ? (
                    <>
                        <Register />
                        <Login setIsAuthenticated={setIsAuthenticated} />
                    </>
                ) : (
                    <GenerateKeys username={username}/>
                )}
            </main>
        </div>
    );
}

export default App;
