import React, { useState, useEffect } from 'react';

const ShareFile = ({ token }) => {
    const [userFiles, setUserFiles] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [canSign, setCanSign] = useState(false);
    const [message, setMessage] = useState('');

    // Función para obtener los archivos del usuario
    const fetchUserFiles = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/files/user-files', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los archivos del usuario.');
            }

            const data = await response.json();
            setUserFiles(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Función para obtener la lista de usuarios
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/files/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Error al obtener la lista de usuarios.');
            }
    
            const data = await response.json();
            console.log('Usuarios obtenidos:', data); // Depuración
            setUsers(data);
        } catch (error) {
            console.error('Error en fetchUsers:', error);
        }
    };
    

    // Llama a las funciones al cargar el componente
    useEffect(() => {
        fetchUserFiles();
        fetchUsers();
    }, [token]);

    const handleShare = async () => {
        if (!selectedFile || !selectedUser) {
            setMessage('Selecciona un archivo y un usuario para compartir.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/files/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    archivo_id: selectedFile,
                    user_to_share_id: selectedUser,
                    puede_firmar: canSign
                })
            });

            const data = await response.json();
            setMessage(data.message || data.error);
        } catch (error) {
            console.error('Error al compartir el archivo:', error);
            setMessage('Error al compartir el archivo.');
        }
    };

    return (
        <div>
            <h2>Compartir Archivo</h2>
            <div>
                <label>Seleccionar Archivo:</label>
                <select onChange={(e) => setSelectedFile(e.target.value)} value={selectedFile}>
                    <option value="">-- Selecciona un archivo --</option>
                    {userFiles.map(file => (
                        <option key={file.id} value={file.id}>{file.nombre_archivo}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Seleccionar Usuario:</label>
                <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
                    <option value="">-- Selecciona un usuario --</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>¿Puede Firmar?:</label>
                <input 
                    type="checkbox" 
                    checked={canSign} 
                    onChange={() => setCanSign(!canSign)} 
                />
            </div>
            <button onClick={handleShare}>Compartir Archivo</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ShareFile;
