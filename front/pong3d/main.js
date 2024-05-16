import * as THREE from 'three';
import { RGBELoader } from 'three/module/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/module/loaders/GLTFLoader.js';
import { FontLoader } from 'three/module/loaders/FontLoader.js';
import { OrbitControls } from 'three/module/controls/OrbitControls.js';
import Game from '/static/pong3d/game.js';
import Menu from '/static/pong3d/menu.js';
import GameLocal from '/static/pong3d/gameLocal.js';
import GameInv from '/static/pong3d/gameInv.js';
import { hideLoadingAnimation, showLoadingAnimation, status, ft } from '/static/pong3d/utilsPong.js';
import { goToInGame } from '/static/default/assets/js/action/play.js';
import { goToHome } from '/static/default/assets/js/action/play.js';
import globalVariables from '/static/default/assets/js/init.js';
import Alerts from '/static/default/assets/js/class/Alerts.js';

var view = null;
var appli = document.querySelector('#app');
var appliParent = document.querySelector('#game-container')

var loadingManager = new THREE.LoadingManager();
var gameData = {
    gltfLoader: new GLTFLoader(loadingManager).setPath( '/static/pong3d/assets/' ),
    textureLoader : new THREE.TextureLoader(loadingManager),
    RGBELoader : new RGBELoader(loadingManager).setPath('/static/pong3d/assets/hdr/'),
    fontLoader : new FontLoader(loadingManager),
    sceneGameLocal : new THREE.Scene(),
    sceneGameInv : new THREE.Scene(),
    sceneMenu : new THREE.Scene(),
    sceneGame : new THREE.Scene(),
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
    loaded : {instance:0},
}
gameData.rendererMenu.setSize(appliParent.clientWidth , appliParent.clientHeight);
gameData.rendererGameLocal.setSize(appliParent.clientWidth , appliParent.clientHeight);
appli.addEventListener('focus', () => onFocus());
appli.addEventListener('blur',() => notOnFocus());

function onFocus(){
    status.action = true;
}
function notOnFocus(){
    status.action = false;
}
function updateStatus(newStatus) {
    status.status= newStatus.status;
}
async function initialize() {
    initLoading();
	try {
		while(1){
            if (gameData.controlsGameLocal)
                gameData.controlsGameLocal.rotateSpeed = 1;
            if (status.status != 5)
				if (globalVariables.coordination)
					globalVariables.coordination.data = null;
			if (status.status === -1)
				await loadTexture();
			else if (status.status === 0) {
				goToHome();
				await createMenu();
			}
			else if (status.status === 1){
				goToInGame();
                Alerts.createAlert(Alerts.type.GAME, 'Press escape to go back to the menu');
				if (globalVariables.coordination)
                	globalVariables.coordination.send({'event': 'matchmaking', 'data': {'action' : 'join'}})
                showLoadingAnimation();
                await globalVariables.coordination.waitForData(50);
    		    await createGame(0);
            }
            else if (status.status === 2){ 
				goToInGame();
				ft.changeToWait()
                hideLoadingAnimation();
                await globalVariables.coordination.waitForTournament(50)
				ft.changeToInactive();
				if (status.status == 5)
					await createGame(4)
				if (status.status == 0)
					showLoadingAnimation();

            }
            else if (status.status === 3){
				goToInGame();
                await createGameLocal(0);
			}
            else if (status.status === 4){
                    showLoadingAnimation();
                    await globalVariables.coordination.waitForNextMatch(ft.roomCode, 5);
                }
            else if (status.status === 5){
                await createGame(4);
            }
            else if (status.status === 6){
                showLoadingAnimation();
                await globalVariables.coordination.waitForNextMatch("", 6);
                await createGame(0)
            }
		}
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

function initLoading(){
    loadingManager.onStart = function(url, item, total){
        if (gameData.loaded.instance == 0 && window.location.pathname != "/profile")
            showLoadingAnimation();
        gameData.loaded.instance += 1

    }

    loadingManager.onLoad = function(){
        gameData.loaded.instance -= 1
        if (gameData.loaded.instance == 0)
            hideLoadingAnimation();
    }
}

async function loadTexture() {
    return new Promise((resolve, reject) => {
        
        gameData.RGBELoader.load(globalVariables.currentUser.getGameTheme() + '.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            var textureRev = texture.clone()
            textureRev.flipY = false;
			gameData.sceneMenu.background = texture;
			gameData.sceneMenu.environment = texture;
            gameData.sceneGameLocal.background = texture;
			gameData.sceneGameLocal.environment = texture;
            gameData.sceneGame.background = texture;
			gameData.sceneGame.environment = texture;
            gameData.sceneGameInv.background = textureRev;
			gameData.sceneGameInv.environment = textureRev;
            gameData.controlsMenu = new OrbitControls(gameData.camera, gameData.rendererMenu.domElement);
            gameData.controlsGameLocal = new OrbitControls(gameData.camera, gameData.rendererGameLocal.domElement);
			gameData.controlsMenu.enableZoom = false;
			gameData.controlsGameLocal.enableZoom = false;
            gameData.controlsGameLocal.mouseButtons.RIGHT='';
            gameData.controlsMenu.mouseButtons.RIGHT='';
			status.status = 0;
            resolve();
        });
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
        if (status.status == 0 || globalVariables.coordination.data == null){
            globalVariables.coordination.returnMenu = false
            resolve()
        }
        else if (globalVariables.coordination.data.data.statusHost == true)
            view = new Game(status, resolve, updateStatus, gameData, returnValue);
        else
            view = new GameInv(status, resolve, updateStatus, gameData, returnValue);
		globalVariables.coordination.data = null;
    });
}


async function createGameLocal(returnValue) {
    return new Promise((resolve) => {
		view = null;
        view = new GameLocal(status, resolve, updateStatus, gameData, returnValue);
    });
}

export { initialize, gameData }