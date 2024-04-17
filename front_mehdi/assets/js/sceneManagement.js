let currentScene = "start";

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

    console.log("Current scene is:", currentScene);
}

//scene
function sceneSignIn() {
    if (currentScene === "start") {
        unhideElements("signForm");
        currentScene = "signIn";
	}
	else if (currentScene == "settings") {
		hideElements("titleSignUp", "passwordConfirmDiv", "signUpButton", "emailDiv", "home", "settings");
		unhideElements("titleSignIn", "signWith42Button", "signInButton", "forgotPasswordButton", "signForm", "orDiv");
	}
	currentScene = "signIn";
}

function sceneSignUp() {
	hideElements("titleSignIn", "signWith42Button", "signInButton", "forgotPasswordButton", "orDiv");
    unhideElements("titleSignUp", "passwordConfirmDiv", "signUpButton", "emailDiv");
    currentScene = "signUp";
}

function sceneHome() {
	hideElements("signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	resetFormFields("username", "password", "passwordConfirm", "email");
    unhideElements("home");
    currentScene = "home";
	changeScene("conversation-list");
}

async function sceneConversationList() {
	hideElements("conversation-display", "signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
    removeChildDiv("conversation-display", "conversation-list", "profil");
	await createChildDiv("conversation-list");
	setEventListener("conversation-list");
	unhideElements("conversation-list");
    currentScene = "conversation-list";
	fetchUserData();
}

function sceneSearch() {
	hideElements("conversation-display", "signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
    removeChildDiv("conversation-display", "conversation-list-contact-container-id", "profil");
	// createChildDiv("conversation-list");
	// unhideElements("conversation-list");
    currentScene = "search";
}

function sceneConversationDisplay(user) {
	unsetEventListener("conversation-list");
	hideElements("conversation-list", "signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	removeChildDiv("conversation-display", "conversation-list", "profil");
	createChildDiv("conversation-display", user);
	unhideElements("conversation-display");
    currentScene = "conversation-display";
}

function sceneSettings() {
	unsetEventListener("conversation-list");
    hideElements("conversation-display", "conversation-list", "chat", "profil", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	resetFormFields("settings-actual-password", "settings-new-password", "settings-confirm-password", "settings-actual-email", "settings-new-email", "settings-confirm-email");
	unhideElements("settings");
    currentScene = "settings";
}

function sceneProfil(user) {
	unsetEventListener("conversation-list");
    hideElements("conversation-display", "conversation-list", "chat", "settings", "modify-password", "modify-email", "modify-profil-picture", "modify-game-theme");
	removeChildDiv("conversation-display", "conversation-list", "profil");
	fetchUserData();
	createChildDiv("profil", user);
	unhideElements("profil");
    currentScene = "profil";
}

function sceneModifyGameTheme() {
	hideElements("conversation-display", "conversation-list", "chat", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture");
	unhideElements("modify-game-theme");
	currentScene = "modifyGameTheme";
}

function sceneModifyProfilPicture() {
	hideElements("conversation-display", "conversation-list", "chat", "settings", "profil", "modify-password", "modify-email", "modify-game-theme");
	unhideElements("modify-profil-picture");
	currentScene = "modifyProfilPicture";
}

function sceneModifyPassword() {
    hideElements("conversation-display", "conversation-list", "chat", "settings", "profil", "modify-email", "modify-profil-picture", "modify-game-theme");
    unhideElements("modify-password");
    currentScene = "modifyPassword";
}

function sceneModifyEmail() {
    hideElements("conversation-display", "conversation-list", "chat", "settings", "profil", "modify-password", "modify-profil-picture", "modify-game-theme");
    unhideElements("modify-email");
    currentScene = "modifyEmail";
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

//social button
function settingsAction() {
    if (currentScene == "settings") {
        changeScene("home");
    } else {
        changeScene("settings");
    }
}

async function profilAction() {
    if (currentScene == "profil") {
        changeScene("home");
    } else {
		const username = await fetchCurrentUsername();
        changeScene("profil", username);
    }
}
