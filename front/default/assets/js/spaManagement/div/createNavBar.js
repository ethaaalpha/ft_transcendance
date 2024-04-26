import globalVariables from '../../init.js';
import { navBarActionHandler } from '../../action/navBar.js';

async function createNavBar(username) {
	try {
		const navBar = document.getElementById("nav-bar");

		let leftLabel = "Profil";
		let rightLabel = "Settings";
		let leftColor = "#B4B4B4";
		let rightColor = "#B4B4B4";

		if (globalVariables.currentScene === "profil") {
			if (globalVariables.currentUser.getUsername() !== username) {
				leftLabel = "Play";
				rightLabel = "Chat";
			} else {
				leftColor = "#05FF00";
			}
		} else if (globalVariables.currentScene === "settings" || globalVariables.currentScene === "modify-game-theme" || globalVariables.currentScene === "modify-profil-picture" || globalVariables.currentScene === "modify-password" || globalVariables.currentScene === "modify-email") {
			rightColor = "#05FF00";
		}

		let buttonLeft = document.getElementById("nav-bar-button-left");
		let buttonRight = document.getElementById("nav-bar-button-right");

		if (!buttonLeft) {
			buttonLeft = createButton(leftLabel, leftColor, "left", username);
			navBar.appendChild(buttonLeft);
		} else {
			if (buttonLeft.innerHTML !== `<img src="/static/default/assets/images/icons/${leftLabel.toLowerCase()}.svg" class="icon-button"></img> ${leftLabel}` || buttonLeft.style.getPropertyValue("--main_color") !== leftColor) {
				buttonLeft.innerHTML = `<img src="/static/default/assets/images/icons/${leftLabel.toLowerCase()}.svg" class="icon-button"></img> ${leftLabel}`;
				buttonLeft.style.setProperty("--main_color", leftColor);
				buttonLeft.onclick = function() {
					navBarActionHandler(leftLabel, username);
				};
			}
		}

		if (!buttonRight) {
			buttonRight = createButton(rightLabel, rightColor, "right", username);
			navBar.appendChild(buttonRight);
		} else {
			if (buttonRight.innerHTML !== `<img src="/static/default/assets/images/icons/${rightLabel.toLowerCase()}.svg" class="icon-button"></img> ${rightLabel}` || buttonRight.style.getPropertyValue("--main_color") !== rightColor) {
				buttonRight.innerHTML = `<img src="/static/default/assets/images/icons/${rightLabel.toLowerCase()}.svg" class="icon-button"></img> ${rightLabel}`;
				buttonRight.style.setProperty("--main_color", rightColor);
				buttonRight.onclick = function() {
					navBarActionHandler(rightLabel, username);
				};
			}
		}

	} catch (error) {
		console.error("Error in createNavBar: ", error);
		throw error;
	}
}

function createButton(label, color, id, username) {
	const button = document.createElement("button");
	button.type = "button";
	button.id = "nav-bar-button-" + id;
	button.className = "btn col-6 btn-light bordered-button title-4 d-flex align-items-center justify-content-center nav-button-";
	button.style.setProperty("--main_color", color);
	button.innerHTML = `<img src="/static/default/assets/images/icons/${label.toLowerCase()}.svg" class="icon-button"></img> ${label}`;
	
	button.onclick = function() {
		navBarActionHandler(label, username);
	};
	return button;
}

export { createNavBar };
