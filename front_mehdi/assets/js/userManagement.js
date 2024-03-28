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
			if (data.status === 403) {
				console.log("Bad password");
				// notif mdp mauvais ?
				// effacer champ mdp
			}
			if (data.status === 404) {
				console.log("You need to create an account");
				changeScene("signUp");
				document.getElementById("passwordConfirm").focus();
			}
			if (data.status === 200) {
				console.log("Successful connection");
				changeScene("home");
                appendAlert('Successful connection', 'success'); // Afficher l'alerte de succès
			} else {
				console.log("Connexion error");
			}
		}
	).catch(error => {
		console.error('Error:', error);
	});
}


function signUp() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
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
			appendAlert('Your new password has been sent to you email!', 'warning');
		} else {
			console.log("Erreur de connexion");
		}
    })
    .catch(error => {
		console.error('Error:', error);
    });
}
