import axios from 'axios';
import config from '../config/env.js';

class WhatsAppService {
async sendMessage(to, body, messageId = null) {
    if (!to || !body) {
        console.error('❌ Error: "to" y "body" son obligatorios.');
        return;
    }
    const phoneNumber = to.toString().trim();

    const data = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text', 
        text: { body: body.trim() } 
    };

    if (messageId) {
        data.context = { message_id: messageId };
    }

    console.log("📤 Enviando mensaje a WhatsApp API:", JSON.stringify(data, null, 2)); // Debug

    try {
        const response = await axios({
            method: 'POST',
            url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
            headers: {
                Authorization: `Bearer ${config.API_TOKEN}`,
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            },
            data: data
        });

        console.log('✅ Mensaje enviado con éxito:', response.data);
    } catch (error) {
        console.error('❌ Error enviando mensaje:', error.response?.data || error.message);
    }
}

  async markAsRead(messageId) {
    try {
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  async snedInteractiveButtons(to,BodyText,buttons){
    try{
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive : {
            type: 'button',
            body:{ text: BodyText},
            action:{
              buttons: buttons  
            }
          }

        },
      });
    } catch(error){
      console.error(error);

    }
  }
  async sendMediaMessage(to, type, mediaUrl, caption) {
    try {
        const mediaObject = {};
        switch (type) {
            case 'image':
                mediaObject.image = { link: mediaUrl, caption: caption };
                break;
            case 'video':
              mediaObject.video = { link: mediaUrl, caption: caption }
              break;
            case 'document':
                          // Extraer la última parte del URL (después del último '/')
              const urlParts = mediaUrl.split('/');
              const filename = urlParts[urlParts.length - 1]; // Obtiene la última parte de la URL
              mediaObject.document = { link: mediaUrl, caption: caption, filename: filename };
              break;
            
            default:
                throw new Error('Not Supported Media Type');
        }

        console.log('Sending media message:', { to, type, mediaObject });

        const response = await axios({
            method: 'POST',
            url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
            headers: {
                Authorization: `Bearer ${config.API_TOKEN}`,
            },
            data: {
                messaging_product: 'whatsapp',
                to,
                type,
                ...mediaObject,
            },
        });

        console.log('Media message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending media message:', error.response?.data || error.message);
    }
}

 async sendInteractiveListMessage(to, headerText, bodyText, footerText, sections, buttonText) {
  try {
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
      headers: {
        Authorization: `Bearer ${config.API_TOKEN}`,
      },
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'list',
          header: {
            type: 'text',
            text: headerText
          },
          body: {
            text: bodyText
          },
          footer: {
            text: footerText
          },
          action: {
            sections: sections,
            button: buttonText
          }
        }
      },
    });
    console.log('Interactive list message sent successfully');
  } catch (error) {
    console.error('Error sending interactive list message:', error.response?.data || error.message);
  }
}

}

export default new WhatsAppService();
