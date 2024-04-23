import globalVariables from './main.js';
import { changeScene } from './sceneManagement.js';

function navBarButton(action, username) {
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
        changeScene("home");
    } else {
        changeScene("settings");
    }
}

function navBarProfil() {
    if (globalVariables.currentScene == "profil") {
        changeScene("home");
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

export { navBarButton };