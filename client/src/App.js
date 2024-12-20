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

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (storedToken) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
            setToken(storedToken);
        }
    }, []);

    const handleLogout = () => {
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
                        <GoogleOAuthProvider clientId="230512244860-v5qbv35tbha8hgj4kh99uuhf6cdap9kq.apps.googleusercontent.com">
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
