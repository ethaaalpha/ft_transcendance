const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

const appendAlert = (message, type) => {
const wrapper = document.createElement('div');
wrapper.innerHTML = [
	`<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
	`   <div>${message}</div>`,
	'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
	'</div>'
].join('');

alertPlaceholder.append(wrapper);

// Masquer l'alerte après 5 secondes
setTimeout(() => {
	wrapper.querySelector('.alert').remove();
}, 5000);
};

const alertTrigger = document.getElementById('liveAlertBtn');
if (alertTrigger) {
alertTrigger.addEventListener('click', () => {
	appendAlert('Nice, you triggered this alert message!', 'success');
});
}

