class activityWebsocket {
	

	connect() {
		this.socket = new WebSocket('wss://' + window.location.host + '/api/activity/');
		
		this.socket.onopen = (e) => {
			console.log("Le websocket 'activity' est bien connecté !")
		}
		
		// Juste pour debug
		this.socket.onmessage = (e) => {
			const data = JSON.parse(e.data);
			const stringifiedData = JSON.stringify(data)
			console.log("j'ai reçu message ici !")
        	document.querySelector('#activity-log').value += stringifiedData +'\n';
		}

		this.socket.onclose = (e) => {
			console.error('Chat socket closed unexpectedly ! Retrying to connect !');
			setTimeout(() => {
				this.connect();
			}, 1000);
		};
	}

	registerEvents() {

		this.catchEventHTML();
	}

	catchEventHTML() {
		document.querySelector('#chat-message-submit').onclick = (e) => {
			const messageInputDom = document.querySelector('#chat-message-input');
			const targetInputDom = document.querySelector('#chat-message-target');
			const data = {'to': targetInputDom.value, 'content': messageInputDom.value}
			this.socket.send(JSON.stringify({
				'event': 'chat',
				'data': data,
			}));
			messageInputDom.value = '';
		};
	}
}

class coordinationWebsocket {

	constructor () {
		this.input = document.getElementById('room-id-input');
	}

	connect() {
		this.socket = new WebSocket('wss://' + window.location.host + '/api/coordination/');

		this.socket.onopen = (e) => {
			console.log("Le websocket 'coordination' est bien connecté !")
		}

		this.socket.onmessage = (e) => {
			const data = JSON.parse(e.data);
			const stringifiedData = JSON.stringify(data)
			document.querySelector('#activity-log').value += stringifiedData +'\n';
		};

		this.socket.onclose = (e) => {
			console.error('Chat socket closed unexpectedly ! Retrying to connect !');
			setTimeout(() => {
				this.connect();
			}, 1000);
		};
	}

	registerEvents() {
		this.catchEventHTML();
	}

	catchEventHTML() {
		document.querySelector("#button-match").onclick = (e) => {
			this.socket.send(JSON.stringify({'event' : 'matchmaking', 'data' : {'action': 'join'}}))
		}
		document.querySelector("#button-join").onclick = (e) => {
			let value = this.input.value;
			this.socket.send(JSON.stringify({'event' : 'tournament','data': {'room-id': value, 'action': 'join'}}));
			this.input.value = "";
		}
		document.querySelector("#button-create").onclick = (e) => {
			let value = this.input.value;
			this.socket.send(JSON.stringify({'event' : 'create', 'data': {'mode': value}}));
			this.input.value = "";
		}
		document.querySelector('#button-invitation').onclick = (e) => {
			const actInputDom = document.querySelector('#label-invitation-action');
			const userInputDom = document.querySelector('#label-invitation-username'); // A VERIFIER PAR PITIE
			const data = {'target': userInputDom.value}
			this.socket.send(JSON.stringify({
				'event': userInputDom.value,
				'data': data,
			}));
			invInputDom.value = '';
			actInputDom.value = '';
		};
		
	}
}