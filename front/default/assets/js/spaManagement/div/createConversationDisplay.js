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
			// pendingMessage.classList.add('pending-message');
			const boldItalicText = document.createElement('span');
			boldItalicText.innerHTML = `<b><i>${isPendingFriendFrom ? 'Wanna be friend?' : 'Friend request sent!'}</i></b>`;
			pendingMessage.appendChild(boldItalicText);
			messagesDiv.appendChild(pendingMessage);

			if (isPendingFriendFrom) {
				pendingMessage.classList.add('message-received', 'message');
				const acceptButton = document.createElement('button');
				acceptButton.textContent = 'Accept';
				acceptButton.classList.add('accept-button');
				acceptButton.onclick = function() {
					manageFriend(user, 'accept');
				};

				const declineButton = document.createElement('button');
				declineButton.textContent = 'Decline';
				declineButton.classList.add('decline-button');
				declineButton.onclick = function() {
					manageFriend(user, 'refuse');
				};

				pendingMessage.appendChild(acceptButton);
				pendingMessage.appendChild(declineButton);
			} else if (isPendingFriendTo) {
				pendingMessage.classList.add('message-sent', 'message');
			}
		}

		// Handle pending game requests
		const isPendingGameFrom = globalVariables.currentUser.isPendingGameFrom(user);
		const isPendingGameTo = globalVariables.currentUser.isPendingGameTo(user);

		if (isPendingGameFrom || isPendingGameTo) {
			const pendingMessage = document.createElement('div');
			// pendingMessage.classList.add('pending-message');
			const boldItalicText = document.createElement('span');
			boldItalicText.innerHTML = `<b><i>${isPendingGameFrom ? 'Wanna play?' : 'Play request sent!'}</i></b>`;
			pendingMessage.appendChild(boldItalicText);
			messagesDiv.appendChild(pendingMessage);

			if (isPendingGameFrom) {
				pendingMessage.classList.add('message-received', 'message');
				const acceptButton = document.createElement('button');
				acceptButton.textContent = 'Accept';
				acceptButton.classList.add('accept-button');
				acceptButton.onclick = function() {
					acceptPlayRequest(user);
				};

				const declineButton = document.createElement('button');
				declineButton.textContent = 'Decline';
				declineButton.classList.add('decline-button');
				declineButton.onclick = function() {
					refusePlayRequest(user);
				};

				pendingMessage.appendChild(acceptButton);
				pendingMessage.appendChild(declineButton);
			} else if (isPendingGameTo) {
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
