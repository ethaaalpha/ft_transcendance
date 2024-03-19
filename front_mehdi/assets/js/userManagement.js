//check at launch if logged
(async function() {
    const logged = await isLogged();
    if (logged) {
		changeScene("home");
    } else {
		changeScene("signIn");
    }
})();

async function isLogged() {
    const response = await fetch('/api/dashboard');
    return response.status === 200;
}

function signIn() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	
    var formData = new FormData();
    
    formData.append("username", username);
    formData.append("password", password);

	fetchData("/api/auth/login?mode=intern", 'POST', formData).then(
		(data) => {
			if (data.status === 403) { // mauvais mdp
				// notif mdp mauvais ?
				// effacer champ mdp
			}
			if (data.status === 400) { // compte existe pas, gonna become 404
				changeScene("signUp");
				document.getElementById("passwordConfirm").focus();
			}
			if (data.status === 200) {
				console.log("Connexion réussie");
				changeScene("home");
                appendAlert('Connexion réussie!', 'success'); // Afficher l'alerte de succès
			} else {
				console.log("Erreur de connexion");
			}
		}
	).catch(error => {//ca marche pas ca encore, VOIR ETHAN
		console.error('Error:', error);
	});
}


function signUp() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	// var passwordConfirm = document.getElementById("passwordConfirm");
	var email = document.getElementById("email").value;
	
    var formData = new FormData();
    
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
	
	fetchData("/api/auth/register", 'POST', formData).then(
	(data) => {
		if (data.status === 200) {
			console.log("Register réussie");
			changeScene("home");
		} else {
			console.log("Erreur de connexion");
		}
    })
    .catch(error => {
		console.error('Error:', error);
    });
}

function signWith42() {
	fetchData("/api/auth/login?mode=42")
    .then((data) => {
		data.json().then(
			(dataJSON) => {
				console.log(dataJSON)
				window.location.href = dataJSON.url;
			}
			)
		})	
	}
	
	
function signOut() {
	fetchData("/api/auth/logout", 'POST')
	.then(() => {
		console.log("Deconexion réussie");
		changeScene("signIn");
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

function forgotPassword() {
	var username = document.getElementById("username").value;
	
    var formData = new FormData();
    
    formData.append("username", username);
	
	fetchData("/api/auth/reset-password", 'POST', formData).then(
	(data) => {
		if (data.status === 200) {
			console.log("password sent!");
		} else {
			console.log("Erreur de connexion");
		}
    })
    .catch(error => {
		console.error('Error:', error);
    });
}
