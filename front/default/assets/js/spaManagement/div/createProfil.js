import globalVariables from '../../init.js';
import { fetchUserData, fetchProfilPicture, fetchUserStats, fetchMatchHistory } from '../../fetch/http.js';
import { manageFriend } from '../../action/userManagement.js';

async function createProfil(username) {

	try {

		await fetchUserData();

		const profilDisplay = document.getElementById("profil");

		// Back button
		const backButton = document.createElement("button");
		backButton.classList.add("arrow-back", "d-flex", "justify-content-start", "align-items-center");
		backButton.onclick = function() {
			history.pushState({}, '', '/');
		};

		const imgButton = document.createElement('img');
		imgButton.src = '/static/default/assets/images/icons/arrow.svg';
		backButton.appendChild(imgButton)

		profilDisplay.appendChild(backButton);

		// Create parent div
		const persoInfoDiv = document.createElement("div");
		persoInfoDiv.id = "perso-info-id";
		persoInfoDiv.classList.add("perso-info-container");
		profilDisplay.appendChild(persoInfoDiv);
	
		// Fetch and add profile picture
		const leftDiv = document.createElement("div");
		leftDiv.classList.add("perso-info-container-left")
	
		// Image
		const pictureUrl = await fetchProfilPicture(username);
		const profileImage = document.createElement("img");
		profileImage.src = pictureUrl;
		profileImage.alt = "Profile Picture";
	
		// Status
		const connectionStatus = document.createElement('div');
		connectionStatus.classList.add('perso-info-container-left-status')
		connectionStatus.style.setProperty('--item-color', 'red');
	
		leftDiv.appendChild(profileImage);
		persoInfoDiv.appendChild(leftDiv);
		persoInfoDiv.appendChild(connectionStatus);
	
		// Right div block
		const rightDiv = document.createElement('div');
		rightDiv.classList.add('perso-info-container-right');
	
		// create nameActionsDiv
		const nameActionsDiv = document.createElement("div");
		nameActionsDiv.id = "name-actions-id";
		nameActionsDiv.classList.add("perso-info-container-actions");
		persoInfoDiv.appendChild(rightDiv);
	
		// Fetch and add current username
		const currentUsername = globalVariables.currentUser.getUsername();
		const usernameElement = document.createElement("span");
		usernameElement.textContent = username;
		usernameElement.classList.add("username", "title-2");
	
		rightDiv.appendChild(usernameElement)
		rightDiv.appendChild(nameActionsDiv);

		let isMyProfil;

		if (username !== currentUsername) {
			isMyProfil = false;
		} else {
			isMyProfil = true;
		}

		// Check if username is different from current user
		if (!isMyProfil) {
			// Check if user is not a friend
			const status = await globalVariables.currentUser.isFriend(username);
			if (status === "notFriend") {
				const button1 = document.createElement("button");
				button1.classList.add("action-button");

				const imgButton = document.createElement('img');
				imgButton.src = '/static/default/assets/images/icons/notFriend.svg';
				button1.appendChild(imgButton)

				button1.onclick = function() {
					manageFriend(username, "add");
				};
				nameActionsDiv.appendChild(button1);
			} else if (status === "pending") {
				const button1 = document.createElement("button");
				button1.classList.add("action-button");

				const imgButton = document.createElement('img');
				imgButton.src = '/static/default/assets/images/icons/pending.svg';
				button1.appendChild(imgButton)
				
				button1.onclick = function() {
					// Do nothing for pending status
				};
				nameActionsDiv.appendChild(button1);
			} else if (status === "friend") {
				const button1 = document.createElement("button");
				button1.classList.add("action-button");
				
				const imgButton = document.createElement('img');
				imgButton.src = '/static/default/assets/images/icons/friend.svg';
				button1.appendChild(imgButton)

				button1.onclick = function() {
					manageFriend(username, "remove");
				};
				nameActionsDiv.appendChild(button1);
			}

			// Check if user is blocked
			const isBlocked = await globalVariables.currentUser.isBlocked(username);
			const button2 = document.createElement("button");
			button2.classList.add("action-button");
			
			const imgButton = document.createElement('img');
			imgButton.src = '/static/default/assets/images/icons/blocked.svg';
			button2.appendChild(imgButton)

			if (isBlocked) {
				button2.onclick = function() {
					manageFriend(username, "unblock");
				};
				button2.style.backgroundColor = "#05FF00";
			} else {
				button2.onclick = function() {
					manageFriend(username, "block");
				};
				button2.style.backgroundColor = "#ccc";
			}
			nameActionsDiv.appendChild(button2);
		}

		// PERSONNAL SCORES
		const userStats = await fetchUserStats(username);
		
		// Create parent div for statistics
		const persoScoresDiv = document.createElement("div");
		persoScoresDiv.id = "perso-scores-id";
		persoScoresDiv.classList.add("perso-scores-div");
		profilDisplay.appendChild(persoScoresDiv);

		// Display user statistics
		persoScoresDiv.appendChild(createStatElement("matches mon", userStats.numberOfVictory, "The more the better.", "square"));
		persoScoresDiv.appendChild(createStatElement("matches lost", userStats.numberOfLoses, "The less the better.", "square"));
		persoScoresDiv.appendChild(createStatElement("soccer field ball distance", userStats.traveledDistance, "The distance the ball traveled on the soccer field while you played.", "rectangle"));
		persoScoresDiv.appendChild(createStatElement("average duration", userStats.averagePong, "The shorter you are in game the better.", "square"));
		persoScoresDiv.appendChild(createStatElement("hits per match", userStats.averagePong, "The less you touch the ball the better.", "square"));

		// MATCH HISTORY
		const matchHistory = await fetchMatchHistory(username);
		console.log(matchHistory);

		const matchHistoryDiv = document.getElementById("match-history");

		matchHistory.matchs.forEach(match => {
			// Create container div for each match
			const matchDiv = document.createElement("div");
			matchDiv.classList.add("match-div");

			// Left column: duration and id
			const leftColumnDiv = document.createElement("div");
			leftColumnDiv.classList.add("left-column");

			const durationDiv = document.createElement("div");
			durationDiv.textContent = formatDuration(match.duration);
			leftColumnDiv.appendChild(durationDiv);

			const idDiv = document.createElement("div");
			idDiv.textContent = "#" + match.id;
			leftColumnDiv.appendChild(idDiv);

			// Right column: host vs invited and score
			const rightColumnDiv = document.createElement("div");
			rightColumnDiv.classList.add("right-column");

			const teamsDiv = document.createElement("div");
			teamsDiv.textContent = match.host + " vs " + match.invited;
			rightColumnDiv.appendChild(teamsDiv);

			const scoreDiv = document.createElement("div");
			scoreDiv.textContent = match.score.join(" - ");
			rightColumnDiv.appendChild(scoreDiv);

			// Append left and right columns to matchDiv
			matchDiv.appendChild(leftColumnDiv);
			matchDiv.appendChild(rightColumnDiv);

			// Append matchDiv to matchHistoryDiv
			matchHistoryDiv.appendChild(matchDiv);
		});

	} catch (error) {
		console.error("Error in createProfil: ", error);
		throw error;
	}
}

