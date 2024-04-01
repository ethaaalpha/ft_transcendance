import * as THREE from 'three';
import { RGBELoader } from 'three/module/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/module/loaders/GLTFLoader.js';
import { FontLoader } from 'three/module/loaders/FontLoader.js';
import { OrbitControls } from 'three/module/controls/OrbitControls.js';
import Game from './game.js';
import Menu from './menu.js';
import GameLocal from './gameLocal.js';
import GameInv from './gameInv.js';
import { hideLoadingAnimation, hideTournamentCode, showLoadingAnimation, showTournamentCode, status } from './utilsPong.js';

hideTournamentCode()
var data = null;
function waitForNextMatch(code){
    console.log(data);
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            socketTmp.send(JSON.stringify({'event': 'next', 'data': {'room-id' : code}}))
            console.log(status);
            if (data) {
                if (data.event == "end" || data.event == "win")
                    status.status = 0
                if (data.event == "next")
                    status.status = 5
                clearInterval(intervalId);
                hideLoadingAnimation();
                resolve();
            }
        }, 5000);
    });

};
document.getElementById("codeForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    var code = document.getElementById("codeInput").value;
    if (code == null || code == ""){
        socketTmp.send(JSON.stringify({'event': 'create', 'data': {'mode' : 'tournament4'}}))
    }
    else{
        socketTmp.send(JSON.stringify({'event': 'tournament', 'data': {'action' : 'join', 'room-id' : code}}))
    }
    return waitForNextMatch(code)
});

var view;
var i = 0;
var appli = document.querySelector('#app');
if (!appli) {
    console.log("querySelector error");
}
const socketTmp = new WebSocket("wss://" + window.location.host + "/api/coordination/")
socketTmp.onmessage = (event) => {
    console.log(JSON.parse(event.data))
    const tmp = JSON.parse(event.data)
    if (tmp.event == "next")
        data = tmp;
    else if (tmp.event == "end")
        data = tmp
    else if (tmp.event == "win")
        data = tmp
}
var loadingManager = new THREE.LoadingManager();
var gameData = {
    gltfLoader: new GLTFLoader(loadingManager).setPath( '/static/assets/' ),
    textureLoader : new THREE.TextureLoader(loadingManager),
    fontLoader : new FontLoader(loadingManager),
    sceneGameLocal : new THREE.Scene(),
    sceneGameInv : new THREE.Scene(),
    sceneMenu : new THREE.Scene(),
    rendererMenu : new THREE.WebGLRenderer(),
    rendererGameLocal : new THREE.WebGLRenderer(),
    camera : new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
    directionalLight : new THREE.DirectionalLight(0xC6FF89, 16),
    directionalLight2 : new THREE.DirectionalLight(0xC6FF89, 16),
    directionalLight3 : new THREE.DirectionalLight(0xC6FF89, 20),
    directionalLight4 : new THREE.DirectionalLight(0xC6FF89, 20),
    clock : new THREE.Clock(),
    raycaster : new THREE.Raycaster(),
    appli : appli,
    controlsMenu : null,
    controlsGameLocal : null,
    loaded : {instance:0}

}
gameData.rendererMenu.setSize(window.innerWidth , window.innerHeight);
gameData.rendererGameLocal.setSize(window.innerWidth , window.innerHeight);

// var status = {
// 	status:-1,
// };
function updateStatus(newStatus) {
    status.status= newStatus.status;
}
async function initialize() {
	try {
		while(1){
            if (status.status != 5)
                data = null;
            console.log(status)
			if (status.status === -1)
				await loadTexture();
			else if (status.status === 0)
				await createMenu();
			else if (status.status === 1){
                socketTmp.send(JSON.stringify({'event': 'matchmaking', 'data': {'action' : 'join'}}))
                showLoadingAnimation();
                await waitForData();
    		    await createGame(0);
            }
            else if (status.status === 2){
                showTournamentCode()
                hideLoadingAnimation();
                await waitForData();
                await createGame(4);
            }
            else if (status.status === 3)
                await createGame();
            else if (status.status === 4){
                    showLoadingAnimation();
                    console.log(status)
                    await waitForNextMatch("");
                }
            else if (status.status === 5){
                await createGame(4);
            } 
		}
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

function initLoading(){
    loadingManager.onStart = function(url, item, total){
        if (gameData.loaded.instance = 0)
            showLoadingAnimation();
        gameData.loaded.instance += 1
        console.log("coucou");

    }
    loadingManager.onProgress = function(url, item, total){
        console.log(url);
    }
    loadingManager.onLoad = function(){
        console.log("coucou2");
        gameData.loaded.instance -= 1
        if (gameData.loaded.instance = 0)
            hideLoadingAnimation();
    }
}

async function loadTexture() {
    return new Promise((resolve, reject) => {
        
        // var RGBELoad = new RGBELoader(loadingManager).setPath('/static/assets/hdr/');
        // RGBELoad.load('d2.hdr', (texture) => {
        //     texture.mapping = THREE.EquirectangularReflectionMapping;
        //     var textureRev = texture.clone()
        //     textureRev.flipY = false;
		// 	gameData.sceneMenu.background = texture;
		// 	gameData.sceneMenu.environment = texture;
        //     gameData.sceneGameLocal.background = texture;
		// 	gameData.sceneGameLocal.environment = texture;
        //     gameData.sceneGameInv.background = textureRev;
		// 	gameData.sceneGameInv.environment = textureRev;
            gameData.controlsMenu = new OrbitControls(gameData.camera, gameData.rendererMenu.domElement);
            gameData.controlsGameLocal = new OrbitControls(gameData.camera, gameData.rendererGameLocal.domElement);
			gameData.controlsMenu.enableZoom = false;
			gameData.controlsGameLocal.enableZoom = false;
            gameData.controlsGameLocal.mouseButtons.RIGHT='';
            gameData.controlsMenu.mouseButtons.RIGHT='';
			status.status = 0;
            resolve();
        // });
    });
}

async function createMenu() {
    return new Promise((resolve) => {
		view = null;
        view = new Menu(status, resolve, updateStatus, gameData);
    });
}

async function createGame(returnValue) {
    return new Promise((resolve) => {
        view = null;
        if (data.data.statusHost == true)
            view = new Game(status, resolve, updateStatus, gameData, returnValue);
        else
            view = new GameInv(status, resolve, updateStatus, gameData, returnValue);
		data = null;
    });
}


async function createGameLocal() {
    return new Promise((resolve) => {
		view = null;
        view = new GameLocal(status, resolve, updateStatus, gameData);
    });
}

function waitForData(time) {
    
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            if (data) {
                console.log("cou");
                clearInterval(intervalId);
                hideLoadingAnimation();
                resolve();
            }
        }, time);
    });
}
initLoading();
initialize();
//waitstatus(500);


export { initialize }
