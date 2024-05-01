import globalVariables from '../init.js';
import { removeChildDiv, createChildDiv } from './div.js';
import { setEventListener } from './setEvent.js';
import { unsetEventListener } from './unsetEvent.js';
import { setFocus } from './setFocus.js';

async function changeScene(newScene, username) {
	switch (newScene) {
		case "sign-in":
			await sceneSignIn();
			break;
		case "sign-up":
			await sceneSignUp();
			break;
		case "conversation-list":
			await sceneConversationList();
			break;
		case "conversation-display":
			await sceneConversationDisplay(username);
			break;
		case "search":
			await sceneSearch(username);
			break;
		case "profil":
			await sceneProfil(username);
			break;
		case "settings":
			await sceneSettings();
			break;
		case "settings-game-theme":
			await sceneSettingsGameTheme();
			break;
		case "settings-profil-picture":
			await sceneSettingsProfilPicture();
			break;
		case "settings-password":
			await sceneSettingsPassword();
			break;
		case "settings-email":
			await sceneSettingsEmail();
			break;
		default:
			console.log("Invalid scene in changeScene: ", globalVariables.currentScene);
	}
	console.log("Scene:", globalVariables.currentScene);
}

// Variables
const parentsToHide = [
	"sign-in",
	"sign-up",
	"conversation-list",
	"conversation-display",
	"search",
	"profil",
	"match-history",
	"settings",
	"settings-game-theme",
	"settings-profil-picture",
	"settings-password",
	"settings-email",
	"nav-bar",
	"home",
];

const parentsToremove = [
	"sign-in",
	"sign-up",
	"conversation-list",
	"conversation-display",
	"search",
	"profil",
	"match-history",
	"settings",
	"settings-game-theme",
	"settings-profil-picture",
	"settings-password",
	"settings-email",
	"nav-bar"
];

const eventsToUnset = [
	"sign-in",
	"sign-up",
	"conversation-list",
	"conversation-display",
	"search",
	"settings-profil-picture",
	"settings-password",
	"settings-email",
];

// Handler
async function sceneSignIn() {
	removeChildDiv(["sign-in"]); // Ici parce-que sinon ça pue

	globalVariables.currentScene = "sign-in";
	hideElements("sign-in");
	await createChildDiv(["sign-in"]);
	setEventListener("sign-in");
	
	hideElements(...parentsToHide);
	unhideElements("sign-in");
	unsetEventListener(eventsToUnset, "sign-in");
	removeChildDiv(parentsToremove, "sign-in");
	setFocus("sign-in");
}

async function sceneSignUp() {
	removeChildDiv(["profil"]); // Ici parce-que sinon ça pue

	globalVariables.currentScene = "sign-up";
	hideElements("sign-up");
	await createChildDiv(["sign-up"]);
	setEventListener("sign-up");
	
	hideElements(...parentsToHide);
	unhideElements("sign-up");
	unsetEventListener(eventsToUnset, "sign-up");
	removeChildDiv(parentsToremove, "sign-up");
	setFocus("sign-up");
}

async function sceneConversationList() {
	removeChildDiv(["conversation-list"]); // Ici parce-que sinon ça pue

	globalVariables.currentScene = "conversation-list";
	hideElements("conversation-list");
	await createChildDiv(["conversation-list", "nav-bar"]);
	setEventListener("conversation-list");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "conversation-list");
	unsetEventListener(eventsToUnset, "conversation-list");
	removeChildDiv(parentsToremove, "conversation-list", "nav-bar");
}

async function sceneConversationDisplay(username) {
	removeChildDiv(["conversation-display"]); // Ici parce-que sinon ça pue

	globalVariables.currentScene = "conversation-display";
	hideElements("conversation-display");
	await createChildDiv(["conversation-display", "nav-bar"], username);
	setEventListener("conversation-display");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "conversation-display");
	unsetEventListener(eventsToUnset, "conversation-display");
	removeChildDiv(parentsToremove, "conversation-display", "nav-bar");
	setFocus("conversation-display");
}

