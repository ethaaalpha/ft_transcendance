import * as THREE from 'three';
import { RGBELoader } from 'three/module/loaders/RGBELoader.js';
import Game from './game.js'
import Menu from './menu.js';
import GameLocal from './gameLocal.js';

var view;
var scene = new THREE.Scene();
var status = {
	status:-1,
};
var data_texture;
var appli = document.querySelector('#app');
if (!appli) {
	console.log("coucou");
}
function updateStatus(newStatus) {
    status= newStatus;
}
async function initialize() {
	try {
		while(1){
			if (status.status === -1)
				await loadTexture();
			if (status.status === 0)
				await createMenu();
			if (status.status === 1)
				await createGame();
            if (status.status === 2)
                await createGameLocal();
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

//delete texture
