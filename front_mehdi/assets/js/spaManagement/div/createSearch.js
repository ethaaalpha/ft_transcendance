async function createSearch() {
	try {
		const searchParentDiv = document.getElementById("search");

		// Create parents div
		const searchbarDiv = document.createElement("div");
		searchbarDiv.id = "search-searchbar-container-id";
		searchbarDiv.classList.add("search-searchbar-container");

		const conversationDiv = document.createElement("div");
		conversationDiv.id = "search-contact-container-id";
		conversationDiv.classList.add("search-contact-container");

		searchParentDiv.appendChild(searchbarDiv);
		searchParentDiv.appendChild(conversationDiv);

		// Input search
		const messageInput = document.createElement("input");
		messageInput.setAttribute("type", "text");
		messageInput.setAttribute("placeholder", "Search a contact...");
		messageInput.classList.add("search-searchbar-input");
		messageInput.setAttribute("id", "search-searchbar-input-id");

		// Vérifier si l'élément existe avant d'accéder à sa valeur
		const searchInput = document.getElementById("conversation-list-searchbar-input-id");
		if (searchInput) {
			messageInput.value = searchInput.value; // Utiliser value pour définir la valeur
		} else {
			console.error("L'élément conversation-list-searchbar-input-id n'existe pas.");
			return;
		}

		searchbarDiv.appendChild(messageInput);

	} catch (error) {
		console.error('Error in createSearch: ', error);
		throw error;
	}
}

export { createSearch };
