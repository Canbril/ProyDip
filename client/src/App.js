// client/src/App.js
import React from 'react';
import GenerateKeys from './GenerateKeys';
import './App.css';

function App() {
    return (
        <div className="App">
            <header>
                <h1>Aplicación de Generación de Llaves RSA</h1>
            </header>
            <main>
                <GenerateKeys />
            </main>
        </div>
    );
}

export default App;
