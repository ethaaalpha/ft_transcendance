import { fetchData } from '/static/default/assets/js/fetch/api.js';
import globalVariables from '/static/default/assets/js/init.js';
import User from '/static/default/assets/js/class/User.js';
import Alerts from '/static/default/assets/js/class/Alerts.js';

async function isConnected() {
	try {
		const logged = await fetchUserData();
		if (logged) {
			return(true);
		}
		return(false);
	} catch (error) {
		console.error("Error in fetchUserData: ", error);
		return(false);
	}
}

async function userExist(username) {
	try {
		const exist = await fetchUserData(username);
		if (exist) {
			return(true);
		}
		return(false);
	} catch (error) {
		console.error("Error in userExist: ", error);
		return(false);
	}
}

async function fetchUserData(username = null) {
	let request = '/api/dashboard';
	return new Promise((resolve, reject) => {
		if (username != null) {
			request += '?id=' + username;
		}
		fetchData(request)
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
			Alerts.createAlert(Alerts.type.FAILED, 'Failed to retrieved data !');
			reject(error);
		});
	});
};

async function fetchProfilPicture(username) {
	return new Promise((resolve, reject) => {
		fetchData('/api/dashboard?id=' + username + '&filter=profilePicture')
		.then(data => {
			resolve("/media/" + data.data['profilePicture']);
		})
		.catch(error => {
			console.error('Error fetching user data:', error);
			Alerts.createAlert(Alerts.type.FAILED, 'Failed to retrieved data !');
			reject(error);
		});
	});
}

function fetchUserStats(username) {
	return new Promise((resolve, reject) => {
		fetchData('/api/dashboard?id=' + username + '&filter=userStats')
		.then(data => {
			resolve(data.data['userStats']);
		})
		.catch(error => {
			console.error('Error fetching user data:', error);
			Alerts.createAlert(Alerts.type.FAILED, 'Failed to retrieved data !');
			reject(error);
		});
	});
}

function fetchMatchHistory(username) {
	return new Promise((resolve, reject) => {
		fetchData('/api/dashboard/match?since=2005-04-19T16:00:00.000Z&user=' + username)
		.then(data => {
			resolve(data.data);
		})
		.catch(error => {
			console.error('Error fetching user data:', error);
			Alerts.createAlert(Alerts.type.FAILED, 'Failed to retrieved data !');
			reject(error);
		});
	});
}

export { fetchProfilPicture, fetchUserStats, fetchUserData, fetchMatchHistory, userExist, isConnected };
