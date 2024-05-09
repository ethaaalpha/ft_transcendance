import {sleep} from "/static/pong3d/utilsPong.js"
import globalVariables from "/static/default/assets/js/init.js"

function backgroundRunner(active = true) {
    var speed = 50; 
    var backgroundZ1 = document.querySelector('.backgroundZ1');
    var currentPosition = 0;
	var animationId = null;

    async function scrollBackground() {
		if (!globalVariables.backgroundRunner)
			return
        currentPosition += speed / 60;
        backgroundZ1.style.backgroundPositionX = currentPosition + 'px';
        await sleep(135);
		animationId = requestAnimationFrame(scrollBackground);

    }

    function toggleAnimation() {
        if (active) {
			if (!globalVariables.backgroundRunner)
				globalVariables.backgroundRunner = true;
            	animationId = requestAnimationFrame(scrollBackground);
        } else {
			if (globalVariables.backgroundRunner) {
				globalVariables.backgroundRunner = false;
            	cancelAnimationFrame(globalVariables.backgroundRunner);
			}
        }
    }

    toggleAnimation();
}

export { backgroundRunner };
