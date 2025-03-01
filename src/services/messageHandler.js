import { respuestadetrigger } from './googleSheetsService.js';
import whatsappService from './whatsappService.js';

class MessageHandler {
    constructor() {}

    async handleIncomingMessage(message, senderInfo) {
        const fromNumber = message.from.slice(0, 2) + message.from.slice(3);

        console.log("📩 Mensaje recibido de:", fromNumber); // Depuración

        // Extraer contenido del mensaje
        const incomingMessage = message.type === "text" ? message.text.body.toLowerCase().trim() : null;

        console.log("📩 Contenido del mensaje:", incomingMessage); // Depuración

        if (!incomingMessage) {
            console.log("⚠️ Mensaje vacío o no reconocido.");
            await whatsappService.sendMessage(fromNumber, "Mensaje no reconocido. Por favor, inténtalo nuevamente.");
            return;
        }

        // ✅ Si el usuario dice "hola", responde con el mensaje de Aurora
        if (this.isSimpleGreeting(incomingMessage)) {
            console.log("✅ Mensaje identificado como saludo.");
            await this.handleSimpleGreeting(fromNumber, senderInfo);
        } else {
            console.log("⚠️ No es un saludo, no se responde.");
        }
    }

    // ✅ Solo detecta "hola" y algunas variantes
    isSimpleGreeting(message) {
        const simpleGreetings = ["hola", "holaa", "holaaa", "holis", "holiwis"];
        return simpleGreetings.includes(message);
    }

    // ✅ Solo responde con el mensaje de Aurora, sin menús ni interacciones extra
    async handleSimpleGreeting(fromNumber, senderInfo) {
        const name = senderInfo?.profile?.name || "amigx";
        
        console.log("📝 Marcando mensaje como leído...");
        await whatsappService.markAsRead(fromNumber); // ✅ Marca el mensaje como leído
    
        console.log("📝 Enviando respuesta de Aurora...");
        await whatsappService.sendMessage(fromNumber, `¡🌸 Hola ${name}! *Soy Aurora, tu compañera en este camino de maternidad.* 🤰💖\nEstoy aquí para escucharte, acompañarte y brindarte información útil en cada etapa de tu embarazo. Escríbeme cuando lo necesites.`);
        
        console.log("✅ Mensaje de Aurora enviado.");
    }

}

export default new MessageHandler();
