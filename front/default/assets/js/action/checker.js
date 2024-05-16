function isValidUsername(username) {
	var usernameRegex = /^(?!42_)[a-zA-Z0-9._-]+$/;
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
	if (email.length < 5 || email.length > 254)
		return false
	return true
}

function emptyValues(elements) {
	for (let i = 0; i < elements.length; i++) {
		if (!elements[i].value.trim()) {
			return true; 
		}
	}
	return false;
}

function checkAllSignUp(event, enter = false) {
	var _username = document.getElementById('sign-up-username');
	var _password = document.getElementById('sign-up-password');
	var _passwordMatch = document.getElementById('sign-up-password-confirm');
	var _email = document.getElementById('sign-up-email');

	var items = [_username, _password, _passwordMatch, _email];

	if (enter) {
		if (emptyValues(items))
			return false;
		for (var i = 0; i < items.length; i++) {
			if (items[i].classList.contains('is-invalid')) {
				return false;
			}
		}
		return true;

	} else {
		isValidUsername(_username.value) ? _username.classList.remove('is-invalid') : _username.classList.add('is-invalid');
		isValidPassword(_password.value) ? _password.classList.remove('is-invalid') : _password.classList.add('is-invalid');
		isValidPassword(_passwordMatch.value) ? _passwordMatch.classList.remove('is-invalid') : _passwordMatch.classList.add('is-invalid');
		isValidEmail(_email.value) ? _email.classList.remove('is-invalid') : _email.classList.add('is-invalid')
		if (_password.value != _passwordMatch.value) {
			_password.classList.add('is-invalid');
			_passwordMatch.classList.add('is-invalid');
		}
	}
}

function checkAllSignIn(event, enter = false) {
	var _username = document.getElementById('sign-in-username');
	var _password = document.getElementById('sign-in-password');

	var items = [_username, _password];

	if (enter) {
		if (emptyValues(items))
			return false;
		for (var i = 0; i < items.length; i++) {
			if (items[i].classList.contains('is-invalid')) {
				return false;
			}
		}
		return true;
	} else {
		if (isValidUsername(_username.value))
			_username.classList.remove('is-invalid')
		else
			_username.classList.add('is-invalid');
		if (isValidPassword(_password.value))
			_password.classList.remove('is-invalid')
		else
			_password.classList.add('is-invalid');
	}
}

function checkAllSettingsPassword(event, enter = false) {
	var _actual = document.getElementById('settings-actual-password');
	var _new = document.getElementById('settings-new-password');
	var _confirm = document.getElementById('settings-confirm-password');

	var items = [_actual, _new, _confirm];
	if (enter) {
		if (emptyValues(items))
			return false;
		for (var i = 0; i < items.length; i++) {
			if (items[i].classList.contains('is-invalid')) {
				return false;
			}
		}
		return true;
	} else {
		items.forEach((i) => {
			if (isValidPassword(i.value))
				i.classList.remove('is-invalid');
			else
				i.classList.add('is-invalid');
		});
	
		if (_new.value != _confirm.value || _actual.value === _new.value) {
			_new.classList.add('is-invalid');
			_confirm.classList.add('is-invalid');
		}
	}
}

function checkAllSettingsEmail(event, enter = false) {
	var _actual = document.getElementById('settings-actual-email');
	var _new = document.getElementById('settings-new-email');
	var _confirm = document.getElementById('settings-confirm-email');

	var items = [_actual, _new, _confirm];

	if (enter) {
		if (emptyValues(items))
			return false;
		for (var i = 0; i < items.length; i++) {
			if (items[i].classList.contains('is-invalid')) {
				return false;
			}
		}
		return true;
	} else {
		items.forEach((i) => {
			if (isValidEmail(i.value))
				i.classList.remove('is-invalid');
			else
				i.classList.add('is-invalid');
		});
	
		if (_new.value != _confirm.value || _actual.value === _new.value) {
			_new.classList.add('is-invalid');
			_confirm.classList.add('is-invalid');
		}
	}
}

export { checkAllSignIn, checkAllSignUp, checkAllSettingsPassword, checkAllSettingsEmail };