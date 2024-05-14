import Alerts from '/static/default/assets/js/class/Alerts.js';
import { fetchData } from '/static/default/assets/js/fetch/api.js';
import globalVariables from '/static/default/assets/js/init.js';
import { updateGameTheme } from '/static/default/assets/js/spaManagement/div/createInGame.js';
import { fetchUserData } from '/static/default/assets/js/fetch/http.js';
import { pushUrl } from '/static/default/assets/js/spaManagement/router.js';
import { checkAllSettingsEmail, checkAllSignIn, checkAllSignUp } from '/static/default/assets/js/action/utils.js';

function signIn() {
	if (!checkAllSignIn(null, true))
		return
	var username = document.getElementById("sign-in-username").value;
	var password = document.getElementById("sign-in-password").value;

	if (!username.trim() || !password.trim())
		return Alerts.createAlert(Alerts.type.FAILED, 'Value empty !')
	
	var formData = new FormData();
	
	formData.append("username", username);
	formData.append("password", password);

	fetchData("/api/auth/login?mode=intern", 'POST', formData).then(
		(data) => {
			if (data.status === 403) {
				Alerts.createAlert(Alerts.type.FAILED, data.data.message);
				// console.log("Bad password");
			}
			else if (data.status === 404) {
				// console.log("You need to create an account");
				pushUrl('/sign-up');
			}
			else if (data.status === 200) {
/				// console.log("Successful connection");
				pushUrl('/');
				Alerts.createAlert(Alerts.type.SUCCESS, data.data.message);
			} else {
				Alerts.createAlert(Alerts.type.FAILED, data.data.message);
				// console.log("Connexion error");
			}
		}
	).catch(error => {
		console.error('Error:', error);
	});
}


