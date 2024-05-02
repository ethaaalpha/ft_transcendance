import globalVariables from '../init.js';
import { removeChildDiv, createChildDiv } from './div.js';
import { setEventListener } from './setEvent.js';
import { unsetEventListener } from './unsetEvent.js';
import { setFocus } from './setFocus.js';

// CHANGE SCENE
let sceneChangeLock = false;

async function changeScene(newScene, username) {
	if (sceneChangeLock) {
		addToSceneQueue(newScene, username);
		return;
	}

	sceneChangeLock = true;

	try {
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
				console.log("Invalid scene in changeScene :", globalVariables.currentScene);
		}
	} catch (error) {
		console.error("Error during scene change :", error);
	} finally {
		sceneChangeLock = false;
		const nextScene = dequeueNextScene();
		if (nextScene) {
			const { scene, username } = nextScene;
			await changeScene(scene, username);
		}
	}
}

let sceneQueue = [];

function addToSceneQueue(newScene, username) {
	sceneQueue = [{ scene: newScene, username: username }];
}

function dequeueNextScene() {
	const nextScene = sceneQueue.shift();
	return nextScene;
}

// VARIABLES
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

// HANDLER
async function sceneSignIn() {
	globalVariables.currentScene = "sign-in";
	
	await removeChildDiv(["sign-in"]);
	hideElements("sign-in");

	await createChildDiv(["sign-in"]);
	setEventListener("sign-in");
	
	hideElements(...parentsToHide);
	unhideElements("sign-in");
	setFocus("sign-in");

	unsetEventListener(eventsToUnset, "sign-in");
	await removeChildDiv(parentsToremove, "sign-in");
}

async function sceneSignUp() {
	globalVariables.currentScene = "sign-up";
	
	await removeChildDiv(["profil"]);
	hideElements("sign-up");
	
	await createChildDiv(["sign-up"]);
	setEventListener("sign-up");
	
	hideElements(...parentsToHide);
	unhideElements("sign-up");
	setFocus("sign-up");
	
	unsetEventListener(eventsToUnset, "sign-up");
	await removeChildDiv(parentsToremove, "sign-up");
}

async function sceneConversationList() {
	globalVariables.currentScene = "conversation-list";

	//CLEAN NEW SCENE
	await removeChildDiv(["conversation-list"]);								//remove NEW if already exist
	hideElements("conversation-list");											//hide NEW

	//CREATE NEW SCENE
	await createChildDiv(["conversation-list", "nav-bar"]);						//create child NEW
	setEventListener("conversation-list");										//set event NEW
	
	//TRANSITION TO NEW SCENE
	hideElements(...parentsToHide);												//hide ALL
	unhideElements("home", "nav-bar", "conversation-list");						//unhide NEW
	// setFocus();

	//CLEAN OLD SCENES
	unsetEventListener(eventsToUnset, "conversation-list");						//unset ALL (exept NEW)
	await removeChildDiv(parentsToremove, "conversation-list", "nav-bar");		//remove ALL (exept NEW)
}

async function sceneConversationDisplay(username) {
	globalVariables.currentScene = "conversation-display";
	
	await removeChildDiv(["conversation-display"]);
	hideElements("conversation-display");

	await createChildDiv(["conversation-display", "nav-bar"], username);
	setEventListener("conversation-display");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "conversation-display");
	setFocus("conversation-display");
	
	unsetEventListener(eventsToUnset, "conversation-display");
	await removeChildDiv(parentsToremove, "conversation-display", "nav-bar");
}

async function sceneSearch(username) {
	globalVariables.currentScene = "search";
	
	await removeChildDiv(["search"]);
	hideElements("search");
	
	await createChildDiv(["search", "nav-bar"], username);
	setEventListener("search");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "search");
	setFocus("search");
	
	unsetEventListener(eventsToUnset, "search");
	await removeChildDiv(parentsToremove, "search", "nav-bar");
}

async function sceneProfil(username) {
	globalVariables.currentScene = "profil";
	
	await removeChildDiv(["profil", "match-history"]);
	hideElements("profil", "match-history");
	
	await createChildDiv(["profil", "nav-bar"], username);
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "profil", "match-history");

	unsetEventListener(eventsToUnset, "profil");
	await removeChildDiv(parentsToremove, "profil", "match-history", "nav-bar");
}


async function sceneSettings() {
	globalVariables.currentScene = "settings";

	await removeChildDiv(["settings"]);
	hideElements("settings");
	
	await createChildDiv(["settings", "nav-bar"]);
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "settings");

	unsetEventListener(eventsToUnset, "settings");
	await removeChildDiv(parentsToremove, "settings", "nav-bar");
}

async function sceneSettingsGameTheme() {
	globalVariables.currentScene = "settings-game-theme";
	
	await removeChildDiv(["settings-game-theme"]);
	hideElements("settings-game-theme");
	
	await createChildDiv(["settings-game-theme", "nav-bar"]);
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "settings-game-theme");
	
	unsetEventListener(eventsToUnset, "settings-game-theme");
	await removeChildDiv(parentsToremove, "settings-game-theme", "nav-bar");
}

async function sceneSettingsProfilPicture() {
	globalVariables.currentScene = "settings-profil-picture";
	
	await removeChildDiv(["settings-profil-picture"]);
	hideElements("settings-profil-picture");
	
	await createChildDiv(["settings-profil-picture", "nav-bar"]);
	setEventListener("settings-profil-picture");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "settings-profil-picture");
	
	unsetEventListener(eventsToUnset, "settings-profil-picture");
	await removeChildDiv(parentsToremove, "settings-profil-picture", "nav-bar");
}

async function sceneSettingsPassword() {
	globalVariables.currentScene = "settings-password";
	
	await removeChildDiv(["settings-password"]);
	hideElements("settings-password");
	
	await createChildDiv(["settings-password", "nav-bar"]);
	setEventListener("settings-password");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "settings-password");
	setFocus("settings-password");
	
	unsetEventListener(eventsToUnset, "settings-password");
	await removeChildDiv(parentsToremove, "settings-password", "nav-bar");
}

async function sceneSettingsEmail() {
	globalVariables.currentScene = "settings-email";
	
	await removeChildDiv(["settings-email"]);
	hideElements("settings-email");

	await createChildDiv(["settings-email", "nav-bar"]);
	setEventListener("settings-email");
	
	hideElements(...parentsToHide);
	unhideElements("home", "nav-bar", "settings-email");
	setFocus("settings-email");
	
	unsetEventListener(eventsToUnset, "settings-email");
	await removeChildDiv(parentsToremove, "settings-email", "nav-bar");
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
