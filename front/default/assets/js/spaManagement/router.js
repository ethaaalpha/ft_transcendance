import { changeScene } from "./scene.js";
import globalVariables from "../init.js";
import { fetchUserData } from "../fetch/http.js";
import { isConnected } from "../fetch/http.js";
import Connect from "../class/Connect.js";
import { fetchProfilPicture } from "../fetch/http.js";

async function locationHandler() {
	const pathname = window.location.pathname;

	console.log("pathname:" + pathname);

	const connected = await isConnected();
	if (!connected) {
		switch (pathname) {
			case "/sign-up":
				routeSignUp();
				break;
			default:
				routeSignIn();
				break;
		}
	} else {
		if (!globalVariables.activity || globalVariables.activity.readyState === WebSocket.CLOSED) {
			globalVariables.activity =  new Connect();
		}
		switch (pathname) {
			case "/search":
				routeSearchRoute();
				break;
			case "/profil":
				routeProfilRoute();
				break;
			case "/settings":
				routeSettingsRoute();
				break;
			case "/chat":
				routeChatRoute();
				break;
			case "/in-game":
				routeInGameRoute();
				break;
			default:
				routeHome();
				break;
		}
	}
};

// HANDLER
function routeHome() {
	changeScene('conversation-list');
}

const routeSignIn = async () => {
	changeScene('sign-in');
};

const routeSignUp = async () => {
	changeScene('sign-up');
};

const routeSearchRoute = async () => {
	const searchParams = new URLSearchParams(window.location.search);
	const username = searchParams.get("username");

	if (username) {
		if (!await fetchProfilPicture(username)) {
			console.log("searchAction: error to replace with alert");
			locationHandler();
		} else {
			changeScene('search', username);
		}
	} else {
		routeHome();
	}
};

const routeProfilRoute = async () => {
	const searchParams = new URLSearchParams(window.location.search);
	const username = searchParams.get("username");

	if (username) {
		// Show profil scene with username
		// Implement sceneProfil() function with username accordingly
	} else {
		// Redirect to chat if username is not provided
		// Implement sceneChat() function accordingly
	}
};

const routeSettingsRoute = async () => {
	// const searchParams = new URLSearchParams(window.location.search);
	// const item = searchParams.get("item");

	changeScene('settings');
	// if (item) {
	// 	// Show settings scene with specific item
	// 	// Implement sceneSettings() function with item accordingly
	// } else {
	// }
};

const routeChatRoute = async () => {
	const searchParams = new URLSearchParams(window.location.search);
	const withUser = searchParams.get("with");

	if (withUser) {
		// Check if user is friend, if not redirect
		// Implement friend check logic and redirection accordingly
	}
	// Show chat scene
	// Implement sceneChat() function accordingly
};

const routeInGameRoute = async () => {
	// Check if user is in game, if not redirect
	// Implement in-game check logic and redirection accordingly
	// Show in-game scene
	// Implement sceneInGame() function accordingly
};

const routeDefault = async () => {
	console.log("ethan my love");
	const isConnected = await fetchUserData();
	if (isConnected) {
		// globalVariables.activity = new Connect();
		changeScene('conversation-list');
	} else {
		locationHandler('sign-in');
	}
};


export { locationHandler };