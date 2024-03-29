// Fonction pour générer les div avec les images carrées et les bords arrondis
function genererDivsAvecImages(nbDivs) {
	const conteneur = document.getElementById("modify-game-theme-menu");
  
	for (let i = 0; i < nbDivs; i++) {
	  // Création de l'élément div
	  const div = document.createElement("div");
	  
	  // Attribution de classes CSS
	  div.classList.add("modify-game-theme-image-container");
  
	  // Création de l'élément image
	  const image = document.createElement("img");
	  
	  // Attribution de la source de l'image
	  image.src = "assets/images/theme-0.png";
	  
	  // Ajout des classes CSS pour les bords arrondis
	  image.classList.add("modify-game-theme-image");
  
	  // Ajout de l'image à la div
	  div.appendChild(image);
  
	  // Ajout de la div au conteneur
	  conteneur.appendChild(div);
	}
  }
  
  // Appel de la fonction pour générer 5 divs avec des images
  genererDivsAvecImages(3);
  