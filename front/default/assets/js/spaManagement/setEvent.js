import globalVariables from '../init.js';
import { changeScene } from './scene.js';
import { sendMessage } from '../action/chat.js';
import { signIn, signUp, modifyEmail, modifyPassword } from '../action/userManagement.js';
import { sendMessageInGame } from '../action/chat.js';
import { checkSignInAllValues, checkSignUpAllValues, isValidEmail, isValidPassword, isValidUsername } from '../action/utils.js';

async function setEventListener(scene) {
	switch (scene) {
		case "sign-in":
			setEventSignIn();
			break;
		case "sign-up":
			setEventSignUp();
			break;
		case "conversation-list":
			setEventConversationList();
			break;
		case "conversation-display":
			setEventConversationDisplay();
			break;
		case "search":
			setEventSearch();
			break;
		case "in-game":
			setEventInGame();
			break;
		case 'settings-profil-picture':
			setEventSettingsProfilPicture();
			break;
		case 'settings-password':
			setEventSettingsPassword();
			break;
		case 'settings-email':
			setEventSettingsEmail();
			break;
		default:
			console.log("Invalid scene for setEventListener: ", scene);
	}
	// console.log("setEventListener: ", scene);
}

// ADD
function addEventListener(eventName, elementId, eventHandler) {
	const element = document.getElementById(elementId);
	if (!element) {
		console.error(`Element with id "${elementId}" not found.`);
		return;
	}

	if (!globalVariables.eventListeners[eventName]) {
		globalVariables.eventListeners[eventName] = {};
	}

	globalVariables.eventListeners[eventName][elementId] = eventHandler;

	element.addEventListener(eventName, eventHandler);
}

// HANDLER
function setEventSignIn() {
	addEventListener("input", "sign-in-username", function() {
		var usernameInput = this.value;
		if (isValidUsername(usernameInput))
			this.classList.remove("is-invalid");
		else
			this.classList.add("is-invalid");
	});

	addEventListener("input", "sign-in-password", function() {
		var passwordInput = this.value;
		if (isValidPassword(passwordInput))
			this.classList.remove("is-invalid");
		else
			this.classList.add("is-invalid");
	});

	addEventListener("keypress", "sign-in-username", function(event) {
		if (event.key === "Enter") {
			if (checkSignInAllValues())
				signIn();
		}
	});

	addEventListener("keypress", "sign-in-password", function(event) {
		if (event.key === "Enter") {
			if (checkSignInAllValues())
				signIn();
		}
	});
}

function setEventSignUp() {
	addEventListener("input", "sign-up-username", function() {
		var usernameInput = this.value;
		if (isValidUsername(usernameInput))
			this.classList.remove('is-invalid')
		else
			this.classList.add('is-invalid')
	});

	addEventListener("input", "sign-up-password", function() {
		var passwordInput = this.value;
		if (isValidPassword(passwordInput))
			this.classList.remove('is-invalid')
		else
			this.classList.add('is-invalid')
	});

	addEventListener("input", "sign-up-password-confirm", function() {
		var confirmPasswordInput = this.value;
		var passwordInput = document.getElementById("sign-up-password").value;
		var isValid = confirmPasswordInput === passwordInput;
		if (isValid) {
			this.classList.remove("is-invalid");
		} else {
			this.classList.add("is-invalid");
		}
	});
	
	addEventListener("input", "sign-up-email", function() {
		var emailInput = this.value;
		if (isValidEmail(emailInput)) {
			this.classList.remove("is-invalid");
		} else {
			this.classList.add("is-invalid");
		}
	});

	addEventListener("keypress", "sign-up-username", function(event) {
		if (event.key === "Enter") {
			if (checkSignUpAllValues())
				signUp();
		}
	});

	addEventListener("keypress", "sign-up-password", function(event) {
		if (event.key === "Enter") {
			if (checkSignUpAllValues())
				signUp();
		}
	});

	addEventListener("keypress", "sign-up-password-confirm", function(event) {
		if (event.key === "Enter") {
			if (checkSignUpAllValues())
				signUp();;
		}
	});

	addEventListener("keypress", "sign-up-email", function(event) {
		if (event.key === "Enter") {
			if (checkSignUpAllValues())
				signUp();
		}
	});
}

function setEventConversationList() {
	const searchInput = document.getElementById("conversation-list-searchbar-input-id");

	addEventListener("keypress", "conversation-list-searchbar-input-id", function(event) {
		console.log('adjiwodjiwaodjiwao');
		if (event.key === "Enter") {
			history.pushState({}, '', '/search?username=' + searchInput.value);
		}
	});
}

function setEventConversationDisplay() {
	addEventListener("keypress", "send-message-input-id", function(event) {
		if (event.key === "Enter") {
			sendMessage();
		}
	});
}

function setEventSearch() {
	addEventListener("input", "search-searchbar-input-id", function() {
		const inputValue = this.value.trim();
		if (!inputValue) {
			history.pushState({}, '', '/');
		}
	});

	addEventListener("keypress", "search-searchbar-input-id", function(event) {
		if (event.key === "Enter") {
			const searchInput = document.getElementById("search-searchbar-input-id");
			history.pushState({}, '', '/search?username=' + searchInput.value);
		}
	});
}

function setEventInGame() {
	addEventListener("keypress", "in-game-send-message-input-id", function(event) {
		if (event.key === "Enter") {
			sendMessageInGame();
		}
	});
}

function setEventSettingsProfilPicture() {
	addEventListener('change', "settings-profil-picture", function(e) {
		const element = document.getElementById('custom-file-input-span');
		element.textContent = e.target.files[0].name;
	})
}

function setEventSettingsPassword() {
	addEventListener("keypress", "settings-actual-password", function(event) {
		if (event.key === "Enter") {
			modifyPassword();
		}
	});

	addEventListener("keypress", "settings-new-password", function(event) {
		if (event.key === "Enter") {
			modifyPassword();
		}
	});

	addEventListener("keypress", "settings-confirm-password", function(event) {
		if (event.key === "Enter") {
			modifyPassword();
		}
	});
}

function setEventSettingsEmail() {
	addEventListener("keypress", "settings-actual-email", function(event) {
		if (event.key === "Enter") {
			modifyEmail();
		}
	});

	addEventListener("keypress", "settings-new-email", function(event) {
		if (event.key === "Enter") {
			modifyEmail();
		}
	});

	addEventListener("keypress", "settings-confirm-email", function(event) {
		if (event.key === "Enter") {
			modifyEmail();
		}
	});
}

export { setEventListener }
