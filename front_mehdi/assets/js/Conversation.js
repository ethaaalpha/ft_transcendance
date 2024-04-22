
import globalVariables from './main.js';

class Conversations {
	constructor(myUsername, conversations = {}) {
	  this.conversations = conversations;
	  this.myUsername = myUsername;
	}
  
	addMessage(from, to, content, sendAt) {
	  const message = { sender: from, content, sendAt: sendAt };
	  let target = from === this.myUsername ? to : from;
  
	  if (!this.conversations[target]) {
		this.conversations[target] = [];
	  }
  
	  this.conversations[target].push(message);
	}
  
	addMessageFromSocket(messageData) {
		console.log('messageData :', messageData);
	
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

		// create div in conversation dynamically, to move?
		const conversationDisplay = document.getElementById("conversation-display-messages-id");
		const messageElement = document.createElement("div");
		messageElement.textContent = message.content;

		if (message.sender === globalVariables.userConversations.myUsername) {
			messageElement.classList.add("message-sent");
		} else {
			messageElement.classList.add("message-received");
		}
		messageElement.classList.add("message-margin");
		conversationDisplay.appendChild(messageElement);
		scrollMessagesToBottom();
		
		let inputElement = document.getElementById("send-message-input-id");
		inputElement.value = "";

	}

	getConversation(withUser) {
	  if (this.conversations[withUser]) {
		return this.conversations[withUser];
	  } else {
		console.log(`La conversation avec ${withUser} n'existe pas.`);
		return [];
	  }
	}
}

export default Conversations;
