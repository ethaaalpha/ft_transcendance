import globalVariables from '../init.js';
import { changeScene } from './scene.js';
import { sendMessage } from '../action/chat.js';
import { signIn, signUp } from '../action/userManagement.js';

function setEventListener(scene) {
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
		case 'settings-profil-picture':
			setEventChangePicture();
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
		var isValid = /^[A-Za-z0-9_+\-.@]+$/.test(usernameInput);
		if (isValid && usernameInput.length >= 3 && usernameInput.length <= 32) {
			this.classList.remove("is-invalid");
		} else {
			if (!this.classList.contains("is-invalid")) {
				this.classList.add("is-invalid");
			}
		}
	});

	addEventListener("input", "sign-in-password", function() {
		var passwordInput = this.value;
		if (passwordInput.length >= 5 && passwordInput.length <= 42) {
			this.classList.remove("is-invalid");
		} else {
			this.classList.add("is-invalid");
		}
	});

	addEventListener("keypress", "sign-in-username", function(event) {
		if (event.key === "Enter") {
			signIn();
		}
	});

	addEventListener("keypress", "sign-in-password", function(event) {
		if (event.key === "Enter") {
			signIn();
		}
	});
}

function setEventSignUp() {
	addEventListener("input", "sign-up-username", function() {
		var usernameInput = this.value;
		var isValid = /^[A-Za-z0-9_+\-.@]+$/.test(usernameInput);
		if (isValid && usernameInput.length >= 3 && usernameInput.length <= 32) {
			this.classList.remove("is-invalid");
		} else {
			if (!this.classList.contains("is-invalid")) {
				this.classList.add("is-invalid");
			}
		}
	});

	addEventListener("input", "sign-up-password", function() {
		var passwordInput = this.value;
		if (passwordInput.length >= 5 && passwordInput.length <= 42) {
			this.classList.remove("is-invalid");
		} else {
			this.classList.add("is-invalid");
		}
	});

	addEventListener("input", "sign-up-password-confirm", function() {
		var confirmPasswordInput = this.value;
		var passwordInput = document.getElementById("password").value;
		var isValid = confirmPasswordInput === passwordInput;
		if (isValid) {
			this.classList.remove("is-invalid");
		} else {
			this.classList.add("is-invalid");
		}
	});
	
	addEventListener("input", "sign-up-email", function() {
		var emailInput = this.value;
		var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+\w*$/.test(emailInput) && emailInput.length <= 254;
		if (isValid) {
			this.classList.remove("is-invalid");
		} else {
			this.classList.add("is-invalid");
		}
	});

	addEventListener("keypress", "sign-up-username", function(event) {
		if (event.key === "Enter") {
			signUp();
		}
	});

	addEventListener("keypress", "sign-up-password", function(event) {
		if (event.key === "Enter") {
			signUp();
		}
	});

	addEventListener("keypress", "sign-up-password-confirm", function(event) {
		if (event.key === "Enter") {
			signUp();
		}
	});

	addEventListener("keypress", "sign-up-email", function(event) {
		if (event.key === "Enter") {
			signUp();
		}
	});
}

function setEventConversationList() {
	const searchInput = document.getElementById("conversation-list-searchbar-input-id");

	addEventListener("keypress", "conversation-list-searchbar-input-id", function(event) {
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
			changeScene("conversation-list");
		}
	});
}

function setEventChangePicture() {
	addEventListener('change', "settings-profil-picture", function(e) {
		const element = document.getElementById('custom-file-input-span');
		element.textContent = e.target.files[0].name;
	})
}

export { setEventListener }
