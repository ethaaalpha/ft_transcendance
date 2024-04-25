import globalVariables from '../init.js';
import { changeScene } from './scene.js';
import { sendMessage } from '../action/chat.js';
import { signIn } from '../action/userManagement.js';

function setEventListener(scene) {
	switch (scene) {
		case "sign-in":
			setEventSignIn();
			break;
		case "sign-up":
			setEventSignUp();
			break;
		case "conversation-list":
			setEventConversationList();
			break;
		case "conversation-display":
			setEventConversationDisplay();
			break;
		case "search":
			setEventSearch();
			break;
		case "search-contact":
			setEventSearchContact();
			break;
		default:
			console.log("Invalid scene for setEventListener: ", scene);
	}
	console.log("setEventListener: ", scene);
}

// ADD
function addEventListener(eventName, elementId, eventHandler) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id "${elementId}" not found.`);
        return;
    }

    if (!globalVariables.eventListeners[eventName]) {
        globalVariables.eventListeners[eventName] = {};
    }

    globalVariables.eventListeners[eventName][elementId] = eventHandler;

    element.addEventListener(eventName, eventHandler);
}

// HANDLER
function setEventSignIn() {
	addEventListener("input", "sign-in-username", function() {
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

	addEventListener("input", "sign-in-password", function() {
		var passwordInput = this.value;
		if (passwordInput.length >= 5 && passwordInput.length <= 42) {
			this.classList.remove("is-invalid");
		} else {
			this.classList.add("is-invalid");
		}
	});

	addEventListener("keypress", "sign-in-username", function(event) {
		if (event.key === "Enter") {
			signIn();
		}
	});

	addEventListener("keypress", "sign-in-password", function(event) {
		if (event.key === "Enter") {
			signIn();
		}
	});
}

function setEventSignUp() {
	addEventListener("input", "sign-up-username", function() {
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

	addEventListener("input", "sign-up-password", function() {
		var passwordInput = this.value;
		if (passwordInput.length >= 5 && passwordInput.length <= 42) {
			this.classList.remove("is-invalid");
		} else {
			this.classList.add("is-invalid");
		}
	});

	addEventListener("input", "sign-up-password-confirm", function() {
		var confirmPasswordInput = this.value;
		var passwordInput = document.getElementById("password").value;
		var isValid = confirmPasswordInput === passwordInput;
		if (isValid) {
			this.classList.remove("is-invalid");
		} else {
			this.classList.add("is-invalid");
		}
	});
	
	addEventListener("input", "sign-up-email", function() {
		var emailInput = this.value;
		var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+\w*$/.test(emailInput) && emailInput.length <= 254;
		if (isValid) {
			this.classList.remove("is-invalid");
		} else {
			this.classList.add("is-invalid");
		}
	});

	addEventListener("keypress", "sign-up-username", function(event) {
		if (event.key === "Enter") {
			signUp();
		}
	});

	addEventListener("keypress", "sign-up-password", function(event) {
		if (event.key === "Enter") {
			signUp();
		}
	});

	addEventListener("keypress", "sign-up-password-confirm", function(event) {
		if (event.key === "Enter") {
			signUp();
		}
	});

	addEventListener("keypress", "sign-up-email", function(event) {
		if (event.key === "Enter") {
			signUp();
		}
	});
}

function setEventConversationDisplay() {
    addEventListener("keypress", "send-message-input-id", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
}

function setEventConversationList() {
    addEventListener("input", "conversation-list-searchbar-input-id", function() {
        const inputValue = this.value.trim();

        if (inputValue) {
            changeScene("search");
        } else {
            changeScene("conversation-list");
        }
    });

    addEventListener("keypress", "conversation-list-searchbar-input-id", function(event) {
        if (event.key === "Enter") {
            changeScene("search-contact", this.value);
        }
    });
}

function setEventSearch() {
    addEventListener("input", "search-searchbar-input-id", function() {
        const inputValue = this.value.trim();

        if (!inputValue) {
            changeScene("conversation-list");
        }
    });

    addEventListener("keypress", "search-searchbar-input-id", function(event) {
        if (event.key === "Enter") {
            changeScene("search-contact", this.value);
        }
    });
}

function setEventSearchContact() {
    addEventListener("input", "search-contact-searchbar-input-id", function() {
        const inputValue = this.value.trim();

        if (!inputValue) {
            changeScene("conversation-list");
        }
    });

    addEventListener("keypress", "search-contact-searchbar-input-id", function(event) {
        if (event.key === "Enter") {
            changeScene("search-contact", this.value);
        }
    });
}

export { setEventListener }




// function setEventSearch() {
// 	const searchInput = document.getElementById("search-searchbar-input-id");
// 	let isInputEmpty = true;

// 	onInputFilled = function() {
// 		// changeScene("search");
// 		isInputEmpty = false;
// 	}

// 	onInputCleared = function() {
// 		changeScene("conversation-list");
// 		isInputEmpty = true;
// 	}

// 	searchInput.addEventListener("input", function() {
// 		const inputValue = searchInput.value.trim();

// 		if (inputValue && isInputEmpty) {
// 			onInputFilled();
// 		} else if (!inputValue && !isInputEmpty) {
// 			onInputCleared();
// 		}
// 	});

// 	searchInput.addEventListener("keypress", function(event) {
// 		if (event.key === "Enter") {
// 			changeScene("search-contact", "nico");
// 		}
// 	});
// }

// function setEventSearchContact() {
// 	const searchInput = document.getElementById("search-contact-searchbar-input-id");
// 	let isInputEmpty = true;

// 	onInputFilled = function() {
// 		changeScene("search");
// 		isInputEmpty = false;
// 	}

// 	onInputCleared = function() {
// 		changeScene("conversation-list");
// 		isInputEmpty = true;
// 	}

// 	searchInput.addEventListener("input", function() {
// 		const inputValue = searchInput.value.trim();

// 		if (inputValue && isInputEmpty) {
// 			onInputFilled();
// 		} else if (!inputValue && !isInputEmpty) {
// 			onInputCleared();
// 		}
// 	});

// 	searchInput.addEventListener("keypress", function(event) {
// 		if (event.key === "Enter") {
// 			// createChildDiv("search");
// 			changeScene("search-contact", "nico");
// 		}
// 	});
// }


// // }




// // // FROM SIGN FORM TO UPDATE
// // //
// // //
// // //
// // //







// // // form parsing
// // document.getElementById("sign-in-username").addEventListener("input", function() {
// // 	var usernameInput = this.value;
// // 	var isValid = /^[A-Za-z0-9_+\-.@]+$/.test(usernameInput);
// // 	if (isValid && usernameInput.length >= 3 && usernameInput.length <= 32) {
// // 		this.classList.remove("is-invalid");
// // 	} else {
// // 		if (!this.classList.contains("is-invalid")) {
// // 			this.classList.add("is-invalid");
// // 		}
// // 	}
// // });

// // document.getElementById("sign-in-password").addEventListener("input", function() {
// // 	var passwordInput = this.value;
// // 	if (passwordInput.length >= 5 && passwordInput.length <= 42) {
// // 		this.classList.remove("is-invalid");
// // 	} else {
// // 		this.classList.add("is-invalid");
// // 	}
// // });


// // document.getElementById("passwordConfirm").addEventListener("input", function() {
// // 	var confirmPasswordInput = this.value;
// // 	var passwordInput = document.getElementById("password").value;
// // 	var isValid = confirmPasswordInput === passwordInput;
// // 	if (isValid) {
// // 		this.classList.remove("is-invalid");
// // 	} else {
// // 		this.classList.add("is-invalid");
// // 	}
// // });

// // document.getElementById("email").addEventListener("input", function() {
// // 	var emailInput = this.value;
// // 	var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+\w*$/.test(emailInput) && emailInput.length <= 254;
// // 	if (isValid) {
// // 		this.classList.remove("is-invalid");
// // 	} else {
// // 		this.classList.add("is-invalid");
// // 	}
// // });


// // keyboad touch
// document.addEventListener("DOMContentLoaded", function() {
// 	const usernameInput = document.getElementById("username");
// 	const passwordInput = document.getElementById("password");
// 	const passwordConfirmInput = document.getElementById("passwordConfirm");
// 	const emailInput = document.getElementById("email");

// 	usernameInput.addEventListener("keypress", function(event) {
// 		if (event.key === "Enter") {
// 			if (globalVariables.currentScene == "signIn") {
// 				signIn();
// 			}
// 			else if (globalVariables.currentScene == "signUp") {
// 				signUp();
// 			}
// 		}
// 	});
	
// 	passwordInput.addEventListener("keypress", function(event) {
// 		if (event.key === "Enter") {
// 			if (globalVariables.currentScene == "signIn") {
// 				signIn();
// 			}
// 			else if (globalVariables.currentScene == "signUp") {
// 				signUp();
// 			}
// 		}
// 	});

// 	passwordConfirmInput.addEventListener("keypress", function(event) {
// 		if (event.key === "Enter") {
// 			signUp();
// 		}
// 	});

// 	emailInput.addEventListener("keypress", function(event) {
// 		if (event.key === "Enter") {
// 			signUp();
// 		}
// 	});

// });