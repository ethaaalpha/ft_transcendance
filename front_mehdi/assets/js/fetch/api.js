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
        .then(response => {
            const statusCode = response.status;
            return response.json()
                .then(data => {
                    return { status: statusCode, data: data };
                });
        })
        .catch(error => {
            console.error('Error:', error);
            return { status: 500, data: null }; // Default status code for error
        });
}

export { getCookie, fetchData };
