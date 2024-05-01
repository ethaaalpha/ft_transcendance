import globalVariables from '../../init.js';
import { sendMessage, fetchConversations } from '../../action/chat.js';
import { fetchProfilPicture } from '../../fetch/http.js';
import { changeScene } from '../scene.js';
import { manageFriend } from '../../action/userManagement.js';
import { acceptPlayRequest, refusePlayRequest } from '../../action/play.js';

async function createConversationDisplay(user) {

	try {
		await fetchConversations();

		const conversation = globalVariables.userConversations.getConversation(user);
		const conversationDisplay = document.getElementById("conversation-display");
		conversationDisplay.innerHTML = "";

		// Back button
		const backButton = document.createElement("button");
		backButton.classList.add("arrow-back", "d-flex", "justify-content-start", "align-items-center");
		backButton.onclick = function() {
			history.pushState({}, '', '/');
		};

		const imgButton = document.createElement('img');
		imgButton.src = '/static/default/assets/images/icons/arrow.svg';
		backButton.appendChild(imgButton)
		
		// Create parents div
		const titleDiv = document.createElement("div");
		titleDiv.id = "conversation-display-title-id";
		titleDiv.classList.add("conversation-display-top");
		titleDiv.appendChild(backButton);
		
		const blockBottom = document.createElement('div');
		blockBottom.classList.add('conversation-block-bottom');
	
		const messagesDiv = document.createElement("div");
		messagesDiv.id = "conversation-display-messages-id";
		messagesDiv.classList.add("conversation-display-messages");

		const inputDiv = document.createElement("div");
		inputDiv.id = "conversation-display-input-id";
		inputDiv.classList.add("conversation-display-input");

		const titleRight = document.createElement('div');
		titleRight.classList.add("conversation-display-top-person");
		titleRight.onclick = function () {
			history.pushState({}, '', '/profil?username=' + user);
		}
		
		// Title
		const titleElement = document.createElement("span");
		titleElement.textContent = user;
		titleElement.classList.add("title-3");
		titleElement.setAttribute("id", "send-message-contact-id");

		const profilePicture = document.createElement('img');
		profilePicture.src = await fetchProfilPicture(user);
		
		titleRight.appendChild(profilePicture)
		titleRight.appendChild(titleElement)

		titleDiv.appendChild(titleRight);

		blockBottom.appendChild(messagesDiv);
		blockBottom.appendChild(inputDiv)

		// Adding to global div
		conversationDisplay.appendChild(titleDiv);
		conversationDisplay.appendChild(blockBottom);

		// Messages
		for (let i = conversation.length - 1; i >= 0; i--) {
			const message = conversation[i];
			const messageElement = document.createElement("div");
			const messageText = document.createElement('span');
			messageText.textContent = message.content;
			messageElement.appendChild(messageText)
			
			if (message.sender === globalVariables.userConversations.myUsername) {
				messageElement.classList.add("message-sent", "message");
			} else {
				messageElement.classList.add("message-received", "message");
			}

			messagesDiv.appendChild(messageElement);
		}

		// Handle pending friend requests
		const isPendingFriendFrom = globalVariables.currentUser.isPendingFriendFrom(user);
		const isPendingFriendTo = globalVariables.currentUser.isPendingFriendTo(user);

		if (isPendingFriendFrom || isPendingFriendTo) {
			const pendingMessage = document.createElement('div');
			const text = document.createElement('span');

			pendingMessage.appendChild(text);
			if (isPendingFriendFrom) {
				text.textContent = 'Wanna be friend?'

				const choices = document.createElement('div');
				choices.classList.add('message-choice');

				const acceptButton = document.createElement('button');
				const acceptImg = document.createElement('img');
				acceptImg.src = '/static/default/assets/images/icons/valid.svg';

				acceptButton.appendChild(acceptImg)
				acceptButton.style.setProperty('--message-choice-color', 'rgba(5, 255, 0, 0.25)');
				acceptButton.onclick = function() {
					manageFriend(user, 'accept');
				};

				const declineButton = document.createElement('button');
				const declineImg = document.createElement('img');
				declineImg.src = '/static/default/assets/images/icons/refuse.svg';
				
				declineButton.appendChild(declineImg)
				declineButton.style.setProperty('--message-choice-color', 'rgba(218, 218, 218, 0.25)');
				declineButton.onclick = function() {
					manageFriend(user, 'refuse');
				};

				pendingMessage.classList.add('message-received', 'message', 'message-pending');
				choices.appendChild(acceptButton);
				choices.appendChild(declineButton);
				text.appendChild(choices);
			} else {
				text.textContent = 'Friend request sent!'
				pendingMessage.classList.add('message-sent', 'message');
			}
			
			messagesDiv.appendChild(pendingMessage);

			if (isPendingFriendFrom) {
				
			} else if (isPendingFriendTo) {
				pendingMessage.classList.add('message-sent', 'message');
			}
		}

		const isPendingGameFrom = globalVariables.currentUser.isPendingGameFrom(user);
		const isPendingGameTo = globalVariables.currentUser.isPendingGameTo(user);
		
		// Handle pending game requests
		if (isPendingGameFrom || isPendingGameTo) {
			const pendingMessage = document.createElement('div');
			const text = document.createElement('span');

			pendingMessage.appendChild(text);
			if (isPendingFriendFrom) {
				text.textContent = 'Wanna play?'

				const choices = document.createElement('div');
				choices.classList.add('message-choice');

				const acceptButton = document.createElement('button');
				const acceptImg = document.createElement('img');
				acceptImg.src = '/static/default/assets/images/icons/valid.svg';

				acceptButton.appendChild(acceptImg)
				acceptButton.style.setProperty('--message-choice-color', 'rgba(5, 255, 0, 0.25)');
				acceptButton.onclick = function() {
					acceptPlayRequest(user);
				};

				const declineButton = document.createElement('button');
				const declineImg = document.createElement('img');
				declineImg.src = '/static/default/assets/images/icons/refuse.svg';
				
				declineButton.appendChild(declineImg)
				declineButton.style.setProperty('--message-choice-color', 'rgba(218, 218, 218, 0.25)');
				declineButton.onclick = function() {
					refusePlayRequest(user);
				};

				pendingMessage.classList.add('message-received', 'message', 'message-pending');
				choices.appendChild(acceptButton);
				choices.appendChild(declineButton);
				text.appendChild(choices);
			} else {
				text.textContent = 'Play request sent!'
				pendingMessage.classList.add('message-sent', 'message');
			}
			
			messagesDiv.appendChild(pendingMessage);

			if (isPendingFriendFrom) {
				
			} else if (isPendingFriendTo) {
				pendingMessage.classList.add('message-sent', 'message');
			}
		}

		setTimeout(function() {
			messagesDiv.scrollTop = messagesDiv.scrollHeight;
		}, 1);

		// Input message
		const messageInput = document.createElement("input");
		messageInput.setAttribute("type", "text");
		messageInput.setAttribute("placeholder", "Enter your message...");
		messageInput.setAttribute("id", "send-message-input-id");
		inputDiv.appendChild(messageInput);

		const imageInput = document.createElement('img');
		imageInput.src = '/static/default/assets/images/icons/send.svg';
		
		// Send button
		const sendButton = document.createElement("button");
		sendButton.classList.add("send-button");
		sendButton.setAttribute("id", "send-message-button-id");
		sendButton.onclick = sendMessage;
		sendButton.appendChild(imageInput)
		inputDiv.appendChild(sendButton);

	} catch (error) {
		console.error("Error in createConversationDisplay: ", error);
		throw error;
	}
}

export { createConversationDisplay };
