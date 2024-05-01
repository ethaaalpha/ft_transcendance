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

async function fetchData(apiUrl, method, data = null) {
	const csrfToken = getCookie('csrftoken');
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
	
	try {
		var resultRaw = await fetch(apiUrl, requestOptions);
		var status = resultRaw.status;
		var result = await resultRaw.json();

	} catch (error) {
		console.log("Error: " + error)
		return { status: 500, data: null };
	}
	return ({status: status, data: result});
}

export { getCookie, fetchData };
