import { signUp } from '/static/default/assets/js/action/userManagement.js';

function createSignUp() {
	try {
		const signUpContainer = document.getElementById("sign-up");

		const containerDiv = document.createElement("div");
		containerDiv.classList.add("container");

		const rowDiv = document.createElement("div");
		rowDiv.classList.add("row", "align-items-center", "justify-content-center", "vh-100");

		const colDiv = document.createElement("div");
		colDiv.classList.add("col-md-6", "col-lg-4", "dark-form");

		const signUpForm = document.createElement("form");
		const title = document.createElement("h1");
		title.classList.add("title-1", "mb-3", "fw-bold");
		title.textContent = "signUp";
		signUpForm.appendChild(title);

		const usernameInputDiv = document.createElement("div");
		usernameInputDiv.classList.add("form-floating", "fixed", "mb-3", "col-8", "mx-auto");

		const usernameInput = document.createElement("input");
		usernameInput.setAttribute("type", "text");
		usernameInput.classList.add("form-control");
		usernameInput.setAttribute("id", "sign-up-username");
		usernameInput.setAttribute("placeholder", "Username");

		const usernameInputLabel = document.createElement("label");
		usernameInputLabel.setAttribute("for", "sign-up-username");
		usernameInputLabel.classList.add("form-label");
		usernameInputLabel.textContent = "Username";
		usernameInputDiv.appendChild(usernameInput);
		usernameInputDiv.appendChild(usernameInputLabel);
		signUpForm.appendChild(usernameInputDiv);

		const passwordInputDiv = document.createElement("div");
		passwordInputDiv.classList.add("form-floating", "fixed", "mb-3", "col-8", "mx-auto");

		const passwordInput = document.createElement("input");
		passwordInput.setAttribute("type", "password");
		passwordInput.classList.add("form-control");
		passwordInput.setAttribute("id", "sign-up-password");
		passwordInput.setAttribute("placeholder", "Password");

		const passwordInputLabel = document.createElement("label");
		passwordInputLabel.setAttribute("for", "sign-up-password");
		passwordInputLabel.classList.add("form-label");
		passwordInputLabel.textContent = "Password";
		passwordInputDiv.appendChild(passwordInput);
		passwordInputDiv.appendChild(passwordInputLabel);
		signUpForm.appendChild(passwordInputDiv);

		const confirmPasswordInputDiv = document.createElement("div");
		confirmPasswordInputDiv.classList.add("form-floating", "fixed", "mb-3", "col-8", "mx-auto");

		const confirmPasswordInput = document.createElement("input");
		confirmPasswordInput.setAttribute("type", "password");
		confirmPasswordInput.classList.add("form-control");
		confirmPasswordInput.setAttribute("id", "sign-up-password-confirm");
		confirmPasswordInput.setAttribute("placeholder", "Confirm password");

		const confirmPasswordInputLabel = document.createElement("label");
		confirmPasswordInputLabel.setAttribute("for", "sign-up-password-confirm");
		confirmPasswordInputLabel.classList.add("form-label");
		confirmPasswordInputLabel.textContent = "Confirm password";
		confirmPasswordInputDiv.appendChild(confirmPasswordInput);
		confirmPasswordInputDiv.appendChild(confirmPasswordInputLabel);
		signUpForm.appendChild(confirmPasswordInputDiv);

		const emailInputDiv = document.createElement("div");
		emailInputDiv.classList.add("form-floating", "fixed", "mb-3", "col-8", "mx-auto");

		const emailInput = document.createElement("input");
		emailInput.setAttribute("type", "email");
		emailInput.classList.add("form-control");
		emailInput.setAttribute("id", "sign-up-email");
		emailInput.setAttribute("placeholder", "Email address");

		const emailInputLabel = document.createElement("label");
		emailInputLabel.setAttribute("for", "sign-up-email");
		emailInputLabel.classList.add("form-label");
		emailInputLabel.textContent = "Email address";
		emailInputDiv.appendChild(emailInput);
		emailInputDiv.appendChild(emailInputLabel);
		signUpForm.appendChild(emailInputDiv);

		const createAccountButton = document.createElement("button");
		createAccountButton.setAttribute("type", "button");
		createAccountButton.classList.add("btn", "btn-light", "btn-block", "col-8", "opacity-75", "bordered-button");
		createAccountButton.style.setProperty("--main_color", "white");
		createAccountButton.textContent = "Create an account";
		createAccountButton.onclick = signUp;

		const createAccountDiv = document.createElement("div");
		createAccountDiv.classList.add("mb-3", "text-center", "mx-auto");
		createAccountDiv.appendChild(createAccountButton);
		signUpForm.appendChild(createAccountDiv);

		colDiv.appendChild(signUpForm);
		rowDiv.appendChild(colDiv);
		containerDiv.appendChild(rowDiv);
		signUpContainer.appendChild(containerDiv);

		const signInUsername = document.getElementById("sign-in-username");
		const signInPassword = document.getElementById("sign-in-password");
		if (signInUsername && signInPassword) {
			usernameInput.value = signInUsername.value;
			passwordInput.value = signInPassword.value;
		}
	} catch (error) {
		console.error("Error in createSignUp: ", error);
		throw error;
	}
}

export { createSignUp };