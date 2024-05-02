import globalVariables from '../init.js';

function unsetEventListener(eventToUnset, exception) {
	eventToUnset.forEach(event => {
		if (event !== exception) {
			switch (event) {
				case "sign-in":
					unsetEventSignIn();
					break;
				case "sign-up":
					unsetEventSignUp();
					break;
				case "conversation-list":
					unsetEventConversationList();
					break;
				case "conversation-display":
					unsetEventConversationDisplay();
					break;
				case "search":
					unsetEventSearch();
					break;
				case "settings-profil-picture":
					unsetEventSettingsProfilPicture();
					break;
				case "settings-password":
					unsetEventSettingsPassword();
					break;
				case "settings-email":
					unsetEventSettingsEmail();
					break;
				default:
					console.log("Invalid event for unsetEventListener: ", event);
			}
		}
	});
}

// REMOVE
function removeEventListener(eventName, elementId) {
	if (!globalVariables.eventListeners || !globalVariables.eventListeners[eventName]) return;

	const eventHandler = globalVariables.eventListeners[eventName][elementId];
	const element = document.getElementById(elementId);
	if (element && eventHandler) {
		element.removeEventListener(eventName, eventHandler);
		delete globalVariables.eventListeners[eventName][elementId];
	}
}

// HANDLER
function unsetEventSignIn() {
	removeEventListener("input", "sign-in-username");
	removeEventListener("input", "sign-in-password");
	removeEventListener("keypress", "sign-in-username");
	removeEventListener("keypress", "sign-in-password");
}

function unsetEventSignUp() {
	removeEventListener("input", "sign-up-username");
	removeEventListener("input", "sign-up-password");
	removeEventListener("input", "sign-up-password-confirm");
	removeEventListener("input", "sign-up-email");
	removeEventListener("keypress", "sign-up-username");
	removeEventListener("keypress", "sign-up-password");
	removeEventListener("keypress", "sign-up-password-confirm");
	removeEventListener("keypress", "sign-up-email");
}

function unsetEventConversationList() {
	removeEventListener("keypress", "conversation-list-searchbar-input-id");
}

function unsetEventConversationDisplay() {
	removeEventListener("keypress", "send-message-input-id");
}

function unsetEventSearch() {
	removeEventListener("input", "search-searchbar-input-id");
}

function unsetEventSettingsProfilPicture() {
	removeEventListener("change", "settings-profil-picture");
}

function unsetEventSettingsPassword() {
    removeEventListener("keypress", "settings-actual-password");
    removeEventListener("keypress", "settings-new-password");
    removeEventListener("keypress", "settings-confirm-password");
}

function unsetEventSettingsEmail() {
    removeEventListener("keypress", "settings-actual-email");
    removeEventListener("keypress", "settings-new-email");
    removeEventListener("keypress", "settings-confirm-email");
}


export { unsetEventListener }

// REMOVE ALL
// function removeAllglobalVariables.EventListeners() {
// 	for (const eventName in globalVariables.eventListeners) {
// 		const listeners = globalVariables.eventListeners[eventName];
// 		for (const elementId in listeners) {
// 			const eventHandler = listeners[elementId];
// 			const element = document.getElementById(elementId);
// 			if (element) {
// 				element.removeEventListener(eventName, eventHandler);
// 			}
// 		}
// 	}

// 	globalVariables.eventListeners = {};
// }
