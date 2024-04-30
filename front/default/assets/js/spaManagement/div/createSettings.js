import { changeScene } from '../scene.js';
import { signOut } from '../../action/userManagement.js';

async function createSettings() {

	try {
		const settingsDiv = document.getElementById("settings");

		// Back button
		const backButton = document.createElement("button");
		backButton.className = "arrow-back d-flex justify-content-start align-items-center";
		backButton.onclick = function() {
			history.pushState({}, '', '/');
		};
		const backButtonImage = document.createElement("img");
		backButtonImage.src = "/static/default/assets/images/icons/arrow.svg";
		backButton.appendChild(backButtonImage);
		settingsDiv.appendChild(backButton);

		// Title and description
		const title = document.createElement("span");
		title.className = "title-2 greened";
		title.textContent = "Settings";
		settingsDiv.appendChild(title);

		const description = document.createElement("span");
		description.className = "body-text settings-text";
		description.textContent = "Change everything we allow you to.";
		settingsDiv.appendChild(description);

		// Settings choice block
		const blockDiv = document.createElement('div')
		blockDiv.classList.add('block-scroll')
		blockDiv.style.setProperty('--top', '3%')

		// Settings buttons
		const settingsButtons = [
			{ label: "Modify game theme", icon: "gamepad.svg", scene: "game-theme" },
			{ label: "Modify profile picture", icon: "user_settings.svg", scene: "profil-picture" },
			{ label: "Modify password", icon: "lock.svg", scene: "password" },
			{ label: "Modify email", icon: "mail.svg", scene: "email" },
			{ label: "Sign out", icon: "logout.svg", action: signOut }
		];

		settingsButtons.forEach(button => {
			const buttonElement = document.createElement("button");
			buttonElement.className = "modify-btn btn btn-block btn-light d-flex align-items-center justify-content-start bordered-button-expanded";
			buttonElement.style.setProperty("--main_color", "#DADADA");
			buttonElement.onclick = button.scene ? function() { history.pushState({}, '', '/settings?item=' + button.scene);	} : button.action;
			const iconImage = document.createElement("img");
			iconImage.src = `/static/default/assets/images/icons/${button.icon}`;
			iconImage.className = "icon-button";
			if (button.label === "Sign out") {
				iconImage.style.paddingLeft = "0.05em";
				iconImage.style.paddingRight = "0.4em";
				buttonElement.className += " bordered-button-logout";
			} else {
				iconImage.style.paddingRight = "0.5em";
			}
			buttonElement.appendChild(iconImage);
			const labelSpan = document.createElement("span");
			labelSpan.textContent = button.label;
			buttonElement.appendChild(labelSpan);
			blockDiv.appendChild(buttonElement);
		});

		settingsDiv.appendChild(blockDiv);
		
	} catch (error) {
		console.error("Error in createSettings: ", error);
		throw error;
	}
}

export { createSettings };
