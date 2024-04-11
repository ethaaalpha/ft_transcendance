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
		childElement.style.setProperty('--opacity', '0.6')
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

		parentElement.appendChild(childElement);
		children.forEach(child => {
			childElement.appendChild(child);
		});

		this.childElement = childElement;
		return this;
	}

	getChild() {
		return this.childElement;
	}
}

class FormTournament {

	constructor () {
		this.defaultValues();
	}

	defaultValues(){
		this.state = 0; // 0 mean first 1 mean second
		this.roomCode = null;
		this.historic = [];
		this.count = 0;
		this.max = 0;
	}

	updateCount() {
		let newvalue = this.count.toString() + '/' + this.max.toString();
		changeValue('tournament-js-count', newvalue);
	}

	updateOpacity() {
		this.historic[0].getChild().style.setProperty('--opacity', '0.8');
		if (this.historic.length >= 2) {
			this.historic[1].getChild().style.setProperty('--opacity', '0.6');
		}

	}

	joinPlayer(player) {
		if (this.state == 0)
			return;
		this.count += 1;
		this.updateCount();
		this.historic.push(new FormTournamentEvent(player, 'join').build('tournament-form-content'));
		this.updateOpacity();
	}

	leavePlayer(player) {
		if (this.state == 0)
			return;
		this.count -= 1;
		this.updateCount();
		this.historic.push(new FormTournamentEvent(player, 'left').build('tournament-form-content'));
		this.updateOpacity();
	}

	registerEventsRoom() {
		document.getElementById('tournament-form-top-right').addEventListener("click", (event) => {
			let data = {'event': 'tournament', 'data': {
				'action': 'quit',
				'room-id': this.roomCode,
				},
			}
			console.log(data)
			// finir ici en send ws
		});
	}
	
	registerEventsWait() {
		document.getElementById('tournament-js-create').addEventListener("click", (event) => {
			let value = document.getElementById('tournament-js-select').value;
			let data = {'event': 'create', 'data': {
				'mode': `tournament${value}`
				},
			}
			console.log(data)
			// finir ici en send ws
		});

		document.getElementById('tournament-js-join').addEventListener("click", (event) => {
			let value = document.getElementById('tournament-js-code').value;
			let data = {'event': 'tournament', 'data': {
				'room-id': value,
				'action': 'join',
				},
			}
			console.log(data)
			// finir ici en send ws
		});
	}

	changeToRoom(roomCode, max) {
		this.roomCode = roomCode;
		this.state = 1;
		this.max = max;
		hideElement('tournament-a');
		unhideElement('tournament-b');
		this.updateCount();
		changeValue('tournament-js-code', roomCode)
		this.registerEventsRoom();
	}

	changeToWait() {
		hideElement('tournament-b')
		unhideElement('tournament-a')
		this.defaultValues();
		this.registerEventsWait();
	}
}

var ft = new FormTournament();
ft.changeToWait();
ft.changeToRoom('JUDaowDW#', 3)

ft.joinPlayer('alfred')
ft.leavePlayer('alfredito')
ft.joinPlayer('migouelito')
ft.joinPlayer('migouelito')
ft.joinPlayer('migouelito')
ft.joinPlayer('migouelito')
ft.joinPlayer('migouelito')
ft.joinPlayer('migouelito')


