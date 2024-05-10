function createError() {
	const img = document.createElement('img')
	img.src = '/static/default/assets/images/lore/rocket.gif'
	img.style.width = '100%';
	img.style.marginBottom = '5%'

	const span = document.createElement('span');
	span.textContent = 'Sorry, the server is actually down or you’re trying to multi-play.';
	span.style.color = '#05FF00';
	span.style.textAlign = 'left';
	span.style.fontSize = '1.7vw'
	span.style.fontWeight = 'bold'

	const div = document.getElementById('error');
	div.style.width = '40%';
	div.style.aspectRatio = '4/1'
	div.style.padding = '2%';
	div.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center')
	div.appendChild(img)
	div.appendChild(span)
}

export { createError };