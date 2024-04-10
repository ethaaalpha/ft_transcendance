
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
		if (messageData.hasOwnProperty('from') && messageData.hasOwnProperty('to')) {
		const { from, to, content, sendAt } = messageData;
		let target = from === this.myUsername ? to : from;
	
		const message = { sender: from, content, sendAt };
	
		if (!this.conversations[target]) {
			this.conversations[target] = [];
		}
	
		this.conversations[target].unshift(message);
		} else {
		console.log('Le message reçu du socket ne contient pas les propriétés from et/ou to.');
		}
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


function fetchConversations() {
	return new Promise((resolve, reject) => {
		fetchData('/api/dashboard/conversations')
		.then(data => {
			gChatConversations = new Conversations("mehdi", data.data.conversations);
			resolve();
		})
		.catch(error => {
			console.error('Error fetching user data:', error);
			reject(error);
		});
	});
}

function sendMessage(to, content) {
    const data = {'to': to, 'content': content};
    if (activity && activity.socket.readyState === WebSocket.OPEN) {
        activity.socket.send(JSON.stringify({
            'event': 'chat',
            'data': data,
        }));
    } else {
        console.error("Erreur lors de l'envoi du message : Websocket non connecté.");
    }
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
