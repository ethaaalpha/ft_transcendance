import { createChildDiv } from './div.js';
import { sendMessage } from '../action/chat.js';

function unsetEventListener(eventToUnset, exception) {
	eventToUnset.forEach(event => {
		if (event !== exception) {
			switch (event) {
				// case "sign-in":
				//     unsetEventSignIn();
				//     break;
				// case "sign-up":
				//     unsetEventSignUp();
				//     break;
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
				// case "profil":
				//     unsetEventProfil();
				//     break;
				// case "settings":
				//     unsetEventSettings();
				//     break;
				// case "modify-game-theme":
				//     unsetEventModifyGameTheme();
				//     break;
				// case "modify-profil-picture":
				//     unsetEventModifyProfilPicture();
				//     break;
				// case "modify-password":
				//     unsetEventModifyPassword();
				//     break;
				// case "modify-email":
				//     unsetEventModifyEmail();
				//     break;
				default:
					console.log("Invalid event for unsetEventListener: ", event);
			}
		}
	});
}

function unsetEventConversationDisplay() {
	const messageInput = document.getElementById("send-message-input-id");

	if (messageInput) {
		messageInput.removeEventListener("keypress", sendMessage);
	}
}

function unsetEventConversationList() {
	const searchInput = document.getElementById("conversation-list-searchbar-input-id");

	if (searchInput) {
		searchInput.removeEventListener("input", onInputFilled);
		searchInput.removeEventListener("input", onInputCleared);
		searchInput.removeEventListener("keypress", createChildDiv);
	}
}

function unsetEventSearch() {
	const searchInput = document.getElementById("search-searchbar-input-id");

	if (searchInput) {
		searchInput.removeEventListener("input", onInputFilled);
		searchInput.removeEventListener("input", onInputCleared);
		searchInput.removeEventListener("keypress", createChildDiv);
	}
}

function unsetEventSearchContact() {
	const searchInput = document.getElementById("search-contact-searchbar-input-id");

	if (searchInput) {
		searchInput.removeEventListener("input", onInputFilled);
		searchInput.removeEventListener("input", onInputCleared);
		searchInput.removeEventListener("keypress", createChildDiv);
	}
}

export { unsetEventListener }
