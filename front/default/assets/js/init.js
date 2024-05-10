import { routeHandler } from '/static/default/assets/js/spaManagement/router.js';

window.onload = routeHandler;

window.onpopstate = async function() {
	await routeHandler();
}

// Experimental !
// window.navigation.addEventListener("navigate", async (event) => {
	// await routeHandler();
// });

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
