const loggedDisplay = document.getElementById('logged');
const unloggedDisplay = document.getElementById('unlogged');

function handleFormSubmit(event) {
	event.preventDefault();

	// Create a FormData object for the form
	const formData = new FormData(event.target);

	// Now you can proceed with form submission using fetchData or other logic
	const apiUrl = event.target.action;  // Use the form's action attribute as the API endpoint
	const method = event.target.method.toUpperCase();

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

main()
	
	// username = null;
	// const loggedDisplay = document.getElementById('logged');
	// const unloggedDisplay = document.getElementById('unlogged');
	// loggedDisplay.style.display = 'none'
	// unloggedDisplay.style.display = 'none'
	// async function isLogged() {
	// 	const response = await fetch('/dashboard')
	// 	return response.status === 200;
	// }
	// (async () => {
    // 	if (await isLogged()) {
	// 		function connect() {
	// 			const chatSocket = new WebSocket(
    //     			'wss://'
    //     			+ window.location.host
    //    				+ '/activity/'
    //  			);
	// 			console.log("Websocket created and connected !");
    // 			chatSocket.onmessage = function(e) {
    //     			const data = JSON.parse(e.data);
	// 				const stringifiedData = JSON.stringify(data)
	// 				console.log(`j'ai reçu quelque chose ! ${stringifiedData}`)
    //     			document.querySelector('#activity-log').value += stringifiedData +'\n';
    // 			};
    // 			chatSocket.onclose = function(e) {
    //     			console.error('Chat socket closed unexpectedly ! Retrying to connect !');
	// 				setTimeout(function() {
	// 					connect();
	// 				}, 1000);
    // 			};
	// 			document.querySelector('#chat-message-submit').onclick = function(e) {
    //     			const messageInputDom = document.querySelector('#chat-message-input');
    //     			const targetInputDom = document.querySelector('#chat-message-target');
    //     			const message = messageInputDom.value;
	// 				data = {'from': username, 'to': targetInputDom.value, 'content': messageInputDom.value}
	// 				console.log(`J'envoie ça ${JSON.stringify(data)}`)
    //     			chatSocket.send(JSON.stringify({
    //     			    'event': 'chat',
	// 					'data': data,
    //     			}));
    //     			messageInputDom.value = '';
    // 			};
				
	// 		}
	// 		function coordinationConnect() {
	// 			const coordinationSocket = new WebSocket(
	// 				'wss://'
	// 				+ window.location.host
	// 				+ '/coordination/'
	// 			)
	// 			console.log("Coordination socket created and connected !");
	// 			coordinationSocket.onmessage = function(e) {
    //     			const data = JSON.parse(e.data);
	// 				const stringifiedData = JSON.stringify(data)
	// 				console.log(`j'ai reçu quelque chose coord! ${stringifiedData}`)
    //     			document.querySelector('#activity-log').value += stringifiedData +'\n';
    // 			};
	// 			coordinationSocket.onclose = function(e) {
    //     			console.error('Chat socket closed unexpectedly ! Retrying to connect !');
	// 				setTimeout(function() {
	// 					coordinationConnect();
	// 				}, 1000);
    // 			}
	// 			document.querySelector("#button-match").onclick = function(e) {
	// 				coordinationSocket.send(JSON.stringify({'event' : 'matchmaking', 'data' : {'action': 'join'}}))
	// 			}
	// 			document.querySelector("#button-join").onclick = function(e) {
	// 				domInput = document.querySelector("#room-id-input");
	// 				value = domInput.value;
	// 				coordinationSocket.send(JSON.stringify({'event' : 'tournament', data: {'room-id': value, 'action': 'join'}}));
	// 				domInput.value = "";
	// 			}
	// 			document.querySelector("#button-create").onclick = function(e) {
	// 				domInput = document.querySelector("#room-id-input");
	// 				value = domInput.value;
	// 				coordinationSocket.send(JSON.stringify({'event' : 'create', data: {'mode': value}}));
	// 				domInput.value = "";
	// 			}
	// 		}
	// 		// Fetch with CSRF token included in headers
	// 		fetch('/dashboard?filter=username', {
	// 		  method: 'GET',
	// 		  headers: {
	// 		    'Content-Type': 'application/json',
	// 		    'X-CSRFToken': getCsrfToken(),
	// 		  },
	// 		})
	// 		  .then(response => response.json())
	// 		  .then(response => {
	// 		    const text = document.getElementById('username');
	// 		    text.innerText = response['username'];
	// 		    username = response['username'];
	// 		    text.style.fontWeight = 'bold';
	// 		});
	// 		fetch('/dashboard?filter=profilePicture', {
	// 		  method: 'GET',
	// 		  headers: {
	// 		    'Content-Type': 'application/json',
	// 		    'X-CSRFToken': getCsrfToken(),
	// 		  },
	// 		})
	// 		  .then(response => response.json())
	// 		  .then(response => {
	// 		    const image = document.getElementById('image');
	// 		    image.src = response['profilePicture'];
	// 		  });
	// 		// connect();
	// 		// coordinationConnect();
	// 		loggedDisplay.style.display = 'flex'
    // 	} else {
	// 		unloggedDisplay.style.display = 'block'
    // 	}
   	// })();