function createStatElement(title, data, description, shape) {
	// Create the statistics element
	const statElement = document.createElement("div");
	statElement.classList.add("perso-scores-stat-" + shape + "-div");

	// Create top bar element
	const topElement = document.createElement('div');
	topElement.classList.add("d-flex", 'align-items-center', 'justify-content-start', 'flex-row', "perso-scores-stat-title")

	// Create the icon element
	const iconElement = document.createElement('img');
	iconElement.src = '/static/default/assets/images/icons/info.svg';

	// Create the title element
	const titleElement = document.createElement("div");
	titleElement.textContent = title;

	topElement.appendChild(iconElement);
	topElement.appendChild(titleElement)
	statElement.appendChild(topElement);

	// Create the data element
	const dataElement = document.createElement("div");
	dataElement.textContent = data;
	dataElement.classList.add("perso-scores-stat-data");
	statElement.appendChild(dataElement);

	// Create the description element
	const descriptionElement = document.createElement("div");
	descriptionElement.textContent = description;
	descriptionElement.classList.add("perso-scores-stat-description");
	statElement.appendChild(descriptionElement);

	return statElement;
}

function formatDuration(duration) {
	const minutesPart = Math.floor(duration / 60);
	const secondsPart = duration % 60;
	return `${minutesPart}"${secondsPart < 10 ? '0' : ''}${secondsPart}`;
}

export { createProfil };
