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
