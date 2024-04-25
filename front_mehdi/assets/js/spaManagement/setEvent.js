import { changeScene } from './scene.js';
import { sendMessage } from '../action/chat.js';

function setEventListener(scene) {
	switch (scene) {
		// case "sign-in":
		// 	setEventSignIn();
		// 	break;
		// case "sign-up":
		// 	setEventSignUp();
		// 	break;
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
		// case "profil":
		// 	setEventProfil(username);
		// 	break;
		// case "settings":
		// 	setEventSettings();
		// 	break;
		// case "modify-game-theme":
		// 	setEventModifyGameTheme();
		// 	break;
		// case "modify-profil-picture":
		// 	setEventModifyProfilPicture();
		// 	break;
		// case "modify-password":
		// 	setEventModifyPassword();
		// 	break;
		// case "modify-email":
		// 	setEventModifyEmail();
		// 	break;
		default:
			console.log("Invalid scene for setEventListener: ", scene);
	}
}

let onInputFilled, onInputCleared;

function setEventConversationList() {
	const searchInput = document.getElementById("conversation-list-searchbar-input-id");
	let isInputEmpty = true;

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
			// createChildDiv("search");
			changeScene("search-contact", "nico");
		}
	});
}

function setEventSearch() {
	const searchInput = document.getElementById("search-searchbar-input-id");
	let isInputEmpty = true;

	onInputFilled = function() {
		// changeScene("search");
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
			changeScene("search-contact", "nico");
		}
	});
}

function setEventSearchContact() {
	const searchInput = document.getElementById("search-contact-searchbar-input-id");
	let isInputEmpty = true;

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
			// createChildDiv("search");
			changeScene("search-contact", "nico");
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

export { setEventListener }




// FROM SIGN FORM TO UPDATE
//
//
//
//









// // form parsing
// document.getElementById("username").addEventListener("input", function() {
//     var usernameInput = this.value;
//     var isValid = /^[A-Za-z0-9_+\-.@]+$/.test(usernameInput);
//     if (isValid && usernameInput.length >= 3 && usernameInput.length <= 32) {
//         this.classList.remove("is-invalid");
//     } else {
//         if (!this.classList.contains("is-invalid")) {
//             this.classList.add("is-invalid");
//         }
//     }
// });

// document.getElementById("password").addEventListener("input", function() {
//     var passwordInput = this.value;
//     if (passwordInput.length >= 5 && passwordInput.length <= 42) {
//         this.classList.remove("is-invalid");
//     } else {
//         this.classList.add("is-invalid");
//     }
// });

// document.getElementById("passwordConfirm").addEventListener("input", function() {
//     var confirmPasswordInput = this.value;
//     var passwordInput = document.getElementById("password").value;
//     var isValid = confirmPasswordInput === passwordInput;
//     if (isValid) {
//         this.classList.remove("is-invalid");
//     } else {
//         this.classList.add("is-invalid");
//     }
// });

// document.getElementById("email").addEventListener("input", function() {
//     var emailInput = this.value;
//     var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+\w*$/.test(emailInput) && emailInput.length <= 254;
//     if (isValid) {
//         this.classList.remove("is-invalid");
//     } else {
//         this.classList.add("is-invalid");
//     }
// });


// // keyboad touch
// document.addEventListener("DOMContentLoaded", function() {
//     const usernameInput = document.getElementById("username");
//     const passwordInput = document.getElementById("password");
//     const passwordConfirmInput = document.getElementById("passwordConfirm");
//     const emailInput = document.getElementById("email");

//     usernameInput.addEventListener("keypress", function(event) {
//         if (event.key === "Enter") {
// 			if (globalVariables.currentScene == "signIn") {
//             	signIn();
// 			}
// 			else if (globalVariables.currentScene == "signUp") {
// 				signUp();
// 			}
//         }
//     });
	
//     passwordInput.addEventListener("keypress", function(event) {
// 		if (event.key === "Enter") {
// 			if (globalVariables.currentScene == "signIn") {
// 				signIn();
// 			}
// 			else if (globalVariables.currentScene == "signUp") {
// 				signUp();
// 			}
//         }
//     });

// 	passwordConfirmInput.addEventListener("keypress", function(event) {
//         if (event.key === "Enter") {
// 			signUp();
//         }
//     });

// 	emailInput.addEventListener("keypress", function(event) {
//         if (event.key === "Enter") {
// 			signUp();
//         }
//     });

// });
