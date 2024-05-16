import { routeHandler } from '/static/default/assets/js/spaManagement/router.js';

window.onload = routeHandler;

window.onpopstate = async function() {
	await routeHandler();
}

var globalVariables = {
	currentScene: 'start',
	eventListeners: {},
	backgroundRunner: false,
	gameData: null,
	gameTheme: 1,
	isInGame: false,
	currentUser: null,
	userConversations: null,
	activity: null,
	coordination: null,
};

export default globalVariables;
