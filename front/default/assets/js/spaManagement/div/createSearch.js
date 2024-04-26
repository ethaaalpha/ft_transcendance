import { fetchProfilPicture } from '../../fetch/http.js';
import { changeScene } from '../scene.js';

async function createSearch(username) {
	try {
		const searchInput = username;
		const searchParentDiv = document.getElementById("search");

		// Create parents div
		const searchBarDiv = document.createElement("div");
		searchBarDiv.id = "search-searchbar-container-id";
		searchBarDiv.classList.add("search-searchbar-container");

		const conversationDiv = document.createElement("div");
		conversationDiv.id = "search-contact-container-id";
		conversationDiv.classList.add("search-contact-container");

		searchParentDiv.appendChild(searchBarDiv);
		searchParentDiv.appendChild(conversationDiv);

		// Input search
		const messageInput = document.createElement("input");
		messageInput.setAttribute("type", "text");
		messageInput.setAttribute("placeholder", "Search a contact...");
		messageInput.classList.add("search-searchbar-input");
		messageInput.setAttribute("id", "search-searchbar-input-id");
		messageInput.value = searchInput;
		searchBarDiv.appendChild(messageInput);

		const imgUrl = await fetchProfilPicture(searchInput)

		if (imgUrl) {
			const conversationButton = document.createElement("button");
			conversationButton.classList.add("search-button");

			const img = document.createElement("img");
			img.src = imgUrl;
			img.alt = "Profile Picture";
			conversationButton.appendChild(img);
	
			const userInfo = document.createElement("div");
			userInfo.classList.add("search-user");
			userInfo.textContent = searchInput;

			conversationButton.appendChild(userInfo);

			conversationButton.addEventListener("click", function() {
				changeScene("profil", searchInput);
			});

			conversationDiv.appendChild(conversationButton);
		}
		else
			console.error('Error fetching user data:', error);

	} catch (error) {
		console.error('Error in createSearch: ', error);
		throw error;
	}
}

export { createSearch };
