let currentScene = "start";

function changeScene(newScene) {
    switch (newScene) {
        case "signIn":
            handleSignIn();
            break;
        case "signUp":
            handleSignUp();
            break;
        case "home":
            handleHome();
            break;
        case "settings":
            handleSettings();
            break;
        case "profil":
            handleProfil();
            break;
        case "modifyPassword":
            handleModifyPassword();
            break;
        case "modifyEmail":
            handleModifyEmail();
            break;
        case "modifyProfilPicture":
            handleModifyProfilPicture();
            break;
        default:
            console.log("Invalid scene: ", newScene);
    }

    console.log("Current scene is:", currentScene);
}

//handle
function handleSignIn() {
    if (currentScene === "start") {
        unhideElements("signForm");
        currentScene = "signIn";
	}
	else if (currentScene == "settings") {
		hideElements("titleSignUp", "passwordConfirmDiv", "signUpButton", "emailDiv", "home", "settings");
		resetFormFields("username", "password", "passwordConfirm", "email");
		unhideElements("titleSignIn", "signWith42Button", "signInButton", "forgotPasswordButton", "signForm", "orDiv");
	}
	currentScene = "signIn";
}

function handleSignUp() {
    hideElements("titleSignIn", "signWith42Button", "signInButton", "forgotPasswordButton", "orDiv");
    unhideElements("titleSignUp", "passwordConfirmDiv", "signUpButton", "emailDiv");
    currentScene = "signUp";
}

function handleHome() {
    hideElements("signForm", "settings", "profil", "modify-password", "modify-email", "modify-profil-picture");
	//reset form?
    unhideElements("home", "chat");
    currentScene = "home";
}

function handleSettings() {
    hideElements("chat", "profil", "modify-password", "modify-email", "modify-profil-picture");
	resetFormFields("settings-actual-password", "settings-new-password", "settings-confirm-password", "settings-actual-email", "settings-new-email", "settings-confirm-email");
    unhideElements("settings");
    currentScene = "settings";
}

function handleProfil() {
    hideElements("chat", "settings", "modify-password", "modify-email", "modify-profil-picture");
    unhideElements("profil");
    currentScene = "profil";
}

function handleModifyPassword() {
    hideElements("chat", "settings", "profil", "modify-email", "modify-profil-picture");
    unhideElements("modify-password");
    currentScene = "modifyPassword";
}

function handleModifyEmail() {
    hideElements("chat", "settings", "profil", "modify-password", "modify-profil-picture");
    unhideElements("modify-email");
    currentScene = "modifyEmail";
}

function handleModifyProfilPicture() {
    hideElements("chat", "settings", "profil", "modify-password", "modify-email");
    unhideElements("modify-profil-picture");
    currentScene = "modifyProfilPicture";
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

function profilAction() {
    if (currentScene == "profil") {
        changeScene("home");
    } else {
        changeScene("profil");
    }
}
