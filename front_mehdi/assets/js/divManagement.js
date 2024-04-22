import globalVariables from './main.js';
import { fetchConversations, sendMessage } from './chatManagement.js';
import { fetchCurrentUsername, fetchProfilPicture, fetchUserStats } from './httpGetters.js';
import { fetchUserData } from './main.js';
import { changeScene } from './sceneManagement.js';
import { navBarButton } from './navBarButton.js';

function removeChildDiv(...parentIds) {
    parentIds.forEach(parentId => {
        const parent = document.getElementById(parentId);
        if (!parent) {
            console.error(`L'élément avec l'id "${parentId}" n'existe pas.`);
            return;
        }

        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    });
}

function createChildDiv(divId, user) {
    switch (divId) {
        case "conversation-list":
            handleConversationList();
            break;
        case "conversation-display":
            handleConversationDisplay(user);
            break;
		// case "searchProfil":
		// 	handleSearchProfil();
		// 	break;
        case "profil":
			handleProfilDisplay(user);
            break;
		case "settings":
			handleSettingsDisplay(user);
			break;
        default:
            console.log("Invalid divId: ", divId);
    }
    // console.log("Current divId is:", globalVariables.currentScene);
}

// handler
async function handleConversationList() {
	
	const conversationList = document.getElementById("conversation-list");

    // create parent div
	const searchbarDiv = document.createElement("div");
    searchbarDiv.id = "conversation-list-searchbar-container-id";
    searchbarDiv.classList.add("conversation-list-searchbar-container");

    const conversationDiv = document.createElement("div");
    conversationDiv.id = "conversation-list-contact-container-id";
    conversationDiv.classList.add("conversation-list-contact-container");

	conversationList.appendChild(searchbarDiv);
    conversationList.appendChild(conversationDiv);

	// imput search
	const messageInput = document.createElement("input");
	messageInput.setAttribute("type", "text");
	messageInput.setAttribute("placeholder", "Search a contact...");
	messageInput.classList.add("conversation-list-searchbar-input");
	messageInput.setAttribute("id", "conversation-list-searchbar-input-id");
	searchbarDiv.appendChild(messageInput);
	
    if (!globalVariables.userConversations) {// to delete and put in main
        try {
            await fetchConversations();
        } catch (error) {
            console.error("Erreur lors de la récupération des conversations:", error);
            return;
        }
    }

	for (let user in globalVariables.userConversations.conversations) {
		if (globalVariables.userConversations.conversations.hasOwnProperty(user)) {
			const conversationButton = document.createElement("button");
			conversationButton.classList.add("conversation-list-contact-button");


			// Create an img element for user profile picture
			const img = document.createElement("img");

			try {
				const imgUrl = await fetchProfilPicture(user);
				img.src = imgUrl;
			  } catch (error) {
				console.error("Error in getting profil picture of:", error);
			  }
			img.alt = "Profile Picture";
			conversationButton.appendChild(img);
	
			// Create elements for user and last message
			const userInfo = document.createElement("div");
			userInfo.classList.add("conversation-list-user");
			userInfo.textContent = user;
	
			// Get the last message
			// const lastMessage = document.createElement("div");
			// lastMessage.classList.add("conversation-list-last-message");
			// lastMessage.textContent = getLastMessage(user);
	
			// Append user info and last message to the button
			conversationButton.appendChild(userInfo);
			// conversationButton.appendChild(lastMessage);
	
			conversationButton.onclick = function() {
				changeScene("conversation-display", user);
			}
			// addEventListener("click", function() {
			// 	changeScene("conversation-display", user);
			// });

            // button2.onclick = function() {
            //     manageFriend(username, "unblock");
            // };

			conversationDiv.appendChild(conversationButton);
		}


	// for (let user in globalVariables.userConversations.conversations) {
	// 	if (globalVariables.userConversations.conversations.hasOwnProperty(user)) {
	// 		const conversationButton = document.createElement("button");
	// 		conversationButton.textContent = user;
	// 		conversationButton.classList.add("conversation-list-contact-button");

	// 		conversationButton.addEventListener("click", function() {
	// 			changeScene("conversation-display", user);
	// 		});

	// 		conversationDiv.appendChild(conversationButton);
	// 	}
	}

	handleNavButtons(false, username);

}

