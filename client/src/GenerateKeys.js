import { jwtDecode } from 'jwt-decode';

function GenerateKeys({ token }) {
    const handleGenerateKeys = async () => {
        try {

            console.log("Token recibido:", token);  // Verifica si el token está presente

            // Decodificar el token para obtener el username
            const decodedToken = jwtDecode(token);
            console.log("Token decodificado:", decodedToken);  // Verifica que el token se decodifique correctamente

            const username = decodedToken.username;
            if (!username) {
                throw new Error('Username no disponible en el token');
            }

            console.log("Username extraído del token:", username);  // Verifica que el username se extraiga correctamente

            const requestData = { username };

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/generate-keys`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  // Asegúrate de pasar el token en el header
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('Error al generar las llaves');
            }

            const data = await response.blob();
            console.log("Llave generada, descargando...", data);  // Verifica que se reciba la respuesta correctamente

            // Si es necesario, puedes procesar el archivo binario recibido (por ejemplo, descargarlo como archivo)
            const link = document.createElement('a');
            link.href = URL.createObjectURL(data);
            link.download = 'privateKey.pem';
            link.click();

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Generar Llaves RSA</h1>
            <button onClick={handleGenerateKeys}>Generar y Descargar Llaves</button>
        </div>
    );
}

export default GenerateKeys;
