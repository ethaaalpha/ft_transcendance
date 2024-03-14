//alertes
const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

const appendAlert = (message, type) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('');

  alertPlaceholder.append(wrapper);

  // Masquer l'alerte après 5 secondes
  setTimeout(() => {
    wrapper.querySelector('.alert').remove();
  }, 5000);
};

const alertTrigger = document.getElementById('liveAlertBtn');
if (alertTrigger) {
  alertTrigger.addEventListener('click', () => {
    appendAlert('Nice, you triggered this alert message!', 'success');
  });
}



//when enter press click on signin
document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    // const passwordConfirmInput = document.getElementById("passwordConfirm");
    // const emailInput = document.getElementById("email");

    usernameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            signIn();
        }
    });

    passwordInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            signIn();
        }
    });
});

//check at launch if log
(async function() {
    const logged = await isLogged();
    if (logged) {
        unhideElement("home");
    } else {
        unhideElement("loginForm");
    }
})();

async function isLogged() {
    const response = await fetch('/api/dashboard');
    return response.status === 200;
}

// SIGN FONCTIONS
function signIn() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	
    var formData = new FormData();
    
    formData.append("username", username);
    formData.append("password", password);

	fetchData("/api/auth/login?mode=intern", 'POST', formData).then(
		(data) => {
			if (data.status === 200) {
				console.log("Connexion réussie");
				hideElement("loginForm");
				unhideElement("home");
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
			hideElement("loginForm");
			unhideElement("home");
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
	
//HOME
	
function signOut() {
	fetchData("/api/auth/logout", 'POST')
	.then(() => {
		console.log("Deconexion réussie");
		hideElement("home");
		unhideElement("loginForm");
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

	//gestion de scenes
	function sceneSignUp() {
		unhideElement("passwordConfirm");
	unhideElement("signUpButton2");
	unhideElement("email");
	hideElement("signWith42Button");
	hideElement("signInButton");
	hideElement("signUpButton");
}

// HIDE OR NOT
function hideElement(elementId) {
	var element = document.getElementById(elementId);
	if (element) {
		element.classList.add("d-none");
	}
}

function unhideElement(elementId) {
	var element = document.getElementById(elementId);
	if (element) {
		element.classList.remove("d-none");
	}
}
	
	
	// if (identifiant === "") {
		// 	display error empty
		// } else {
			// 	if not into database OR wrong password {
				// 		display error wrong combinaison username password
				// 	}
				// 	else
				// 		hide and succefully loged scenario
				// }
				
				
function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

function fetchData(apiUrl, method, data = null) {
	const csrfToken = getCookie('csrftoken');
	
	// console.log(`la data ${JSON.stringify(data)}`);
	// console.log(`voici le token ${csrfToken}`);
	
	const headers = {
		'X-CSRFTOKEN': csrfToken,
	};
	
	const requestOptions = {
		method: method,
		headers: headers,
	};
	
	if (data && (method === 'POST' || method === 'PUT')) {
		requestOptions.body = data;
	}
	
	return fetch(apiUrl, requestOptions)
	.then(response => response)
	.catch(error => console.error('Error:', error));
}