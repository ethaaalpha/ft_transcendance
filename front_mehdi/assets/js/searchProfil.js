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

// function setSearchbarListeners() {
// 	document.getElementById("conversation-list-searchbar-input-id").addEventListener("input", function() {
// 		const searchInput = document.getElementById("conversation-list-searchbar-input-id");
// 		let isInputEmpty = true;

// 		const inputValue = searchInput.value.trim();
		
// 		if (inputValue && isInputEmpty) {
// 			changeScene("search");
// 			isInputEmpty = false;
// 		} else if (!inputValue && !isInputEmpty) {
// 			changeScene("conversation-list");
// 			isInputEmpty = true;
// 		}
// 	});

// 	document.addEventListener("DOMContentLoaded", function() {
// 		const searchInput = document.getElementById("conversation-list-searchbar-container-id");
			
// 		searchInput.addEventListener("keypress", function(event) {
// 			if (event.key === "Enter") {
// 				searchProfil();
// 			}
// 		});
// 	});
// }


function setSearchbarListeners() {
    const searchInput = document.getElementById("conversation-list-searchbar-input-id");
    let isInputEmpty = true;

    function onInputFilled() {
        changeScene("search");
        isInputEmpty = false;
    }

    function onInputCleared() {
        changeScene("conversation-list");
        isInputEmpty = true;
    }

    searchInput.addEventListener("input", function() {
        const inputValue = searchInput.value.trim();
        
        if (inputValue && isInputEmpty) {
            onInputFilled();
        } else if (!inputValue && !isInputEmpty) {
            onInputCleared();
        }
    });

    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchProfil();
        }
    });
}



// function unsetEventListenerChat() {
//     const searchInput = document.getElementById("conversation-list-searchbar-input-id");
    
//     searchInput.removeEventListener("input", onInputFilled);
//     searchInput.removeEventListener("input", onInputCleared);
//     searchInput.removeEventListener("keypress", searchProfil);
// }
