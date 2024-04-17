function backgroundRunner() {
	var speed = 5; // Vitesse de défilement en pixels par seconde
	var backgroundZ1 = document.querySelector('.backgroundZ1');
	var currentPosition = 0;
	
	function scrollBackground() {
	  currentPosition += speed / 60;
	  backgroundZ1.style.backgroundPositionX = currentPosition + 'px';
	  requestAnimationFrame(scrollBackground);
	}
	requestAnimationFrame(scrollBackground);
}

backgroundRunner();