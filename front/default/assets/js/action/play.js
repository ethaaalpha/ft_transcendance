import globalVariables from "/static/default/assets/js/init.js";
import { setNewOpponentUsername } from "/static/default/assets/js/spaManagement/div/createInGame.js";
import { pushUrl } from '/static/default/assets/js/spaManagement/router.js';
import { status } from "/static/pong3d/utilsPong.js"

function receivedNewOpponentUsername(username) {
	setNewOpponentUsername(username);

	let item = document.getElementById('in-game-title-id');
	if (item)
		item.classList.remove('d-none')

	item = document.getElementById('in-game-bottom-id')
	if (item)
		item.classList.remove('d-none');
}

function receivedPlayAnswer() {
	goToInGame();
	status.status = 6;
}

function goToInGame() {
	if (window.location.pathname != '/in-game' || !globalVariables.isInGame) {
		globalVariables.isInGame = true;
		pushUrl('/in-game');
	}
}

function goToHome() {
	if (window.location.pathname == '/in-game' || globalVariables.isInGame) {
		globalVariables.isInGame = false;
		pushUrl('/');
	}
}

function sentPlayRequest(to) {	
	globalVariables.coordination.send({'event':  'invite', 'data': {'target': to}});
}

function acceptPlayRequest(from) {
	globalVariables.coordination.send({'event':  'accept', 'data': {'target': from}});
}

function refusePlayRequest(from) {
	globalVariables.coordination.send({'event':  'refuse', 'data': {'target': from}});
}

export { sentPlayRequest, acceptPlayRequest, refusePlayRequest, goToInGame, goToHome, receivedNewOpponentUsername, receivedPlayAnswer};