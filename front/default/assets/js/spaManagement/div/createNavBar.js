import globalVariables from '/static/default/assets/js/init.js';
import { navBarActionHandler } from '/static/default/assets/js/action/navBar.js';

function createNavBar(username) {
	try {
		const navBar = document.getElementById("nav-bar");

		let leftLabel = "Profile";
		let rightLabel = "Settings";
		let leftExtension = '';
		let leftColor = "#B4B4B4";
		let leftBackgroundColor = 'transparent';
		let rightBackgroundColor = 'transparent'
		let rightColor = "#B4B4B4";
		let hoverLeftColor = 'var(--default-green)';
		let hoverRightColor = 'var(--default-green)';
		let rightExtension = '';

		if ((globalVariables.currentScene === "profile" || globalVariables.currentScene === 'conversation-display') && globalVariables.currentUser.isFriend(username) === 'friend') {
			if (globalVariables.currentUser.getUsername() !== username) {
				leftLabel = "Play";
				leftColor = 'var(--default-blue)';
				hoverLeftColor = 'var(--default-blue)';
				leftBackgroundColor = '#00C2FF40';
				rightLabel = "Chat";
			} else {
				leftColor = "#05FF00";
				leftBackgroundColor = '#05FF0040';
				leftExtension += '_green';
			}
		} else if (globalVariables.currentScene === "settings" || globalVariables.currentScene === "settings-game-theme" || globalVariables.currentScene === "settings-profile-picture" || globalVariables.currentScene === "settings-password" || globalVariables.currentScene === "settings-email") {
			rightColor = "#05FF00";
			rightExtension += '_green';
			rightBackgroundColor = '#05FF0040';
		}

		let buttonLeft = document.getElementById("nav-bar-button-left");
		let buttonRight = document.getElementById("nav-bar-button-right");

		if (!buttonLeft) {
			buttonLeft = createButton(leftLabel, leftColor, leftBackgroundColor, hoverLeftColor, "left", username);
			navBar.appendChild(buttonLeft);
		} else {
			if (buttonLeft.innerHTML !== `<img src="/static/default/assets/images/icons/${leftLabel.toLowerCase() + leftExtension}.svg" class="icon-button"></img> ${leftLabel}` || buttonLeft.style.getPropertyValue("--main_color") !== leftColor) {
				buttonLeft.innerHTML = `<img src="/static/default/assets/images/icons/${leftLabel.toLowerCase() + leftExtension}.svg" class="icon-button"></img> ${leftLabel}`;
				buttonLeft.style.setProperty("--main_color", leftColor);
				buttonLeft.style.setProperty("--default_hover", hoverLeftColor);
				buttonLeft.style.setProperty('--background-nav', leftBackgroundColor);
				buttonLeft.onclick = function() {
					navBarActionHandler(leftLabel, username);
				};
			}
		}

		if (!buttonRight) {
			buttonRight = createButton(rightLabel, rightColor, rightBackgroundColor, hoverRightColor, "right", username);
			navBar.appendChild(buttonRight);
		} else {
			if (buttonRight.innerHTML !== `<img src="/static/default/assets/images/icons/${rightLabel.toLowerCase() + rightExtension}.svg" class="icon-button"></img> ${rightLabel}` || buttonRight.style.getPropertyValue("--main_color") !== rightColor) {
				buttonRight.innerHTML = `<img src="/static/default/assets/images/icons/${rightLabel.toLowerCase() + rightExtension}.svg" class="icon-button"></img> ${rightLabel}`;
				buttonRight.style.setProperty("--main_color", rightColor);
				buttonRight.style.setProperty('--background-nav', rightBackgroundColor);
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

function createButton(label, color, backgroundColor, hoverColor, id, username, clickable = true) {
	const button = document.createElement("button");
	button.type = "button";
	button.id = "nav-bar-button-" + id;
	button.className = "btn col-6 btn-light nav-bar-btn bordered-button title-4 d-flex align-items-center justify-content-center nav-bar-btn";
	button.style.setProperty("--main_color", color);
	button.style.setProperty("--default_hover", hoverColor);
	button.style.setProperty('--background-nav', backgroundColor);
	button.innerHTML = `<img src="/static/default/assets/images/icons/${label.toLowerCase()}.svg" class="icon-button"></img> ${label}`;
	
	if (clickable) {
		button.onclick = function() {
			navBarActionHandler(label, username);
		};
	}
	return button;
}

export { createNavBar };