import { createGameRequestItem } from '/static/default/assets/js/spaManagement/div/createConversationDisplay.js';
import globalVariables from '/static/default/assets/js/init.js';
import { createConversationItem } from '/static/default/assets/js/spaManagement/div/createConversationList.js';

class Conversations {
	constructor(myUsername, conversations = {}) {
		this.conversations = conversations;
		this.myUsername = myUsername;
	}

	addMessageFromSocket(messageData, display, received = false, type = 0) {		
		if (!messageData.hasOwnProperty('from') && !messageData.hasOwnProperty('sendAt')) {
			messageData.from = this.myUsername;
			messageData.sendAt = new Date();
		}

		const { from, to, content, sendAt } = messageData;
		let target = from === this.myUsername ? to : from;
		const message = { sender: from, content, sendAt };
	
		if (!this.conversations[target]) {
			this.conversations[target] = [];
		}
		this.conversations[target].unshift(message);

		if (display) {
			const conversationDisplay = document.getElementById("conversation-display-messages-id");
			const messageElement = document.createElement("div");
			const messageText = document.createElement('span');
			messageText.textContent = message.content;
			messageElement.appendChild(messageText)

			if (message.sender === this.myUsername) {
				messageElement.classList.add("message-sent", "message");
			} else {
				messageElement.classList.add("message-received", "message");
			}

			conversationDisplay.appendChild(messageElement);
			this.scrollMessagesToBottom(false);
		}
		
		if (!received) {
			let inputElement = document.getElementById("send-message-input-id");
			inputElement.value = "";
		}
	}

	async addNewConversationFromSocket(from) {
		const conversationList = document.getElementById("conversation-list");

		if (window.location.pathname + window.location.search === '/') {
			await createConversationItem(conversationList, from, true)
		}
	}

	addGameInviteFromSocket(from, received) {
		if (window.location.pathname + window.location.search === '/chat?with=' + from) {
			const conversationDisplay = document.getElementById("conversation-display-messages-id");
			createGameRequestItem(from, conversationDisplay, received);
		}
	}

	addMessageFromGameSocket(messageData, received = false) {
		if (!globalVariables.isInGame)
			return
		if (!messageData.hasOwnProperty('from') && !messageData.hasOwnProperty('sendAt')) {
			messageData.from = this.myUsername;
			messageData.sendAt = new Date();
		}
	
		const { from, content, sendAt } = messageData;
		const message = { sender: from, content, sendAt };
	
		const conversationDisplay = document.getElementById("in-game-conversation-display-messages-id");
		const messageElement = document.createElement("div");
		const messageText = document.createElement('span');
		messageText.textContent = message.content;
		messageElement.appendChild(messageText)

		if (message.sender === this.myUsername) {
			messageElement.classList.add("message-sent", "message");
		} else {
			messageElement.classList.add("message-received", "message");
		}
	
		conversationDisplay.appendChild(messageElement);
		this.scrollMessagesToBottom(true);
		
		if (!received) {
			let inputElement = document.getElementById("in-game-send-message-input-id");
			inputElement.value = "";
		}
	}

	scrollMessagesToBottom(inGame) {
		let messagesElement = null;

		if (inGame) {
			messagesElement = document.getElementById("in-game-conversation-display-messages-id");
		} else {
			messagesElement = document.getElementById("conversation-display-messages-id");
		}
		messagesElement.scrollTop = messagesElement.scrollHeight;
	}

	getConversation(withUser) {
		if (this.conversations[withUser]) {
			return this.conversations[withUser];
		} else {
			return [];
		}
	}
}

export default Conversations;
