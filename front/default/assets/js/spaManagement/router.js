import { changeScene } from "./scene.js";
import globalVariables from "../init.js";
import { fetchUserData } from "../fetch/http.js";
import { isConnected } from "../fetch/http.js";
import Connect from "../class/Connect.js";
import { fetchProfilPicture } from "../fetch/http.js";
import { userExist } from "../fetch/http.js";
import Alerts from "../class/Alerts.js";

async function locationHandler() {
	const connected = await isConnected();
	const pathname = window.location.pathname; // Here to make small delay with isConnected
		
	console.log("pathname:" + pathname);
	if (!connected) {
		switch (pathname) {
			case "/sign-up":
				await routeSignUp();
				break;
			default:
				await routeSignIn();
				break;
		}
	} else {
		if (!globalVariables.activity || globalVariables.activity.readyState === WebSocket.CLOSED) {
			globalVariables.activity =  new Connect();
		}
		switch (pathname) {
			case "/search":
				await routeSearchRoute();
				break;
			case "/profil":
				await routeProfilRoute();
				break;
			case "/settings":
				await routeSettingsRoute();
				break;
			case "/chat":
				await routeChatRoute();
				break;
			case "/in-game":
				await routeInGameRoute();
				break;
			case '/callback-42':
				await routeHome();
				Alerts.createAlert(Alerts.type.SUCCESS, 'You logged with 42 beacon.')
				break;
			default:
				await routeHome();
				break;
		}
	}
};

// HANDLER
async function routeHome() {
	await changeScene('conversation-list');
}

async function routeSignIn() {
	await changeScene('sign-in');
};

async function routeSignUp() {
	await changeScene('sign-up');
};

async function routeSearchRoute() {
	const searchParams = new URLSearchParams(window.location.search);
	const username = searchParams.get("username");

	if (username) {
		const exist = await userExist(username);
		if (exist) {
			await changeScene('search', username);
			return ;
		} else {
			Alerts.createAlert(Alerts.type.FAILED, username + ' do not exist')
		}
	}
	// console.log("routeSearchRoute: error to replace with alert");
	history.pushState({}, '', '/')
};

async function routeProfilRoute() {
	const searchParams = new URLSearchParams(window.location.search);
	const username = searchParams.get("username");

	if (username) {
		const exist = await userExist(username);
		if (exist) {
			await changeScene('profil', username);
			return ;
		} else {
			Alerts.createAlert(Alerts.type.FAILED, username + ' do not exist')
		}
	}
	// console.log("routeProfilRoute: error to replace with alert");
	history.pushState({}, '', '/');
};

async function routeSettingsRoute() {
	const searchParams = new URLSearchParams(window.location.search);
	const item = searchParams.get("item");

	const modify = ['game-theme', 'profil-picture', 'password', 'email'];
	// console.log('item :::' + item)
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
	// console.log("routeSettingsRoute: error to replace with alert item:" + item);
};

async function routeChatRoute() {
	const searchParams = new URLSearchParams(window.location.search);
	const withUser = searchParams.get("with");

	if (withUser) {
		if (globalVariables.currentUser.isFriend(withUser) == 'friend' || globalVariables.currentUser.isFriend(withUser) == 'pending') {
			await changeScene('conversation-display', withUser);
			return ;
		} else {
			Alerts.createAlert(Alerts.type.FAILED, withUser + " isn't your friend")
		}
	}
	history.pushState({}, '', '/');

	// console.log("routeChatRoute: error to replace with alert withUser:" + withUser);
};

const routeInGameRoute = async () => {};

export { locationHandler };