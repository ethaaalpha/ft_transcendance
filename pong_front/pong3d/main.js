import * as THREE from 'three';
import { RGBELoader } from 'three/module/loaders/RGBELoader.js';
import { OrbitControls } from 'three/module/controls/OrbitControls.js';
import Game from './game.js'
import Menu from './menu.js';
import GameLocal from './gameLocal.js';
import GameInv from './gameInv.js';
import { sleep } from './utilsPong.js';

var view;
var appli = document.querySelector('#app');
if (!appli) {
    console.log("coucou");
}
var data = null;
const socketTmp = new WebSocket("wss://probable-space-tribble-pg5wg6jqq59c7qq7-443.app.github.dev/api/coordination/")
socketTmp.onmessage = (event) => {
    console.log(event)
    const tmp = JSON.parse(event.data)
    if (tmp.event == "next")
        data = tmp.data;
}
var gameData = {
        sceneGameLocal : new THREE.Scene(),
        sceneGameInv : new THREE.Scene(),
        sceneMenu : new THREE.Scene(),
        rendererMenu : new THREE.WebGLRenderer(),
        rendererGameLocal : new THREE.WebGLRenderer(),
        camera : new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
        directionalLight : new THREE.DirectionalLight(0xED7F10, 80),
        directionalLight2 : new THREE.DirectionalLight(0xED7F10, 80),
        clock : new THREE.Clock(),
        raycaster : new THREE.Raycaster(),
        appli : appli,
        controlsMenu : null,
        controlsGameLocal : null,
}
gameData.rendererMenu.setSize(window.innerWidth , window.innerHeight);
gameData.rendererGameLocal.setSize(window.innerWidth , window.innerHeight);

var status = {
	status:-1,
};
function updateStatus(newStatus) {
    status= newStatus;
}
async function initialize() {
	try {
		while(1){
			if (status.status === -1)
				await loadTexture();
			else if (status.status === 0)
				await createMenu();
			else if (status.status === 1){
                await waitForData();
    		    await createGame();
            }
            else if (status.status === 2)
                await createGameLocal();
            //await sleep(1500)
		}
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}
async function loadTexture() {
    return new Promise((resolve, reject) => {
        var RGBELoad = new RGBELoader().setPath('/static/assets/');
        RGBELoad.load('witcher.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            var textureRev = texture.clone()
            textureRev.flipY = false;
			gameData.sceneMenu.background = texture
			gameData.sceneMenu.environment = texture
            gameData.sceneGameLocal.background = texture
			gameData.sceneGameLocal.environment = texture
            gameData.sceneGameInv.background = textureRev
			gameData.sceneGameInv.environment = textureRev

            var controlsMenu = new OrbitControls(gameData.camera, gameData.rendererMenu.domElement);
			controlsMenu.enableZoom = false;
            gameData.controlsMenu = controlsMenu;
            var controlsGameLocal = new OrbitControls(gameData.camera, gameData.rendererGameLocal.domElement);
			controlsGameLocal.enableZoom = false;
            gameData.controlsGameLocal = controlsGameLocal;

			status.status = 0;
            resolve();
        });
    });
}

async function createMenu() {
    return new Promise((resolve, reject) => {
		view = null;
        view = new Menu(status, resolve, updateStatus, gameData);
    });
}
async function createGame() {
    return new Promise((resolve, reject) => {
		view = null;
        if (data.statusHost == true)
            view = new Game(status, resolve, updateStatus, gameData, data);
        else
            view = new GameInv(status, resolve, updateStatus, gameData, data);
    });
}
async function createGameLocal() {
    return new Promise((resolve, reject) => {
		view = null;
        view = new GameLocal(status, resolve, updateStatus, gameData);
    });
}
function waitForData() {
    socketTmp.send(JSON.stringify({'event': 'matchmaking', 'data': {'action' : 'join'}}))
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            if (data) {
                clearInterval(intervalId);
                resolve();
            }
            console.log(data)
        }, 500);
    });
}

initialize();

