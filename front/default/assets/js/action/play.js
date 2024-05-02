import globalVariables from "../init.js";

// RECEIVE THINGS FROM WS
function playRequestReceived(from, to) {
	globalVariables.currentUser.addPendingGameFrom(from);
	// alert
}

function playAnswerReceived(from, answer) {
	if (answer === 'accept') {
		// alert sucess
		// launch game
		goToInGame();//change scene to in-game
	} else {
		//alert fail
	}
}

function goToInGame() {//the only to go to in-game is to do this two steps
	globalVariables.isInGame = true;
	history.pushState({}, '', '/in-game');
}



// SEND THINGS TO WS
// user click on navbar button 'play' in a friend profil scene
function playRequestSent(from, to) {
	goToInGame();

	// implement here your ws action to sent the play request
	
	// if sucess
		// globalVariables.currentUser.addPendingGameTo(to);
		// alert sucess
	// else
		// alert fail
}

// in conversation display, user accept game request
function acceptPlayRequest(from) {
	// implement here your ws action to sent the accept request
	console.log("acceptPlayRequest from: " + from);// to delete
	//alert sucess/fail
}

// in conversation display, user refuse game request
function refusePlayRequest(from) {
	// implement here your ws action to sent the refuse request
	console.log("refusePlayRequest from: " + from);// to delete
	//alert sucess/fail
}

export { playRequestSent, playRequestReceived, acceptPlayRequest, refusePlayRequest };