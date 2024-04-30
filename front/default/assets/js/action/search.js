import { changeScene } from "../spaManagement/scene.js";
import { fetchProfilPicture } from "../fetch/http.js";
import { locationHandler } from "../spaManagement/router.js";

async function searchAction(username) {
	console.log("teaaaast");
	if (!await fetchProfilPicture(username)) {
		console.log("searchAction: error to replace with alert");
		locationHandler();
	} else {
		console.log("hereeeee");
		changeScene('search', username);
	}
}


// async function searchAction(username) {
//     try {
//         const response = await fetchProfilPicture(username);
//         if (!response.ok) {
//             console.log("searchAction: error to replace with alert");
//             locationHandler();
//         } else {
//             console.log("hereeeee");
//             changeScene('search', username);
//         }
//     } catch (error) {
//         console.error("An error occurred while fetching profile picture:", error);
//         // Gérer l'erreur ici, par exemple afficher une alerte à l'utilisateur
//     }
// }


export { searchAction };