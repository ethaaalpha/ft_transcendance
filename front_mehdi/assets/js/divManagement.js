
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
	
    if (!gChatConversations) {
        // console.error("gChatConversations n'est pas encore défini.");
        try {
            await fetchConversations();
        } catch (error) {
            console.error("Erreur lors de la récupération des conversations:", error);
            return;
        }
    }

	// Parcourez chaque conversation dans gChatConversations
	for (let user in gChatConversations.conversations) {
		if (gChatConversations.conversations.hasOwnProperty(user)) {
			// Créez un élément de bouton pour cette conversation
			const conversationButton = document.createElement("button");
			conversationButton.textContent = user; // Nom de l'utilisateur avec qui la conversation a lieu
			// conversationButton.classList.add("conversation-button");
			conversationButton.classList.add("modify-btn");

			// Ajoutez un écouteur d'événements pour ouvrir la conversation au clic
			conversationButton.addEventListener("click", function() {
				changeScene("conversation-display", user);
			});

			// Ajoutez le bouton à la liste des conversations
			conversationList.appendChild(conversationButton);
		}
	}
}

// function handleConversationDisplay(user) {
//     const conversation = gChatConversations.getConversation(user);
//     const conversationDisplay = document.getElementById("conversation-display");
//     conversationDisplay.innerHTML = ""; // Efface le contenu précédent

//     // Créez le bouton "arrow-back"
//     const backButton = document.createElement("button");
//     backButton.classList.add("arrow-back");
//     backButton.onclick = function() {
//         changeScene('conversation-list');
//     };

//     // Ajoutez le contenu SVG au bouton
//     const svgContent = `
//         <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <g clip-path="url(#clip0_116_82)">
//                 <path d="M7.70801 18.5H29.2913" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//                 <path d="M18.4997 7.70825L7.70801 18.4999L18.4997 29.2916" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//             </g>
//             <defs>
//                 <clipPath id="clip0_116_82">
//                     <rect width="37" height="37" fill="white"/>
//                 </clipPath>
//             </defs>
//         </svg>
//     `;
//     backButton.innerHTML = svgContent;

//     // Ajoutez le bouton "arrow-back" à la conversationDisplay
//     conversationDisplay.appendChild(backButton);

//     // Parcourez chaque message dans la conversation et affichez-le
//     conversation.forEach(message => {
//         const messageElement = document.createElement("div");
//         messageElement.textContent = `${message.sender} (${message.sendAt}): ${message.content}`;
//         conversationDisplay.appendChild(messageElement);
//     });
// }

function handleConversationDisplay(user) {
    const conversation = gChatConversations.getConversation(user);
    const conversationDisplay = document.getElementById("conversation-display");
    conversationDisplay.innerHTML = ""; // Efface le contenu précédent

    // Créez le bouton "arrow-back"
    const backButton = document.createElement("button");
    backButton.classList.add("arrow-back");
    backButton.onclick = function() {
        changeScene('conversation-list');
    };

    // Ajoutez le contenu SVG au bouton
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

    // Ajoutez le bouton "arrow-back" à la conversationDisplay
    conversationDisplay.appendChild(backButton);

    // Créez un élément span pour le nom de la personne avec qui vous parlez
    const titleElement = document.createElement("span");
    titleElement.textContent = user; // Nom de la personne avec qui vous parlez
    titleElement.classList.add("title-2");

    // Ajoutez le titre à la conversationDisplay
    conversationDisplay.appendChild(titleElement);

    // Créez un formulaire pour le message
    const messageForm = document.createElement("form");

    // Créez un input pour entrer le message
    const messageInput = document.createElement("input");
    messageInput.setAttribute("type", "text");
    messageInput.setAttribute("placeholder", "Your message...");
    messageInput.classList.add("message-input");
	messageInput.setAttribute("id", "send-message-input-id");
    messageForm.appendChild(messageInput);

    // Créez un bouton "send" pour envoyer le message
    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    sendButton.classList.add("send-button");
	sendButton.setAttribute("id", "send-message-button-id");
    // sendButton.onclick = sendMessage(user, messageInput.value);
	messageInput.value = "";
    messageForm.appendChild(sendButton);

    // Ajoutez le formulaire à la conversationDisplay
    conversationDisplay.appendChild(messageForm);

    // Parcourez chaque message dans la conversation en commençant par le plus récent
    for (let i = conversation.length - 1; i >= 0; i--) {
        const message = conversation[i];
        const messageElement = document.createElement("div");
        messageElement.textContent = message.content;
        
        // Ajout de la classe en fonction de l'expéditeur
        if (message.sender === gChatConversations.myUsername) {
            messageElement.classList.add("message-sent");
        } else {
            messageElement.classList.add("message-received");
        }

        // Ajout de la classe pour la marge entre les messages
        messageElement.classList.add("message-margin");

        // Ajoutez le message à la conversationDisplay
        conversationDisplay.appendChild(messageElement);
    }
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
