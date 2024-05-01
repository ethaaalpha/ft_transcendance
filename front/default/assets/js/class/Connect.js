import globalVariables from '../init.js';

class Connect {
	constructor() {
		this.socket = new WebSocket('wss://' + window.location.host + '/api/activity/');

		this.socket.onopen = (e) => {
			console.log("Websocket: 'activity' is connected");
		};

		this.socket.onmessage = (e) => {
			const eventData = JSON.parse(e.data);
			const event = eventData.event;
			const data = eventData.data;
		
			if (event === 'state') {
				console.log("Websocket: state message");
			} else if (event === 'chat') {
				if (globalVariables.userConversations) {
					globalVariables.userConversations.addMessageFromSocket(data);
				} else {
					console.log("globalVariables.userConversations is undefined");
				}
			} else if (event === 'friends') {
				// alert
				console.log("Websocket: friends request received from:" + data.from);
			}
		};

		this.socket.onclose = (e) => {
			console.error('Websocket: Chat socket closed unexpectedly. Retrying to connect.');
			setTimeout(() => {
				this.connect();
			}, 1000);
		};
	}
}

export default Connect;
