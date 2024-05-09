import { status } from "/static/pong3d/utilsPong.js";
import Alerts from "/static/default/assets/js/class/Alerts.js"
import globalVariables from "/static/default/assets/js/init.js";

var opacity_low = 0.1;
var opacity_medium = 0.2;
var opacity_high = 0.4;

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


// Events
function eventQuit(e) {
	globalVariables.coordination.send({'event': 'tournament', 'data': {
		'action': 'quit',
		'room-id': this.roomCode,
		},
	})
	this.changeToInactive();
}

function eventCopy(e) {
	navigator.clipboard.writeText(this.roomCode)
	Alerts.createAlert(Alerts.type.GAME, "Code copied to clipboard !")
}


function eventCreate(e) {
	let value = document.getElementById('tournament-js-select').value;
	globalVariables.coordination.send({'event': 'create', 'data': {
		'mode': `tournament${value}`
		},
	})
}
	
function eventJoin(e) {
	this.askToJoin();
}
	
function eventJoinPress(e) {
	if (e.key === "Enter")
		this.askToJoin();
}
	
function eventEscape(e) {
	status.status = 0
	globalVariables.coordination.inGame = true;
	globalVariables.coordination.send({'event': 'end', 'data': {
		'message': 'Forced by player',
		},
	})
	this.changeToInactive();
}


class FormTournament {

	constructor () {
		this.changeToInactive();
		this.historic = []

		this.eventCreate = eventCreate.bind(this);
        this.eventJoin = eventJoin.bind(this);
        this.eventJoinPress = eventJoinPress.bind(this);
        this.eventEscape = eventEscape.bind(this);
        this.eventQuit = eventQuit.bind(this);
        this.eventCopy = eventCopy.bind(this);

	}

	defaultValues(){
		this.state = 0; // 0 mean first 1 mean second
		this.roomCode = null;
		this.historic = [];
		this.count = 0;
		this.max = 0;


		document.getElementById('tournament-js-create').removeEventListener("click", this.eventCreate);
		document.getElementById('tournament-js-join').removeEventListener("click", this.eventJoin);
		document.getElementById('tournament-js-code').removeEventListener("keydown", this.eventJoinPress);
		document.getElementById('tournament-escape-button').removeEventListener('click', this.eventEscape)
		document.getElementById('tournament-form-top-right').removeEventListener("click", this.eventQuit);
		document.getElementById('tournament-js-code-display').removeEventListener("click", this.eventCopy);
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

	askToJoin() {
		let value = document.getElementById('tournament-js-code').value;
		this.roomCode = value
		globalVariables.coordination.send({'event': 'tournament', 'data': {
			'room-id': value,
			'action': 'join',
			},
		})

	}

	// Extern entry
	changeToRoom(roomCode) {
		if (roomCode != null)
			this.roomCode = roomCode;
		this.state = 1;
		this.max = 0;
		unhideElement('tournament');
		hideElement('tournament-a');
		unhideElement('tournament-b');
		this.updateCount();
		this.registerEventsRoom();
		changeValue('tournament-js-code-display', '#' + this.roomCode);
	}

	changeToWait() {
		this.defaultValues();
		unhideElement('tournament');
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
		hideElement('tournament');
	}

	registerEventsWait() {
		document.getElementById('tournament-js-create').addEventListener("click", this.eventCreate);
		document.getElementById('tournament-js-join').addEventListener("click", this.eventJoin);
		document.getElementById('tournament-js-code').addEventListener("keydown", this.eventJoinPress);
		document.getElementById('tournament-escape-button').addEventListener('click', this.eventEscape)
	}

	registerEventsRoom() {
		document.getElementById('tournament-form-top-right').addEventListener("click", this.eventQuit);
		document.getElementById('tournament-js-code-display').addEventListener("click", this.eventCopy);
	}
}

export default FormTournament