import { changeScene } from './sceneManagement.js';
import { searchProfil } from './profil.js';
import { sendMessage } from './chatManagement.js';

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

function setEventConversationList() {
	const searchInput = document.getElementById("conversation-list-searchbar-input-id");
	let isInputEmpty = true;

	function onInputFilled() {
		changeScene("search");
		isInputEmpty = false;
	}

	function onInputCleared() {
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
		case "conversation-display":
			unsetEventConversationDisplay();
			break;
		default:
			console.log("Invalid scene for setEventListener: ", scene);
	}
}

function unsetEventConversationDisplay() {
    const searchInput = document.getElementById("conversation-list-searchbar-input-id");
    
    searchInput.removeEventListener("input", onInputFilled);
    searchInput.removeEventListener("input", onInputCleared);
    searchInput.removeEventListener("keypress", searchProfil);
}

export { setEventListener, unsetEventListener }
