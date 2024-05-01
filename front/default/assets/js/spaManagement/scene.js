import globalVariables from '../init.js';
import { removeChildDiv, createChildDiv } from './div.js';
import { setEventListener } from './setEvent.js';
import { unsetEventListener } from './unsetEvent.js';
import { setFocus } from './setFocus.js';

async function changeScene(newScene, username) {
	switch (newScene) {
		case "sign-in":
			sceneSignIn();
			break;
		case "sign-up":
			sceneSignUp();
			break;
		case "conversation-list":
			sceneConversationList();
			break;
		case "conversation-display":
			sceneConversationDisplay(username);
			break;
		case "search":
			sceneSearch(username);
			break;
		case "profil":
			sceneProfil(username);
			break;
		case "settings":
			sceneSettings();
			break;
		case "settings-game-theme":
			sceneSettingsGameTheme();
			break;
		case "settings-profil-picture":
			sceneSettingsProfilPicture();
			break;
		case "settings-password":
			sceneSettingsPassword();
			break;
		case "settings-email":
			sceneSettingsEmail();
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
	'settings-profil-picture'
];

// Handler
async function sceneSignIn() {
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
	globalVariables.currentScene = "profil";
	hideElements("profil");
	await createChildDiv(["profil", "nav-bar"], username);
	// setEventListener("profil");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "profil");
	unsetEventListener(eventsToUnset, "profil");
	removeChildDiv(parentsToremove, "profil", "nav-bar");
}


async function sceneSettings() {
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
	globalVariables.currentScene = "settings-password";
	hideElements("settings-password");
	await createChildDiv(["settings-password", "nav-bar"]);
	// setEventListener("settings-password");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "settings-password");
	unsetEventListener(eventsToUnset, "settings-password");
	removeChildDiv(parentsToremove, "settings-password", "nav-bar");
}

async function sceneSettingsEmail() {
	globalVariables.currentScene = "settings-email";
	hideElements("settings-email");
	await createChildDiv(["settings-email", "nav-bar"]);
	// setEventListener("settings-email");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "settings-email");
	unsetEventListener(eventsToUnset, "settings-email");
	removeChildDiv(parentsToremove, "settings-email", "nav-bar");
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
