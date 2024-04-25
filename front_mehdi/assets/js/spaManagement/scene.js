import globalVariables from '../init.js';
import { removeChildDiv, createChildDiv } from './div.js';
import { fetchUserData } from '../init.js';
import { setEventListener, unsetEventListener } from './eventListener.js'
import { fetchConversations } from '../action/chat.js';
import { signIn } from '../action/userManagement.js';

function changeScene(newScene, user) {
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
			sceneConversationDisplay(user);
			break;
		case "search":
			sceneSearch();
			break;
		case "search-contact":
			sceneSearchContact(user);
			break;
		case "profil":
			sceneProfil(user);
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

    console.log("Current scene:", globalVariables.currentScene);
}

// Handler


const parentToHide = [
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
    // "nav-bar"
];

const parentToremove = [
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
    // "nav-bar"
];


const eventToUnset = [
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

	hideElements(parentToHide);

	unhideElements("sign-in");
	removeChildDiv(parentToremove, "sign-in");
}

async function sceneSignUp() {
	globalVariables.currentScene = "sign-up";
	
	hideElements("sign-up");
	await createChildDiv("sign-up");
	
	hideElements(parentToHide);
	
	unhideElements("sign-up");
	removeChildDiv(parentToremove, "sign-up");
}

// function sceneHome() {
//     globalVariables.currentScene = "home";
// 	hideElements(parentToHide);

//     unhideElements("home");
// 	changeScene("conversation-list");
// }

async function sceneConversationList() {
	globalVariables.currentScene = "conversation-list";

	hideElements("conversation-list");
	await createChildDiv("conversation-list");
	setEventListener("conversation-list");
	
	hideElements(parentToHide);
	unhideElements("home");
	unhideElements("conversation-list");
	unsetEventListener(eventToUnset, "conversation-list");
	removeChildDiv(parentToremove, "conversation-list");
}

async function sceneSearch() {
	globalVariables.currentScene = "search";

	hideElements("search");
	await createChildDiv("search");
	setEventListener("search");

	hideElements(parentToHide);
	unhideElements("home");
	unhideElements("search");
	unsetEventListener(eventToUnset, "search");
	removeChildDiv(parentToremove, "search");	
}

async function sceneSearchContact(user) {
	globalVariables.currentScene = "search-contact";

	hideElements("search-contact");
	await createChildDiv("search-contact", user);
	setEventListener("search-contact");

	hideElements(parentToHide);
	unhideElements("home");
	unhideElements("search-contact");
	unsetEventListener(eventToUnset, "search-contact");
	removeChildDiv(parentToremove, "search-contact");	
}

async function sceneConversationDisplay(user) {
	globalVariables.currentScene = "conversation-display";

	hideElements("conversation-display");
	await createChildDiv("conversation-display", user);
	setEventListener("conversation-display");

	hideElements(parentToHide);
	unhideElements("home");
	unhideElements("conversation-display");
	unsetEventListener(eventToUnset, "conversation-display");
	removeChildDiv(parentToremove, "conversation-display");
}


async function sceneProfil(user) {
	globalVariables.currentScene = "profil";

	hideElements("profil");
	await createChildDiv("profil", user);
	setEventListener("profil");

	hideElements(parentToHide);
	unhideElements("home");
	unhideElements("profil");
	unsetEventListener(eventToUnset, "profil");
	removeChildDiv(parentToremove, "profil");
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
