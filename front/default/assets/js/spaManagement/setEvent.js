import globalVariables from '/static/default/assets/js/init.js';
import { pushUrl } from '/static/default/assets/js/spaManagement/router.js';
import { sendMessage } from '/static/default/assets/js/action/chat.js';
import { signIn, signUp, modifyEmail, modifyPassword } from '/static/default/assets/js/action/userManagement.js';
import { sendMessageInGame } from '/static/default/assets/js/action/chat.js';
import { checkAllSignIn, checkAllSignUp, checkAllSettingsPassword, checkAllSettingsEmail } from '/static/default/assets/js/action/utils.js';

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
	addEventListener("input", "sign-in-username", checkAllSignIn);

	addEventListener("input", "sign-in-password", checkAllSignIn);

	addEventListener("keypress", "sign-in-username", function(event) {
		if (event.key === "Enter") {
			if (checkAllSignIn(event, true))
				signIn();
		}
	});

	addEventListener("keypress", "sign-in-password", function(event) {
		if (event.key === "Enter") {
			if (checkAllSignIn(event, true))
				signIn();
		}
	});
}

function setEventSignUp() {
	addEventListener("input", "sign-up-username", checkAllSignUp);

	addEventListener("input", "sign-up-password", checkAllSignUp);

	addEventListener("input", "sign-up-password-confirm", checkAllSignUp);
	
	addEventListener("input", "sign-up-email", checkAllSignUp);

	addEventListener("keypress", "sign-up-username", function(event) {
		if (event.key === "Enter") {
			if (checkAllSignUp(event, true))
				signUp();
		}
	});

	addEventListener("keypress", "sign-up-password", function(event) {
		if (event.key === "Enter") {
			if (checkAllSignUp(event, true))
				signUp();
		}
	});

	addEventListener("keypress", "sign-up-password-confirm", function(event) {
		if (event.key === "Enter") {
			if (checkAllSignUp(event, true))
				signUp();
		}
	});

	addEventListener("keypress", "sign-up-email", function(event) {
		if (event.key === "Enter") {
			if (checkAllSignUp(event, true))
				signUp();
		}
	});
}

function setEventConversationList() {
	const searchInput = document.getElementById("conversation-list-searchbar-input-id");

	addEventListener("keypress", "conversation-list-searchbar-input-id", function(event) {
		if (event.key === "Enter") {
			pushUrl('/search?username=' + searchInput.value);
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
			pushUrl('/');
		}
	});

	addEventListener("keypress", "search-searchbar-input-id", function(event) {
		if (event.key === "Enter") {
			const searchInput = document.getElementById("search-searchbar-input-id");
			pushUrl('/search?username=' + searchInput.value);
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
	addEventListener("input", "settings-actual-password", checkAllSettingsPassword);

	addEventListener("input", "settings-new-password", checkAllSettingsPassword)
	
	addEventListener("input", "settings-confirm-password", checkAllSettingsPassword);

	addEventListener("keypress", "settings-actual-password", function(event) {
		if (event.key === "Enter") {
			if (checkAllSettingsPassword(event, true))
				modifyPassword();
		}
	});

	addEventListener("keypress", "settings-new-password", function(event) {
		if (event.key === "Enter") {
			if (checkAllSettingsPassword(event, true))
				modifyPassword();
		}
	});

	addEventListener("keypress", "settings-confirm-password", function(event) {
		if (event.key === "Enter") {
			if (checkAllSettingsPassword(event, true))
				modifyPassword();
		}
	});
}

function setEventSettingsEmail() {
	addEventListener('input', 'settings-actual-email', checkAllSettingsEmail);
	addEventListener('input', 'settings-new-email', checkAllSettingsEmail);
	addEventListener('input', 'settings-confirm-email', checkAllSettingsEmail);

	addEventListener("keypress", "settings-actual-email", function(event) {
		if (event.key === "Enter") {
			if (checkAllSettingsEmail(event, true))
				modifyEmail();
		}
	});

	addEventListener("keypress", "settings-new-email", function(event) {
		if (event.key === "Enter") {
			if (checkAllSettingsEmail(event, true))
				modifyEmail();
		}
	});

	addEventListener("keypress", "settings-confirm-email", function(event) {
		if (event.key === "Enter") {
			if (checkAllSettingsEmail(event, true))
				modifyEmail();
		}
	});
}

export { setEventListener }
