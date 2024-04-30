import { changeScene } from '../scene.js';
import { modifyEmail } from '../../action/userManagement.js';

async function createModifyEmail() {

	try {
		const modifyEmailDiv = document.getElementById("modify-email");

		// Back button
		const backButton = document.createElement("button");
		backButton.className = "arrow-back d-flex justify-content-start align-items-center";
		backButton.onclick = function() {
			changeScene('settings');
		};
		const backButtonImage = document.createElement("img");
		backButtonImage.src = "/static/default/assets/images/icons/arrow.svg";
		backButton.appendChild(backButtonImage);
		modifyEmailDiv.appendChild(backButton);

		// Title and description
		const title = document.createElement("span");
		title.className = "title-2 greened";
		title.textContent = "Modify email";
		modifyEmailDiv.appendChild(title);

		const description = document.createElement("span");
		description.className = "body-text settings-text";
		description.textContent = "So we can send you love letters.";
		modifyEmailDiv.appendChild(description);

		// Block to wrap item
		const blockDiv = document.createElement('div')
		blockDiv.classList.add('settings-block-scroll')
		blockDiv.style.setProperty('--top', '5%')

		// Email inputs
		const emailInputs = ["Actual email", "New email", "Confirm email"];
		emailInputs.forEach(inputLabel => {
			const formGroup = document.createElement("div");
			formGroup.className = "form-floating fixed item-spacer";
			const inputField = document.createElement("input");
			inputField.type = "email";
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
		button.onclick = modifyEmail;
		const buttonSpan = document.createElement("span");
		buttonSpan.className = "btn-title";
		buttonSpan.textContent = "Change my email";
		button.appendChild(buttonSpan);

		blockDiv.appendChild(button);
		modifyEmailDiv.appendChild(blockDiv);
		
	} catch (error) {
		console.error("Error in createModifyEmail: ", error);
		throw error;
	}
}

export { createModifyEmail };
