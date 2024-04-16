
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
        default:
            console.log("Invalid divId: ", divId);
    }

    console.log("Current divId is:", currentScene);
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

	
    if (!gChatConversations) {
        // console.error("gChatConversations n'est pas encore défini.");
        try {
            await fetchConversations();
        } catch (error) {
            console.error("Erreur lors de la récupération des conversations:", error);
            return;
        }
    }

	for (let user in gChatConversations.conversations) {
		if (gChatConversations.conversations.hasOwnProperty(user)) {
			const conversationButton = document.createElement("button");
			conversationButton.classList.add("conversation-list-contact-button");
	

			// Create an img element for user profile picture
			const img = document.createElement("img");

			try {
				const imgUrl = await fetchProfilPicture(user);
				img.src = imgUrl;
				console.log(img.src);
			  } catch (error) {
				console.error("Erreur lors de la récupération de la photo de profil :", error);
			  }



			// img.src = fetchProfilPicture(user);
			// console.log(img.src);
			img.alt = "Profile Picture";
			conversationButton.appendChild(img);
	
			// Create elements for user and last message
			const userInfo = document.createElement("div");
			userInfo.classList.add("conversation-list-user");
			userInfo.textContent = user;
	
			// const lastMessage = document.createElement("div");
			// lastMessage.classList.add("conversation-list-last-message");
			// lastMessage.textContent = getLastMessage(user); // Replace this with your logic to get the last message
	
			// Append user info and last message to the button
			conversationButton.appendChild(userInfo);
			// conversationButton.appendChild(lastMessage);
	
			conversationButton.addEventListener("click", function() {
				changeScene("conversation-display", user);
			});

			conversationDiv.appendChild(conversationButton);
		}


	// for (let user in gChatConversations.conversations) {
	// 	if (gChatConversations.conversations.hasOwnProperty(user)) {
	// 		const conversationButton = document.createElement("button");
	// 		conversationButton.textContent = user;
	// 		conversationButton.classList.add("conversation-list-contact-button");

	// 		conversationButton.addEventListener("click", function() {
	// 			changeScene("conversation-display", user);
	// 		});

	// 		conversationDiv.appendChild(conversationButton);
	// 	}
	}
}

function handleConversationDisplay(user) {

    const conversation = gChatConversations.getConversation(user);
    const conversationDisplay = document.getElementById("conversation-display");
    conversationDisplay.innerHTML = "";

	// back button
    const backButton = document.createElement("button");
    backButton.classList.add("arrow-back");
    backButton.onclick = function() {
        changeScene('conversation-list');
    };

    const svgContent = `
        <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_116_82)">
                <path d="M7.70801 18.5H29.2913" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.4997 7.70825L7.70801 18.4999L18.4997 29.2916" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_116_82">
                    <rect width="37" height="37" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    `;
    backButton.innerHTML = svgContent;
    conversationDisplay.appendChild(backButton);

    // create parent div
	const titleDiv = document.createElement("div");
    titleDiv.id = "conversation-display-title-id";
    titleDiv.classList.add("conversation-display-title");

    const messagesDiv = document.createElement("div");
    messagesDiv.id = "conversation-display-messages-id";
    messagesDiv.classList.add("conversation-display-messages");

    const inputDiv = document.createElement("div");
    inputDiv.id = "conversation-display-input-id";
    inputDiv.classList.add("conversation-display-input");

	conversationDisplay.appendChild(titleDiv);
    conversationDisplay.appendChild(messagesDiv);
    conversationDisplay.appendChild(inputDiv);

	// Title
    const titleElement = document.createElement("span");
    titleElement.textContent = user;
    titleElement.classList.add("title-2");
	titleElement.setAttribute("id", "send-message-contact-id");
    titleDiv.innerHTML = "";
    titleDiv.appendChild(titleElement);
	
    // Messages
    for (let i = conversation.length - 1; i >= 0; i--) {
		const message = conversation[i];
        const messageElement = document.createElement("div");
        messageElement.textContent = message.content;
        
        if (message.sender === gChatConversations.myUsername) {
			messageElement.classList.add("message-sent");
        } else {
			messageElement.classList.add("message-received");
        }
		
        messageElement.classList.add("message-margin");
		
        messagesDiv.appendChild(messageElement);
    }

	setTimeout(function() {
		messagesDiv.scrollTop = messagesDiv.scrollHeight;
	}, 1);

	// imput message
	const messageInput = document.createElement("input");
	messageInput.setAttribute("type", "text");
	messageInput.setAttribute("placeholder", "Enter your message...");
	messageInput.classList.add("message-input");
	messageInput.setAttribute("id", "send-message-input-id");
	inputDiv.appendChild(messageInput);

	// send button
	const sendButton = document.createElement("button");
	sendButton.textContent = "Send";
	sendButton.classList.add("send-button");
	sendButton.setAttribute("id", "send-message-button-id");
	sendButton.onclick = sendMessage;
	inputDiv.appendChild(sendButton);

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
	  image.src = `assets/images/theme-${i}.png`;
  
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
