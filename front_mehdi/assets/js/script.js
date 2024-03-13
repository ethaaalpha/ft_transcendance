
//check at loundr if log
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
			} else {
				console.log("Erreur de connexion");
			}
		}
	).catch(error => {//ca marche pas ca encore, VOIR ETHAN
		console.error('Error:', error);
	});
}

function signUp() {
	console.log("je suis dans signUp");

	unhideElement("passwordConfirm");
	unhideElement("signUp2");
	unhideElement("email");
	hideElement("42");
	hideElement("signInButton");
	hideElement("signUpButton");
}

function signUp2() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	// var passwordConfirm = document.getElementById("passwordConfirm");
	var email = document.getElementById("email").value;

    var formData = new FormData();
    
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);

	fetchData("/api/auth/register", 'POST', formData)
    .then(() => {
		console.log("Register réussie");
        hideElement("loginForm");
        unhideElement("home");
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

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