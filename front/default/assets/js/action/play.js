import globalVariables from "../init.js";
import { setNewOpponentUsername } from "../spaManagement/div/createInGame.js";

// RECEIVE THINGS FROM WS
function receivedNewOpponentUsername(username) {
	// if new opponent after the first one, in tornament for exemple, do this
	setNewOpponentUsername(username);// clear conv and change profil pic and name
}

function receivedPlayRequest(from, to) {
	globalVariables.currentUser.addPendingGameFrom(from);
	// alert
}

function receivedPlayAnswer(from, answer) {
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

    // setTimeout(function() {
    //     receivedNewOpponentUsername("louane"); // Assurez-vous que cette fonction est définie correctement
    // }, 10000);
}



// SEND THINGS TO WS
// user click on navbar button 'play' in a friend profil scene
function sentPlayRequest(from, to) {
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

export { sentPlayRequest, receivedPlayRequest, acceptPlayRequest, refusePlayRequest };