import Alerts from '../class/Alerts.js';
import globalVariables from '../init.js';
import { changeScene } from '../spaManagement/scene.js';
import { sentPlayRequest } from './play.js';

function navBarActionHandler(action, username) {
	if (globalVariables.isInGame)
		return Alerts.createAlert(Alerts.type.FAILED, "You're playing !");

	switch (action) {
		case "Settings":
			navBarSettings();
			break;
		case "Profil":
			navBarProfil();
			break;
		case "Play":
			navBarPlay(username);
			break;
		case "Chat":
			navBarChat(username);
			break;
		default:
			console.log("Invalid button: ", action);
	}
}

function navBarSettings() {
	if (globalVariables.currentScene === "settings") {
		history.pushState({}, '', '/');
	} else {
		history.pushState({}, '', '/settings');
	}
}

function navBarProfil() {
	if (globalVariables.currentScene == "profil") {
		history.pushState({}, '', '/');
	} else {
		const username = globalVariables.currentUser.getUsername();
		history.pushState({}, '', '/profil?username=' + username);
	}
}

async function navBarPlay(username) {
	if (globalVariables.currentUser.isFriend(username) === 'friend') {
		sentPlayRequest(globalVariables.currentUser.getUsername(), username);
	} else {
		// alert
		console.log("You cannot play with " + username);
	}
}

async function navBarChat(username) {
	history.pushState({}, '', '/chat?with=' + username);
}

export { navBarActionHandler };
