function isValidUsername(username) {
	var usernameRegex = /^(?!42_)[a-zA-Z0-9._-]+$/; // check for invalid chars + start 42_
	if (!usernameRegex.test(username))
		return false
	if (username.length < 3 || username.length > 9)
		return false
	return true;
}

function isValidPassword(password) {
	if (password.length < 5 || password.length > 32)
		return false
	return true;
}

function isValidEmail(email) {
	var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	if (!emailRegex.test(email))
		return false
	if (email.length < 5 || email > 254)
		return false
	return true
}

function checkSignUpAllValues() {
	let username = document.getElementById('sign-up-username');
	let password = document.getElementById('sign-up-password');
	let passwordMatch = document.getElementById('sign-up-password-confirm');
	let email = document.getElementById('sign-up-email');

	if (username.classList.contains('is-invalid')
		|| password.classList.contains('is-invalid')
		|| passwordMatch.classList.contains('is-invalid')
		|| email.classList.contains('is-invalid')){
			return false
	}
	return true
}

function checkSignInAllValues() {
	let username = document.getElementById('sign-in-username');
	let password = document.getElementById('sign-in-password');

	if (username.classList.contains('is-invalid')
		|| password.classList.contains('is-invalid')){
		return false
	}
	return true
}

export { isValidUsername, isValidPassword, isValidEmail, checkSignUpAllValues, checkSignInAllValues };