function signUp() {
	if (!checkAllSignUp(null, true))
		return 
	var username = document.getElementById("sign-up-username").value;
	var password = document.getElementById("sign-up-password").value;
	var email = document.getElementById("sign-up-email").value;
	
	if (!username.trim() || !password.trim() || !email.trim())
		return Alerts.createAlert(Alerts.type.FAILED, 'Value empty !')

	var formData = new FormData();
	
	formData.append("username", username);
	formData.append("password", password);
	formData.append("email", email);
	
	fetchData("/api/auth/register", 'POST', formData).then(
	(data) => {
		let type = Alerts.type.FAILED;
		if (data.status === 200) {
			pushUrl('/');
			type = Alerts.type.SUCCESS;
		}
		Alerts.createAlert(type, data.data.message);
		// console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

async function signWith42() {
	fetchData("/api/auth/login?mode=42", 'GET', ).then(
		(data) => {
			let type = Alerts.type.FAILED;
			if (data.status === 200) {
				window.location.href = data.data.url;
				return;
			}
			Alerts.createAlert(type, data.data.message);
			// console.log(data.data);
		})
		.catch(error => {
			console.error('Error:', error);
		});
}
	
	
function signOut() {
	fetchData("/api/auth/logout", 'POST')
	.then(() => {
		// console.log("Sign out success");
		globalVariables.currentUser = null;
		globalVariables.userConversations = null;
		globalVariables.isInGame = false;
		globalVariables.activity.close();
		globalVariables.coordination.destroy();
		globalVariables.coordination = null;
		globalVariables.activity = null;
		pushUrl('/sign-in');
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

function forgotPassword() {
	var username = document.getElementById("sign-in-username").value;
	
	if (!username.trim())
		return Alerts.createAlert(Alerts.type.FAILED, 'Value empty !')

	var formData = new FormData();
	formData.append("username", username);
	
	fetchData("/api/auth/reset-password", 'POST', formData).then(
	(data) => {
		if (data.status === 200) {
			Alerts.createAlert(Alerts.type.SUCCESS, 'Password sent to your email.');
		} else {
			Alerts.createAlert(Alerts.type.FAILED, data.data.message);
		}
		// console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

function modifyPassword() {
	if (!checkAllSettingsPassword(null, true))
		return
	var actualPassword = document.getElementById("settings-actual-password").value;
	var newPassword = document.getElementById("settings-new-password").value;
	
	if (!newPassword.trim() || !actualPassword.trim())
		return Alerts.createAlert(Alerts.type.FAILED, 'Value empty !')

	var formData = new FormData();
	
	formData.append("actualPassword", actualPassword);
	formData.append("newPassword", newPassword);
	
	fetchData("/api/dashboard?filter=password", 'POST', formData).then(
	(data) => {
		let type = Alerts.type.FAILED;
		if (data.status === 200) {
			pushUrl('/settings');
			type = Alerts.type.SUCCESS
		}
		Alerts.createAlert(Alerts.type.FAILED, data.data.message);
		// console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});	
}

function modifyEmail() {
	if (!checkAllSettingsEmail(null, true))
		return
	var actualEmail = document.getElementById("settings-actual-email").value;
	var newEmail = document.getElementById("settings-new-email").value;
	
	if (!actualEmail.trim() || !newEmail.trim())
		return Alerts.createAlert(Alerts.type.FAILED, 'Value empty !')

	var formData = new FormData();
	
	formData.append("actualEmail", actualEmail);
	formData.append("newEmail", newEmail);
	
	fetchData("/api/dashboard?filter=email", 'POST', formData).then(
	(data) => {
		let type = Alerts.type.FAILED;
		if (data.status === 200) {
			pushUrl('/settings');
			type = Alerts.type.SUCCESS
		}
		Alerts.createAlert(type, data.data.message);
		// console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});	
}

function modifyProfilPicture() {
	const validExtensions = ['png', 'jpeg', 'jpg'];
	var profilePictureInput = document.getElementById("settings-profil-picture-input");
    var files = profilePictureInput.files;
	var formData = new FormData();

    if (!files || !files[0]) {
		Alerts.createAlert(Alerts.type.FAILED, 'No file selected')
        return; 
    }
	
	const profilePicture = files[0]; // Because just one file (first one)
	if (profilePicture.size > 1900000) {
		Alerts.createAlert(Alerts.type.FAILED, 'File too large (<1.9M)')
		return 
	}
	
	const fileExtension = profilePicture.name.split('.').pop().toLowerCase();
	if (!fileExtension || !validExtensions.includes(fileExtension)) {
		Alerts.createAlert(Alerts.type.FAILED, 'Please select a PNG, JPEG, or JPG file.');
		return;
	}

	formData.append("profilePicture", profilePicture);
	fetchData("/api/dashboard?filter=profilePicture", 'POST', formData).then(
	(data) => {
		let type = Alerts.type.FAILED;
		if (data.status === 200) {
			pushUrl('/settings');
			type = Alerts.type.SUCCESS
		}
		Alerts.createAlert(type, data.data.message);
		// console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});	
}

function modifyGameTheme(id) {
	var themeList = ['d2', 'land', 'adibou', 'penDraw', 'epic', 'colors'];
	var formData = new FormData();
	
	formData.append("gameTheme", themeList[id - 1]);
	
	fetchData("/api/dashboard?filter=gameTheme", 'POST', formData).then(
	(data) => {
		let type = Alerts.type.FAILED;
		if (data.status === 200) {
			globalVariables.gameTheme = id;
			pushUrl('/settings');
			type = Alerts.type.SUCCESS
			fetchUserData().then(
				function (){
					updateGameTheme();
				}
			)
		}
		Alerts.createAlert(type, data.data.message);
		// console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});	
}


function manageFriend(username, action) {	
	var formData = new FormData();

	if (!username.trim() || !action.trim())
		return

	formData.append("action", action);
	formData.append("username", username);
	
	fetchData("/api/dashboard/friends", 'POST', formData).then(
	(data) => {
		let type = Alerts.type.FAILED;
		if (data.status === 200) {
			type = Alerts.type.SUCCESS;
			const img = document.getElementById('friend-relation-state');
			const button1 = document.getElementById('friend-relation-button1');
			const button2 = document.getElementById('friend-relation-button2');

			switch (action) {
				case 'accept':
					globalVariables.currentUser.addFriend(username);
					break;
				case 'remove':
					globalVariables.currentUser.removeFriend(username);
					img.src = '/static/default/assets/images/icons/notFriend.svg'
					button1.onclick = function() {
						manageFriend(username, "add");
					};
					break;
				case 'add':
					globalVariables.currentUser.addPendingFriendTo(username);
					img.src = '/static/default/assets/images/icons/pending.svg'
					button1.onclick = function() {
						manageFriend(username, "remove");
					};
					break
				case 'block':
					globalVariables.currentUser.addBlockedUser(username);
					button2.classList.add('blocked');
					button2.onclick = function() {
						manageFriend(username, "unblock");
					};
					break
				case 'unblock':
					globalVariables.currentUser.removeBlockedUser(username);
					button2.classList.remove('blocked')
					button2.onclick = function() {
						manageFriend(username, "block");
					};
					break;
			}
		}
		Alerts.createAlert(type, data.data.message);
		// console.log(data.data);
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

export { signIn, signUp, signWith42, signOut, forgotPassword, modifyPassword, modifyEmail, modifyProfilPicture, manageFriend, modifyGameTheme };
