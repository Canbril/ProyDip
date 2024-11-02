// client/src/App.js
import React, { useState, useEffect } from 'react';
import GenerateKeys from './GenerateKeys';
import Register from './Register';
import Login from './Login';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Verificar token en el almacenamiento local al cargar la app
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
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
                    <GenerateKeys />
                )}
            </main>
        </div>
    );
}

export default App;
