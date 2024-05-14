import { modifyGameTheme } from '/static/default/assets/js/action/userManagement.js';
import globalVariables from '/static/default/assets/js/init.js';
import { pushUrl } from '/static/default/assets/js/spaManagement/router.js';


function createSettingsGameTheme() {

	try {
		const settingsGameThemeDiv = document.getElementById("settings-game-theme");

		// Back button
		const backButton = document.createElement("button");
		backButton.className = "arrow-back d-flex justify-content-start align-items-center";
		backButton.onclick = function() {
			pushUrl('/settings');
		};
		const backButtonImage = document.createElement("img");
		backButtonImage.src = "/static/default/assets/images/icons/arrow.svg";
		backButton.appendChild(backButtonImage);
		settingsGameThemeDiv.appendChild(backButton);

		// Title and description
		const title = document.createElement("span");
		title.className = "title-2 greened";
		title.textContent = "Modify game theme";
		settingsGameThemeDiv.appendChild(title);

		const description = document.createElement("span");
		description.className = "body-text settings-text";
		description.textContent = "Go through parallel universes.";
		settingsGameThemeDiv.appendChild(description);

		// Menu container
		const menuContainer = document.createElement("div");
		menuContainer.id = "settings-game-theme-menu";
		menuContainer.className = "settings-game-theme-container";
		settingsGameThemeDiv.appendChild(menuContainer);
		
		// Image button
		for (let i = 0; i < 6; i++) {
			const div = document.createElement("div");
			
			div.classList.add("settings-game-theme-image-container", "selectable");
			const image = document.createElement("img");
			image.src = `/static/default/assets/images/theme/${i}.jpg`;
			image.classList.add("settings-game-theme-image");
			div.appendChild(image);
			div.onclick = function() {
				selectGameTheme(i + 1);
			};
			menuContainer.appendChild(div);
		}

		// Overlay button
		const overlayButton = document.createElement("button");
		overlayButton.className = "modify-btn btn btn-block btn-light d-flex align-items-center justify-content-start bordered-button-expanded";
		overlayButton.style.setProperty("--main_color", "#B4B4B4");
		overlayButton.onclick = function() {
			let items = document.getElementsByClassName('selectable');

			for (let i = 0; i < items.length; i++) {
				if (items[i].classList.contains('selected')) {
					modifyGameTheme(i + 1);
					break;
				}
			}
		};

		const overlayButtonText = document.createElement("span");
		overlayButtonText.textContent = "Change game theme";
		overlayButton.appendChild(overlayButtonText);
		settingsGameThemeDiv.appendChild(overlayButton);
		var themeList = ['d2', 'land', 'adibou', 'penDraw', 'epic', 'colors', 'd3'];
		var id = themeList.indexOf(globalVariables.currentUser.getGameTheme()) + 1;
		if (id < 1 || id > 6)
			id = 1;
		selectGameTheme(id);

	} catch (error) {
		console.error("Error in createSettingsGameTheme: ", error);
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
}

export { createSettingsGameTheme };
