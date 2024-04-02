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
