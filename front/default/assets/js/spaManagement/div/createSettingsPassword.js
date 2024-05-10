import { pushUrl } from '/static/default/assets/js/spaManagement/router.js';
import { modifyPassword } from '../../action/userManagement.js';

function createSettingsPassword() {

	try {
		const settingsPasswordDiv = document.getElementById("settings-password");

		// Back button
		const backButton = document.createElement("button");
		backButton.className = "arrow-back d-flex justify-content-start align-items-center";
		backButton.onclick = function() {
			pushUrl('/settings');
		};
		const backButtonImage = document.createElement("img");
		backButtonImage.src = "/static/default/assets/images/icons/arrow.svg";
		backButton.appendChild(backButtonImage);
		settingsPasswordDiv.appendChild(backButton);

		// Title and description
		const title = document.createElement("span");
		title.className = "title-2 greened";
		title.textContent = "Modify password";
		settingsPasswordDiv.appendChild(title);

		const description = document.createElement("span");
		description.className = "body-text settings-text";
		description.textContent = "Minimum 5 and a maximum of 32 characters.";
		settingsPasswordDiv.appendChild(description);

		// Block to wrap item
		const blockDiv = document.createElement('div')
		blockDiv.classList.add('block-scroll')
		blockDiv.style.setProperty('--top', '5%')

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
			blockDiv.appendChild(formGroup);
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

		blockDiv.appendChild(button);	
		settingsPasswordDiv.appendChild(blockDiv);	

	} catch (error) {
		console.error("Error in createSettingsPassword: ", error);
		throw error;
	}
}

export { createSettingsPassword };
