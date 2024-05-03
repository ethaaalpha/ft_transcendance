import User from './class/User.js';
import Connect from './class/Connect.js';
import { fetchData } from './fetch/api.js';
import { backgroundRunner } from './action/background.js';
import { routeHandler } from './spaManagement/router.js';
import { isConnected } from './fetch/http.js';
import { status } from '/static/pong3d/utilsPong.js';

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
var appliParent = document.querySelector('#game-container')
waitParentSize();

function waitParentSize(){
	setTimeout(function(i) {
		if (appliParent.clientHeight == 0 || appliParent.clientHeight == 0)
			return(waitParentSize());
		import('/static/pong3d/main.js')
    	.then((module) => {
    	module.initialize();
    	})
		.catch((error) => {
    	console.error('Failed to import module: ', error);
    	})
	}, 50);
}


export default globalVariables;
