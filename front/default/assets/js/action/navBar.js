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
	console.log("scene in navbarhandler: " + globalVariables.currentScene + " " + "settings");
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
	console.log("you are trying to play with " + username);
}

async function navBarChat(username) {
	history.pushState({}, '', '/chat?with=' + username);
}

export { navBarActionHandler };
