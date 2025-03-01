class InteractiveMenus {
    constructor() {
        this.menuFunctions = {
            'menuPrincipal': this.sendMainMenu.bind(this)
        };
        this.sendInteractiveMenu = this.sendInteractiveMenu.bind(this);
    }

    async sendMainMenu(to) {
        const headerText = '📌 Menú de Bienestar';
        const bodyText = 'Elige la opción que mejor describe cómo te sientes:';
        const footerText = 'Aurora está aquí para apoyarte 💙';
        const buttonText = 'Ver opciones';

        const sections = [
            {
                title: 'Tu bienestar emocional',
                rows: [
                    { id: 'urgent_support', title: '🆘 Necesito ayuda ya', description: 'Me siento abrumada y necesito apoyo' },
                    { id: 'emotional_check', title: '🤔 ¿Esto es normal?', description: 'Tengo dudas sobre mis emociones' },
                    { id: 'mental_health_info', title: '📖 Quiero aprender más', description: 'Conoce más sobre salud mental en el embarazo' },
                    { id: 'free_talk', title: '💬 Solo quiero hablar', description: 'Expresa lo que sientes sin juicios' }
                ]
            }
        ];

        try {
            await this.sendInteractiveMenu(to, headerText, bodyText, footerText, buttonText, sections);
            console.log('Menú principal enviado con éxito');
        } catch (error) {
            console.error('Error al enviar el menú interactivo:', error);
        }
    }

    async sendInteractiveMenu(to, headerText, bodyText, footerText, buttonText, sections) {
        try {
            await whatsappService.sendInteractiveListMessage(to, headerText, bodyText, footerText, sections, buttonText);
            console.log('Menú interactivo enviado');
        } catch (error) {
            console.error('Error al enviar el menú interactivo:', error);
        }
    }

    async executeMenuFunction(menuId, to) {
        const normalizedId = menuId.trim().toLowerCase();
        const menuFunction = this.menuFunctions[normalizedId];
        
        if (menuFunction) {
            await menuFunction(to);
        } else {
            await whatsappService.sendMessage(to, 'Opción no encontrada.');
        }
    }
}

export default InteractiveMenus;
