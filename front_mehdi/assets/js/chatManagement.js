
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

		// if (messageData.hasOwnProperty('from') && messageData.hasOwnProperty('to')) {
		const { from, to, content, sendAt } = messageData;
		let target = from === this.myUsername ? to : from;
	
		const message = { sender: from, content, sendAt };
	
		if (!this.conversations[target]) {
			this.conversations[target] = [];
		}
	
		this.conversations[target].unshift(message);

		// create div in conversation dynamically
		const conversationDisplay = document.getElementById("conversation-display");
		const messageElement = document.createElement("div");
		messageElement.textContent = message.content;

		if (message.sender === gChatConversations.myUsername) {
			messageElement.classList.add("message-sent");
		} else {
			messageElement.classList.add("message-received");
		}
		messageElement.classList.add("message-margin");
		conversationDisplay.appendChild(messageElement);

		// } else {
		// console.log('Le message reçu du socket ne contient pas les propriétés from et/ou to.');
		// }
	}

	getConversation(withUser) {
	  if (this.conversations[withUser]) {
		return this.conversations[withUser];
	  } else {
		console.log(`La conversation avec ${withUser} n'existe pas.`);
		return [];
	  }
	}

	displayConversations() { // to delete
		for (let target in this.conversations) {
		  if (this.conversations.hasOwnProperty(target)) {
			console.log(`Conversation avec ${target}:`);
			this.conversations[target].forEach(message => {
			console.log(`De ${message.sender} (${message.sendAt}): ${message.content}`);
			});
		  }
		}
	}
}  


function fetchUsername() {
	return new Promise((resolve, reject) => {
	  fetchData('/api/dashboard')
		.then(data => {
		  resolve(data.data['username']);
		})
		.catch(error => {
		  console.error('Error fetching user data:', error);
		  reject(error);
		});
	});
  }

async function fetchConversations() {
	try {
	  const username = await fetchUsername();
	  const data = await fetchData('/api/dashboard/conversations');
	  gChatConversations = new Conversations(username, data.data.conversations);
	} catch (error) {
	  console.error('Error fetching user data:', error);
	}
}

function sendMessage() {
	const to = document.getElementById("send-message-contact-id").textContent;
	const content = document.getElementById("send-message-input-id").value;

	console.log(to);
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
	// console.log("Jessaie de send");
}

class connect {
	constructor() {
		this.socket = new WebSocket('wss://' + window.location.host + '/api/activity/');

		this.socket.onopen = (e) => {
			console.log("Le websocket 'activity' est bien connecté !");
		};

		this.socket.onmessage = (e) => {
			const data = JSON.parse(e.data);
			if (gChatConversations) {
				gChatConversations.addMessageFromSocket(data.data);
			  } else {
				console.log("gChatConversations est undefined");
			  }
			console.log("j'ai reçu message ici !");
		};

		this.socket.onclose = (e) => {
			console.error('Chat socket closed unexpectedly ! Retrying to connect !');
			setTimeout(() => {
				this.connect();
			}, 1000);
		};
	}
}

activity = new connect();
