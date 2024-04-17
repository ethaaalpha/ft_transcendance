async function searchProfil() {

	const searchInput = document.getElementById("conversation-list-searchbar-input-id").value;
	const conversationDiv = document.getElementById("conversation-list-contact-container-id");

	const imgUrl = await fetchProfilPicture(searchInput)

		if (imgUrl) {
			const conversationButton = document.createElement("button");
			conversationButton.classList.add("conversation-list-contact-button");

			const img = document.createElement("img");
			img.src = imgUrl;
			img.alt = "Profile Picture";
			conversationButton.appendChild(img);
	
			const userInfo = document.createElement("div");
			userInfo.classList.add("conversation-list-user");
			userInfo.textContent = searchInput;

			conversationButton.appendChild(userInfo);

			conversationButton.addEventListener("click", function() {
				changeScene("profil", searchInput);
			});

			conversationDiv.appendChild(conversationButton);
		}
		else
			console.log("merde");

}