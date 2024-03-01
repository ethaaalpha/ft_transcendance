import * as THREE from 'three';
import { RGBELoader } from 'three/module/loaders/RGBELoader.js';
import Game from './game.js'
import Menu from './menu.js';
import GameLocal from './gameLocal.js';
import { sleep } from './utilsPong.js';

var view;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//const controls = new OrbitControls(this.camera, this.renderer.domElement);
//controls.enableZoom = false;

var status = {
	status:-1,
};
var appli = document.querySelector('#app');
if (!appli) {
	console.log("coucou");
}
function updateStatus(newStatus) {
    status.status= 0;
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

        var RGBELoad = new RGBELoader().setPath('static/assets/');
        RGBELoad.load('witcher.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
			scene.background = texture
			scene.environment = texture
			status.status = 0;
            resolve();
        });
    });
}

async function createMenu() {
    return new Promise((resolve, reject) => {
		
		view = null;
        view = new Menu(status, resolve, appli, scene, updateStatus);
    });
}
async function createGame() {
    return new Promise((resolve, reject) => {
		view = null;
        view = new Game(status, resolve, appli, scene, updateStatus);
    });
}
async function createGameLocal() {
    return new Promise((resolve, reject) => {
		view = null;
        view = new GameLocal(status, resolve, appli, scene, updateStatus);
    });
}

initialize();

