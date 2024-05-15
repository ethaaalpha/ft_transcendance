import { createNavBar } from '/static/default/assets/js/spaManagement/div/createNavBar.js';
import { createSignIn } from '/static/default/assets/js/spaManagement/div/createSignIn.js';
import { createSignUp } from '/static/default/assets/js/spaManagement/div/createSignUp.js';
import { createConversationList } from '/static/default/assets/js/spaManagement/div/createConversationList.js';
import { createConversationDisplay } from '/static/default/assets/js/spaManagement/div/createConversationDisplay.js';
import { createSearch } from '/static/default/assets/js/spaManagement/div/createSearch.js';
import { createProfil } from '/static/default/assets/js/spaManagement/div/createProfile.js';
import { createInGame } from '/static/default/assets/js/spaManagement/div/createInGame.js';
import { createSettings } from '/static/default/assets/js/spaManagement/div/createSettings.js';
import { createSettingsGameTheme } from '/static/default/assets/js/spaManagement/div/createSettingsGameTheme.js';
import { createSettingsProfilPicture } from '/static/default/assets/js/spaManagement/div/createSettingsProfilePicture.js';
import { createSettingsPassword } from '/static/default/assets/js/spaManagement/div/createSettingsPassword.js';
import { createSettingsEmail } from '/static/default/assets/js/spaManagement/div/createSettingsEmail.js';
import { createError } from '/static/default/assets/js/spaManagement/div/createError.js';

function removeChildDiv(parentIds, ...excludeIds) {
	parentIds.forEach(parentId => {
		if (excludeIds.includes(parentId)) return;

		const parent = document.getElementById(parentId);
		if (!parent) {
			console.error(`The element with ID "${parentId}" does not exist.`);
			return;
		}

		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
	});
}

async function createChildDiv(divIds, username) {
	try {
		for (const divId of divIds) {
			switch (divId) {
				case "nav-bar":
					createNavBar(username);
					break;
				case "sign-in":
					createSignIn();
					break;
				case "sign-up":
					createSignUp();
					break;
				case "conversation-list":
					await createConversationList();
					break;
				case "conversation-display":
					await createConversationDisplay(username);
					break;
				case "search":
					await createSearch(username);
					break;
				case "profile":
					await createProfil(username);
					break;
				case "in-game":
					await createInGame(username);
					break;
				case "settings":
					createSettings();
					break;
				case "settings-game-theme":
					createSettingsGameTheme();
					break;
				case "settings-profile-picture":
					createSettingsProfilPicture();
					break;
				case "settings-password":
					createSettingsPassword();
					break;
				case "settings-email":
					createSettingsEmail();
					break;
				case 'error':
					createError();
					break;
				default:
					console.log("Invalid divId: ", divId);
					throw new Error("Invalid divId");
			}
		}
	} catch (error) {
		console.error("Error creating child div: ", error);
		throw error;
	}
}

export { createChildDiv, removeChildDiv };
