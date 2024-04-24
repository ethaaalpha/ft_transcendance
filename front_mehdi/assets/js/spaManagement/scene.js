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
        case "home":
            sceneHome();
            break;
        case "conversation-list":
            sceneConversationList();
            break;
		case "search":
			sceneSearch();
			break;
        case "conversation-display":
            sceneConversationDisplay(user);
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

    console.log("Current scene is:", globalVariables.currentScene);
}

// Handler

//earch create div has to delete his childs before creating it

function sceneSignIn() {
	globalVariables.currentScene = "sign-in";

	hideElements("sign-in");
	createChildDiv("sign-in");

	hideElements();//everything

	unhideElements("sign-in");
	removeChildDiv();// everything exept sign in
}

function sceneSignUp() {
	globalVariables.currentScene = "sign-up";
	
	hideElements("sign-up");
	createChildDiv("sign-up");//get text input in username and password if it exist
	
	hideElements();//everything
	
	unhideElements("sign-up");
	removeChildDiv();// everything exept sign up
}

//

function sceneHome() {
    globalVariables.currentScene = "home";
	// hideElements("signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	// resetFormFields("username", "password", "passwordConfirm", "email");
    unhideElements("home");
	changeScene("conversation-list");
}

async function sceneConversationList() {
    globalVariables.currentScene = "conversation-list";
	hideElements("conversation-display", "signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
    removeChildDiv("conversation-display", "conversation-list", "profil", "settings", "modify-game-theme");
	// await fetchConversations();
	await createChildDiv("conversation-list");
	setEventListener("conversation-list");
	unhideElements("conversation-list");
}

function sceneSearch() {
    globalVariables.currentScene = "search";
	hideElements("conversation-display", "signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
    removeChildDiv("conversation-display", "conversation-list-contact-container-id", "profil");
	// createChildDiv("conversation-list");
	// unhideElements("conversation-list");
}

async function sceneConversationDisplay(user) {
    globalVariables.currentScene = "conversation-display";
	unsetEventListener("conversation-list");
	hideElements("conversation-list", "signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	removeChildDiv("conversation-display", "conversation-list", "profil");
	await createChildDiv("conversation-display", user);
	setEventListener("conversation-display");
	unhideElements("conversation-display");
}

async function sceneProfil(user) {
	globalVariables.currentScene = "profil";
	unsetEventListener("conversation-list");
    hideElements("conversation-display", "conversation-list", "chat", "settings", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	removeChildDiv("conversation-display", "conversation-list", "profil", "settings", "modify-game-theme");
	await fetchUserData();
	await createChildDiv("profil", user);
	unhideElements("profil");
}

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
