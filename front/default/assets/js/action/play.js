import globalVariables from "../init.js";

// RECEIVE THINGS FROM WS
// if the user receive a game play request
function playRequestReceived(from, to) {
	globalVariables.currentUser.addPendingGameFrom(from);
	// alert
}

function playAnswerReceived(from, answer) {
	if (answer === 'accept') {
		// alert sucess
		// launch game
	} else {
		//alert fail
	}
}

// SEND THINGS TO WS
// user click on navbar button 'play' in a friend profil scene
function playRequestSent(from, to) {
	// implement here your ws action to sent the request
	globalVariables.currentUser.addPendingGameTo(to);
	// alert
}

// in conversation display, user accept game request
function acceptPlayRequest(from) {
	// implement here your ws action to sent the request
	console.log("acceptPlayRequest from: " + from);// to delete
	//alert
}

// in conversation display, user refuse game request
function refusePlayRequest(from) {
	// implement here your ws action to sent the request
	console.log("refusePlayRequest from: " + from);// to delete
	//alert
}

export { playRequestSent, playRequestReceived, acceptPlayRequest, refusePlayRequest };