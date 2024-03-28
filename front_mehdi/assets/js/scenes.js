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
	else if (currentScene == "signIn" && newScene == "home") {//if signin or signup sucess/ split en deux
		hideElement("signForm");
		unhideElement("home");
		currentScene = "home";
	}
	else if (currentScene == "home" && newScene == "signIn") {//sign out
		hideElement("titleSignUp", "passwordConfirmDiv", "signUpButton", "emailDiv", "home");
		unhideElement("titleSignIn", "signWith42Button", "signInButton", "forgotPasswordButton", "signForm", "orDiv");
		currentScene = "signIn";
	}
	else if (currentScene == "signIn" && newScene == "signUp") {//sign up
		hideElement("titleSignIn", "signWith42Button", "signInButton", "forgotPasswordButton", "orDiv")
		unhideElement("titleSignUp", "passwordConfirmDiv", "signUpButton", "emailDiv");
	}

    console.log("La scène actuelle est maintenant:", currentScene);
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
