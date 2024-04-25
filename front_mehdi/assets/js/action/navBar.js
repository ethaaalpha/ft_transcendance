import globalVariables from '../init.js';
import { changeScene } from '../spaManagement/scene.js';

function navBarActionHandler(action, username) {
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
	if (globalVariables.currentScene == "settings") {
		changeScene("conversation-list");
	} else {
		changeScene("settings");
	}
}

function navBarProfil() {
	if (globalVariables.currentScene == "profil") {
		changeScene("conversation-list");
	} else {
		const username = globalVariables.currentUser.getUsername();
		changeScene("profil", username);
	}
}

async function navBarPlay(username) {
	console.log("you are trying to play with " + username);
}

async function navBarChat(username) {
	changeScene("conversation-display", username);
}

export { navBarActionHandler };
