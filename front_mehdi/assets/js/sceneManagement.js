import globalVariables from './main.js';
import { removeChildDiv, createChildDiv } from './divManagement.js';
import { fetchUserData } from './main.js';
import { setEventListener, unsetEventListener } from './eventListenerManagement.js'

function changeScene(newScene, user) {
    switch (newScene) {
        case "signIn":
            sceneSignIn();
            break;
        case "signUp":
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
		case "modifyGameTheme":
			sceneModifyGameTheme();
			break;
		case "modifyProfilPicture":
			sceneModifyProfilPicture();
			break;
        case "modifyPassword":
            sceneModifyPassword();
            break;
        case "modifyEmail":
            sceneModifyEmail();
            break;
        default:
            console.log("Invalid scene: ", newScene);
    }

    console.log("Current scene is:", globalVariables.currentScene);
}

//scene
function sceneSignIn() {
    if (globalVariables.currentScene === "start") {
        unhideElements("signForm");
        globalVariables.currentScene = "signIn";
	}
	else if (globalVariables.currentScene == "settings") {
		hideElements("titleSignUp", "passwordConfirmDiv", "signUpButton", "emailDiv", "home", "settings");
		unhideElements("titleSignIn", "signWith42Button", "signInButton", "forgotPasswordButton", "signForm", "orDiv");
	}
	globalVariables.currentScene = "signIn";
}

function sceneSignUp() {
	hideElements("titleSignIn", "signWith42Button", "signInButton", "forgotPasswordButton", "orDiv");
    unhideElements("titleSignUp", "passwordConfirmDiv", "signUpButton", "emailDiv");
    globalVariables.currentScene = "signUp";
}

function sceneHome() {
	hideElements("signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	resetFormFields("username", "password", "passwordConfirm", "email");
    unhideElements("home");
    globalVariables.currentScene = "home";
	changeScene("conversation-list");
}

async function sceneConversationList() {
	hideElements("conversation-display", "signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
    removeChildDiv("conversation-display", "conversation-list", "profil");
	await fetchUserData();
	await createChildDiv("conversation-list");
	setEventListener("conversation-list");
	unhideElements("conversation-list");
    globalVariables.currentScene = "conversation-list";
}

function sceneSearch() {
	hideElements("conversation-display", "signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
    removeChildDiv("conversation-display", "conversation-list-contact-container-id", "profil");
	// createChildDiv("conversation-list");
	// unhideElements("conversation-list");
    globalVariables.currentScene = "search";
}

function sceneConversationDisplay(user) {
	unsetEventListener("conversation-list");
	hideElements("conversation-list", "signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	removeChildDiv("conversation-display", "conversation-list", "profil");
	createChildDiv("conversation-display", user);
	setEventListener("conversation-display");
	unhideElements("conversation-display");
    globalVariables.currentScene = "conversation-display";
}

function sceneSettings() {
	unsetEventListener("conversation-list");
    hideElements("conversation-display", "conversation-list", "chat", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	resetFormFields("settings-actual-password", "settings-new-password", "settings-confirm-password", "settings-actual-email", "settings-new-email", "settings-confirm-email");
	unhideElements("settings");
    globalVariables.currentScene = "settings";
}

async function sceneProfil(user) {
    globalVariables.currentScene = "profil";
	unsetEventListener("conversation-list");
    hideElements("conversation-display", "conversation-list", "chat", "settings", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	removeChildDiv("conversation-display", "conversation-list", "profil");
	await fetchUserData();
	createChildDiv("profil", user);
	unhideElements("profil");
}

function sceneModifyGameTheme() {
	hideElements("conversation-display", "conversation-list", "chat", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture");
	unhideElements("modify-game-theme");
	globalVariables.currentScene = "modifyGameTheme";
}

function sceneModifyProfilPicture() {
	hideElements("conversation-display", "conversation-list", "chat", "settings", "profil", "modify-password", "modify-email", "modify-game-theme");
	unhideElements("modify-profil-picture");
	globalVariables.currentScene = "modifyProfilPicture";
}

function sceneModifyPassword() {
    hideElements("conversation-display", "conversation-list", "chat", "settings", "profil", "modify-email", "modify-profil-picture", "modify-game-theme");
    unhideElements("modify-password");
    globalVariables.currentScene = "modifyPassword";
}

function sceneModifyEmail() {
    hideElements("conversation-display", "conversation-list", "chat", "settings", "profil", "modify-password", "modify-profil-picture", "modify-game-theme");
    unhideElements("modify-email");
    globalVariables.currentScene = "modifyEmail";
}

//utils
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

//navbar button
function settingsAction() {
    if (globalVariables.currentScene == "settings") {
        changeScene("home");
    } else {
        changeScene("settings");
    }
}

async function profilAction() {
    if (globalVariables.currentScene == "profil") {
        changeScene("home");
    } else {
		const username = await fetchCurrentUsername();
        changeScene("profil", username);
    }
}

export { changeScene, settingsAction, profilAction };
