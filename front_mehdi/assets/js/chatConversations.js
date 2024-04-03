 
  // et du coup de mon cote faire appel a l'api pour actualiser les infos quand je clique sur le bouton d'une scene, et creer les div a ce moment la seulement, puis supprimer ces div quand je revient en arriere. 
  // OU je stocke rien. Uniquement un tampon pour le chat quand je suis sur la page (conversation + status de conexion des amis(qui peut changer en fonction de ce que renvoi le ws)), sinon je supprime quand pas sur chat?, et a chaque fois sur un profil requete a l'api pour les infos.
  // quand demande damis creer message "Wanna be friends?" et checker status du message de retour

//   class Conversations {
// 	constructor(conversations = {}) {
// 	  this.conversations = conversations;
// 	}
  
// 	addMessage(from, to, content, sendAt) {
// 		const message = { sender: from, content, sendAt: sendAt };
// 		let target = from === this.myUsername ? to : from;
	
// 		if (!this.conversations[target]) {
// 		  this.conversations[target] = [];
// 		}
	
// 		this.conversations[target].push(message);
// 	  }

// 	getConversation(withUser) {
// 	  if (this.conversations[withUser]) {
// 		return this.conversations[withUser];
// 	  } else {
// 		console.log(`La conversation avec ${withUser} n'existe pas.`);
// 		return [];
// 	  }
// 	}
//   }
  
//   // Exemple d'utilisation avec les données du JSON
//   const conversationsJson = {
// 	"42_ebi": [
// 	  {"sender": "42_ebi", "content": "Bonjour comment ça", "sendAt": "2024-04-02T20:18:36.597Z"},
// 	  {"sender": "nmilan", "content": "Très bien merci", "sendAt": "2024-04-02T20:17:38.013Z"},
// 	  {"sender": "nmilan", "content": "Quel est ton", "sendAt": "2024-04-02T20:17:36.966Z"},
// 	  {"sender": "nmilan", "content": "temps préféré de", "sendAt": "2024-04-02T20:17:35.844Z"},
// 	  {"sender": "nmilan", "content": "manger des frites", "sendAt": "2024-04-02T20:17:34.912Z"},
// 	  {"sender": "nmilan", "content": "au restaurant ?", "sendAt": "2024-04-02T20:17:23.960Z"},
// 	  {"sender": "42_ebi", "content": "J'aime manger pizza", "sendAt": "2024-04-02T20:12:33.794Z"}
// 	],
// 	"mdesma": [
// 	  {"sender": "mdesma", "content": "Quel est ton", "sendAt": "2024-04-02T20:14:36.597Z"},
// 	  {"sender": "nmilan", "content": "film préféré ?", "sendAt": "2024-04-02T20:13:38.013Z"},
// 	  {"sender": "mdesma", "content": "J'aime beaucoup les", "sendAt": "2024-04-02T20:12:36.966Z"},
// 	  {"sender": "nmilan", "content": "classiques comme Pulp", "sendAt": "2024-04-02T20:11:35.844Z"},
// 	  {"sender": "mdesma", "content": "Fiction et The Godfather", "sendAt": "2024-04-02T20:10:34.912Z"},
// 	  {"sender": "nmilan", "content": "Et toi ?", "sendAt": "2024-04-02T20:09:23.960Z"},
// 	  {"sender": "mdesma", "content": "Je préfère les", "sendAt": "2024-04-02T20:08:33.794Z"}
// 	],
// 	"thwang": [
// 	  {"sender": "nmilan", "content": "Ceci est un", "sendAt": "2024-04-02T20:05:36.597Z"},
// 	  {"sender": "thwang", "content": "nouveau message", "sendAt": "2024-04-02T20:04:38.013Z"},
// 	  {"sender": "nmilan", "content": "dans la troisième", "sendAt": "2024-04-02T20:03:36.966Z"},
// 	  {"sender": "thwang", "content": "conversation.", "sendAt": "2024-04-02T20:02:35.844Z"},
// 	  {"sender": "nmilan", "content": "Alternant entre nous", "sendAt": "2024-04-02T20:01:34.912Z"},
// 	  {"sender": "thwang", "content": "pour les messages.", "sendAt": "2024-04-02T20:00:23.960Z"},
// 	  {"sender": "nmilan", "content": "C'est intéressant !", "sendAt": "2024-04-02T19:59:33.794Z"}
// 	]
//   };
  
//   // Création de toutes les conversations à partir du JSON
//   const chatConversations = new Conversations(conversationsJson);
  
//   // Ajout de nouveaux messages à une conversation spécifique
//   chatConversations.addMessage("42_ebi", "nmilan", "J'aime manger pizza", "2024-04-02T20:12:33.794Z");
//   chatConversations.addMessage("nmilan", "42_ebi", "Pizza Hawaïenne est super !", "2024-04-02T20:12:34.794Z");
//   chatConversations.addMessage("mdesma", "nmilan", "J'aime beaucoup les classiques comme Pulp Fiction et The Godfather", "2024-04-02T19:59:33.794Z");
  
