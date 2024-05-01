class Alerts {
	static type = {
		SUCCESS: { background: '--alert-bg-valid', textcolor: '--alert-tx-valid', icon: 'success.svg'},
		FAILED: { background: '--alert-bg-fail', textcolor: '--alert-tx-fail', icon: 'fail.svg'},
		MESSAGE: { background: '--alert-bg-message', textcolor: '--alert-tx-message', icon: 'message.svg'},
		GAME: { background: '--alert-bg-game', textcolor: '--alert-tx-game', icon: 'game.svg'}
	};

	static async createAlert(type, message) {
		let parent = document.getElementById('liveAlertPlaceholder');
		
		const icon = document.createElement('img');
		icon.src = '/static/default/assets/images/icons/alerts/' + type.icon;
		icon.style.width = '1.6em'

		const span = document.createElement('span');
		span.textContent = message;

		const newAlert = document.createElement('div');
    	newAlert.classList.add('alert', 'alert-item');
		newAlert.style.backgroundColor = `var(${type.background})`;
		newAlert.style.color = `var(${type.textcolor})`;
		newAlert.appendChild(icon);
		newAlert.appendChild(span)
   		parent.appendChild(newAlert);


    	// Remove the alert after 5 seconds
		await new Promise(resolve => setTimeout(resolve, 4500));
		newAlert.classList.add('alert-item-destroy')

		await new Promise(resolve => setTimeout(resolve, 500));
		newAlert.remove();
	}
}

export default Alerts ;