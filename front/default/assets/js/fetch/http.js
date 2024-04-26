import { fetchData } from './api.js';

function fetchCurrentUsername() {
	return new Promise((resolve, reject) => {
	fetchData('/api/dashboard')
		.then(data => {
		resolve(data.data['username']);
		})
		.catch(error => {
		console.error('Error fetching user data:', error);
		reject(error);
		});
	});
}

function fetchProfilPicture(username) {
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

export { fetchCurrentUsername, fetchProfilPicture, fetchUserStats };
