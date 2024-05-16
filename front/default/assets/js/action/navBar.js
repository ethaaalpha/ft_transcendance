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
		case "Profile":
			navBarProfil();
			break;
		case "Play":
			navBarPlay(username);
			break;
		case "Chat":
			navBarChat(username);
			break;
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
	if (globalVariables.currentScene == "profile") {
		pushUrl('/');
	} else {
		const username = globalVariables.currentUser.getUsername();
		pushUrl('/profile?username=' + username);
	}
}

async function navBarPlay(username) {
	if (globalVariables.currentUser.isFriend(username) === 'friend') {
		sentPlayRequest(username);
	} else {
		Alerts.createAlert(Alerts.type.FAILED, "You can't play with " + username);
	}
}

async function navBarChat(username) {
	pushUrl('/chat?with=' + username);
}

export { navBarActionHandler };
