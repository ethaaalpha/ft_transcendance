import { fetchData } from './api.js';
import globalVariables from '../init.js';
import User from '../class/User.js';

// GETTER
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

// FETCH
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
					globalVariables.currentUser.update(data.data, globalVariables.currentUser);
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

async function fetchProfilPicture(username) {
	return new Promise((resolve, reject) => {
		fetchData('/api/dashboard?id=' + username + '&filter=profilePicture')
		.then(data => {
			resolve("/media/" + data.data['profilePicture']);
		})
		.catch(error => {
			console.error('Error fetching user data:', error);
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
			reject(error);
		});
	});
}

function fetchMatchHistory(username) {
	return new Promise((resolve, reject) => {
		fetchData('/api/dashboard/match?since=2005-04-19T16:00:00.000Z')
		.then(data => {
			resolve(data.data);
		})
		.catch(error => {
			console.error('Error fetching user data:', error);
			reject(error);
		});
	});
}

export { fetchProfilPicture, fetchUserStats, fetchUserData, fetchMatchHistory, userExist, isConnected };
