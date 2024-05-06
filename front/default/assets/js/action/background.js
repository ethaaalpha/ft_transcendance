import {sleep} from "/static/pong3d/utilsPong.js"

function backgroundRunner() {
	var speed = 50; // Vitesse de défilement en pixels par seconde
	var backgroundZ1 = document.querySelector('.backgroundZ1');
	var currentPosition = 0;
	
	// async function scrollBackground() {
	// 	currentPosition += speed / 60;
	// 	backgroundZ1.style.backgroundPositionX = currentPosition + 'px';
	// 	await sleep(200)
	// 	requestAnimationFrame(scrollBackground);
	// }
	// requestAnimationFrame(scrollBackground);
}

export { backgroundRunner };
