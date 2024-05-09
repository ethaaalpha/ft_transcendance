import { routeHandler } from './spaManagement/router.js';

window.onload = routeHandler;
window.navigation.addEventListener("navigate", async (event) => {
	await routeHandler();
});

var globalVariables = {
	currentScene: 'start',
	currentUser: null,
	userConversations: null,
	activity: null,
	coordination: null,
	eventListeners: {},
	gameTheme: 1,
	isInGame: false,
	gameData: null,
	backgroundRunner: false
};

export default globalVariables;
