import globalVariables from "../init.js";
import { setNewOpponentUsername } from "../spaManagement/div/createInGame.js";
import { pushUrl } from '/static/default/assets/js/spaManagement/router.js';
import { status } from "/static/pong3d/utilsPong.js"


// RECEIVE THINGS FROM WS

// addMessageFromGameSocket()

function receivedNewOpponentUsername(username) {
	// if new opponent after the first one, in tornament for exemple, do this
	setNewOpponentUsername(username);// clear conv and change profil pic and name

	let item = document.getElementById('in-game-title-id'); // active input
	item.classList.remove('d-none')

	item = document.getElementById('in-game-bottom-id')
	item.classList.remove('d-none');
}

function receivedPlayRequest(from, to) {
	globalVariables.currentUser.addPendingGameFrom(from);
	// alert
}

function receivedPlayAnswer(from, code) {
	goToInGame();
	status.status = 6;
	console.log("hello")
	// ici faire le go in game avec le status !
}

function goToInGame() {//the only to go to in-game is to do this two steps
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


// SEND THINGS TO WS
// user click on navbar button 'play' in a friend profil scene
function sentPlayRequest(from, to) {	
	// implement here your ws action to sent the play request
	globalVariables.coordination.send({'event':  'invite', 'data': {'target': to}});
	// if sucess
		// globalVariables.currentUser.addPendingGameTo(to);
		// alert sucess
	// else
		// alert fail
}

// in conversation display, user accept game request
function acceptPlayRequest(from) {
	// implement here your ws action to sent the accept request
	globalVariables.coordination.send({'event':  'accept', 'data': {'target': from}});
	//alert sucess/fail
}

// in conversation display, user refuse game request
function refusePlayRequest(from) {
	// implement here your ws action to sent the refuse request
	globalVariables.coordination.send({'event':  'refuse', 'data': {'target': from}});
	//alert sucess/fail
}

export { sentPlayRequest, receivedPlayRequest, acceptPlayRequest, refusePlayRequest, goToInGame, goToHome, receivedNewOpponentUsername, receivedPlayAnswer};