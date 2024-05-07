import { changeScene } from "./scene.js";
import globalVariables from "../init.js";
import { isConnected } from "../fetch/http.js";
import Activity from "../class/Activity.js";
import { userExist } from "../fetch/http.js";
import Alerts from "../class/Alerts.js";
import { createGame } from "/static/default/assets/js/spaManagement/div/createInGame.js";
import Coordination from "../class/Coordination.js";

async function routeHandler() {
	const connected = await isConnected();
	const pathname = window.location.pathname;
	
	// console.log("BIG pathname:" + pathname + " globalVariables.isInGame:" + globalVariables.isInGame);
	if (globalVariables.isInGame && pathname !== '/in-game') {
		console.log("The user left the game by using back button");//Nico do something here
	}

	console.log("pathname:" + pathname);
	if (!connected) {
		switch (pathname) {
			case "/sign-up":
				await routeSignUp();
				break;
			case '/authentification-error':
				Alerts.createAlert(Alerts.type.FAILED, 'You failed to log with 42 beacon.')
			default:
				await routeSignIn();
				break;
		}
	} else {
		if (!globalVariables.activity || globalVariables.activity.readyState === WebSocket.CLOSED) {
			globalVariables.activity = new Activity();
			createGame()
		}
		if (!globalVariables.coordination || globalVariables.coordination.socketC === WebSocket.CLOSED) {
			globalVariables.coordination = new Coordination();
		}
		switch (pathname) {
			case "/search":
				await loadRoute(routeSearch);
				break;
			case "/profil":
				await loadRoute(routeProfil);
				break;
			case "/settings":
				await loadRoute(routeSettings);
				break;
			case "/chat":
				await loadRoute(routeChat);
				break;
			case "/in-game":
				await loadRoute(routeInGame);
				break;
			case '/callback-42':
				await loadRoute(routeHome);
				Alerts.createAlert(Alerts.type.SUCCESS, 'You logged with 42 beacon.')
				break;
			case '/error':
				await loadRoute(routeError);
				break;
			default:
				await loadRoute(routeHome);
				break;
		}
	}
};

// Mouse Loading
async function loadRoute(routeFunction) {
	try {
        document.body.style.cursor = 'wait';
        await routeFunction();
    } finally {
        document.body.style.cursor = 'default';
    }
}

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

async function routeSearch() {
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
	// console.log("routeSearch: error to replace with alert");
	history.pushState({}, '', '/')
};

async function routeProfil() {
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
	// console.log("routeProfil: error to replace with alert");
	history.pushState({}, '', '/');
};

async function routeSettings() {
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
	// console.log("routeSettings: error to replace with alert item:" + item);
};

async function routeChat() {
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

	// console.log("routeChat: error to replace with alert withUser:" + withUser);
};

async function routeError() {
	if (globalVariables.coordination.isConnected())
		return (history.pushState({}, '', '/'))
	else
		await changeScene('error', 'none');
}

async function routeInGame() {
	if (globalVariables.isInGame) {
		changeScene('in-game');
	} else {
		history.pushState({}, '', '/');
	}
};

export { routeHandler };