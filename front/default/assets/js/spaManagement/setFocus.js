function setFocus(currentScene) {
	switch (currentScene) {
		case "sign-in":
			focusSignIn();
			break;
		case "sign-up":
			focusSignUp();
			break;
		case "conversation-display":
			focusConversationDisplay();
			break;
		case "search":
			focusSearch();
			break;
		case "settings-password":
			focusSettingsPassword();
			break;
		case "settings-email":
			focusSettingsEmail();
			break;
	}
}

function focusSignIn() {
	document.getElementById("sign-in-username").focus();
}

function focusSignUp() {
	const usernameInput = document.getElementById("sign-up-username");
	const confirmPasswordInput = document.getElementById("sign-up-password-confirm");

	if (usernameInput && usernameInput.value === "") {
		usernameInput.focus();
	} else if (confirmPasswordInput) {
		confirmPasswordInput.focus();
	}
}

function focusConversationDisplay() {
	document.getElementById("send-message-input-id").focus();
}

function focusSearch() {
	document.getElementById("search-searchbar-input-id").focus();
}

function focusSettingsPassword() {
	document.getElementById("settings-actual-password").focus();
}

function focusSettingsEmail() {
	document.getElementById("settings-actual-email").focus();
}

export { setFocus };