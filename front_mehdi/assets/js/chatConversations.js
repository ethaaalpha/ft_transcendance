
let chatConversations;

function createChat() {
	createConversations();
	// buildConversation();
	
}

// create conv

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
	
		this.conversations[target].push(message);
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

function createConversations() {
	fetchData('/api/dashboard/conversations')
	.then(data => {
		// console.log('Données de l\'API :', data.data);
		chatConversations = new Conversations("mehdi", data.data.conversations);;
		// chatConversations.displayConversations();//to delete
		buildConversation();
	})
	.catch(error => {
		console.error('Error fetching user data:', error);
	});
}

//build conv (with div)

function buildConversation() {
	const conversationList = document.getElementById("conversationList");

	// Assurez-vous que chatConversations est défini
	if (!chatConversations) {
		console.error("chatConversations n'est pas défini.");
		return;
	}

	// Parcourez chaque conversation dans chatConversations
	for (let user in chatConversations.conversations) {
		if (chatConversations.conversations.hasOwnProperty(user)) {
			// Créez un élément de bouton pour cette conversation
			const conversationButton = document.createElement("button");
			conversationButton.textContent = user; // Nom de l'utilisateur avec qui la conversation a lieu
			conversationButton.classList.add("conversation-button");

			// Ajoutez un écouteur d'événements pour ouvrir la conversation au clic
			conversationButton.addEventListener("click", function() {
				displayConversation(user);
			});

			// Ajoutez le bouton à la liste des conversations
			conversationList.appendChild(conversationButton);
		}
	}
}

function displayConversation(user) {
    const conversation = chatConversations.getConversation(user);
    const conversationDisplay = document.getElementById("conversationDisplay");
    conversationDisplay.innerHTML = ""; // Efface le contenu précédent

    // Parcourez chaque message dans la conversation et affichez-le
    conversation.forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.textContent = `${message.sender} (${message.sendAt}): ${message.content}`;
        conversationDisplay.appendChild(messageElement);
    });
}
