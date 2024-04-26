import { changeScene } from '../scene.js';
import { modifyPassword } from '../../action/userManagement.js';

async function createModifyPassword() {

	try {
		const modifyPasswordDiv = document.getElementById("modify-password");

		// Back button
		const backButton = document.createElement("button");
		backButton.className = "arrow-back d-flex justify-content-start align-items-center";
		backButton.onclick = function() {
			changeScene('settings');
		};
		const backButtonImage = document.createElement("img");
		backButtonImage.src = "/static/default/assets/images/icons/arrow.svg";
		backButton.appendChild(backButtonImage);
		modifyPasswordDiv.appendChild(backButton);

		// Title and description
		const title = document.createElement("span");
		title.className = "title-2 greened";
		title.textContent = "Modify password";
		modifyPasswordDiv.appendChild(title);

		const description = document.createElement("span");
		description.className = "body-text settings-text";
		description.textContent = "Minimum 5 and a maximum of 32 characters.";
		modifyPasswordDiv.appendChild(description);

		// Password inputs
		const passwordInputs = ["Actual password", "New password", "Confirm password"];
		passwordInputs.forEach(inputLabel => {
			const formGroup = document.createElement("div");
			formGroup.className = "form-floating fixed item-spacer";
			const inputField = document.createElement("input");
			inputField.type = "password";
			inputField.className = "form-control dark-form-input";
			inputField.id = `settings-${inputLabel.toLowerCase().replace(/\s/g, '-')}`;
			inputField.placeholder = inputLabel;
			const label = document.createElement("label");
			label.htmlFor = `settings-${inputLabel.toLowerCase().replace(/\s/g, '-')}`;
			label.textContent = inputLabel;
			formGroup.appendChild(inputField);
			formGroup.appendChild(label);
			modifyPasswordDiv.appendChild(formGroup);
		});

		// Button
		const button = document.createElement("button");
		button.className = "btn btn-light bordered-button-expanded";
		button.style.setProperty("--main_color", "#DADADA");
		button.onclick = modifyPassword;
		const buttonSpan = document.createElement("span");
		buttonSpan.className = "btn-title";
		buttonSpan.textContent = "Change my password";
		button.appendChild(buttonSpan);
		modifyPasswordDiv.appendChild(button);	

	} catch (error) {
		console.error("Error in createModifyPassword: ", error);
		throw error;
	}
}

export { createModifyPassword };
