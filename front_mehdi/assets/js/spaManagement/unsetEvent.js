import globalVariables from '../init.js';
import { createChildDiv } from './div.js';
import { sendMessage } from '../action/chat.js';

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
				case "search-contact":
					unsetEventSearchContact();
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

function unsetEventConversationDisplay() {
	removeEventListener("keypress", "send-message-input-id");
}

function unsetEventConversationList() {
	removeEventListener("input", "conversation-list-searchbar-input-id");
	removeEventListener("keypress", "conversation-list-searchbar-input-id");
}

function unsetEventSearch() {
	removeEventListener("input", "search-searchbar-input-id");
	removeEventListener("keypress", "search-searchbar-input-id");
}

function unsetEventSearchContact() {
	removeEventListener("input", "search-contact-searchbar-input-id");
	removeEventListener("keypress", "search-contact-searchbar-input-id");
}







// function unsetEventConversationDisplay() {
// 	const messageInput = document.getElementById("send-message-input-id");

// 	if (messageInput) {
// 		messageInput.removeEventListener("keypress", sendMessage);
// 	}
// }

// function unsetEventConversationList() {
// 	const searchInput = document.getElementById("conversation-list-searchbar-input-id");

// 	if (searchInput) {
// 		searchInput.removeEventListener("input", onInputFilled);
// 		searchInput.removeEventListener("input", onInputCleared);
// 		searchInput.removeEventListener("keypress", createChildDiv);
// 	}
// }

// function unsetEventSearch() {
// 	const searchInput = document.getElementById("search-searchbar-input-id");

// 	if (searchInput) {
// 		searchInput.removeEventListener("input", onInputFilled);
// 		searchInput.removeEventListener("input", onInputCleared);
// 		searchInput.removeEventListener("keypress", createChildDiv);
// 	}
// }

// function unsetEventSearchContact() {
// 	const searchInput = document.getElementById("search-contact-searchbar-input-id");

// 	if (searchInput) {
// 		searchInput.removeEventListener("input", onInputFilled);
// 		searchInput.removeEventListener("input", onInputCleared);
// 		searchInput.removeEventListener("keypress", createChildDiv);
// 	}
// }

export { unsetEventListener }


// REMOVE ALL
// function removeAllglobalVariables.EventListeners() {
//     for (const eventName in globalVariables.eventListeners) {
//         const listeners = globalVariables.eventListeners[eventName];
//         for (const elementId in listeners) {
//             const eventHandler = listeners[elementId];
//             const element = document.getElementById(elementId);
//             if (element) {
//                 element.removeEventListener(eventName, eventHandler);
//             }
//         }
//     }

// 	globalVariables.eventListeners = {};
// }
