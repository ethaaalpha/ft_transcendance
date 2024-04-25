import globalVariables from '../init.js';
import { removeChildDiv, createChildDiv } from './div.js';
import { fetchUserData } from '../init.js';
import { setEventListener, unsetEventListener } from './eventListener.js'
import { fetchConversations } from '../action/chat.js';
import { signIn } from '../action/userManagement.js';

function changeScene(newScene, username) {
    switch (newScene) {
        case "sign-in":
            sceneSignIn();
            break;
        case "sign-up":
            sceneSignUp();
            break;
        // case "home":
        //     sceneHome();
        //     break;
        case "conversation-list":
            sceneConversationList();
            break;
		case "conversation-display":
			sceneConversationDisplay(username);
			break;
		case "search":
			sceneSearch();
			break;
		case "search-contact":
			sceneSearchContact(username);
			break;
		case "profil":
			sceneProfil(username);
			break;
		case "settings":
			sceneSettings();
			break;
		case "modify-game-theme":
			sceneModifyGameTheme();
			break;
		case "modify-profil-picture":
			sceneModifyProfilPicture();
			break;
        case "modify-password":
            sceneModifyPassword();
            break;
        case "modify-email":
            sceneModifyEmail();
            break;
        default:
            console.log("Invalid scene: ", newScene);
    }

    console.log("Scene:", globalVariables.currentScene);
}

// Handler

const parentsToHide = [
    "sign-in",
    "sign-up",
    "conversation-list",
    "conversation-display",
	"search",
	"search-contact",
    "profil",
    "settings",
	"home",
    "modify-game-theme",
    "modify-profil-picture",
    "modify-password",
    "modify-email",
    "nav-bar"
];

const parentsToremove = [
    "sign-in",
    "sign-up",
    "conversation-list",
    "conversation-display",
	"search",
	"search-contact",
    "profil",
    "settings",
    "modify-game-theme",
    "modify-profil-picture",
    "modify-password",
    "modify-email",
    "nav-bar"
	// "home"
];


const eventsToUnset = [
    // "sign-in",
    // "sign-up",
    "conversation-list",
    "conversation-display",
	"search",
	"search-contact"
    // "profil",
    // "settings",
    // "modify-game-theme",
    // "modify-profil-picture",
    // "modify-password",
    // "modify-email",
    // "nav-bar"
];

async function sceneSignIn() {
	globalVariables.currentScene = "sign-in";

	hideElements("sign-in");
	await createChildDiv("sign-in");

	hideElements(parentsToHide);

	unhideElements("sign-in");
	removeChildDiv(parentsToremove, "sign-in");
}

async function sceneSignUp() {
	globalVariables.currentScene = "sign-up";
	
	hideElements("sign-up");
	await createChildDiv("sign-up");
	
	hideElements(parentsToHide);
	
	unhideElements("sign-up");
	removeChildDiv(parentsToremove, "sign-up");
}

// function sceneHome() {
//     globalVariables.currentScene = "home";
// 	hideElements(parentsToHide);

//     unhideElements("home");
// 	changeScene("conversation-list");
// }

async function sceneConversationList() {//template
	globalVariables.currentScene = "conversation-list";
	hideElements("conversation-list");
	await createChildDiv(["conversation-list", "nav-bar"]);
	setEventListener("conversation-list");
	
	hideElements(parentsToHide);
	unhideElements("home", "nav-bar", "conversation-list");
	unsetEventListener(eventsToUnset, "conversation-list");
	removeChildDiv(parentsToremove, "conversation-list", "nav-bar");
}

async function sceneSearch() {
	globalVariables.currentScene = "search";
	hideElements("search");
	await createChildDiv(["search", "nav-bar"]);
	setEventListener("search");
	
	hideElements(parentsToHide);
	unhideElements("home", "nav-bar", "search");
	unsetEventListener(eventsToUnset, "search");
	removeChildDiv(parentsToremove, "search", "nav-bar");
}

