import { status, hideLoadingAnimation, showLoadingAnimation, ft } from "/static/pong3d/utilsPong.js";
import FormTournament from "/static/pong3d/tournament.js";
import { goToHome, goToInGame } from '/static/default/assets/js/action/play.js';
import globalVariables from '/static/default/assets/js/init.js';
import { receivedNewOpponentUsername } from "/static/default/assets/js/action/play.js";

class Coordination{
	constructor() {
		this.connect()
		this.data = null;
		this.inGame = false
	}

	destroy(){
		this.socketCo.close();
	}

	connect(){
		this.socketCo = new WebSocket("wss://" + window.location.host + "/api/coordination/");

		this.socketCo.onmessage = (event) => {
			console.log(JSON.parse(event.data))
			const tmp = JSON.parse(event.data)
			if (tmp.event == "next" || tmp.event == "win" || tmp.event == "end") {
				this.data = tmp;	
				switch (tmp.event) {
					case 'next':
						let usernameOpponent = tmp.data.statusHost ? tmp.data.invited : tmp.data.host; 
						receivedNewOpponentUsername(usernameOpponent)
						break;
					default:
						console.log('je suis sensé quitter')
						goToHome();
						break;
				}
			}
			else if (tmp.event == "create" && tmp.data.status == true){
				ft.changeToRoom(tmp.data.message)
				this.waitForNextMatch(tmp.data.message)
			}
			else if (tmp.event == "tournament" && tmp.data.status == true){
				ft.changeToRoom(null)
				this.waitForNextMatch(ft.roomCode)
			}
			else if (tmp.event == "count")
				ft.eventPlayer(tmp.data.updater, tmp.data.count, tmp.data.max)
			else if (tmp.event == 'matchmaking' && tmp.data.status == false) {
				// si le gars essaie de lancer 2 matchmaking en même temps
				// ici remettre sur la page par défaut
				// faire une alerte
			}
			else if (tmp.event == 'create' && tmp.data.status == false) {
				// si le gars essaie de jouer à deux endroits en même (ex: matchmaking + je créer une room)
				// pareil qu'en haut
				// ft.changeToInactive();
			}
			else if (tmp.event == 'tournament' && tmp.data.status == false) {
				// si le gars essaie de jouer à deux endroits en même (ex: matchmaking + je créer une room)
				// pareil qu'en haut
				// ft.changeToInactive();
			}
			else if (tmp.event == 'chat') {
				globalVariables.userConversations.addMessageFromGameSocket(tmp.data, true);
			}
		}

		this.socketCo.onerror = (event) => {
			history.pushState({}, '', '/error')
		}

		this.socketCo.onclose = (event) => {
			history.pushState({}, '', '/error')
		}
	}
	send(data){
		if (this.socketCo.readyState === WebSocket.OPEN){
			this.socketCo.send(JSON.stringify(data));
			console.log(data);}
		else
			console.log("Error socket Coordiantion State");
	}

	async waitForNextMatch(code){
		console.log(this.data);
		return new Promise((resolve) => {
			const intervalId = setInterval(() => {
				this.socketCo.send(JSON.stringify({'event': 'next', 'data': {'room-id' : code}}))
				console.log(status);
				if (this.data) {
					this.inGame = true;
					if (this.data.event == "end" || this.data.event == "win"){
						this.inGame = false
						status.status = 0
					}
					if (this.data.event == "next") {
						status.status = 5
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
				if (this.data) {
					console.log("cou");
					clearInterval(intervalId);
					hideLoadingAnimation();
					resolve();
				}
			}, time);
		});
	}

	async waitForTournament(time) {
		return new Promise((resolve) => {
			const intervalId = setInterval(() => {
				if (this.inGame == true) {
					console.log("cou");
					clearInterval(intervalId);
					hideLoadingAnimation();
					resolve();
				}
			}, time);
		});
	}

	isConnected() {
		return this.socketCo.readyState != WebSocket.OPEN ? false : true
	}
}
var coordination = new Coordination()

export { coordination }