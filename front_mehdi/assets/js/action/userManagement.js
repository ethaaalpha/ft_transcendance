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
				console.log("Bad password");
				// notif mdp mauvais ?
				// effacer champ mdp
			}
			if (data.status === 404) {
				console.log("You need to create an account");
				changeScene("sign-up");
				document.getElementById("sign-up-password-confirm").focus();
			}
			if (data.status === 200) {
				console.log("Successful connection");
				changeScene("conversation-list");
                appendAlert('Successful connection', 'success');
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
		if (data.status === 200) {
			console.log("Register sucess");
			changeScene("conversation-list");
		} else {
			console.log("Error conexion");
		}
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
		console.log("Deconexion réussie");
		changeScene("sign-in");
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
		if (data.status === 200) {
			console.log("password sent!");
			appendAlert('Your new password has been sent to you email!', 'warning');
		} else {
			console.log("Erreur de connexion");
		}
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
		if (data.status === 200) {
			console.log("Password changed");
			changeScene("settings");
		} else {
			console.log("Password do not match !");
		}
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
		if (data.status === 200) {
			console.log("Email changed");
			changeScene("settings");
		} else {
			console.log("Email do not match !");
		}
    })
    .catch(error => {
		console.error('Error:', error);
    });	
}

function modifyProfilPicture() {
	var profilePicture = document.getElementById("settings-actual-email").files;
	
    var formData = new FormData();
    
    formData.append("profilePicture", profilePicture);
	
	fetchData("/api/dashboard?filter=profilePicture", 'POST', formData).then(
	(data) => {
		if (data.status === 200) {
			console.log("Profile picture changed");
			changeScene("settings");
		} else {
			console.log("Size problem !");
		}
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
			console.log("manage friend action done!");
		} else {
			console.log("Login error");
		}
    })
    .catch(error => {
		console.error('Error:', error);
    });
}

export { signIn, signUp, signWith42, signOut, forgotPassword, modifyPassword, modifyEmail, modifyProfilPicture, manageFriend };
