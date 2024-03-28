// start
// signForm
// signIn
// signUp
// home

let currentScene = "start";

function changeScene(newScene) {

	if (currentScene == "start" && newScene == "signIn") {//at launch if not logged
		unhideElement("signForm");
		currentScene = "signIn";
	}
	else if (currentScene == "start" && newScene == "home") {//at launch ig logged
		unhideElement("home");
		currentScene = "home";
	}
	else if ((currentScene == "signIn" || currentScene == "signUp") && newScene == "home") {//if signin or signup sucess/ split en deux
		hideElement("signForm");
		document.getElementById("username").value = "";
		document.getElementById("password").value = "";
		document.getElementById("passwordConfirm").value = "";
		document.getElementById("email").value = "";
		unhideElement("home");
		currentScene = "home";
	}
	else if (currentScene == "settings" && newScene == "signIn") {//sign out
		hideElement("titleSignUp", "passwordConfirmDiv", "signUpButton", "emailDiv", "home", "settings");
		unhideElement("titleSignIn", "signWith42Button", "signInButton", "forgotPasswordButton", "signForm", "orDiv");
		currentScene = "signIn";
	}
	else if (currentScene == "signIn" && newScene == "signUp") {//sign up
		hideElement("titleSignIn", "signWith42Button", "signInButton", "forgotPasswordButton", "orDiv")
		unhideElement("titleSignUp", "passwordConfirmDiv", "signUpButton", "emailDiv");
		currentScene = "signUp";
	}
	else if (currentScene == "home" && newScene == "settings") {
		// hideElement("chat")
		unhideElement("settings");
		currentScene = "settings";
	}
	else if ((currentScene == "settings" || currentScene == "modifyPassword" || currentScene == "modifyEmail") && newScene == "home") {
		hideElement("settings");
		hideElement("modify-password");
		hideElement("modify-email");
		// unhideElement("chat")
		currentScene = "home";
	}
	else if (newScene == "modifyPassword") {
		hideElement("settings")
		unhideElement("modify-password");
		currentScene = "modifyPassword";
	}
	else if (newScene == "modifyEmail") {
		hideElement("settings")
		unhideElement("modify-email");
		currentScene = "modifyEmail";
	}
	else if ((currentScene == "modifyPassword" || currentScene == "modifyEmail") && newScene == "settings") {
		if (currentScene == "modifyPassword") {
			document.getElementById("settings-actual-password").value = "";
			document.getElementById("settings-new-password").value = "";
			document.getElementById("settings-confirm-password").value = "";
			hideElement("modify-password");
		}
		else if (currentScene == "modifyEmail") {
			document.getElementById("settings-actual-email").value = "";
			document.getElementById("settings-new-email").value = "";
			document.getElementById("settings-confirm-email").value = "";
			hideElement("modify-email");
		}
		unhideElement("settings");
		currentScene = "settings";
	}

    console.log("Current scene is:", currentScene);
}

// HIDE OR NOT

function hideElement(...elementIds) {
    elementIds.forEach(elementId => {
        var element = document.getElementById(elementId);
        if (element) {
            element.classList.add("d-none");
        }
    });
}

function unhideElement(...elementIds) {
    elementIds.forEach(elementId => {
        var element = document.getElementById(elementId);
        if (element) {
            element.classList.remove("d-none");
        }
    });
}



function settingsAction() {
    var settingsElement = document.getElementById('settings');

    if (currentScene == "home") {
        changeScene("settings");
    } else {
        changeScene("home");
    }
}
