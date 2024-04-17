let gChatConversations;
let gUser;

//check at launch if logged
(async function() {
    const logged = await isLogged();
    if (logged) {
		await fetchUserData();
		// await fetchConversations();
		changeScene("home");
		// updateProfil();
    } else {
		changeScene("signIn");
    }
})();

async function isLogged() {
    const response = await fetch('/api/dashboard');
    return response.status === 200;
}


async function fetchUserData() {
	try {
	  const data = await fetchData('/api/dashboard');
	  gUser = new User(data.data);
	} catch (error) {
	  console.error('Error fetching user data:', error);
	}
}