import { coordination } from "/static/default/assets/js/class/Coordination.js";
import { status } from "/static/pong3d/utilsPong.js";

var opacity_low = 0.4;
var opacity_medium = 0.6;
var opacity_high = 0.8;

function unhideElement(id) {
	let element = document.getElementById(id);
	element.classList.remove('d-none');
}

function hideElement(id) {
	let element = document.getElementById(id);
	element.classList.add('d-none');
}

function changeValue(id, value) {
	let element = document.getElementById(id);
	element.innerHTML = value;
}

class FormTournamentEvent {
	constructor (player, action) {
		this.player = player;
		this.action = action;
		this.childElement = null;
	}

	build (parent) {
		let parentElement = document.getElementById(parent);
		let childElement = document.createElement('div');
		let children = [];

		childElement.classList.add('tournament-form-content-children');
		childElement.style.setProperty('--opacity', opacity_low)
		let spanA = document.createElement('span');
		spanA.classList.add('tournament-name');
		spanA.innerHTML = ' ' + this.player;
		let spanB = document.createElement('span');
		spanB.classList.add('tournament-text-italic');
		spanB.innerHTML = ' just ' + this.action + ' the room';
		

		let item = document.createElement('i');
		item.classList.add('bi');
		if (this.action == 'left'){
			item.classList.add('bi-dash')
			children.push(item);
		} else {
			item.classList.add('bi-plus')
			children.push(item);
		}
		children.push(spanA);
		children.push(spanB);

		parentElement.insertBefore(childElement, parentElement.firstChild)
		children.forEach(child => {
			childElement.appendChild(child);
		});

		this.childElement = childElement;
		return this;
	}

	getChild() {
		return this.childElement;
	}

	destroy() {
		this.childElement.remove();
	}
}

class FormTournament {

	constructor () {
		this.changeToInactive();
		this.historic = []
	}

	defaultValues(){
		this.state = 0; // 0 mean first 1 mean second
		this.roomCode = null;
		this.historic = [];
		this.count = 0;
		this.max = 0;
	}

	updateCount() {
		if (this.count < 0)
			this.count = 0;
		if (this.count > this.max)
			this.count = this.max;
		let newvalue = this.count.toString() + '/' + this.max.toString();
		changeValue('tournament-js-count', newvalue);
	}

	updateOpacity() {
		let maxl = this.historic.length;
		this.historic[maxl - 1].getChild().style.setProperty('--opacity', opacity_high);
		if (this.historic.length >= 2) {
			this.historic[maxl - 2].getChild().style.setProperty('--opacity', opacity_medium);
			for (let i = 0; i < maxl - 2; i++) {
				this.historic[i].getChild().style.setProperty('--opacity', opacity_low);
			}
		}
	}

	eventPlayer(player, newcount, max) {
		this.max = max;
		if (newcount > this.count)
			this.joinPlayer(player, newcount)
		else
			this.leavePlayer(player, newcount)
	}
	
	joinPlayer(player, newcount, max) {
		if (this.state == 0)
			return;
		this.count = newcount;
		this.updateCount();
		this.historic.push(new FormTournamentEvent(player, 'join').build('tournament-form-content'));
		this.updateOpacity();
	}

	leavePlayer(player, newcount) {
		if (this.state == 0)
			return;
		this.count = newcount;
		this.updateCount();
		this.historic.push(new FormTournamentEvent(player, 'left').build('tournament-form-content'));
		this.updateOpacity();
	}

	registerEventsRoom() {
		document.getElementById('tournament-form-top-right').addEventListener("click", (event) => {
			coordination.send({'event': 'tournament', 'data': {
				'action': 'quit',
				'room-id': this.roomCode,
				},
			})
			this.changeToInactive()
		});

		document.getElementById('tournament-js-code-display').addEventListener("click", (event) => {
			navigator.clipboard.writeText(this.roomCode)
		});
	}

	askToJoin() {
		let value = document.getElementById('tournament-js-code').value;
		this.roomCode = value
		coordination.send({'event': 'tournament', 'data': {
			'room-id': value,
			'action': 'join',
			},
		})

	}
	
	registerEventsWait() {
		document.getElementById('tournament-js-create').addEventListener("click", (event) => {
			let value = document.getElementById('tournament-js-select').value;
			coordination.send({'event': 'create', 'data': {
				'mode': `tournament${value}`
				},
			})
		});

		document.getElementById('tournament-js-join').addEventListener("click", (event) => {
			this.askToJoin();
		});

		document.getElementById('tournament-js-code').addEventListener("keydown", (event) => {
			if (event.key === 'Enter') 
				this.askToJoin();
		});

		document.getElementById('tournament-escape-button').addEventListener('click', (event) => {
			status.status = 0
			coordination.inGame = true;
			coordination.send({'event': 'end', 'data': {
				'message': 'Forced by player',
				},
			})
			this.changeToInactive();
		})
	}

	changeToRoom(roomCode) {
		if (roomCode != null)
			this.roomCode = roomCode;
		this.state = 1;
		this.max = 0;
		unhideElement('game');
		hideElement('tournament-a');
		unhideElement('tournament-b');
		this.updateCount();
		this.registerEventsRoom();
		changeValue('tournament-js-code-display', this.roomCode);
	}

	changeToWait() {
		this.defaultValues();
		unhideElement('game');
		hideElement('tournament-b')
		unhideElement('tournament-a')
		this.defaultValues();
		this.registerEventsWait();
	}

	changeToInactive() {
		var content = document.getElementById('tournament-form-content');
		while (content.firstChild)
			content.removeChild(content.firstChild)
		var element = document.getElementById('tournament-js-code')
		element.value = "";
		hideElement('tournament-b');
		hideElement('tournament-a');
		hideElement('game');
	}
}

export default FormTournament