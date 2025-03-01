import { getRandomMessage } from './googleSheetsService.js';
import whatsappService from './whatsappService.js';

class RandomMessageService {
    constructor() {
        this.activeTimers = new Map();
    }

    startSingleMessageTimer(fromNumber, delay = 180000) {  // Cambio de nombre y parámetro para claridad
        if (this.activeTimers.has(fromNumber)) {
            clearTimeout(this.activeTimers.get(fromNumber));
        }

        const timerId = setTimeout(async () => {
            const message = await getRandomMessage();
            if (message) {
                await whatsappService.sendMessage(fromNumber, message);
            }
            this.activeTimers.delete(fromNumber);  // Asegurarse de limpiar después de enviar
        }, delay);

        this.activeTimers.set(fromNumber, timerId);
    }

    stopMessageTimer(fromNumber) {
        if (this.activeTimers.has(fromNumber)) {
            clearTimeout(this.activeTimers.get(fromNumber));
            this.activeTimers.delete(fromNumber);
        }
    }
}

const randomMessageService = new RandomMessageService();
export { randomMessageService };
