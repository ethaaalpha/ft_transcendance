import globalVariables from '/static/default/assets/js/init.js';
import { fetchUserData } from '/static/default/assets/js/fetch/http.js';
import { fetchConversations } from '/static/default/assets/js/action/chat.js';
import { fetchProfilPicture } from '/static/default/assets/js/fetch/http.js';
import { pushUrl } from '/static/default/assets/js/spaManagement/router.js';
import { updateStatus } from '/static/default/assets/js/action/chat.js'

async function createConversationList() {
	try {
		await fetchUserData();
		await fetchConversations();

		const conversationList = document.getElementById("conversation-list");

		const searchbarDiv = document.createElement("div");
		searchbarDiv.id = "conversation-list-searchbar-container-id";

		const conversationDiv = document.createElement("div");
		conversationDiv.id = "conversation-list-contact-container-id";
		conversationDiv.classList.add("block-scroll");
		conversationDiv.style.setProperty("--top", '5%');

		conversationList.appendChild(searchbarDiv);
		conversationList.appendChild(conversationDiv);

		const messageInput = document.createElement("input");
		messageInput.setAttribute("type", "text");
		messageInput.setAttribute("placeholder", "Search a contact...");
		messageInput.classList.add("searchbar-input");
		messageInput.setAttribute("id", "conversation-list-searchbar-input-id");
		searchbarDiv.appendChild(messageInput);

		for (let user in globalVariables.userConversations.conversations)
			await createConversationItem(conversationDiv, user);

	} catch (error) {
		console.error("Error in createConversationList: ", error);
		throw error;
	}
}

async function createConversationItem(parent, user, noconv = false) {

	if (globalVariables.userConversations.conversations.hasOwnProperty(user) || noconv) {
		const conversationButton = document.createElement("button");
		conversationButton.classList.add("conversation-list-contact-button");
		const img = document.createElement("img");
		try {
			const imgUrl = await fetchProfilPicture(user);
			img.src = imgUrl;
		} catch (error) {
			console.error("Error in getting profile picture of:", error);
		}
		img.alt = "Profile Picture";

		const state = document.createElement("div");
		state.id = 'conversation-list-status-' + user; 
		state.style.aspectRatio = '1/1';
		state.style.width = '5%';
		state.style.borderRadius = '50%';
		state.style.backgroundColor = 'var(--item-color)';
		state.style.zIndex = '2';
		state.style.marginLeft = '-10%';
		state.style.marginRight = '5%';
		state.style.marginBottom = '-14%';
	
		conversationButton.appendChild(img);
		conversationButton.appendChild(state);

		const rightBlock = document.createElement("div");
		rightBlock.classList.add('conversation-list-contact-button-right')

		const userInfo = document.createElement("div");
		userInfo.textContent = user;

		const lastMessage = document.createElement('span');
		lastMessage.textContent = 'Nothing yet :(';
	
		if (!noconv) {
			if (globalVariables.userConversations.conversations[user][0])
				lastMessage.textContent = globalVariables.userConversations.conversations[user][0].content;
		}

		rightBlock.appendChild(userInfo);
		rightBlock.appendChild(lastMessage);
		conversationButton.appendChild(rightBlock);
		conversationButton.onclick = function() {
			pushUrl('/chat?with=' + user);
		}
		parent.appendChild(conversationButton);
		updateStatus(globalVariables.currentUser.getFriendStatus(user), state.id);
	}
}

export { createConversationList, createConversationItem };
