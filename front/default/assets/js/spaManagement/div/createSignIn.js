import { signWith42, signIn } from '/static/default/assets/js/action/userManagement.js';
import { forgotPassword } from '/static/default/assets/js/action/userManagement.js';

function createSignIn() {
	try {

		const signInContainer = document.getElementById("sign-in");

		// Create container div
		const containerDiv = document.createElement("div");
		containerDiv.classList.add("container");

		// Create row div with classes
		const rowDiv = document.createElement("div");
		rowDiv.classList.add("row", "align-items-center", "justify-content-center", "vh-100");

		// Create col div with classes
		const colDiv = document.createElement("div");
		colDiv.classList.add("col-md-6", "col-lg-4", "dark-form");

		// Create form element
		const signInForm = document.createElement("form");

		// Title
		const title = document.createElement("h1");
		title.classList.add("title-1", "mb-3", "fw-bold");
		title.textContent = "signIn";
		signInForm.appendChild(title);

		// Continue with 42 button
		const continueWith42Button = document.createElement("button");
		continueWith42Button.setAttribute("type", "button");
		continueWith42Button.classList.add("btn", "btn-success", "btn-block", "col-8", "opacity-50", "login-form-green-button");
		continueWith42Button.onclick = signWith42;
		const img = document.createElement("img");
		img.id = "picture-42";
		img.setAttribute("src", "/static/default/assets/images/icons/42.svg");
		img.alt = "42 Logo";
		continueWith42Button.appendChild(img);
		continueWith42Button.innerHTML += " Continue with 42";
		const continueWith42Div = document.createElement("div");
		continueWith42Div.classList.add("mb-3", "text-center", "mx-auto");
		continueWith42Div.appendChild(continueWith42Button);
		signInForm.appendChild(continueWith42Div);


		// Or divider
		const orDiv = document.createElement("div");
		orDiv.classList.add("mb-3", "text-center", "mx-auto", "col-8", "opacity-75", "d-flex", "align-items-center");
		orDiv.innerHTML = `<div class="form-tab"></div><span style="margin-left: 2em; margin-right: 2em;">or</span><div class="form-tab"></div>`;
		signInForm.appendChild(orDiv);

		// Username input
		const usernameInputDiv = document.createElement("div");
		usernameInputDiv.classList.add("form-floating", "fixed", "mb-3", "col-8", "mx-auto");
		const usernameInput = document.createElement("input");
		usernameInput.setAttribute("type", "text");
		usernameInput.classList.add("form-control");
		usernameInput.setAttribute("id", "sign-in-username");
		usernameInput.setAttribute("placeholder", "Username");
		const usernameInputLabel = document.createElement("label");
		usernameInputLabel.setAttribute("for", "sign-in-username");
		usernameInputLabel.classList.add("form-label");
		usernameInputLabel.textContent = "Username";
		usernameInputDiv.appendChild(usernameInput);
		usernameInputDiv.appendChild(usernameInputLabel);
		signInForm.appendChild(usernameInputDiv);

		// Password input
		const passwordInputDiv = document.createElement("div");
		passwordInputDiv.classList.add("form-floating", "fixed", "mb-3", "col-8", "mx-auto");
		const passwordInput = document.createElement("input");
		passwordInput.setAttribute("type", "password");
		passwordInput.classList.add("form-control");
		passwordInput.setAttribute("id", "sign-in-password");
		passwordInput.setAttribute("placeholder", "Password");
		const passwordInputLabel = document.createElement("label");
		passwordInputLabel.setAttribute("for", "sign-in-password");
		passwordInputLabel.classList.add("form-label");
		passwordInputLabel.textContent = "Password";
		passwordInputDiv.appendChild(passwordInput);
		passwordInputDiv.appendChild(passwordInputLabel);
		signInForm.appendChild(passwordInputDiv);

		// Continue with username button
		const continueWithUsernameButton = document.createElement("button");
		continueWithUsernameButton.setAttribute("type", "button");
		continueWithUsernameButton.classList.add("btn", "btn-light", "btn-block", "col-8", "opacity-75", "bordered-button");
		continueWithUsernameButton.style.setProperty("--main_color", "white");
		continueWithUsernameButton.textContent = "Continue with username";
		continueWithUsernameButton.onclick = signIn;
		const continueWithUsernameDiv = document.createElement("div");
		continueWithUsernameDiv.classList.add("mb-3", "text-center", "mx-auto");
		continueWithUsernameDiv.appendChild(continueWithUsernameButton);
		signInForm.appendChild(continueWithUsernameDiv);

		// Forgot password button
		const forgotPasswordButton = document.createElement("button");
		forgotPasswordButton.setAttribute("type", "button");
		forgotPasswordButton.classList.add("col-8", "text-button");
		forgotPasswordButton.textContent = "Forgot password?";
		forgotPasswordButton.onclick = forgotPassword;
		const forgotPasswordDiv = document.createElement("div");
		forgotPasswordDiv.classList.add("mb-3", "text-center", "mx-auto");
		forgotPasswordDiv.appendChild(forgotPasswordButton);
		signInForm.appendChild(forgotPasswordDiv);

		// Append form to col div
		colDiv.appendChild(signInForm);

		// Append col div to row div
		rowDiv.appendChild(colDiv);

		// Append row div to container div
		containerDiv.appendChild(rowDiv);

		// Append container div to sign-in container
		signInContainer.appendChild(containerDiv);

	} catch (error) {
		console.error("Error in createSignIn: ", error);
		throw error;
	}
}

export { createSignIn };