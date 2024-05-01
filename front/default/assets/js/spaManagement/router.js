import { changeScene } from "./scene.js";
import globalVariables from "../init.js";
import { fetchUserData } from "../fetch/http.js";
import { isConnected } from "../fetch/http.js";
import Connect from "../class/Connect.js";
import { fetchProfilPicture } from "../fetch/http.js";
import { userExist } from "../fetch/http.js";

async function locationHandler() {
	const connected = await isConnected();
	const pathname = window.location.pathname; // Here to make small delay with isConnected
		
	console.log("pathname:" + pathname);
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
async function routeHome() {
	await changeScene('conversation-list');
}

const routeSignIn = async () => {
	await changeScene('sign-in');
};

const routeSignUp = async () => {
	await changeScene('sign-up');
};

const routeSearchRoute = async () => {
	const searchParams = new URLSearchParams(window.location.search);
	const username = searchParams.get("username");

	if (username) {
		const exist = await userExist(username);
		if (exist) {
			await changeScene('search', username);
			return ;
		}
	}
	console.log("routeSearchRoute: error to replace with alert");
	history.pushState({}, '', '/')
};

const routeProfilRoute = async () => {
	const searchParams = new URLSearchParams(window.location.search);
	const username = searchParams.get("username");

	if (username) {
		const exist = await userExist(username);
		if (exist) {
			await changeScene('profil', username);
			return ;
		}
	}
	console.log("routeProfilRoute: error to replace with alert");
	history.pushState({}, '', '/');
};

const routeSettingsRoute = async () => {
	const searchParams = new URLSearchParams(window.location.search);
	const item = searchParams.get("item");

	const modify = ['game-theme', 'profil-picture', 'password', 'email'];
	console.log('item :::' + item)
	if (item) {
		if (modify.includes(item)) {
			await changeScene('settings-' + item);
			return ;
		}
	} else {
		await changeScene('settings');
		return ;
	}
	history.pushState({}, '', '/settings');
	console.log("routeSettingsRoute: error to replace with alert item:" + item);
};

const routeChatRoute = async () => {
	const searchParams = new URLSearchParams(window.location.search);
	const withUser = searchParams.get("with");

	if (globalVariables.currentUser.isFriend(withUser) == 'friend') {
		await changeScene('conversation-display', withUser);
		return ;
	}
	history.pushState({}, '', '/');
	console.log("routeChatRoute: error to replace with alert withUser:" + withUser);
};

const routeInGameRoute = async () => {};

export { locationHandler };