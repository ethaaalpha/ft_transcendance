import { status, hideLoadingAnimation, ft, sleep } from "/static/pong3d/utilsPong.js";
import { goToHome } from '/static/default/assets/js/action/play.js';
import globalVariables from '/static/default/assets/js/init.js';
import { receivedNewOpponentUsername } from "/static/default/assets/js/action/play.js";
import Alerts from "/static/default/assets/js/class/Alerts.js";
import { pushUrl } from '/static/default/assets/js/spaManagement/router.js';
import { receivedPlayAnswer } from "/static/default/assets/js/action/play.js";

class Coordination {
	constructor() {
		this.connect()
		this.roomCode = null;
		this.data = null;
		this.inGame = false
		this.returnMenu = false
		this.backInGame = (event) => this.cancel(event)
		document.addEventListener('keydown', this.backInGame);
	}

	cancel(event){
		if (event.code == 'Escape' && status.status == 1){
			this.returnMenu = true
			this.send({"event": 'matchmaking', 'data': {'action': 'quit'}})
		}
	}
	destroy(){
		if (this.socketCo.readyState === WebSocket.OPEN)
			this.socketCo.close();
		document.removeEventListener('keydown', this.backInGame);
		// console.log("Coordination socket closed")
	}

	connect() {
		this.socketCo = new WebSocket("wss://" + window.location.host + "/api/coordination/");
		this.socketCo.onopen = (event) => {
			// console.log("Coordination socket connected")
		}

		this.socketCo.onmessage = (event) => {
			console.log(JSON.parse(event.data))
			const tmp = JSON.parse(event.data)
			if (tmp.event == "next" || tmp.event == "win" || tmp.event == "end") {
				this.data = tmp;	
				switch (tmp.event) {
					case 'next':
						let usernameOpponent = tmp.data.statusHost ? tmp.data.invited : tmp.data.host; 
						receivedNewOpponentUsername(usernameOpponent)
						Alerts.createAlert(Alerts.type.GAME, 'Next opponent : ' + usernameOpponent)
						break;
					case 'end':
						if (tmp.data.rank)
							Alerts.createAlert(Alerts.type.GAME, "You are eliminated from the tournament");
						goToHome();
						break;
					case 'win':
						Alerts.createAlert(Alerts.type.GAME, 'You won the tournament !')
						goToHome();
						break;
					default:
						goToHome();
				}
			}
			else if (tmp.event == "create" && tmp.data.status == true){
				ft.changeToRoom(tmp.data.message)
				this.waitForNextMatch(tmp.data.message, 5)
			}
			else if (tmp.event == "tournament" && tmp.data.status == true){
				ft.changeToRoom(null)
				this.waitForNextMatch(ft.roomCode, 5)
			}
			else if (tmp.event == "count")
				ft.eventPlayer(tmp.data.updater, tmp.data.count, tmp.data.max)
			else if (tmp.event == 'invite' || tmp.event == 'refuse' || tmp.event == 'accept' || tmp.event == 'invited') { // Invitation
				let type = tmp.data.status ? Alerts.type.SUCCESS : Alerts.type.MESSAGE
				switch (tmp.event) {
					case 'invite':
						if (tmp.data.status)
							globalVariables.currentUser.addPendingGameTo(tmp.data.message[1]);
						break;
					case 'invited':
						if (tmp.data.status) {
							globalVariables.currentUser.addPendingGameFrom(tmp.data.message[1]);
							if (globalVariables.userConversations)
								globalVariables.userConversations.addGameInviteFromSocket(tmp.data.message[1], true);
						}
						break;
					case 'refuse':
						globalVariables.currentUser.removePendingGameFrom(tmp.data.message[1])
						globalVariables.currentUser.removePendingGameTo(tmp.data.message[1])
						break;
					case 'accept':
						if (tmp.data.status) {
							this.roomCode = tmp.data.message[2];
							receivedPlayAnswer(tmp.data.message[1], tmp.data.message[2]);
						}
						globalVariables.currentUser.removePendingGameFrom(tmp.data.message[1])
						globalVariables.currentUser.removePendingGameTo(tmp.data.message[1])
						break;
				}
				if (tmp.data.message) {
					if (typeof(tmp.data.message) == 'string')
						Alerts.createAlert(type, tmp.data.message)
					else
						Alerts.createAlert(type, tmp.data.message[0])
				}
			}

			else if (tmp.event == 'chat') {
				globalVariables.userConversations.addMessageFromGameSocket(tmp.data, true);
			}
		}

		this.socketCo.onerror = (event) => {
			if (globalVariables.currentUser != null)
				pushUrl('/error')
		}

		this.socketCo.onclose = (event) => {
			if (globalVariables.currentUser != null)
				pushUrl('/error')
		}
	}

	send(data){
		if (this.socketCo.readyState === WebSocket.OPEN){
			this.socketCo.send(JSON.stringify(data));
			// console.log(data);
		}
			// console.log("Error socket Coordination State");
	}

	async waitForNextMatch(code, nextStatus){
		// console.log(this.data);
		return new Promise((resolve) => {
			if (code == "" || code == null){
				if (this.roomCode != null){
					code = this.roomCode;
					this.roomCode = null;
				}
			}
			const intervalId = setInterval(() => {
				this.socketCo.send(JSON.stringify({'event': 'next', 'data': {'room-id' : code}}))
				// console.log(status);
				if (this.data) {
					this.inGame = true;
					if (this.data.event == "end" || this.data.event == "win"){
						status.status = 0
					}
					if (this.data.event == "next") {
						status.status = nextStatus
					}
					clearInterval(intervalId);
					hideLoadingAnimation();
					resolve();
				}
			}, 500);
		});
	};

	async waitForData(time) {
		return new Promise((resolve) => {
			const intervalId = setInterval(() => {
				// console.log(this.returnMenu)
				if (this.data) {
					clearInterval(intervalId);
					hideLoadingAnimation();
					resolve();
				}
				else if (this.returnMenu == true){
					status.status = 0;
					resolve();
				}
			}, time);
		});
	}

	async waitForTournament(time) {
		return new Promise((resolve) => {
			const intervalId = setInterval(async () => {
				if (this.inGame == true) {
					clearInterval(intervalId);
					hideLoadingAnimation();
					await sleep(600);
					this.inGame = false
					resolve();
				}
			}, time);
		});
	}

	isConnected() {
		return this.socketCo.readyState != WebSocket.CLOSED ? true : false
	}
}

export default Coordination