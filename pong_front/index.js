const loggedDisplay = document.getElementById('logged');
const unloggedDisplay = document.getElementById('unlogged');

function handleFormSubmit(event) {
	event.preventDefault();


	const form = event.currentTarget;
	// Create a FormData object for the form
	const formData = new FormData(form);

	// Now you can proceed with form submission using fetchData or other logic
	console.log(`ici ${form.getAttribute('action')}`)
	const apiUrl = form.getAttribute('action');  // Use the form's action attribute as the API endpoint
	const method = form.method.toUpperCase();

	fetchData(apiUrl, method, formData)
		.then(data => {
			console.log('Data:', data);
		},
		error => console.error('Error:', error))
}

function updatePP(link){
	const image = document.getElementById('image');
	image.src = link;
}

function updateUsername(username) {
	const usernameHTML = document.getElementById('username')
	usernameHTML.innerText = username;
	usernameHTML.style.fontWeight = 'bold';
}

function loadLogged() {
	fetchData('/api/dashboard')
		.then(data => {
			console.log(data)
			updatePP(data['profilePicture']);
			updateUsername(data['username']);
	});
	loggedDisplay.style.display = 'flex';

	document.getElementById('auth-logout').onclick = async (event) => {
		(async () => {
			await fetchData('/api/auth/logout', 'POST')
				.then(data => {
					loggedDisplay.style.display = 'none'
					unloggedDisplay.style.display = 'block'
				});
		})();
	};;

	activity = new activityWebsocket();
	activity.connect();
	activity.registerEvents();

	coordination = new coordinationWebsocket();
	coordination.connect();
	coordination.registerEvents();
}

function loadUnlogged() {
	unloggedDisplay.style.display = 'block';

	document.getElementById('auth-42').onclick = async (event) => {
		(async () => {
			await fetchData('/api/auth/login?mode=42')
				.then(data => {
					url = data['url']
					window.location.href = url
				});
		})();
	};;
}

async function isLogged() {
	const response = await fetch('/api/dashboard')
	return response.status === 200;
}

async function main() {
	loggedDisplay.style.display = 'none';
	unloggedDisplay.style.display = 'none';

	isLogged = await isLogged();
	if (isLogged) {
		console.log("utilisateur connecté")
		loadLogged();
	}
	else {
		console.log("utilisateur déconnecté")
		loadUnlogged();
	}

	const ajaxForms = document.querySelectorAll('.ajax-form');
    ajaxForms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

main();