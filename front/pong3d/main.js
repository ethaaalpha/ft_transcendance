import * as THREE from 'three';
import { RGBELoader } from 'three/module/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/module/loaders/GLTFLoader.js';
import { FontLoader } from 'three/module/loaders/FontLoader.js';
import { OrbitControls } from 'three/module/controls/OrbitControls.js';
import FormTournament from './tournament.js';
import Game from './game.js';
import Menu from './menu.js';
import GameLocal from './gameLocal.js';
import GameInv from './gameInv.js';
import { hideLoadingAnimation, showLoadingAnimation, status } from './utilsPong.js';

var data = null;
var view;
var i = 0;
var ft = new FormTournament(sendTournament)
var appli = document.querySelector('#app');
var appliParent = document.querySelector('#game-container')
console.log(appliParent.clientWidth);
function sendTournament(data){
	socketTmp.send(JSON.stringify(data))
}
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
        }, 500);
    });

};

const socketTmp = new WebSocket("wss://" + window.location.host + "/api/coordination/")
socketTmp.onmessage = (event) => {
    console.log(JSON.parse(event.data))
    const tmp = JSON.parse(event.data)
    if (tmp.event == "next" || tmp.event == "win" || tmp.event == "end")
        data = tmp;
	else if (tmp.event == "create" && tmp.data.status == true){
		ft.changeToRoom(tmp.data.message)
		waitForNextMatch(tmp.data.message)
	}
	else if (tmp.event == "tournament" && tmp.data.status == true){
		ft.changeToRoom(null)
		waitForNextMatch(ft.roomCode)
	}
	else if (tmp.event == "count")
		ft.eventPlayer(tmp.data.updater, tmp.data.count, tmp.data.max)
}
var loadingManager = new THREE.LoadingManager();
var gameData = {
    gltfLoader: new GLTFLoader(loadingManager).setPath( '/static/pong3d/assets/' ),
    textureLoader : new THREE.TextureLoader(loadingManager),
    fontLoader : new FontLoader(loadingManager),
    sceneGameLocal : new THREE.Scene(),
    sceneGameInv : new THREE.Scene(),
    sceneMenu : new THREE.Scene(),
    rendererMenu : new THREE.WebGLRenderer(),
    rendererGameLocal : new THREE.WebGLRenderer(),
    camera : new THREE.PerspectiveCamera(75, appliParent.clientWidth / appliParent.clientHeight, 0.1, 1000),
    directionalLight : new THREE.DirectionalLight(0xC6FF89, 16),
    directionalLight2 : new THREE.DirectionalLight(0xC6FF89, 16),
    directionalLight3 : new THREE.DirectionalLight(0xC6FF89, 20),
    directionalLight4 : new THREE.DirectionalLight(0xC6FF89, 20),
    clock : new THREE.Clock(),
    raycaster : new THREE.Raycaster(),
    appli : appli,
    appliParent : appliParent,
    controlsMenu : null,
    controlsGameLocal : null,
    loaded : {instance:0}

}
gameData.rendererMenu.setSize(appliParent.clientWidth , appliParent.clientHeight);
gameData.rendererGameLocal.setSize(appliParent.clientWidth , appliParent.clientHeight);

// var status = {
// 	status:-1,
// };
function updateStatus(newStatus) {
    status.status= newStatus.status;
}
async function initialize() {
    initLoading();
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
                ft.changeToWait();
                hideLoadingAnimation();
                await waitForNextMatch("")
				ft.changeToInactive();
				if (status.status == 5)
					await createGame(4)
				if (status.status == 0)
					showLoadingAnimation();

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
        if (gameData.loaded.instance == 0)
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
        if (gameData.loaded.instance == 0)
            hideLoadingAnimation();
    }
}

async function loadTexture() {
    return new Promise((resolve, reject) => {
        
        // var RGBELoad = new RGBELoader(loadingManager).setPath('/static/pong3d/assets/hdr/');
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


export { initialize }
