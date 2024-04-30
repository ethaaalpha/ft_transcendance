import User from './class/User.js';
import Connect from './class/Connect.js';
import { fetchData } from './fetch/api.js';
import { changeScene }  from './spaManagement/scene.js';
import { backgroundRunner } from './action/background.js';
import { locationHandler } from './spaManagement/router.js';
import { isConnected } from './fetch/http.js';

backgroundRunner();
window.onload = locationHandler;
window.onpopstate = locationHandler;

var globalVariables = {
	currentScene: 'start',
	currentUser: null,
	userConversations: null,
	activity: null,
	eventListeners: {},
	gameTheme: 1
};



// (async function() {
// 	try {
// 		const connected = await isConnected();
// 		if (connected) {
// 		// 	changeScene("conversation-list");
// 			// globalVariables.activity =  new Connect();
// 			return;
// 		}
// 	} catch (error) {
// 		console.error("Error in fetchUserData: ", error);
// 	}
// 	// locationHandler();
// 	changeScene("sign-in");
// })();

export default globalVariables;