import Alerts from '../class/Alerts.js';
import { fetchData } from '../fetch/api.js';
import { changeScene } from '../spaManagement/scene.js';

function signIn() {
	var username = document.getElementById("sign-in-username").value;
	var password = document.getElementById("sign-in-password").value;
	
	var formData = new FormData();
	
	formData.append("username", username);
	formData.append("password", password);

	fetchData("/api/auth/login?mode=intern", 'POST', formData).then(
		(data) => {
			if (data.status === 403) {
				Alerts.createAlert(Alerts.type.FAILED, data.data.message);
				console.log("Bad password");
				// notif mdp mauvais ?
				// effacer champ mdp
			}
			if (data.status === 404) {
				console.log("You need to create an account");
				history.pushState({}, '', '/sign-up');
				document.getElementById("sign-up-password-confirm").focus();
			}
			if (data.status === 200) {
				console.log("Successful connection");
				history.pushState({}, '', '/');
				Alerts.createAlert(Alerts.type.SUCCESS, data.data.message);
			} else {
				console.log("Connexion error");
			}
		}
	).catch(error => {
		console.error('Error:', error);
	});
}


function signUp() {
	var username = document.getElementById("sign-up-username").value;
	var password = document.getElementById("sign-up-password").value;
	var email = document.getElementById("sign-up-email").value;
	
	var formData = new FormData();
	
	formData.append("username", username);
	formData.append("password", password);
	formData.append("email", email);
	
	fetchData("/api/auth/register", 'POST', formData).then(
	(data) => {
		let type = Alerts.type.FAILED;
		if (data.status === 200) {
			history.pushState({}, '', '/');
			type = Alerts.type.SUCCESS;
		}
		Alerts.createAlert(type, data.data.message);
		console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

function signWith42() {
	fetchData("/api/auth/login?mode=42")
	.then((data) => {
		data.json().then(
			(dataJSON) => {
				console.log(dataJSON)
				window.location.href = dataJSON.url;
			}
			)
		})	
	}
	
	
function signOut() {
	fetchData("/api/auth/logout", 'POST')
	.then(() => {
		console.log("Sign out sucess");
		history.pushState({}, '', '/sign-in');
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

function forgotPassword() {
	var username = document.getElementById("username").value;
	
	var formData = new FormData();
	
	formData.append("username", username);
	
	fetchData("/api/auth/reset-password", 'POST', formData).then(
	(data) => {
		let type = Alerts.type.FAILED;
		if (data.status === 200) {
			type = Alerts.type.SUCCESS;
		}
		Alerts.createAlert(type, data.data.message);
		console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

function modifyPassword() {
	var actualPassword = document.getElementById("settings-actual-password").value;
	var newPassword = document.getElementById("settings-new-password").value;
	
	var formData = new FormData();
	
	formData.append("actualPassword", actualPassword);
	formData.append("newPassword", newPassword);
	
	fetchData("/api/dashboard?filter=password", 'POST', formData).then(
	(data) => {
		let type = Alerts.type.FAILED;
		if (data.status === 200) {
			history.pushState({}, '', '/settings');
			type = Alerts.type.SUCCESS
		}
		Alerts.createAlert(type, data.data.message);
		console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});	
}

function modifyEmail() {
	var actualEmail = document.getElementById("settings-actual-email").value;
	var newEmail = document.getElementById("settings-new-email").value;
	
	var formData = new FormData();
	
	formData.append("actualEmail", actualEmail);
	formData.append("newEmail", newEmail);
	
	fetchData("/api/dashboard?filter=email", 'POST', formData).then(
	(data) => {
		let type = Alerts.type.FAILED;
		if (data.status === 200) {
			history.pushState({}, '', '/settings');
			type = Alerts.type.SUCCESS
		}
		Alerts.createAlert(type, data.data.message);
		console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});	
}

function modifyProfilPicture() {
	var profilePictureInput = document.getElementById("settings-profil-picture-input");
    var files = profilePictureInput.files;
	var formData = new FormData();

    if (!files || !files[0]) {
        console.log("No file selected");
        return; 
    }
	
	const profilePicture = files[0]; // Because just one file (first one)

	formData.append("profilePicture", profilePicture);
	fetchData("/api/dashboard?filter=profilePicture", 'POST', formData).then(
	(data) => {
		let type = Alerts.type.FAILED;
		if (data.status === 200) {
			history.pushState({}, '', '/settings');
			type = Alerts.type.SUCCESS
		}
		Alerts.createAlert(type, data.data.message);
		console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});	
}

function manageFriend(username, action) {	
	var formData = new FormData();
	formData.append("action", action);
	formData.append("username", username);
	
	fetchData("/api/dashboard/friends", 'POST', formData).then(
	(data) => {
		if (data.status === 200) {
		}
		console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

export { signIn, signUp, signWith42, signOut, forgotPassword, modifyPassword, modifyEmail, modifyProfilPicture, manageFriend };
