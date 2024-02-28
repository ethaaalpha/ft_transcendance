class activityWebsocket {

	connect() {
		this.socket = new WebSocket('wss://' + window.location.host + '/api/activity/');
		
		this.socket.onopen = function(e) {
			console.log("Le websocket 'activity' est bien connecté !")
		}
		
		// Juste pour debug
		this.socket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			const stringifiedData = JSON.stringify(data)
        	document.querySelector('#activity-log').value += stringifiedData +'\n';
		}
	}

	registerEvents() {
		this.socket.onclose = function(e) {
			console.error('Chat socket closed unexpectedly ! Retrying to connect !');
			setTimeout(function() {
				connect();
			}, 1000);
		};
		this.catchEventHTML();
	}

	catchEventHTML() {
		document.querySelector('#chat-message-submit').onclick = function(e) {
			const messageInputDom = document.querySelector('#chat-message-input');
			const targetInputDom = document.querySelector('#chat-message-target');
			data = {'from': username, 'to': targetInputDom.value, 'content': messageInputDom.value}
			console.log(`J'envoie ça ${JSON.stringify(data)}`)
			chatSocket.send(JSON.stringify({
				'event': 'chat',
				'data': data,
			}));
			messageInputDom.value = '';
		};
	}
}

class coordinationWebsocket {

	connect() {
		this.socket = new WebSocket('wss://' + window.location.host + '/api/coordination/');

		this.socket.onopen = function(e) {
			console.log("Le websocket 'coordination' est bien connecté !")
		}

		this.socket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			const stringifiedData = JSON.stringify(data)
			document.querySelector('#activity-log').value += stringifiedData +'\n';
		};
	}

	registerEvents() {
		this.socket.onclose = function(e) {
			console.error('Chat socket closed unexpectedly ! Retrying to connect !');
			setTimeout(function() {
				connect();
			}, 1000);
		};
		this.catchEventHTML();
	}

	catchEventHTML() {
		document.querySelector("#button-match").onclick = function(e) {
			coordinationSocket.send(JSON.stringify({'event' : 'matchmaking', 'data' : {'action': 'join'}}))
		}
		document.querySelector("#button-join").onclick = function(e) {
			domInput = document.querySelector("#room-id-input");
			value = domInput.value;
			coordinationSocket.send(JSON.stringify({'event' : 'tournament', data: {'room-id': value, 'action': 'join'}}));
			domInput.value = "";
		}
		document.querySelector("#button-create").onclick = function(e) {
			domInput = document.querySelector("#room-id-input");
			value = domInput.value;
			coordinationSocket.send(JSON.stringify({'event' : 'create', data: {'mode': value}}));
			domInput.value = "";
		}
	}
}