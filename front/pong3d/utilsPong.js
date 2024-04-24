let sleepSetTimeout_ctrl;

var status = {
	status:-1,
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
    loadingAnimation.style.display = "block";
}

function hideLoadingAnimation() {
    var loadingAnimation = document.getElementById("loader");
    loadingAnimation.style.display = "none";
}

function showTournamentCode() {
    var loadingAnimation = document.getElementById("codeForm");
    loadingAnimation.style.display = "block";
}

function hideTournamentCode() {
    var loadingAnimation = document.getElementById("codeForm");
    loadingAnimation.style.display = "none";
}
export { sleep, waitForData, loadShader, hideLoadingAnimation, showLoadingAnimation, hideTournamentCode, showTournamentCode, status}