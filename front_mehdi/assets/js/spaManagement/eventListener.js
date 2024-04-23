import { changeScene } from './scene.js';
import { searchProfil } from '../profil.js';
import { sendMessage } from '../chatManagement.js';

// Setters
function setEventListener(scene) {
    switch (scene) {
        case "conversation-list":
            setEventConversationList();
            break;
        case "conversation-display":
            setEventConversationDisplay();
            break;
        default:
            console.log("Invalid scene for setEventListener: ", scene);
    }
}

let onInputFilled, onInputCleared;

function setEventConversationList() {
    const searchInput = document.getElementById("conversation-list-searchbar-input-id");
    let isInputEmpty = true;

    // Redéfinition des fonctions onInputFilled et onInputCleared à l'intérieur de setEventConversationList
    onInputFilled = function() {
        changeScene("search");
        isInputEmpty = false;
    }

    onInputCleared = function() {
        changeScene("conversation-list");
        isInputEmpty = true;
    }

    searchInput.addEventListener("input", function() {
        const inputValue = searchInput.value.trim();

        if (inputValue && isInputEmpty) {
            onInputFilled();
        } else if (!inputValue && !isInputEmpty) {
            onInputCleared();
        }
    });

    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchProfil();
        }
    });
}

function setEventConversationDisplay() {
	const messageInput = document.getElementById("send-message-input-id");

	messageInput.addEventListener("keypress", function(event) {
		if (event.key === "Enter") {
			sendMessage();
		}
	});

}

// Unsetters
function unsetEventListener(scene) {
	switch (scene) {
		case "conversation-list":
			unsetEventConversationList();
			break;
		case "conversation-display":
			unsetEventConversationDisplay();
			break;
		default:
			console.log("Invalid scene for setEventListener: ", scene);
	}
}

function unsetEventConversationDisplay() {
    const messageInput = document.getElementById("send-message-input-id");

	if (messageInput) {
		messageInput.removeEventListener("keypress", sendMessage);
	}
}

function unsetEventConversationList() {
    const searchInput = document.getElementById("conversation-list-searchbar-input-id");

	if (searchInput) {
		searchInput.removeEventListener("input", onInputFilled);
		searchInput.removeEventListener("input", onInputCleared);
		searchInput.removeEventListener("keypress", searchProfil);
	}
}


export { setEventListener, unsetEventListener }



// FROM SIGN FORM TO UPDATE
//
//
//
//









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


// keyboad touch
document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const passwordConfirmInput = document.getElementById("passwordConfirm");
    const emailInput = document.getElementById("email");

    usernameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
			if (globalVariables.currentScene == "signIn") {
            	signIn();
			}
			else if (globalVariables.currentScene == "signUp") {
				signUp();
			}
        }
    });
	
    passwordInput.addEventListener("keypress", function(event) {
		if (event.key === "Enter") {
			if (globalVariables.currentScene == "signIn") {
				signIn();
			}
			else if (globalVariables.currentScene == "signUp") {
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