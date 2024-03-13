
function signIn() {
	var username = document.getElementById("username").value;
	var passwordConfirm = document.getElementById("passwordConfirm");
	var password = document.getElementById("password").value;
	var email = document.getElementById("email");
	
    var formData = new FormData();
    
    formData.append("username", username);
    formData.append("password", password);
	
	if (username === "") {
		passwordConfirm.classList.remove("d-none");
		email.classList.remove("d-none");
	} else {

		fetchData("/api/auth/login?mode=intern", 'POST', formData).then(
			(data) => {
				// console.log(`mehdi avale ma bite ${data.status}`)
                if (data.status === 200) {
                    // Connexion réussie
                    console.log("Connexion réussie");
                    hideLoginForm();
                    unhideDashBoard1();
                } else {
                    // Erreur de connexion
                    console.log("Erreur de connexion");
                    // Gérer l'affichage de l'erreur ou autre action à effectuer
                }
            }
		).catch(error => {
            // Erreur de fetch
            console.error('Error:', error);
            // Gérer l'affichage de l'erreur ou autre action à effectuer
        });
	}


		// fetchData("/api/auth/login?mode=intern", 'POST', formData).then(
		// 	(data) => console.log(data.status)
		// )
		// /// CATCH ERROR OR LOGIN HERE

		// // hideLoginForm();
		// // unhideDashBoard1();

}

function signOut() {

	fetchData("/api/auth/logout", 'POST').then(
		// (data) => {}
	).catch(error => {
		// Erreur de fetch
		console.error('Error:', error);
		// Gérer l'affichage de l'erreur ou autre action à effectuer
	});

}



function hideLoginForm() {
	var loginForm = document.getElementById("loginForm");
	loginForm.classList.add("d-none");
	unhideDashBoard1();
}

function unhideDashBoard1() {
	var dashBoard1 = document.getElementById("dashBoard");
	dashBoard1.classList.remove("d-none");
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