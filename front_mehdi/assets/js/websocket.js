import globalVariables from './main.js';

class connect {
	constructor() {
		this.socket = new WebSocket('wss://' + window.location.host + '/api/activity/');

		this.socket.onopen = (e) => {
			console.log("Le websocket 'activity' est bien connecté !");
		};

		this.socket.onmessage = (e) => {
			const eventData = JSON.parse(e.data);
			const event = eventData.event;
			const data = eventData.data;
		
			if (event === 'state') {
				console.log("state message");
			} else if (event === 'chat') {
				if (globalVariables.userConversations) {
					globalVariables.userConversations.addMessageFromSocket(data);
				} else {
					console.log("globalVariables.userConversations est undefined");
				}
			} else if (event === 'friends') {
				console.log("friends message");
			}
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
