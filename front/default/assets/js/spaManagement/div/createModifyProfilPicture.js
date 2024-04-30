import { changeScene } from '../scene.js';
import { modifyProfilPicture } from '../../action/userManagement.js';

async function createModifyProfilPicture() {

	try {
		const modifyProfilPictureDiv = document.getElementById("modify-profil-picture");

		// Back button
		const backButton = document.createElement("button");
		backButton.className = "arrow-back d-flex justify-content-start align-items-center";
		backButton.onclick = function() {
			changeScene('settings');
		};
		const backButtonImage = document.createElement("img");
		backButtonImage.src = "/static/default/assets/images/icons/arrow.svg";
		backButton.appendChild(backButtonImage);
		modifyProfilPictureDiv.appendChild(backButton);

		// Title and description
		const title = document.createElement("span");
		title.className = "title-2 greened";
		title.textContent = "Modify profil picture";
		modifyProfilPictureDiv.appendChild(title);

		const description = document.createElement("span");
		description.className = "body-text settings-text";
		description.textContent = "So we can see your lovely smile.";
		modifyProfilPictureDiv.appendChild(description);

		// Block to wrap item
		const blockDiv = document.createElement('div')
		blockDiv.classList.add('block-scroll')
		blockDiv.style.setProperty('--top', '5%')

		// Custom file input
		const customFileInput = document.createElement("label");
		customFileInput.className = "custom-file-input";
		customFileInput.textContent = "Choose a file"
			
		const fileImage = document.createElement("img");
		fileImage.src = "/static/default/assets/images/icons/upload.svg";
			
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.id = "settings-profil-picture";
		fileInput.accept = "image/*";
			
		customFileInput.appendChild(fileImage);
		customFileInput.appendChild(fileInput);

		// Button
		const button = document.createElement("button");
		button.className = "btn btn-light bordered-button-expanded";
		button.style.setProperty("--main_color", "#DADADA");
		button.onclick = modifyProfilPicture;
		const buttonSpan = document.createElement("span");
		buttonSpan.className = "btn-title";
		buttonSpan.textContent = "Change my profil picture";
		button.appendChild(buttonSpan);

		blockDiv.appendChild(customFileInput)
		blockDiv.appendChild(button)
		modifyProfilPictureDiv.appendChild(blockDiv);	

	} catch (error) {
		console.error("Error in createModifyProfilPicture: ", error);
		throw error;
	}
}

export { createModifyProfilPicture };
