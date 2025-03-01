import { google } from 'googleapis';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Configurar el cliente de autenticación de Google Sheets con credenciales de entorno
const googleSheetsClient = new google.auth.GoogleAuth({
    credentials: {
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL        
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

// Obtener un cliente autenticado de Google Sheets API
async function getGoogleSheetAPI() {
    const client = await googleSheetsClient.getClient();
    return google.sheets({ version: 'v4', auth: client });
}


async function respuestadetrigger(triggerMessage) {
    const sheets = google.sheets({ version: 'v4', auth: await googleSheetsClient.getClient() });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'Respuestas!B:F'; // Asume que los triggers están en la columna B y las respuestas en C

    try {
        // Leer datos de la hoja de cálculo
        const result = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range
        });

        const rows = result.data.values || [];
        const normalizedMessage = triggerMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const messageWords = normalizedMessage.split(/\s+/);

        console.log('Mensaje recibido normalizado:', normalizedMessage);

        for (const row of rows) {
            if (!row[0] || !row[1] || !row[2]) continue; // Asegurar que la fila tenga los datos necesarios

            // Normalizar los triggers (pueden ser frases completas o palabras sueltas)
            const triggers = row[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(',').map(t => t.trim());

            // Depuración: Verificar los triggers actuales con los que se está comparando
            console.log(`Comparando el mensaje recibido: "${normalizedMessage}" con los triggers:`, triggers);

            // **Comparación de frases completas**
            if (triggers.includes(normalizedMessage)) {
                console.log("Se encontró coincidencia exacta con una frase completa.");
                return {
                    message: row[1], // Respuesta
                    type: (row[2] || 'text').trim().toLowerCase(), // Tipo de respuesta
                    caption: row[3] || "", // Subtítulo, si existe
                    url: row[4] || "" // URL, si existe
                };
            }

            // **Comparación de palabras individuales**
            if (messageWords.some(word => triggers.includes(word))) {
                console.log("Se encontró coincidencia con una palabra individual.");
                return {
                    message: row[1], // Respuesta
                    type: (row[2] || 'text').trim().toLowerCase(), // Tipo de respuesta
                    caption: row[3] || "", // Subtítulo, si existe
                    url: row[4] || "" // URL, si existe
                };
            }
        }

        console.log('No se encontraron coincidencias de triggers en el mensaje.');
        return null;
    } catch (error) {
        console.error('Error leyendo los datos de la hoja de cálculo:', error);
        return null;
    }
}


// Función para obtener un mensaje aleatorio desde la hoja 'mensajes'
async function getRandomMessage() {
    const sheets = await getGoogleSheetAPI();
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'mensajes!A:A';

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range
        });

        const rows = response.data.values;
        if (rows.length) {
            const randomIndex = Math.floor(Math.random() * rows.length);
            return rows[randomIndex][0];
        }
        return 'No messages available.';
    } catch (error) {
        console.error('Error retrieving random message from Google Sheets:', error);
        return 'Error retrieving messages.';
    }
}

async function isPhoneNumberRegistered(phoneNumber) {
    const sheets = await getGoogleSheetAPI();
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'Usuarios!C:C'; // Asumiendo que los números están en la columna C

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range
        });

        const phoneNumbers = response.data.values || [];
        return phoneNumbers.some(row => row[0] === phoneNumber);
    } catch (error) {
        console.error('Error al verificar el número de teléfono registrado:', error);
        return false;
    }
}

export { respuestadetrigger, getRandomMessage, isPhoneNumberRegistered};
