// form parsing
document.getElementById("username").addEventListener("input", function() {
    var usernameInput = this.value;
    var isValid = /^[A-Za-z0-9_+\-.@]+$/.test(usernameInput);
    if (isValid && usernameInput.length >= 3 && usernameInput.length <= 32) {
        this.classList.remove("is-invalid");
    } else {
        if (!this.classList.contains("is-invalid")) {
            this.classList.add("is-invalid");
        }
    }
});

document.getElementById("password").addEventListener("input", function() {
    var passwordInput = this.value;
    if (passwordInput.length >= 5 && passwordInput.length <= 42) {
        this.classList.remove("is-invalid");
    } else {
        this.classList.add("is-invalid");
    }
});

document.getElementById("passwordConfirm").addEventListener("input", function() {
    var confirmPasswordInput = this.value;
    var passwordInput = document.getElementById("password").value;
    var isValid = confirmPasswordInput === passwordInput;
    if (isValid) {
        this.classList.remove("is-invalid");
    } else {
        this.classList.add("is-invalid");
    }
});

document.getElementById("email").addEventListener("input", function() {
    var emailInput = this.value;
    var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+\w*$/.test(emailInput) && emailInput.length <= 254;
    if (isValid) {
        this.classList.remove("is-invalid");
    } else {
        this.classList.add("is-invalid");
    }
});

document.getElementById("conversation-list-searchbar-input-id").addEventListener("input", function() {
    const searchInput = document.getElementById("conversation-list-searchbar-input-id");
    let isInputEmpty = true;

    const inputValue = searchInput.value.trim();
    
    if (inputValue && isInputEmpty) {
        changeScene("search");
        isInputEmpty = false;
    } else if (!inputValue && !isInputEmpty) {
        changeScene("conversation-list");
        isInputEmpty = true;
    }
});


// keyboad touch
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

	const searchInput = document.getElementById("conversation-list-searchbar-container-id");
	
	searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
			searchProfil();
        }
    });


});

