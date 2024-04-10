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
