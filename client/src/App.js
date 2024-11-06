// client/src/App.js
import React, { useState, useEffect } from 'react';
import GenerateKeys from './GenerateKeys';
import UploadFile from './UploadFile';
import SignFile from './SignFile';
import Register from './Register';
import Login from './Login';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUsername('');
    };

    return (
        <div className="App">
            <header>
                <h1>Aplicación de Llaves RSA</h1>
                {isAuthenticated && <button onClick={handleLogout}>Cerrar Sesión</button>}
            </header>
            <main>
                {!isAuthenticated ? (
                    <>
                        <Register />
                        <Login setIsAuthenticated={setIsAuthenticated} />
                    </>
                ) : (
                    <>
                        <GenerateKeys username={username} />
                        <UploadFile username={username} />
                        <SignFile username={username} />
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
