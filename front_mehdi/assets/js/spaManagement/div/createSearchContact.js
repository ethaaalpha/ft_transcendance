import { fetchProfilPicture } from '../../fetch/http.js';
import { changeScene } from '../scene.js';

async function createSearchContact(user) {
	try {
		
		const searchInput = user;//document.getElementById("search-searchbar-input-id").value;//if exist, try
		const searchContactParentDiv = document.getElementById("search-contact");

		// Create parents div
		const searchContactBarDiv = document.createElement("div");
		searchContactBarDiv.id = "search-contact-searchbar-container-id";
		searchContactBarDiv.classList.add("search-contact-searchbar-container");

		const conversationDiv = document.createElement("div");
		conversationDiv.id = "search-contact-contact-container-id";
		conversationDiv.classList.add("search-contact-contact-container");

		searchContactParentDiv.appendChild(searchContactBarDiv);
		searchContactParentDiv.appendChild(conversationDiv);

		// Input search
		const messageInput = document.createElement("input");
		messageInput.setAttribute("type", "text");
		messageInput.setAttribute("placeholder", "Search a contact...");
		messageInput.classList.add("search-contact-searchbar-input");
		messageInput.setAttribute("id", "search-contact-searchbar-input-id");
		messageInput.value = searchInput.value;
		searchContactBarDiv.appendChild(messageInput);

		const imgUrl = await fetchProfilPicture(searchInput)

		if (imgUrl) {
			const conversationButton = document.createElement("button");
			conversationButton.classList.add("search-contact-button");

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
		console.error('Error in createSearchContact: ', error);
		throw error;
	}
}

export { createSearchContact };
