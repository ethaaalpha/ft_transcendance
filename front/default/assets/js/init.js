import { backgroundRunner } from './action/background.js';
import { routeHandler } from './spaManagement/router.js';

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
	gameInstance : null,
	gameData: null,
};

export default globalVariables;
