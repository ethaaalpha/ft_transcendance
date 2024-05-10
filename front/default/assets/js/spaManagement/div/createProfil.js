import globalVariables from '/static/default/assets/js/init.js';
import { fetchUserData, fetchProfilPicture, fetchUserStats, fetchMatchHistory } from '/static/default/assets/js/fetch/http.js';
import { manageFriend } from '/static/default/assets/js/action/userManagement.js';
import Alerts from '/static/default/assets/js/class/Alerts.js';
import { pushUrl } from '/static/default/assets/js/spaManagement/router.js';


async function createProfil(username) {

	try {
		await fetchUserData();

		const profilDisplay = document.getElementById("profil");

		// Back button
		const backButton = document.createElement("button");
		backButton.classList.add("arrow-back", "d-flex", "justify-content-start", "align-items-center");
		backButton.onclick = function() {
			pushUrl('/');
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
		connectionStatus.classList.add('perso-info-container-left-status');
		const friendStatus = globalVariables.currentUser.getFriendStatus(username);
		
		switch (friendStatus) {
			case 'online':
				connectionStatus.style.setProperty('--item-color', 'var(--alert-tx-valid)');
				break;
			case 'in-game':
				connectionStatus.style.setProperty('--item-color', 'var(--alert-tx-game)');
				break;
			case 'offline':
				connectionStatus.style.setProperty('--item-color', 'var(--alert-tx-fail)');
				break
			default:
				connectionStatus.style.setProperty('--item-color', 'transparent');
				break;
		}
		
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

			const button1 = document.createElement("button");
			const imgButton1 = document.createElement('img');

			imgButton1.id = 'friend-relation-state';
			button1.classList.add("action-button");
			button1.id = 'friend-relation-button1';
			button1.appendChild(imgButton1)
			nameActionsDiv.appendChild(button1);

			if (status === "notFriend") {
				imgButton1.src = '/static/default/assets/images/icons/notFriend.svg';
				
				button1.onclick = function() {
					manageFriend(username, "add");
				};
			} else if (status === "pending") {
				imgButton1.src = '/static/default/assets/images/icons/pending.svg';
				
				button1.onclick = function() {
					Alerts.createAlert(Alerts.type.FAILED, 'Friend request pending.')
				};
			} else if (status === "friend") {
				imgButton1.src = '/static/default/assets/images/icons/friend.svg';

				button1.onclick = function() {
					manageFriend(username, "remove");
				};
			}

			// Check if user is blocked
			const isBlocked = await globalVariables.currentUser.isBlocked(username);
			const button2 = document.createElement("button");
			button2.classList.add("action-button");
			
			const imgButton = document.createElement('img');
			imgButton.src = '/static/default/assets/images/icons/block.svg';
			button2.appendChild(imgButton)
			button2.id = 'friend-relation-button2';

			if (isBlocked) {
				button2.classList.add('blocked');
				button2.onclick = function() {
					manageFriend(username, "unblock");
				};
			} else {
				button2.onclick = function() {
					manageFriend(username, "block");
				};
			}
			nameActionsDiv.appendChild(button2);
		}
		
		// Create parent div for statistics
		const persoScoresDiv = document.createElement("div");
		persoScoresDiv.id = "perso-scores-id";
		persoScoresDiv.classList.add("perso-scores-div");
		profilDisplay.appendChild(persoScoresDiv);

		// MATCH HISTORY
		var dataMatch = [];
		const matchHistory = await fetchMatchHistory(username);
		const matchHistoryDiv = document.getElementById("match-history");

		const matchListDiv = document.createElement('match-history-list');
		matchListDiv.classList.add('match-history-list', 'block-scroll')

		matchHistory.matchs.forEach(match => {
			dataMatch.push(match.distance);
			const winner = match.winner == username ? true : false;

			// Create container div for each match
			const matchDiv = document.createElement("div");
			matchDiv.classList.add("match-div");

			const leftBigColumnDiv = document.createElement('div');
			leftBigColumnDiv.classList.add('left-big-column')

			const leftRowDiv = document.createElement('div');
			leftRowDiv.classList.add('d-flex', 'left-row', 'justify-content-center', 'align-items-center');

			const leftRowIcon = document.createElement('div');
			leftRowDiv.classList.add('left-img-div');

			const leftRowIconImg = document.createElement('img')
			leftRowIconImg.src = winner ? '/static/default/assets/images/icons/win.svg' : '/static/default/assets/images/icons/lose.svg';
			
			leftRowIcon.appendChild(leftRowIconImg)
			leftRowDiv.appendChild(leftRowIcon)
			// Left column: duration and id
			const leftColumnDiv = document.createElement("div");
			leftColumnDiv.classList.add("left-column");
			
			const durationDiv = document.createElement("div");
			durationDiv.textContent = formatDuration(match.duration);
			durationDiv.id = 'time'
			leftColumnDiv.appendChild(durationDiv);
			
			const idDiv = document.createElement("div");
			idDiv.textContent = "#" + match.id;
			idDiv.id = 'uuid';
			leftColumnDiv.appendChild(idDiv);
			
			// Right column: host vs invited and score
			const rightColumnDiv = document.createElement("div");
			rightColumnDiv.classList.add("right-column");

			const teamsDiv = document.createElement("div");
			teamsDiv.textContent = match.host + " vs " + match.invited;
			teamsDiv.id = 'team';
			rightColumnDiv.appendChild(teamsDiv);

			const scoreDiv = document.createElement("div");
			scoreDiv.textContent = match.score.join(" - ");
			if (match.score.includes(10)) {
				scoreDiv.textContent = 'dnf'
				leftRowIconImg.src = winner ? '/static/default/assets/images/icons/dnf_win.svg' : '/static/default/assets/images/icons/dnf_lose.svg';
			} 
			scoreDiv.id = 'score'
			rightColumnDiv.appendChild(scoreDiv);

			// Append left and right columns to matchDiv
			leftBigColumnDiv.appendChild(leftRowDiv)
			leftBigColumnDiv.appendChild(leftColumnDiv)
			matchDiv.appendChild(leftBigColumnDiv);
			matchDiv.appendChild(rightColumnDiv);

			matchListDiv.appendChild(matchDiv)
		});
		// Append matchDiv to matchHistoryDiv
		matchHistoryDiv.appendChild(matchListDiv);

		// PERSONNAL SCORES
		const userStats = await fetchUserStats(username);

		// Display user statistics
		persoScoresDiv.appendChild(createStatElement(["matches won", 'won.svg'], userStats.numberOfVictory, "The more the better.", "square", false));
		persoScoresDiv.appendChild(createStatElement(["matches lost", 'loses.svg'], userStats.numberOfLoses, "The less the better.", "square", false));
		persoScoresDiv.appendChild(createStatElement(["soccer field ball distance", 'distance.svg', dataMatch.reverse().slice(0, 10)], userStats.traveledDistance + 'km', "The distance the ball has traveled in all your games.", "rectangle", true));
		persoScoresDiv.appendChild(createStatElement(["average duration", 'duration.svg'], userStats.averageDuration, "The average time in game.", "square", false));
		persoScoresDiv.appendChild(createStatElement(["hits per match", 'hint.svg'], userStats.averagePong, "The average ball hint.", "square", false));


	} catch (error) {
		console.error("Error in createProfil: ", error);
		throw error;
	}
}

