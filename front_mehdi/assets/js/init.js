import User from './class/User.js';
import Connect from './class/Connect.js';
import { fetchData } from './fetch/api.js';
import { changeScene }  from './spaManagement/scene.js';
import { backgroundRunner } from './action/background.js';

var globalVariables = {
    currentUser: null,
    userConversations: null,
    currentScene: 'start',
	activity: null,
	gameTheme: 1
};

(async function() {
	backgroundRunner();
    try {
        const logged = await fetchUserData();
        if (logged) {
            changeScene("home");
			globalVariables =  new Connect();
            return;
        }
    } catch (error) {
        console.error("Error in fetchUserData: ", error);
    }
    changeScene("sign-in");
})();


async function fetchUserData() {
	return new Promise((resolve, reject) => {
		fetchData('/api/dashboard')
		.then(data => {
			if (data.status === 200) {
				if (!globalVariables.currentUser) {
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
