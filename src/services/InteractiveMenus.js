class InteractiveMenus {
    constructor() {
        this.menuFunctions = {
            'menuPrincipal': this.sendMainMenu.bind(this)
        };
        this.sendInteractiveMenu = this.sendInteractiveMenu.bind(this);
    }

    async sendMainMenu(to) {
        const headerText = '📌 Menú Principal';
        const bodyText = 'Seleccione una de las siguientes opciones:';
        const footerText = 'Estoy aquí para ayudarle';
        const buttonText = 'Ver Opciones';
        const sections = [
            {
                title: 'Categorías',
                rows: [
                    { id: 'info', title: 'ℹ️ Información', description: 'Consulta información relevante' },
                    { id: 'contacto', title: '📞 Contacto', description: 'Accede a datos de contacto' },
                    { id: 'soporte', title: '🛠 Soporte', description: 'Obtén asistencia técnica' }
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