function createStatElement(config, data, description, shape, canva) {
	const title = config[0];
	const icon = config[1];

	// Create the statistics element
	const statElement = document.createElement("div");
	statElement.classList.add("perso-scores-stat-" + shape + "-div");

	// Create top bar element
	const topElement = document.createElement('div');
	topElement.classList.add("d-flex", 'align-items-center', 'justify-content-start', 'flex-row', "perso-scores-stat-title")

	// Create the icon element
	const iconElement = document.createElement('img');
	iconElement.src = '/static/default/assets/images/icons/bento/'+ icon;

	// Create the title element
	const titleElement = document.createElement("div");
	titleElement.textContent = title;

	topElement.appendChild(iconElement);
	topElement.appendChild(titleElement)
	statElement.appendChild(topElement);

	// Create the data element
	if (canva == false){
		const dataElement = document.createElement("div");
		dataElement.textContent = data;
		dataElement.classList.add("perso-scores-stat-data");
		statElement.appendChild(dataElement);
	}
	else{
		const dataElement = document.createElement("canvas");
		const data = config[2];
		statElement.appendChild(dataElement);
		createGraph(statElement, dataElement, data);
	}

	// Create the description element
	const descriptionElement = document.createElement("div");
	descriptionElement.textContent = description;
	descriptionElement.classList.add("perso-scores-stat-description");
	statElement.appendChild(descriptionElement);

	return statElement;
}

function createGraph (statElement, dataElement, data) {
	setTimeout(function() {
		if (statElement.clientWidth == 0)
			return createGraph(statElement, dataElement, data)
		dataElement.width = statElement.clientWidth * 0.95;
		dataElement.height = statElement.clientHeight * 0.4;
		const ctx = dataElement.getContext('2d');
		const barWidth = dataElement.width / 20;
		const barMargin =  dataElement.width / 25;
		const chartHeight = statElement.clientHeight * 0.4;
		for (let i = 0; i < data.length; i++) {
			const barHeight = (data[i] / Math.max(...data)) * chartHeight;
			const x = i * (barWidth + barMargin);
			const y = chartHeight - barHeight;
			var radius = barWidth * 0.45
			if (barHeight < 5)
				radius = barWidth * 0.10
			drawBars(x, y, barWidth, barHeight, 'rgba(255, 255, 255, 1)', radius, ctx);
		}
	}, 50);
}

function formatDuration(duration) {
	const minutesPart = Math.floor(duration / 60);
	const secondsPart = duration % 60;
	return `${minutesPart}"${secondsPart < 10 ? '0' : ''}${secondsPart}`;
}

function drawBars(x, y, width, height, color, radius, ctx) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2, false);
	ctx.lineTo(x + width, y + height - radius);
	ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5, false);
	ctx.lineTo(x + radius, y + height);
	ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI, false);
	ctx.lineTo(x, y + radius);
	ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}

export { createProfil };