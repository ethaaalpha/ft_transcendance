document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const passwordConfirmInput = document.getElementById("passwordConfirm");
    const emailInput = document.getElementById("email");

    usernameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
			if (currentScene == "signIn") {
            	signIn();
			}
			else if (currentScene == "signUp") {
				signUp();
			}
        }
    });
	
    passwordInput.addEventListener("keypress", function(event) {
		if (event.key === "Enter") {
			if (currentScene == "signIn") {
				signIn();
			}
			else if (currentScene == "signUp") {
				signUp();
			}
        }
    });

	passwordConfirmInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
			signUp();
        }
    });

	emailInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
			signUp();
        }
    });
});
