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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/user-files`, {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/users`, {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/share`, {
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
        <div class="mb-5 w-50 border-bottom-1">
            <h2 class="h2">Compartir Archivo</h2>
            <div class="row mb-3">
                <div class="col-lg-6">
                    <label class="form-label">Seleccionar Archivo:</label>
                    <select class="form-select" onChange={(e) => setSelectedFile(e.target.value)} value={selectedFile}>
                        <option value="">-- Selecciona un archivo --</option>
                        {userFiles.map(file => (
                            <option key={file.id} value={file.id}>{file.nombre_archivo}</option>
                        ))}
                    </select>
                </div>
                <div class="col-lg-6">
                    <label class="form-label">Seleccionar Usuario:</label>
                    <select class="form-select" onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
                        <option value="">-- Selecciona un usuario --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label">¿Puede Firmar?:</label>
                <input 
                    type="checkbox"
                    class="form-check-input"
                    checked={canSign} 
                    onChange={() => setCanSign(!canSign)} 
                />
            </div>
            <button class="btn btn-secondary" onClick={handleShare}>Compartir Archivo</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ShareFile;