async function sceneSearch(username) {
	removeChildDiv(["search"]); // Ici parce-que sinon ça pue

	globalVariables.currentScene = "search";
	hideElements("search");
	await createChildDiv(["search", "nav-bar"], username);
	setEventListener("search");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "search");
	unsetEventListener(eventsToUnset, "search");
	removeChildDiv(parentsToremove, "search", "nav-bar");
	setFocus("search");
}

async function sceneProfil(username) {
	removeChildDiv(["profil", "match-history"]); // Ici parce-que sinon ça pue

	globalVariables.currentScene = "profil";
	hideElements("profil", "match-history");
	await createChildDiv(["profil", "nav-bar"], username);
	// setEventListener("profil");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "profil", "match-history");
	unsetEventListener(eventsToUnset, "profil");
	removeChildDiv(parentsToremove, "profil", "match-history", "nav-bar");
}


async function sceneSettings() {
	removeChildDiv(["settings"]); // Ici parce-que sinon ça pue

	globalVariables.currentScene = "settings";
	hideElements("settings");
	await createChildDiv(["settings", "nav-bar"]);
	// setEventListener("settings");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "settings");
	unsetEventListener(eventsToUnset, "settings");
	removeChildDiv(parentsToremove, "settings", "nav-bar");
}

async function sceneSettingsGameTheme() {
	removeChildDiv(["settings-game-theme"]); // Ici parce-que sinon ça pue

	globalVariables.currentScene = "settings-game-theme";
	hideElements("settings-game-theme");
	await createChildDiv(["settings-game-theme", "nav-bar"]);
	// setEventListener("settings-game-theme");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "settings-game-theme");
	unsetEventListener(eventsToUnset, "settings-game-theme");
	removeChildDiv(parentsToremove, "settings-game-theme", "nav-bar");
}

async function sceneSettingsProfilPicture() {
	removeChildDiv(["settings-profil-picture"]); // Ici parce-que sinon ça pue

	globalVariables.currentScene = "settings-profil-picture";
	hideElements("settings-profil-picture");
	await createChildDiv(["settings-profil-picture", "nav-bar"]);
	setEventListener("settings-profil-picture");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "settings-profil-picture");
	unsetEventListener(eventsToUnset, "settings-profil-picture");
	removeChildDiv(parentsToremove, "settings-profil-picture", "nav-bar");
}

async function sceneSettingsPassword() {
	removeChildDiv(["settings-password"]); // Ici parce-que sinon ça pue

	globalVariables.currentScene = "settings-password";
	hideElements("settings-password");
	await createChildDiv(["settings-password", "nav-bar"]);
	setEventListener("settings-password");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "settings-password");
	unsetEventListener(eventsToUnset, "settings-password");
	removeChildDiv(parentsToremove, "settings-password", "nav-bar");
	setFocus("settings-password");
}

async function sceneSettingsEmail() {
	removeChildDiv(["settings-email"]); // Ici parce-que sinon ça pue

	globalVariables.currentScene = "settings-email";
	hideElements("settings-email");
	await createChildDiv(["settings-email", "nav-bar"]);
	setEventListener("settings-email");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "settings-email");
	unsetEventListener(eventsToUnset, "settings-email");
	removeChildDiv(parentsToremove, "settings-email", "nav-bar");
	setFocus("settings-email");
}

// Utils
function hideElements(...elementIds) {
	elementIds.forEach(elementId => {
		const element = document.getElementById(elementId);
		if (element) {
			element.classList.add("d-none");
		}
	});
}

async function unhideElements(...elementIds) {
	elementIds.forEach(elementId => {
		var element = document.getElementById(elementId);
		if (element) {
			element.classList.remove("d-none");
		}
	});
}

export { changeScene };