function handleConversationDisplay(user) {

    const conversation = globalVariables.userConversations.getConversation(user);
    const conversationDisplay = document.getElementById("conversation-display");
    conversationDisplay.innerHTML = "";

	// back button
    const backButton = document.createElement("button");
    backButton.classList.add("arrow-back", "d-flex", "justify-content-start", "align-items-center");
    backButton.onclick = function() {
        changeScene('conversation-list');
    };

	const imgButton = document.createElement('img');
	imgButton.src = 'assets/images/arrow.svg';
	backButton.appendChild(imgButton)
	
    // create parent div
	const titleDiv = document.createElement("div");
    titleDiv.id = "conversation-display-title-id";
	titleDiv.classList.add("conversation-display-top");
    titleDiv.appendChild(backButton);
	
    const messagesDiv = document.createElement("div");
    messagesDiv.id = "conversation-display-messages-id";
    messagesDiv.classList.add("conversation-display-messages");

    const inputDiv = document.createElement("div");
    inputDiv.id = "conversation-display-input-id";
    inputDiv.classList.add("conversation-display-input");

	const titleRight = document.createElement('div');
	titleRight.classList.add("conversation-display-top-person");
	
	// Title
    const titleElement = document.createElement("span");
    titleElement.textContent = user;
    titleElement.classList.add("title-3");
	titleElement.setAttribute("id", "send-message-contact-id");

	const profilePicture = document.createElement('img');
	profilePicture.src = '/media/pokemon.png'; // changer ici mettre la bonne photo de profil !!
	
	titleRight.appendChild(profilePicture)
	titleRight.appendChild(titleElement)

    titleDiv.appendChild(titleRight);

	// Adding to global div
	conversationDisplay.appendChild(titleDiv);
    conversationDisplay.appendChild(messagesDiv);
    conversationDisplay.appendChild(inputDiv);

    // Messages
    for (let i = conversation.length - 1; i >= 0; i--) {
		const message = conversation[i];
        const messageElement = document.createElement("div");
		const messageText = document.createElement('span');
		messageText.textContent = message.content;
        messageElement.appendChild(messageText)
        
        if (message.sender === globalVariables.userConversations.myUsername) {
			messageElement.classList.add("message-sent", "message");
        } else {
			messageElement.classList.add("message-received", "message");
        }

        messagesDiv.appendChild(messageElement);
    }

	setTimeout(function() {
		messagesDiv.scrollTop = messagesDiv.scrollHeight;
	}, 1);

	// imput message
	const messageInput = document.createElement("input");
	messageInput.setAttribute("type", "text");
	messageInput.setAttribute("placeholder", "Enter your message...");
	messageInput.setAttribute("id", "send-message-input-id");
	inputDiv.appendChild(messageInput);

	const imageInput = document.createElement('img');
	imageInput.src = 'assets/images/send.svg';
	
	// send button
	const sendButton = document.createElement("button");
	sendButton.classList.add("send-button");
	sendButton.setAttribute("id", "send-message-button-id");
	sendButton.onclick = sendMessage;
	sendButton.appendChild(imageInput)
	inputDiv.appendChild(sendButton);

}

