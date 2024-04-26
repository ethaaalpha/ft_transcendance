import globalVariables from '../../init.js';
import { changeScene } from '../scene.js';

async function createModifyGameTheme() {

	try {
		const modifyGameThemeDiv = document.getElementById("modify-game-theme");

		// Back button
		const backButton = document.createElement("button");
		backButton.className = "arrow-back d-flex justify-content-start align-items-center";
		backButton.onclick = function() {
			changeScene('settings');
		};
		const backButtonImage = document.createElement("img");
		backButtonImage.src = "/static/default/assets/images/icons/arrow.svg";
		backButton.appendChild(backButtonImage);
		modifyGameThemeDiv.appendChild(backButton);

		// Title and description
		const title = document.createElement("span");
		title.className = "title-2 greened";
		title.textContent = "Modify game theme";
		modifyGameThemeDiv.appendChild(title);

		const description = document.createElement("span");
		description.className = "body-text settings-text";
		description.textContent = "Go through parallel universes.";
		modifyGameThemeDiv.appendChild(description);

		// Menu container
		const menuContainer = document.createElement("div");
		menuContainer.id = "modify-game-theme-menu";
		menuContainer.className = "modify-game-theme-container";
		modifyGameThemeDiv.appendChild(menuContainer);
		
		// Image button
		for (let i = 0; i < 6; i++) {
			const div = document.createElement("div");
			
			div.classList.add("modify-game-theme-image-container", "selectable");
			const image = document.createElement("img");
			image.src = `/static/default/assets/images/theme/${i}.jpg`;
			image.classList.add("modify-game-theme-image");
			div.appendChild(image);
			div.onclick = function() {
				selectGameTheme(i + 1);
			};
			menuContainer.appendChild(div);
		}

		// Overlay button
		const overlayButton = document.createElement("button");
		overlayButton.className = "modify-btn overlay-btn btn btn-block btn-light d-flex align-items-center justify-content-start bordered-button-expanded";
		overlayButton.style.setProperty("--main_color", "#B4B4B4");
		overlayButton.onclick = changeGameTheme; // to modify with Nico
		const overlayButtonText = document.createElement("span");
		overlayButtonText.textContent = "Change game theme";
		overlayButton.appendChild(overlayButtonText);
		modifyGameThemeDiv.appendChild(overlayButton);

		selectGameTheme(globalVariables.gameTheme);

	} catch (error) {
		console.error("Error in createModifyGameTheme: ", error);
		throw error;
	}
}

function selectGameTheme(id) {
	const divs = document.querySelectorAll('.selectable');
	divs.forEach(div => {
		div.classList.remove('selected');
	});

	const selected = document.querySelector(`.selectable:nth-child(${id})`);
	selected.classList.add('selected');
	globalVariables.gameTheme = id;
}

function changeGameTheme() { // to modify with Nico
	if (globalVariables.gameTheme !== null) {
	console.log(`La div sélectionnée est la ${globalVariables.gameTheme}`);
	} else {
	console.log('Aucune div sélectionnée');
	}
}

export { createModifyGameTheme };
