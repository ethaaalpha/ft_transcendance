function updatePP(link){
	const profilePicture = document.getElementById('profilePicture');
	profilePicture.src = link;
}

function updateUsername(username) {
	const usernameHTML = document.getElementById('username')
	usernameHTML.innerText = username;
	// usernameHTML.style.fontWeight = 'bold';
}

function loadLogged() {
	fetchData('/api/dashboard')
		.then(data => {
			console.log(data)
			updatePP('media/' + data['profilePicture']);
			updateUsername(data['username']);
	});
}