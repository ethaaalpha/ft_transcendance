import FormTournament from "/static/pong3d/tournament.js";

let sleepSetTimeout_ctrl;

var status = {
	status: -1,
    action: false
};

function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}

function waitForData(time, socket) {
    socket.send(JSON.stringify({'event': 'matchmaking', 'data': {'action' : 'join'}}))
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            if (data) {
                clearInterval(intervalId);
                resolve();
            }
        }, time);
    });
}

async function loadShader(url) {
    const response = await fetch(url);
    return response.text();
}

function showLoadingAnimation() {
    var loadingAnimation = document.getElementById("loader");
	loadingAnimation.classList.remove('d-none');
}

function hideLoadingAnimation() {
    var loadingAnimation = document.getElementById("loader");
	loadingAnimation.classList.add('d-none');
}

function showTournamentCode() {
    var tournamentForm = document.getElementById("codeForm");
	tournamentForm.classList.remove('d-none');
}

function hideTournamentCode() {
    var tournamentForm = document.getElementById("codeForm");
	tournamentForm.classList.add('d-none');
}

var ft = new FormTournament();
export { sleep, waitForData, loadShader, hideLoadingAnimation, showLoadingAnimation, hideTournamentCode, showTournamentCode, status, ft}
