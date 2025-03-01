
import {respuestadetrigger, isPhoneNumberRegistered } from './googleSheetsService.js';
import whatsappService from './whatsappService.js';
import { randomMessageService } from './randomMessageService.js';
import InteractiveMenus from './InteractiveMenus.js'; // Asumiendo que los métodos de menú están en este archivo


class MessageHandler {
    constructor() {
      this.interactiveMenus = new InteractiveMenus(); // Instancia de los menús interactivos
  
    }
  
async handleIncomingMessage(message, senderInfo) {
    const fromNumber = message.from.slice(0, 2) + message.from.slice(3);

    // Extraer el contenido del mensaje
    const incomingMessage = message.type === "interactive" ? message.interactive.list_reply.id :
                            message.type === "text" ? message.text.body.toLowerCase().trim() :
                            null;

    if (!incomingMessage) {
        await whatsappService.sendMessage(fromNumber, "Mensaje no reconocido. Por favor, inténtalo nuevamente.");
        return;
    }

    // Verificar si el mensaje es un saludo o un comando de menú
    if (this.isGreeting(incomingMessage)) {
        await this.handleGreeting(fromNumber, senderInfo);
    } else if (this.isMenuCommand(incomingMessage)) {
        await this.interactiveMenus.sendMainMenu(fromNumber);
    } else {
        // Procesar mensajes interactivos y texto normalmente
        const response = await respuestadetrigger(incomingMessage);
        if (response) {
            await this.processResponse(response, fromNumber);
        } else {
            await whatsappService.sendMessage(fromNumber, "No puedo entender el mensaje. ¿Puedes intentar de nuevo? 😊");
        }
    }

    // Marcar el mensaje como leído después de procesar la respuesta
    await whatsappService.markAsRead(message.id);
}

isMenuCommand(incomingMessage) {
    const menuCommands = [
        "menu", "menú", "ver menú", "dame el menú", "quiero el menú", "opciones",
        "lista de opciones", "mostrar menú", "qué opciones hay", "dame opciones",
        "regresar", "volver", "atrás", "ir atrás", "volver al menú", "regresar al inicio",
        "regrésame", "cómo regreso", "quiero regresar", "inicio", "volver al inicio",
        "ir al inicio", "home", "empezar de nuevo", "volver a empezar", "quiero empezar",
        "dame inicio", "pásame el menú", "muéstrame opciones", "mándame el menú",
        "échame el menú", "otra vez el menú", "vuelve al inicio", "vamos al menú",
        "quiero opciones", "muéstrame qué hay"
    ];
    return menuCommands.some(cmd => incomingMessage.includes(cmd));
}

isGreeting(message) {
    const greetings = [
        "hola", "holaa", "holaaa", "ola", "alo", "holis", "holiwis", 
        "hello", "hi", "hey", "hi there", "hello there", "holi",
        "buenas", "buenos dias", "buenos días", "buen dia", "buen día", 
        "buenas tardes", "buenas noches", 
        "qué tal", "que tal", "cómo estás", "como estas", "qué onda", "que onda",
        "qué pasó", "que paso", "qué hay", "que hay", "qué hubo", "que hubo",
        "qué rollo", "que rollo", "qué tranza", "que tranza", "qué pex", "que pex",
        "qué pedo", "que pedo", "qué show", "que show", 
        "saludos", "cómo andas", "como andas", "cómo te va", "como te va",
        "qué pedo compa", "que pedo compa", "qué pasó amigo", "que paso amigo",
        "qué tal amigo", "que tal amigo", "buenas mi gente", "qué onda banda",
        "que onda banda", "qué hubo raza", "que hubo raza"
    ];
    return greetings.some(greeting => message.includes(greeting));
}

async handleGreeting(fromNumber, senderInfo) {
    const name = senderInfo?.profile?.name || "amigx";
    await whatsappService.sendMessage(fromNumber, `¡🌸 Hola ${name}! *Soy Aurora, tu compañera en este camino de maternidad.* 🤰💖 Estoy aquí para escucharte, acompañarte y brindarte información útil en cada etapa de tu embarazo. Escríbeme cuando lo necesites o explora el menú para descubrir cómo puedo apoyarte.`);
}

async processResponse(response, fromNumber) {
    switch (response.type) {
        case 'text':
            await whatsappService.sendMessage(fromNumber, response.message);
            break;
        case 'image':
        case 'video':
        case 'document':
            await whatsappService.sendMediaMessage(fromNumber, response.type, response.url, response.caption);
            break;
        default:
            await whatsappService.sendMessage(fromNumber, "Tipo de respuesta no soportado.");
            break;
    }
}


   async processResponse(response, fromNumber) {
          if (!response) {
              await whatsappService.sendMessage(fromNumber, "Detalla más tu consulta :)");
              return;
          }
  
          switch (response.type) {
              case 'text':
                  await whatsappService.sendMessage(fromNumber, response.message);
                  randomMessageService.startSingleMessageTimer(fromNumber);

                  break;
              case 'image':
                  await whatsappService.sendMediaMessage(fromNumber, 'image', response.url, response.caption);
                  randomMessageService.startSingleMessageTimer(fromNumber);
                  break;
              case 'video':
                  await whatsappService.sendMediaMessage(fromNumber, 'video', response.url, response.caption);
                  randomMessageService.startSingleMessageTimer(fromNumber);
                  break;
              case 'document':
                  await whatsappService.sendMediaMessage(fromNumber, 'document', response.url, response.caption);
                  randomMessageService.startSingleMessageTimer(fromNumber);
                  break;
              case 'menu':
                  await this.interactiveMenus.executeMenuFunction(response.message, fromNumber);
                  randomMessageService.startSingleMessageTimer(fromNumber);
                  break;
              default:
                  await whatsappService.sendMessage(fromNumber, "Tipo de respuesta no soportado.");
                  break;
          }
  
      }
  

    
    async handleInteractiveResponse(action, fromNumber) {
          const response = await this.interactiveMenus.respuestadetrigger(action);
          await this.processResponse(response, fromNumber);
      }
 }  
export default new MessageHandler();

