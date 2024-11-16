
import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GenerateKeys from './GenerateKeys';
import UploadFile from './UploadFile';
import SignFile from './SignFile';
import VerifySignature from './VerifySignature';
import Register from './Register';
import Login from './Login';
import './App.css';

function App() {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const GOOGLE_CLIENT_ID = "492940885368-qhh1peme5cj28nvm061894qoalq2qgtb.apps.googleusercontent.com";

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (storedToken) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
            setToken(storedToken);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/users/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUsername('');
        setToken('');
    };

    return (
        <div className="App">
            <header>
                <h1 class="display-1">Aplicación de Llaves RSA</h1>
                {isAuthenticated && <button class="btn btn-secondary" onClick={handleLogout}>Cerrar Sesión</button>}
            </header>
            <main>
                {!isAuthenticated ? (
                    <>
                        <Register />
                        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} token={token}>
                            <Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} setToken={setToken} />
                        </GoogleOAuthProvider>
                    </>
                ) : (
                    <>
                        <GenerateKeys token={token} />
                        <UploadFile token={token} />
                        <SignFile token={token} />
                        <VerifySignature token={token} />
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
