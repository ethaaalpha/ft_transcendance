function createDiv(parent, name) {
    let parentE = document.getElementById(parent);
    let newE = document.createElement('div');
    newE.id = name;
    parentE.appendChild(newE);
}

function applyBlur(item_id, value_in_percen, blured_color) {
	e = document.getElementById(item_id)
	e.style.background = `rgba(${blured_color})`;
	e.style.backdropFilter = `blur(${value_in_percen}px)`;
}

class FormTournament {
	#state = 0; // 0 default, 1 when joined a room

	init (where) {
		createDiv(where, 'base');
        document.getElementById('base').innerHTML = 'dwajid';
		applyBlur('base', 5, '255, 0, 0, 0.5')
	}
}

window.addEventListener('DOMContentLoaded', () => {
	var fm = new FormTournament()
	fm.init('game')
});