async function sceneSearchContact(user) {
	globalVariables.currentScene = "search-contact";
	hideElements("search-contact");
	await createChildDiv(["search-contact", "nav-bar"], user);
	setEventListener("search-contact");
	
	hideElements(parentsToHide);
	unhideElements("home", "nav-bar", "search-contact");
	unsetEventListener(eventsToUnset, "search-contact");
	removeChildDiv(parentsToremove, "search-contact", "nav-bar");
}

async function sceneConversationDisplay(user) {
	globalVariables.currentScene = "conversation-display";
	hideElements("conversation-display");
	await createChildDiv(["conversation-display", "nav-bar"], user);
	setEventListener("conversation-display");
	
	hideElements(parentsToHide);
	unhideElements("home", "nav-bar", "conversation-display");
	unsetEventListener(eventsToUnset, "conversation-display");
	removeChildDiv(parentsToremove, "conversation-display", "nav-bar");
}


async function sceneProfil(username) {
	globalVariables.currentScene = "profil";
	hideElements("profil");
	await createChildDiv(["profil", "nav-bar"], username);
	// setEventListener("profil");
	
	hideElements(parentsToHide);
	unhideElements("home", "nav-bar", "profil");
	unsetEventListener(eventsToUnset, "profil");
	removeChildDiv(parentsToremove, "profil", "nav-bar");

	// globalVariables.currentScene = "profil";

	// hideElements("profil");
	// await createChildDiv("profil", user);
	// // setEventListener("profil");

	// hideElements(parentsToHide);
	// unhideElements("home");
	// unhideElements("profil");
	// unsetEventListener(eventsToUnset, "profil");
	// removeChildDiv(parentsToremove, "profil");
}

// to update below

async function sceneSettings() {
	globalVariables.currentScene = "settings";
	hideElements("conversation-display", "signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	unsetEventListener("conversation-list");// same as below
    removeChildDiv("conversation-display", "conversation-list", "profil", "modify-game-theme", "modify-profil-picture");//add all to be deleted list, remove hidder after
	await fetchUserData();
	await createChildDiv("settings");
	unhideElements("settings");
	// hideElements("conversation-display", "conversation-list", "chat", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	// resetFormFields("settings-actual-password", "settings-new-password", "settings-confirm-password", "settings-actual-email", "settings-new-email", "settings-confirm-email");
}

async function sceneModifyGameTheme() {
	globalVariables.currentScene = "modify-game-theme";
	hideElements("conversation-display", "conversation-list", "chat", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture");
	removeChildDiv("settings", "modify-game-theme");
	await createChildDiv("modify-game-theme");
	unhideElements("modify-game-theme");
}

async function sceneModifyProfilPicture() {
	globalVariables.currentScene = "modify-profil-picture";
	hideElements("conversation-display", "conversation-list", "chat", "settings", "profil", "modify-password", "modify-email", "modify-game-theme");
	removeChildDiv("settings", "modify-game-theme", "modify-email");
	await createChildDiv("modify-profil-picture");
	unhideElements("modify-profil-picture");
}

async function sceneModifyPassword() {
    globalVariables.currentScene = "modify-password";
    hideElements("conversation-display", "conversation-list", "chat", "settings", "profil", "modify-email", "modify-profil-picture", "modify-game-theme");
	removeChildDiv("settings", "modify-game-theme", "modify-password", "modify-email");
	await createChildDiv("modify-password");
	unhideElements("modify-password");
}

async function sceneModifyEmail() {
    globalVariables.currentScene = "modify-email";
    hideElements("conversation-display", "conversation-list", "chat", "settings", "profil", "modify-password", "modify-profil-picture", "modify-game-theme");
    
	removeChildDiv("settings", "modify-game-theme", "modify-password", "modify-email");
	await createChildDiv("modify-email");
	
	unhideElements("modify-email");
}

// Utils
function resetFormFields(...elementIds) {
    elementIds.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element && element.tagName === "INPUT") {
            element.value = "";
        }
    });
}

function hideElements(...elementIds) {
    elementIds.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add("d-none");
        }
    });
}

function unhideElements(...elementIds) {
    elementIds.forEach(elementId => {
        var element = document.getElementById(elementId);
        if (element) {
            element.classList.remove("d-none");
        }
    });
}

export { changeScene };
