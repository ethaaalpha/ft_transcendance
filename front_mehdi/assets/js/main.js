let gChatConversations;
let gUser;

//check at launch if logged
(async function() {
    const logged = await isLogged();
    if (logged) {
        await fetchUserData();
        // await fetchConversations();
        changeScene("home");
    } else {
        changeScene("signIn");
    }
})();


async function isLogged() {
    const response = await fetch('/api/dashboard');
    return response.status === 200;
}

async function fetchUserData() {
	return new Promise((resolve, reject) => {
		fetchData('/api/dashboard')
		.then(data => {
			if (data.status === 200) {
				if (!gUser) {
					// console.log(data.data);
					gUser = new User(data.data);
				} else {
					gUser.update(data.data);
				}
				resolve(true);
			} else {
				resolve(false);
			}
		})
		.catch(error => {
			console.error('Error fetching user data:', error);
			reject(error);
		});
	});
};
