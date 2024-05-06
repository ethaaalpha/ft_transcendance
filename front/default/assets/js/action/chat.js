import globalVariables from '../init.js';
import Conversations from '../class/Conversation.js';
import { fetchData } from '../fetch/api.js';;
import User from '../class/User.js';
import Connect from '../class/Connect.js';
import Alerts from '../class/Alerts.js';
import { sendCoordination } from '../../../../pong3d/main.js';

async function fetchConversations() {
	try {
		const username = globalVariables.currentUser.getUsername();
		const data = await fetchData('/api/dashboard/conversations');
		globalVariables.userConversations = new Conversations(username, data.data.conversations);
	} catch (error) {
		Alerts.createAlert(Alerts.type.FAILED, data.data.message);
		console.error('Error fetching user data:', error);
	}
}

function sendMessage() {
	const to = document.getElementById("send-message-contact-id").textContent;
	const contentInput = document.getElementById("send-message-input-id");
	const content = contentInput.value.trim();

	if (content === "") {
		let inputElement = document.getElementById("send-message-input-id");
		inputElement.value = "";
		Alerts.createAlert(Alerts.type.FAILED, "Message is empty.");
		console.error("Error sending message: Message is empty.");
		return;
	}

	if (globalVariables.currentUser.isFriend(to) !== 'friend') {
		let inputElement = document.getElementById("send-message-input-id");
		inputElement.value = "";
		Alerts.createAlert(Alerts.type.FAILED, "You can only send messages to friends.");
		console.error("Error sending message: You can only send messages to friends.");
		return;
	}

	const data = {'to': to, 'content': content};
	if (globalVariables.activity && globalVariables.activity.socket.readyState === WebSocket.OPEN) {
		globalVariables.activity.socket.send(JSON.stringify({
			'event': 'chat',
			'data': data,
		}));
		globalVariables.userConversations.addMessageFromSocket(data, true);
	} else {
		Alerts.createAlert(Alerts.type.FAILED, "Websocket isn't connected.");
		console.error("Error sending message: Websocket not connected.");
	}
}

function sendMessageInGame() {
	const to = document.getElementById("in-game-send-message-contact-id").textContent;
	const contentInput = document.getElementById("in-game-send-message-input-id");
	const content = contentInput.value.trim();

	if (content === "") {
		let inputElement = document.getElementById("in-game-send-message-input-id");
		inputElement.value = "";
		Alerts.createAlert(Alerts.type.FAILED, "Message is empty.");
		console.error("Error sending message: Message is empty.");
		return;
	}

	const data = {'to': to, 'content': content};
	sendCoordination({
		'event': 'chat',
		'data': data,
	})
}

export { fetchConversations, sendMessage, sendMessageInGame };
