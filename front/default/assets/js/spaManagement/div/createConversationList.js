import globalVariables from '../../init.js';
import { fetchUserData } from '../../init.js';
import { fetchConversations } from '../../action/chat.js';
import { fetchProfilPicture } from '../../fetch/http.js';
import { changeScene } from '../scene.js';

async function createConversationList() {
	try {
		await fetchUserData();
		await fetchConversations();

		const conversationList = document.getElementById("conversation-list");

		// Create parents div
		const searchbarDiv = document.createElement("div");
		searchbarDiv.id = "conversation-list-searchbar-container-id";

		const conversationDiv = document.createElement("div");
		conversationDiv.id = "conversation-list-contact-container-id";
		conversationDiv.classList.add("block-scroll");
		conversationDiv.style.setProperty("--top", '5%');

		conversationList.appendChild(searchbarDiv);
		conversationList.appendChild(conversationDiv);

		// Input search
		const messageInput = document.createElement("input");
		messageInput.setAttribute("type", "text");
		messageInput.setAttribute("placeholder", "Search a contact...");
		messageInput.classList.add("searchbar-input");
		messageInput.setAttribute("id", "conversation-list-searchbar-input-id");
		searchbarDiv.appendChild(messageInput);

		// Create conversation button
		for (let user in globalVariables.userConversations.conversations) {
			if (globalVariables.userConversations.conversations.hasOwnProperty(user)) {
				const conversationButton = document.createElement("button");
				conversationButton.classList.add("conversation-list-contact-button");
				const img = document.createElement("img");
				try {
					const imgUrl = await fetchProfilPicture(user);
					img.src = imgUrl;
				} catch (error) {
					console.error("Error in getting profil picture of:", error);
				}
				img.alt = "Profile Picture";
				conversationButton.appendChild(img);
				const userInfo = document.createElement("div");
				userInfo.classList.add("conversation-list-user");
				userInfo.textContent = user;
				conversationButton.appendChild(userInfo);
				conversationButton.onclick = function() {
					changeScene("conversation-display", user);
				}
				conversationDiv.appendChild(conversationButton);
			}
		}

	} catch (error) {
		console.error("Error in createConversationList: ", error);
		throw error;
	}
}

export { createConversationList };