async function handleProfilDisplay(username) {

	// if (!globalVariables.currentUser) {
    //     await fetchUserData();
    // }

    const profilDisplay = document.getElementById("profil");

    // back button
    const backButton = document.createElement("button");
    backButton.classList.add("arrow-back", "d-flex", "justify-content-start", "align-items-center");
    backButton.onclick = function() {
        changeScene('conversation-list');
    };

	const imgButton = document.createElement('img');
	imgButton.src = 'assets/images/arrow.svg';
	backButton.appendChild(imgButton)

    profilDisplay.appendChild(backButton);

    // create parent div
    const persoInfoDiv = document.createElement("div");
    persoInfoDiv.id = "perso-info-id";
    persoInfoDiv.classList.add("perso-info-container");
    profilDisplay.appendChild(persoInfoDiv);

    // Fetch and add profile picture
    const pictureUrl = await fetchProfilPicture(username);
    const profileImage = document.createElement("img");
    profileImage.src = pictureUrl;
    profileImage.alt = "Profile Picture";
    profileImage.classList.add("profile-image");
    persoInfoDiv.appendChild(profileImage);

    // create nameActionsDiv
    const nameActionsDiv = document.createElement("div");
    nameActionsDiv.id = "name-actions-id";
    nameActionsDiv.classList.add("name-actions-div");
    persoInfoDiv.appendChild(nameActionsDiv);

    // Fetch and add current username
    const currentUsername = await globalVariables.currentUser.getUsername();
    const usernameElement = document.createElement("div");
    usernameElement.textContent = username;
    usernameElement.classList.add("username", "title-2");
    nameActionsDiv.appendChild(usernameElement);

	let myProfil;

	if (username !== currentUsername) {
		myProfil = false;
	} else {
		myProfil = true;
	}

    // Check if username is different from current user
	if (!myProfil) {
        // Check if user is not a friend
        const status = await globalVariables.currentUser.isFriend(username);
		console.log("username here: " + username);
		console.log(status);
        if (status === "notFriend") {
            const button1 = document.createElement("button");
            button1.classList.add("action-button");
            button1.innerHTML = `
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M15 19C15 16.7909 12.3137 15 9 15C5.68629 15 3 16.7909 3 19M19 16V13M19 13V10M19 13H16M19 13H22M9 12C6.79086 12 5 10.2091 5 8C5 5.79086 6.79086 4 9 4C11.2091 4 13 5.79086 13 8C13 10.2091 11.2091 12 9 12Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>			
            `;
            button1.onclick = function() {
                manageFriend(username, "add");
            };
            nameActionsDiv.appendChild(button1);
        } else if (status === "pending") {
            const button1 = document.createElement("button");
            button1.classList.add("action-button");
            button1.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19C15 16.7909 12.3137 15 9 15C5.68629 15 3 16.7909 3 19M21 10L17 14L15 12M9 12C6.79086 12 5 10.2091 5 8C5 5.79086 6.79086 4 9 4C11.2091 4 13 5.79086 13 8C13 10.2091 11.2091 12 9 12Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            button1.onclick = function() {
                // Do nothing for pending status
            };
            nameActionsDiv.appendChild(button1);
        } else if (status === "friend") {
            const button1 = document.createElement("button");
            button1.classList.add("action-button");
            button1.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19C15 16.7909 12.3137 15 9 15C5.68629 15 3 16.7909 3 19M15 13H21M9 12C6.79086 12 5 10.2091 5 8C5 5.79086 6.79086 4 9 4C11.2091 4 13 5.79086 13 8C13 10.2091 11.2091 12 9 12Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            button1.onclick = function() {
                manageFriend(username, "remove");
            };
            nameActionsDiv.appendChild(button1);
        }

        // Check if user is blocked
        const isBlocked = await globalVariables.currentUser.isBlocked(username);
        const button2 = document.createElement("button");
        button2.classList.add("action-button");
        button2.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 19C18 16.7909 15.3137 15 12 15C8.68629 15 6 16.7909 6 19M12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        if (isBlocked) {
            button2.onclick = function() {
                manageFriend(username, "unblock");
            };
            button2.style.backgroundColor = "green";
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
	
	console.log(userStats);
	console.log(userStats.matchesWon);

    // Display user statistics
    persoScoresDiv.appendChild(createStatElement("matches mon", userStats.numberOfVictory, "The more the better.", "square"));
    persoScoresDiv.appendChild(createStatElement("matches lost", userStats.numberOfLoses, "The less the better.", "square"));
    persoScoresDiv.appendChild(createStatElement("soccer field ball distance", userStats.traveledDistance, "The distance the ball traveled on the soccer field while you played.", "rectangle"));
    persoScoresDiv.appendChild(createStatElement("average duration", userStats.averagePong, "The shorter you are in game the better.", "square"));
    persoScoresDiv.appendChild(createStatElement("hits per match", userStats.averagePong, "The less you touch the ball the better.", "square"));

	if (!myProfil)
		handleNavButtons(true, username);
	else
		handleNavButtons(false, username);
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
	iconElement.src = 'assets/images/info.svg';

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


function handleSettingsDisplay() {
	handleNavButtons();
}








// legacy from settings game theme, to handle
function genererDivsAvecImages(nbDivs) {
	const conteneur = document.getElementById("modify-game-theme-menu");
  
	for (let i = 0; i < nbDivs; i++) {
	  // Création de l'élément div
	  const div = document.createElement("div");
  
	  // Attribution de classes CSS
	//   div.classList.add("modify-game-theme-image-container");
	div.classList.add("modify-game-theme-image-container", "selectable");

	  // Création de l'élément image
	  const image = document.createElement("img");
  
	  // Attribution de la source de l'image en utilisant l'index de la boucle pour incrémenter le chiffre dans le nom de l'image
	  image.src = `assets/images/theme/${i}.jpg`;
  
	  // Ajout des classes CSS pour les bords arrondis
	  image.classList.add("modify-game-theme-image");
  
	  // Ajout de l'image à la div
	  div.appendChild(image);
  
	  div.onclick = function() {
		selectDiv(i + 1);
	  };

	  // Ajout de la div au conteneur
	  conteneur.appendChild(div);
	}
  }
  
  // Appel de la fonction pour générer 3 divs avec des images
genererDivsAvecImages(6);

let selectedDiv = 1; // le theme du jeu selectionné, changer par la valeur que nico veut modifier

  window.onload = function() {
	selectDiv(selectedDiv);
};

function selectDiv(id) {
  // Réinitialiser les bordures de toutes les div
  const divs = document.querySelectorAll('.selectable');
  divs.forEach(div => {
    div.classList.remove('selected');
  });

  // Mettre en surbrillance la div sélectionnée
  const selected = document.querySelector(`.selectable:nth-child(${id})`);
  selected.classList.add('selected');
  selectedDiv = id;
}

function getSelected() {
  if (selectedDiv !== null) {
    console.log(`La div sélectionnée est la ${selectedDiv}`);
  } else {
    console.log('Aucune div sélectionnée');
  }
}



// Utils

function handleNavButtons(friendProfilScene, username) {
    removeChildDiv("nav-bar");
    const navBar = document.getElementById("nav-bar");

    let leftLabel, rightLabel, leftColor, rightColor ;

    if (friendProfilScene) {
        leftLabel = "Play";
        rightLabel = "Chat";
        leftColor = "#B4B4B4";
        rightColor = "#B4B4B4";
    } else  {
        leftLabel = "Profil";
        rightLabel = "Settings";
        leftColor = globalVariables.currentScene === "profil" ? "#05FF00" : "#B4B4B4";
        rightColor = globalVariables.currentScene === "settings" ? "#05FF00" : "#B4B4B4";
    }

    const buttonLeft = createButton(leftLabel, leftColor, "left", username);
    const buttonRight = createButton(rightLabel, rightColor, "right", username);

    navBar.appendChild(buttonLeft);
    navBar.appendChild(buttonRight);
}

function createButton(label, color, id, username) {
    const button = document.createElement("button");
    button.type = "button";
    button.id = "nav-bar-button-" + id;
    button.className = "btn col-6 btn-light bordered-button title-4 d-flex align-items-center justify-content-center nav-button-";
    button.style.setProperty("--main_color", color);
    button.innerHTML = `<img src="assets/images/${label.toLowerCase()}.svg" class="icon-button"></img> ${label}`;
	
	button.onclick = function() {
		navBarButton(label, username);
	};
    return button;
}

// { navBarSettings, navBarProfil, navBarPlay, navBarChat };

export { removeChildDiv, createChildDiv, handleConversationList, handleConversationDisplay, handleProfilDisplay, getSelected };
