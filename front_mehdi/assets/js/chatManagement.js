import globalVariables from './init.js';
import Conversations from './class/Conversation.js';
import { fetchData } from './api.js';;

async function fetchConversations() {
	try {
	  const username = globalVariables.currentUser.getUsername();
	  const data = await fetchData('/api/dashboard/conversations');
	  globalVariables.userConversations = new Conversations(username, data.data.conversations);
	} catch (error) {
	  console.error('Error fetching user data:', error);
	}
}

function sendMessage() {
	const to = document.getElementById("send-message-contact-id").textContent;
	const content = document.getElementById("send-message-input-id").value;

	// console.log(to);
    const data = {'to': to, 'content': content};
    if (globalVariables.activity && globalVariables.activity.socket.readyState === WebSocket.OPEN) {
        globalVariables.activity.socket.send(JSON.stringify({
            'event': 'chat',
            'data': data,
        }));
		globalVariables.userConversations.addMessageFromSocket(data);
    } else {
        console.error("Erreur lors de l'envoi du message : Websocket non connecté.");
    }
}

function scrollMessagesToBottom() {
    const messagesElement = document.getElementById("conversation-display-messages-id");
    messagesElement.scrollTop = messagesElement.scrollHeight;
}

export { fetchConversations, sendMessage, scrollMessagesToBottom };
