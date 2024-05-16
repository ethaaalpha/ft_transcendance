import { changeScene } from "/static/default/assets/js/spaManagement/scene.js";
import globalVariables from "/static/default/assets/js/init.js";
import { isConnected } from "/static/default/assets/js/fetch/http.js";
import Activity from "/static/default/assets/js/class/Activity.js";
import { userExist } from "/static/default/assets/js/fetch/http.js";
import Alerts from "/static/default/assets/js/class/Alerts.js";
import { createGame } from "/static/default/assets/js/spaManagement/div/createInGame.js";
import Coordination from "/static/default/assets/js/class/Coordination.js";
import { backgroundRunner } from "/static/default/assets/js/action/background.js";

async function routeHandler() {
	const connected = await isConnected();
	const pathname = window.location.pathname;
	
	if (globalVariables.isInGame && pathname !== '/in-game' || 
		globalVariables.isInGame && globalVariables.currentScene === 'in-game') {
		history.pushState(null, null, '/in-game');
		Alerts.createAlert(Alerts.type.FAILED, 'You are playing !')
		return ;
	}
	if (!connected) {
		backgroundRunner();
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
		backgroundRunner(false);
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
			case "/profile":
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
	pushUrl('/')
};

async function routeProfil() {
	const searchParams = new URLSearchParams(window.location.search);
	const username = searchParams.get("username");

	if (username) {
		const exist = await userExist(username);
		if (exist) {
			await changeScene('profile', username);
			return ;
		} else {
			Alerts.createAlert(Alerts.type.FAILED, username + ' do not exist')
		}
	}
	pushUrl('/');
};

async function routeSettings() {
	const searchParams = new URLSearchParams(window.location.search);
	const item = searchParams.get("item");

	const modify = ['game-theme', 'profile-picture', 'password', 'email'];
	if (item) {
		if (modify.includes(item)) {
			await changeScene('settings-' + item);
			return ;
		}
	} else {
		await changeScene('settings');
		return ;
	}
	pushUrl('/settings');
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
	pushUrl('/');
};

async function routeInGame() {
	if (globalVariables.isInGame) {
		changeScene('in-game');
	} else {
		pushUrl('/');
	}
};

async function routeError() {
	if (globalVariables.coordination && globalVariables.coordination.isConnected())
		return (pushUrl('/'))
	else
		await changeScene('error', 'none');
}

async function routeHome() {
	await changeScene('conversation-list');
}

async function loadRoute(routeFunction) {
	try {
		document.body.style.cursor = 'wait';
		await routeFunction();
	} finally {
		document.body.style.cursor = 'default';
	}
}

function pushUrl(newUrl) {
	history.pushState({}, '', newUrl);
	routeHandler();
}

export { routeHandler, pushUrl };