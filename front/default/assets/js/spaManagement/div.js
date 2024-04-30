import { createNavBar } from './div/createNavBar.js';
import { createSignIn } from './div/createSignIn.js';
import { createSignUp } from './div/createSignUp.js';
import { createConversationList } from './div/createConversationList.js';
import { createConversationDisplay } from './div/createConversationDisplay.js';
import { createSearch } from './div/createSearch.js';
import { createProfil } from './div/createProfil.js';
import { createSettings } from './div/createSettings.js';
import { createSettingsGameTheme } from './div/createSettingsGameTheme.js';
import { createSettingsProfilPicture } from './div/createSettingsProfilPicture.js';
import { createSettingsPassword } from './div/createSettingsPassword.js';
import { createSettingsEmail } from './div/createSettingsEmail.js';

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
					await createNavBar(username);
					break;
				case "sign-in":
					await createSignIn();
					break;
				case "sign-up":
					await createSignUp();
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
				case "profil":
					await createProfil(username);
					break;
				case "settings":
					await createSettings();
					break;
				case "settings-game-theme":
					await createSettingsGameTheme();
					break;
				case "settings-profil-picture":
					await createSettingsProfilPicture();
					break;
				case "settings-password":
					await createSettingsPassword();
					break;
				case "settings-email":
					await createSettingsEmail();
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