//   // Récupération des messages d'une conversation spécifique
//   console.log("Messages de la conversation avec 42_ebi :", chatConversations.getConversation("42_ebi"));
//   console.log("Messages de la conversation avec mdesma :", chatConversations.getConversation("mdesma"));
//   console.log("Messages de la conversation avec thwang :", chatConversations.getConversation("thwang"));
  

  










  /////





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

	//fot test
	displayConversations() {
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
  













// get http
function createConversations() {
	fetchData('/api/dashboard/conversations')
	.then(data => {
		// console.log(data.data);
		console.log('Données de l\'API :', data.data); // Ajouter ce console.log pour vérifier la structure des données
		chatConversations = new Conversations("ethan", data.data.conversations);
		test();
		// console.log("Messages de la conversation avec mehdi :", chatConversations.getConversation("mehdi"));
		chatConversations.displayConversations();
	})
	.catch(error => {
		console.error('Error fetching user data:', error);
	});
}



let chatConversations;
createConversations();



// TEST

function test() {

//   // Exemple d'utilisation avec les données du JSON
//   const conversationsJson = {
// 	"42_ebi": [
// 	  {"sender": "42_ebi", "content": "Bonjour comment ça", "sendAt": "2024-04-02T20:18:36.597Z"},
// 	  {"sender": "nmilan", "content": "Très bien merci", "sendAt": "2024-04-02T20:17:38.013Z"},
// 	  {"sender": "nmilan", "content": "Quel est ton", "sendAt": "2024-04-02T20:17:36.966Z"},
// 	  {"sender": "nmilan", "content": "temps préféré de", "sendAt": "2024-04-02T20:17:35.844Z"},
// 	  {"sender": "nmilan", "content": "manger des frites", "sendAt": "2024-04-02T20:17:34.912Z"},
// 	  {"sender": "nmilan", "content": "au restaurant ?", "sendAt": "2024-04-02T20:17:23.960Z"},
// 	  {"sender": "42_ebi", "content": "J'aime manger pizza", "sendAt": "2024-04-02T20:12:33.794Z"}
// 	],
// 	"mdesma": [
// 	  {"sender": "mdesma", "content": "Quel est ton", "sendAt": "2024-04-02T20:14:36.597Z"},
// 	  {"sender": "nmilan", "content": "film préféré ?", "sendAt": "2024-04-02T20:13:38.013Z"},
// 	  {"sender": "mdesma", "content": "J'aime beaucoup les", "sendAt": "2024-04-02T20:12:36.966Z"},
// 	  {"sender": "nmilan", "content": "classiques comme Pulp", "sendAt": "2024-04-02T20:11:35.844Z"},
// 	  {"sender": "mdesma", "content": "Fiction et The Godfather", "sendAt": "2024-04-02T20:10:34.912Z"},
// 	  {"sender": "nmilan", "content": "Et toi ?", "sendAt": "2024-04-02T20:09:23.960Z"},
// 	  {"sender": "mdesma", "content": "Je préfère les", "sendAt": "2024-04-02T20:08:33.794Z"}
// 	],
// 	"thwang": [
// 	  {"sender": "nmilan", "content": "Ceci est un", "sendAt": "2024-04-02T20:05:36.597Z"},
// 	  {"sender": "thwang", "content": "nouveau message", "sendAt": "2024-04-02T20:04:38.013Z"},
// 	  {"sender": "nmilan", "content": "dans la troisième", "sendAt": "2024-04-02T20:03:36.966Z"},
// 	  {"sender": "thwang", "content": "conversation.", "sendAt": "2024-04-02T20:02:35.844Z"},
// 	  {"sender": "nmilan", "content": "Alternant entre nous", "sendAt": "2024-04-02T20:01:34.912Z"},
// 	  {"sender": "thwang", "content": "pour les messages.", "sendAt": "2024-04-02T20:00:23.960Z"},
// 	  {"sender": "nmilan", "content": "C'est intéressant !", "sendAt": "2024-04-02T19:59:33.794Z"}
// 	]
//   };
  
//   // Création de toutes les conversations à partir du JSON
//   const chatConversations = new Conversations("nmilan",conversationsJson);
  
//   // Ajout de nouveaux messages à une conversation spécifique
//   chatConversations.addMessage("42_ebi", "nmilan", "J'aime manger patate", "2024-04-02T20:12:33.794Z");
//   chatConversations.addMessage("nmilan", "42_ebi", "Pizza Hawaïenne est super !", "2024-04-02T20:12:34.794Z");
//   chatConversations.addMessage("mdesma", "nmilan", "J'aime beaucoup les classiques comme Pulp Fiction et The Godfather", "2024-04-02T19:59:33.794Z");
  
//   // Récupération des messages d'une conversation spécifique
//   console.log("Messages de la conversation avec 42_ebi :", chatConversations.getConversation("42_ebi"));
//   console.log("Messages de la conversation avec mdesma :", chatConversations.getConversation("mdesma"));
//   console.log("Messages de la conversation avec thwang :", chatConversations.getConversation("thwang"));
  
//   // Exemple d'ajout de message à partir de données de websocket
const newMessageFromSocket = {
	'from': 'merde',
	'to': 'ethan',
	'content': 'Nouveau message du websocket !',
	'sendAt': '2024-04-03T12:00:00.000Z'
  };
  
  chatConversations.addMessageFromSocket(newMessageFromSocket);
  
//   // Vérification de la conversation mise à jour
//   console.log("Messages de la conversation avec 42_ebi :", chatConversations.getConversation("42_ebi"));
  
}