import globalVariables from '../../init.js';
import { sendMessage, fetchConversations } from '../../action/chat.js';
import { fetchProfilPicture } from '../../fetch/http.js';
import { changeScene } from '../scene.js';
import { manageFriend } from '../../action/userManagement.js';
import { acceptPlayRequest, refusePlayRequest } from '../../action/play.js';
import { sendMessageInGame } from '../../action/chat.js';

async function createInGame() {

	try {
		const user = 'admin'
		const inGame = document.getElementById("in-game");
		inGame.innerHTML = "";

		// Back button
		const backButton = document.createElement("button");
		backButton.classList.add("arrow-back", "d-flex", "justify-content-start", "align-items-center");
		// backButton.onclick = function() {};

		const imgButton = document.createElement('img');
		backButton.appendChild(imgButton)
		
		// Create parents div
		const titleDiv = document.createElement("div");
		titleDiv.id = "in-game-title-id";
		titleDiv.classList.add("conversation-display-top");
		titleDiv.appendChild(backButton);
		
		const blockBottom = document.createElement('div');
		blockBottom.classList.add('conversation-block-bottom');
	
		const messagesDiv = document.createElement("div");
		messagesDiv.id = "in-game-conversation-display-messages-id";
		messagesDiv.classList.add("conversation-display-messages");

		const inputDiv = document.createElement("div");
		inputDiv.id = "in-game-input-id";
		inputDiv.classList.add("conversation-display-input");

		const titleRight = document.createElement('div');
		titleRight.classList.add("conversation-display-top-person");
		// titleRight.onclick = function () {
			// history.pushState({}, '', '/profil?username=' + user);
		// }
		
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
		// Mettre à jour le nom créé dans createInGame
		const titleElement = document.getElementById("in-game-send-message-contact-id");
		if (titleElement) {
			titleElement.textContent = username;
		}

		// Mettre à jour la photo de profil créée dans createInGame
		const profilePicture = document.querySelector('.conversation-display-top-person img');
		if (profilePicture) {
			profilePicture.src = await fetchProfilPicture(username);
		}

		// Supprimer toutes les div messages
		const messagesDiv = document.getElementById("in-game-conversation-display-messages-id");
		if (messagesDiv) {
			messagesDiv.innerHTML = '';
		}
	} catch (error) {
		console.error("Error in setNewOpponentUsername: ", error);
		throw error;
	}
}


export { createInGame, setNewOpponentUsername };