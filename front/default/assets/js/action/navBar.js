import Alerts from '/static/default/assets/js/class/Alerts.js';
import globalVariables from '/static/default/assets/js/init.js';
import { pushUrl } from '/static/default/assets/js/spaManagement/router.js';
import { sentPlayRequest } from '/static/default/assets/js/action/play.js';

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
		pushUrl('/');
	} else {
		pushUrl('/settings');
	}
}

function navBarProfil() {
	if (globalVariables.currentScene == "profil") {
		pushUrl('/');
	} else {
		const username = globalVariables.currentUser.getUsername();
		pushUrl('/profil?username=' + username);
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
	pushUrl('/chat?with=' + username);
}

export { navBarActionHandler };
