import User from './User.js';
import Connect from './Connect.js';
import { fetchData } from './api.js';
import { changeScene }  from './sceneManagement.js';

var globalVariables = {
    currentUser: null,
    userConversations: null,
    currentScene: 'start',
	activity: new Connect(),
	gameTheme: 1
};

//check at launch if logged
(async function() {
	const logged = await isLogged();
    if (logged) {
		await fetchUserData();
		console.log("first function");
        // await fetchConversations();
        await changeScene("home");
    } else {
		changeScene("signIn");
    }
})();


async function isLogged() {
	const response = await fetch('/api/dashboard');
    return response.status === 200;
}

async function fetchUserData() {
	return new Promise((resolve, reject) => {
		fetchData('/api/dashboard')
		.then(data => {
			if (data.status === 200) {
				if (!globalVariables.currentUser) {
					// console.log(data.data);
					globalVariables.currentUser = new User(data.data);
				} else {
					globalVariables.currentUser.update(data.data);
				}
				resolve(true);
			} else {
				resolve(false);
			}
		})
		.catch(error => {
			console.error('Error fetching user data:', error);
			reject(error);
		});
	});
};

export { fetchUserData };
export default globalVariables;

// // main.js
// window.addEventListener('DOMContentLoaded', (event) => {
	//     // Ici, vous pouvez exécuter vos fonctions une fois que la page est chargée
	//     // par exemple :
	//     maFonctionDuModule1();
	//     maFonctionDuModule2();
	// });
	
