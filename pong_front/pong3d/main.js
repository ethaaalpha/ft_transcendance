import * as THREE from 'three';
import { RGBELoader } from 'three/module/loaders/RGBELoader.js';
import { OrbitControls } from 'three/module/controls/OrbitControls.js';
import Game from './game.js'
import Menu from './menu.js';
import GameLocal from './gameLocal.js';
import { sleep } from './utilsPong.js';

var view;
var appli = document.querySelector('#app');
if (!appli) {
    console.log("coucou");
}

var gameData = {
        sceneGameLocal : new THREE.Scene(),
        sceneMenu : new THREE.Scene(),
        rendererMenu : new THREE.WebGLRenderer(),
        rendererGameLocal : new THREE.WebGLRenderer(),
        camera : new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
        directionalLight : new THREE.DirectionalLight(0x0fffff, 8),
        directionalLight2 : new THREE.DirectionalLight(0x0fffff, 2),
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
			else if (status.status === 1)
				await createGame();
            else if (status.status === 2)
                await createGameLocal();
            await sleep(1500)
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
			gameData.sceneMenu.background = texture
			gameData.sceneMenu.environment = texture
            gameData.sceneGameLocal.background = texture
			gameData.sceneGameLocal.environment = texture

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
        view = new Game(status, resolve, updateStatus, gameData);
    });
}
async function createGameLocal() {
    return new Promise((resolve, reject) => {
		view = null;
        view = new GameLocal(status, resolve, updateStatus, gameData);
    });
}

initialize();

