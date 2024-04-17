function updateProfil() {
    fetchData('/api/dashboard')
        .then(data => {
            // console.log(data.data);
            // console.log('media/' + data['data']['profilePicture']);
            updateProfilPicture('media/' + data.data['profilePicture']);
            updateUsername(data.data['username']);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

function updateProfilPicture(src) {
    const profilePicture = document.getElementById('profilePicture');
    if (profilePicture) {
        profilePicture.src = "/" + src;
    } else {
        console.error('Element with ID "profilePicture" not found');
    }
}

function updateUsername(username) {
    const profilUsername = document.getElementById('profilUsername');
    if (profilUsername) {
        profilUsername.innerText = username;
    } else {
        console.error('Element with ID "username" not found');
    }
}


function manageFriend(username, action) {	
    var formData = new FormData();
    formData.append("action", action);
    formData.append("username", username);
	
	fetchData("/api/dashboard/friend", 'POST', formData).then(
	(data) => {
		if (data.status === 200) {
			console.log("manage friend action done!");
		} else {
			console.log("Login error");
		}
    })
    .catch(error => {
		console.error('Error:', error);
    });
}


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