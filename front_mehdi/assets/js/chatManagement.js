
let gChatConversations;

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

		if (message.sender === gChatConversations.myUsername) {
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

async function fetchConversations() {
	try {
	  const username = await fetchCurrentUsername();
	  const data = await fetchData('/api/dashboard/conversations');
	  gChatConversations = new Conversations(username, data.data.conversations);
	} catch (error) {
	  console.error('Error fetching user data:', error);
	}
}

function sendMessage() {
	const to = document.getElementById("send-message-contact-id").textContent;
	const content = document.getElementById("send-message-input-id").value;

	// console.log(to);
    const data = {'to': to, 'content': content};
    if (activity && activity.socket.readyState === WebSocket.OPEN) {
        activity.socket.send(JSON.stringify({
            'event': 'chat',
            'data': data,
        }));
		gChatConversations.addMessageFromSocket(data);
    } else {
        console.error("Erreur lors de l'envoi du message : Websocket non connecté.");
    }
}

function scrollMessagesToBottom() {
    const messagesElement = document.getElementById("conversation-display-messages-id");
    messagesElement.scrollTop = messagesElement.scrollHeight;
}