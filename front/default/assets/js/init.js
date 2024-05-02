import User from './class/User.js';
import Connect from './class/Connect.js';
import { fetchData } from './fetch/api.js';
import { backgroundRunner } from './action/background.js';
import { routeHandler } from './spaManagement/router.js';
import { isConnected } from './fetch/http.js';

backgroundRunner();
window.onload = routeHandler;
window.navigation.addEventListener("navigate", async (event) => {
    await routeHandler();
});

var globalVariables = {
	currentScene: 'start',
	currentUser: null,
	userConversations: null,
	activity: null,
	eventListeners: {},
	gameTheme: 1,
	isInGame: false,
};

export default globalVariables;