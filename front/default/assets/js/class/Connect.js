import globalVariables from '../init.js';
import Alerts from './Alerts.js';

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
				globalVariables.currentUser.setFriendStatus(data.user, data.state.toLowerCase());
			} else if (event === 'chat') {
				if (globalVariables.userConversations) {
					if (window.location.pathname + window.location.search != '/chat?with=' + data.from) {
						Alerts.createAlert(Alerts.type.MESSAGE, "Message from " + data.from)
						globalVariables.userConversations.addMessageFromSocket(data, false, true);
					} else {
						globalVariables.userConversations.addMessageFromSocket(data, true, true);
					}
				} else {
					console.log("globalVariables.userConversations is undefined");
				}
			} else if (event === 'friends') {
				// alert
				Alerts.createAlert(Alerts.type.MESSAGE, 'Friends request ' + data.action + ' from ' + data.from);
				if (data.action == 'accepted') {
					globalVariables.currentUser.addFriend(data.from);
				}
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
