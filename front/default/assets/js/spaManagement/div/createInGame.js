import * as THREE from 'three';
import globalVariables from '/static/default/assets/js/init.js';
import { fetchProfilPicture } from '/static/default/assets/js/fetch/http.js';
import { sendMessageInGame } from '/static/default/assets/js/action/chat.js';

async function createInGame() {

	try {
		const user = globalVariables.currentUser.username;
		const inGame = document.getElementById("in-game");
		inGame.classList.add('conversation-display')
		inGame.innerHTML = "";

		// Back button
		const backButton = document.createElement("button");
		backButton.classList.add("arrow-back", "d-flex", "justify-content-start", "align-items-center");

		const imgButton = document.createElement('img');
		backButton.appendChild(imgButton)
		
		// Create parents div
		const titleDiv = document.createElement("div");
		titleDiv.id = "in-game-title-id";
		titleDiv.classList.add("conversation-display-top", 'd-none');
		titleDiv.appendChild(backButton);
		
		const blockBottom = document.createElement('div');
		blockBottom.id = 'in-game-bottom-id';
		blockBottom.classList.add('conversation-block-bottom', 'd-none');
	
		const messagesDiv = document.createElement("div");
		messagesDiv.id = "in-game-conversation-display-messages-id";
		messagesDiv.classList.add("conversation-display-messages");

		const inputDiv = document.createElement("div");
		inputDiv.id = "in-game-input-id";
		inputDiv.classList.add("conversation-display-input");

		const titleRight = document.createElement('div');
		titleRight.classList.add("conversation-display-top-person");
		
		// Title
		const titleElement = document.createElement("span");
		titleElement.textContent = user;
		titleElement.classList.add("title-3");
		titleElement.setAttribute("id", "in-game-send-message-contact-id");

		const profilePicture = document.createElement('img');
		profilePicture.src = await fetchProfilPicture(user);
		
		titleRight.appendChild(profilePicture)
		titleRight.appendChild(titleElement)

		titleDiv.appendChild(titleRight);

		blockBottom.appendChild(messagesDiv);
		blockBottom.appendChild(inputDiv)

		// Adding to global div
		inGame.appendChild(titleDiv);
		inGame.appendChild(blockBottom);

		setTimeout(function() {
			messagesDiv.scrollTop = messagesDiv.scrollHeight;
		}, 1);

		// Input message
		const messageInput = document.createElement("input");
		messageInput.setAttribute("type", "text");
		messageInput.setAttribute("placeholder", "Enter your message...");
		messageInput.setAttribute("id", "in-game-send-message-input-id");
		inputDiv.appendChild(messageInput);

		const imageInput = document.createElement('img');
		imageInput.src = '/static/default/assets/images/icons/send.svg';
		
		// Send button
		const sendButton = document.createElement("button");
		sendButton.classList.add("send-button");
		sendButton.setAttribute("id", "in-game-send-message-button-id");
		sendButton.onclick = sendMessageInGame;
		sendButton.appendChild(imageInput)
		inputDiv.appendChild(sendButton);

	} catch (error) {
		console.error("Error in createinGame: ", error);
		throw error;
	}
}

async function setNewOpponentUsername(username) {
	try {
		// Update username
		const titleElement = document.getElementById("in-game-send-message-contact-id");
		if (titleElement) {
			titleElement.textContent = username;
		}

		// Update pp
		const profilePicture = document.querySelector('.conversation-display-top-person img');
		if (profilePicture) {
			profilePicture.src = await fetchProfilPicture(username);
		}

		// Remove old chat div
		const messagesDiv = document.getElementById("in-game-conversation-display-messages-id");
		if (messagesDiv) {
			messagesDiv.innerHTML = '';
		}
	} catch (error) {
		console.error("Error in setNewOpponentUsername: ", error);
		throw error;
	}
}

function createGame(){
	var appliParent = document.querySelector('#game-container')
	setTimeout(function() {
		if (appliParent.clientHeight == 0 || appliParent.clientHeight == 0 || globalVariables.currentUser == null)
			return(createGame());
		import('/static/pong3d/main.js')
    	.then((module) => {
			globalVariables.gameData = module.gameData
    		module.initialize();
    	})
		.catch((error) => {
    	console.error('Failed to import module: ', error);
    	})
	}, 100);
}

function updateGameTheme(){
	globalVariables.gameData.RGBELoader.load(globalVariables.currentUser.getGameTheme() + '.hdr', (texture) => {
		texture.mapping = THREE.EquirectangularReflectionMapping;
		var textureRev = texture.clone()
		textureRev.flipY = false;
		globalVariables.gameData.sceneMenu.background = texture;
		globalVariables.gameData.sceneMenu.environment = texture;
		globalVariables.gameData.sceneGameLocal.background = texture;
		globalVariables.gameData.sceneGameLocal.environment = texture;
		globalVariables.gameData.sceneGameInv.background = textureRev;
		globalVariables.gameData.sceneGameInv.environment = textureRev;
		gameData.sceneGameLocal.background = texture;
		gameData.sceneGameLocal.environment = texture;
	});
}


export { createInGame, setNewOpponentUsername, createGame, updateGameTheme };