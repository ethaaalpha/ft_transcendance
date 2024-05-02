
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

function handleReloader(event) {
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
			pageElement.reload();
		},
		error => {
			console.error('Error:', error)
		});
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

function changeClass(className, mode) {
	const items = document.querySelectorAll(`.${className}`);
    items.forEach(item => {
        item.style.display = mode;
    });
}

function loadLogged() {
	fetchData('/api/dashboard')
		.then(data => {
			console.log(data)
			updatePP('/media/' + data['profilePicture']);
			updateUsername(data['username']);
	});

	document.getElementById('auth-logout').onclick = async (event) => {
		(async () => {
			await fetchData('/api/auth/logout', 'POST')
				.then(data => {
					pageElement.reload();
				});
		})();
	};;

	activity = new activityWebsocket();
	activity.connect();
	activity.registerEvents();

	coordination = new coordinationWebsocket();
	coordination.connect();
	coordination.registerEvents();

	changeClass('logged', 'flex');
}

function loadUnlogged() {
	changeClass('unlogged', 'block');

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

class Page{
	constructor() {
		this.isLogged = false;
		changeClass('logged', 'none');
		changeClass('unlogged', 'none');
	}

	load() {
		const ajaxForms = document.querySelectorAll('.ajax-form');
		ajaxForms.forEach(form => {
			form.addEventListener('submit', handleFormSubmit);
		});

		const reloaderForms = document.querySelectorAll('.reloader');
		reloaderForms.forEach(form => {
			form.addEventListener('submit', handleReloader);
		});
		this.reload();
	} 

	async reload() {
		changeClass('logged', 'none');
		changeClass('unlogged', 'none');
		this.isLogged = await isLogged();
		if (this.isLogged) {
			console.log("utilisateur connecté")
			loadLogged();
		}
		else {
			console.log("utilisateur déconnecté")
			loadUnlogged();
		}
	}
}

pageElement = new Page();
pageElement.load();