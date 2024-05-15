import globalVariables from '/static/default/assets/js/init.js';
import Conversations from '/static/default/assets/js/class/Conversation.js';
import { fetchData } from '/static/default/assets/js/fetch/api.js';;
import Alerts from '/static/default/assets/js/class/Alerts.js';

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
	let inputElement = document.getElementById("send-message-input-id");

	if (content === "") {
		inputElement.value = "";
		Alerts.createAlert(Alerts.type.FAILED, "Message is empty.");
		return;
	}

	if (globalVariables.currentUser.isFriend(to) !== 'friend') {
		Alerts.createAlert(Alerts.type.FAILED, "You can only send messages to friends.");
		console.error("Error sending message: You can only send messages to friends.");
		inputElement.value = "";
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
	let inputElement = document.getElementById("in-game-send-message-input-id");

	if (content === "") {
		inputElement.value = "";
		Alerts.createAlert(Alerts.type.FAILED, "Message is empty.");
		// console.error("Error sending message: Message is empty.");
		return;
	}
	inputElement.value = "";

	const data = {'from': globalVariables.currentUser.username, 'content': content};
	globalVariables.coordination.send({
		'event': 'chat',
		'data': data,
	})
	globalVariables.userConversations.addMessageFromGameSocket(data);
}

export { fetchConversations, sendMessage, sendMessageInGame };
