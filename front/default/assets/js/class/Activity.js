import globalVariables from '/static/default/assets/js/init.js';
import Alerts from '/static/default/assets/js/class/Alerts.js';
import { updateProfileStatus } from '/static/default/assets/js/spaManagement/div/createProfil.js';

class Activity {
	constructor() {
		this.socket = new WebSocket('wss://' + window.location.host + '/api/activity/');

		this.socket.onopen = (e) => {
			// console.log("Activity websocket connected !");
		};

		this.socket.onmessage = (e) => {
			const eventData = JSON.parse(e.data);
			const event = eventData.event;
			const data = eventData.data;
		
			console.log(eventData)
			if (event === 'state') {
				globalVariables.currentUser.setFriendStatus(data.user, data.state.toLowerCase());
				if (window.location.pathname + window.location.search === '/profil?username=' + data.user && globalVariables.currentScene === 'profil')
					updateProfileStatus(data.state.toLowerCase())
			} else if (event === 'chat') {
				if (globalVariables.userConversations) {
					if (window.location.pathname + window.location.search != '/chat?with=' + data.from) {
						Alerts.createAlert(Alerts.type.MESSAGE, "Message from " + data.from)
						globalVariables.userConversations.addMessageFromSocket(data, false, true);
					} else {
						globalVariables.userConversations.addMessageFromSocket(data, true, true);
					}
				}
			} else if (event === 'friends') {
				Alerts.createAlert(Alerts.type.MESSAGE, 'Friends relation ' + data.action + ' from ' + data.from);
				switch (data.action) {
					case 'received':
						globalVariables.currentUser.addPendingFriendFrom(data.from);
						if (globalVariables.userConversations)
							globalVariables.userConversations.addNewConversationFromSocket(data.from);
						break;
					case 'accepted':
						globalVariables.currentUser.addFriend(data.from);
						break;
					case 'ended':
						globalVariables.currentUser.removeFriend(data.from);
						break;
				}
				// console.log("Websocket: friends request received from:" + data.from);
			}
		};
	}

	close() {
		if (this.socket.readyState === WebSocket.OPEN)
			this.socket.close();
		// console.log("Activity socket closed");
	}
}

export default Activity;
